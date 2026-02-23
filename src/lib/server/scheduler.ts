import { newsapiAdapter } from './sources/newsapi.js';
import { gdeltAdapter } from './sources/gdelt.js';
import { rssAdapter } from './sources/rss.js';
import { redditAdapter } from './sources/reddit.js';
import { classifyStory } from './ai/classifier.js';
import { scoreStory } from './ai/scorer.js';
import { summarizeStory } from './ai/summarizer.js';
import { upsertStories, getRecentTitles } from './db.js';
import { isDuplicate } from '$lib/utils/dedup.js';
import { MIN_POSITIVITY_SCORE } from '$lib/config.js';
import type { RawArticle } from '$lib/types/source.js';
import type { StoryCategory } from '$lib/types/story.js';

export async function runIngestionPipeline(): Promise<{
	fetched: number;
	classified: number;
	stored: number;
}> {
	// 1. Fetch from all sources
	const sources = [newsapiAdapter, gdeltAdapter, rssAdapter, redditAdapter];
	const allArticles: RawArticle[] = [];

	const results = await Promise.allSettled(sources.map((s) => s.fetch()));
	for (const result of results) {
		if (result.status === 'fulfilled') {
			allArticles.push(...result.value);
		}
	}

	const fetched = allArticles.length;
	if (fetched === 0) return { fetched: 0, classified: 0, stored: 0 };

	// 2. Deduplicate against existing stories
	const existingTitles = await getRecentTitles(48);
	const newArticles = allArticles.filter((a) => !isDuplicate(a.title, existingTitles));

	// 3. Classify, score, and summarize
	const storiesToStore = [];
	let classified = 0;

	for (const article of newArticles) {
		const classification = await classifyStory(article.title, article.description);
		if (!classification || !classification.is_positive) continue;
		classified++;

		const score = await scoreStory(article.title, article.description, classification.category);
		if (!score || score.positivity_score < MIN_POSITIVITY_SCORE) continue;

		const summary = await summarizeStory(article.title, article.description, article.content);
		if (!summary) continue;

		storiesToStore.push({
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
		});
	}

	// 4. Store in database
	if (storiesToStore.length > 0) {
		await upsertStories(storiesToStore);
	}

	return { fetched, classified, stored: storiesToStore.length };
}
