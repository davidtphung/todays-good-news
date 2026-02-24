import { newsapiAdapter } from './sources/newsapi.js';
import { gdeltAdapter } from './sources/gdelt.js';
import { rssAdapter } from './sources/rss.js';
import { redditAdapter } from './sources/reddit.js';
import { googleNewsAdapter } from './sources/googlenews.js';
import { classifyStory } from './ai/classifier.js';
import { scoreStory } from './ai/scorer.js';
import { summarizeStory } from './ai/summarizer.js';
import { upsertStories, getRecentTitles } from './db.js';
import { isDuplicate } from '$lib/utils/dedup.js';
import { MIN_POSITIVITY_SCORE } from '$lib/config.js';
import { auditNewStories } from './link-auditor.js';
import type { RawArticle } from '$lib/types/source.js';
import type { StoryCategory } from '$lib/types/story.js';
import type { LinkAuditResult } from './link-auditor.js';

export interface PipelineResult {
	fetched: number;
	classified: number;
	stored: number;
	errors: string[];
	sources: Record<string, number>;
	duration_ms: number;
	timestamp: string;
	linkAudit?: {
		checked: number;
		ok: number;
		issues: LinkAuditResult[];
	};
}

/**
 * Good News Monitoring Agent — Ingestion Pipeline
 *
 * Fetches articles from multiple sources, deduplicates against existing stories,
 * then runs each through the AI classification → scoring → summarization pipeline.
 * Only genuinely positive stories with sufficient scores are stored.
 */
export async function runIngestionPipeline(): Promise<PipelineResult> {
	const startTime = Date.now();
	const errors: string[] = [];
	const sourceCounts: Record<string, number> = {};

	// 1. Fetch from all sources in parallel
	const sources = [rssAdapter, googleNewsAdapter, gdeltAdapter, newsapiAdapter, redditAdapter];
	const allArticles: RawArticle[] = [];

	const results = await Promise.allSettled(sources.map((s) => s.fetch()));

	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		const sourceName = sources[i].name;

		if (result.status === 'fulfilled') {
			sourceCounts[sourceName] = result.value.length;
			allArticles.push(...result.value);
		} else {
			sourceCounts[sourceName] = 0;
			errors.push(`${sourceName}: ${result.reason}`);
		}
	}

	const fetched = allArticles.length;
	console.log(`[Agent] Fetched ${fetched} articles from ${Object.keys(sourceCounts).length} sources`);

	if (fetched === 0) {
		return {
			fetched: 0,
			classified: 0,
			stored: 0,
			errors,
			sources: sourceCounts,
			duration_ms: Date.now() - startTime,
			timestamp: new Date().toISOString()
		};
	}

	// 2. Deduplicate against existing stories
	let existingTitles: string[] = [];
	try {
		existingTitles = await getRecentTitles(48);
	} catch (err) {
		errors.push(`DB getRecentTitles: ${err}`);
	}

	const newArticles = allArticles.filter((a) => !isDuplicate(a.title, existingTitles));
	console.log(`[Agent] ${newArticles.length} new articles after deduplication (${allArticles.length - newArticles.length} duplicates removed)`);

	// 3. Classify, score, and summarize in batches
	const storiesToStore = [];
	let classified = 0;
	const BATCH_SIZE = 5;

	for (let i = 0; i < newArticles.length; i += BATCH_SIZE) {
		const batch = newArticles.slice(i, i + BATCH_SIZE);

		const batchResults = await Promise.allSettled(
			batch.map(async (article) => {
				// Step 1: Classify
				const classification = await classifyStory(article.title, article.description);
				if (!classification || !classification.is_positive) return null;

				// Step 2: Score
				const score = await scoreStory(article.title, article.description, classification.category);
				if (!score || score.positivity_score < MIN_POSITIVITY_SCORE) return null;

				// Step 3: Summarize
				const summary = await summarizeStory(article.title, article.description, article.content);
				if (!summary) return null;

				return {
					title: article.title,
					summary: summary.summary,
					source_url: article.url,
					source_name: article.source,
					category: classification.category as StoryCategory,
					positivity_score: score.positivity_score,
					image_url: article.image_url,
					location_lat: summary.location_lat,
					location_lon: summary.location_lon,
					location_name: summary.location_name,
					published_at: article.published_at,
					ai_classification: {
						is_positive: classification.is_positive,
						confidence: classification.confidence,
						reasoning: classification.reasoning
					},
					is_featured: score.positivity_score >= 85
				};
			})
		);

		for (const result of batchResults) {
			if (result.status === 'fulfilled' && result.value) {
				classified++;
				storiesToStore.push(result.value);
			} else if (result.status === 'rejected') {
				errors.push(`AI pipeline: ${result.reason}`);
			}
		}
	}

	console.log(`[Agent] ${classified} stories classified as positive (${storiesToStore.length} above score threshold)`);

	// 4. Store in database
	if (storiesToStore.length > 0) {
		try {
			await upsertStories(storiesToStore);
			console.log(`[Agent] Stored ${storiesToStore.length} stories in database`);
		} catch (err) {
			errors.push(`DB upsert: ${err}`);
			console.error(`[Agent] Failed to store stories:`, err);
		}
	}

	// 5. Audit links on newly stored stories
	let linkAudit: PipelineResult['linkAudit'] = undefined;
	if (storiesToStore.length > 0) {
		try {
			const auditResults = await auditNewStories(
				storiesToStore.map((s, i) => ({
					id: `new-${i}`,
					title: s.title,
					category: s.category,
					source_url: s.source_url
				}))
			);
			const issues = auditResults.filter((r) => r.status !== 'ok');
			linkAudit = {
				checked: auditResults.length,
				ok: auditResults.filter((r) => r.status === 'ok').length,
				issues
			};
			if (issues.length > 0) {
				console.warn(`[Agent] Link audit found ${issues.length} issues in new stories`);
			}
		} catch (auditErr) {
			errors.push(`Link audit: ${auditErr}`);
		}
	}

	const duration = Date.now() - startTime;
	console.log(`[Agent] Pipeline completed in ${duration}ms`);

	return {
		fetched,
		classified,
		stored: storiesToStore.length,
		errors,
		sources: sourceCounts,
		duration_ms: duration,
		timestamp: new Date().toISOString(),
		linkAudit
	};
}

/**
 * Light-weight check: just fetches headlines without AI processing.
 * Useful for monitoring source health and feed availability.
 */
export async function checkSourceHealth(): Promise<Record<string, { ok: boolean; count: number; error?: string }>> {
	const sources = [rssAdapter, googleNewsAdapter, gdeltAdapter, newsapiAdapter, redditAdapter];
	const health: Record<string, { ok: boolean; count: number; error?: string }> = {};

	const results = await Promise.allSettled(sources.map((s) => s.fetch()));

	for (let i = 0; i < results.length; i++) {
		const sourceName = sources[i].name;
		if (results[i].status === 'fulfilled') {
			const articles = (results[i] as PromiseFulfilledResult<RawArticle[]>).value;
			health[sourceName] = { ok: articles.length > 0, count: articles.length };
		} else {
			health[sourceName] = { ok: false, count: 0, error: String((results[i] as PromiseRejectedResult).reason) };
		}
	}

	return health;
}
