/**
 * Link Auditor — Background agent that validates all story source URLs.
 *
 * Runs in two modes:
 *   1. Scheduled: Every cycle (called from cron/audit endpoint)
 *   2. On-demand: When new stories are ingested (called from scheduler)
 *
 * Checks for: dead links (4xx/5xx), redirects to hub pages, example.com,
 * empty URLs, and SSL errors. Reports are cached and queryable via API.
 */

import { getCached, setCache } from './cache.js';

export interface LinkAuditResult {
	url: string;
	storyId: string;
	storyTitle: string;
	category: string;
	status: 'ok' | 'broken' | 'redirect' | 'placeholder' | 'empty' | 'timeout' | 'error';
	httpCode?: number;
	redirectUrl?: string;
	error?: string;
	checkedAt: string;
}

export interface AuditReport {
	totalChecked: number;
	ok: number;
	broken: number;
	placeholders: number;
	redirects: number;
	errors: number;
	results: LinkAuditResult[];
	startedAt: string;
	completedAt: string;
	durationMs: number;
	triggeredBy: 'cron' | 'manual' | 'ingestion' | 'api';
}

/** Patterns that indicate a hub/category page rather than a direct article */
const HUB_PATTERNS = [
	/^https?:\/\/[^/]+\/?$/, // bare domain
	/\/hub\//,
	/\/category\//,
	/\/topic\//,
	/\/section\//,
	/\/tag\//,
	/example\.com/,
	/example\.org/,
	/placeholder/,
];

/** Check if a URL looks like a placeholder or hub page */
function isPlaceholderUrl(url: string): boolean {
	return HUB_PATTERNS.some((p) => p.test(url));
}

/** Validate a single URL by making a HEAD request (falls back to GET) */
async function checkUrl(url: string, timeoutMs = 10000): Promise<{ status: number; ok: boolean; redirectUrl?: string; error?: string }> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try {
		// Try HEAD first (lighter)
		const res = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
			redirect: 'follow',
			headers: {
				'User-Agent': 'GoodNewsToday-LinkAuditor/1.0 (+https://goodnewstoday.davidtphung.com)',
				'Accept': 'text/html,application/xhtml+xml'
			}
		});

		clearTimeout(timer);

		// Check if we were redirected to a different domain (potential hub redirect)
		const finalUrl = res.url;
		const redirected = finalUrl && finalUrl !== url && new URL(finalUrl).hostname !== new URL(url).hostname;

		return {
			status: res.status,
			ok: res.ok,
			redirectUrl: redirected ? finalUrl : undefined
		};
	} catch (headErr) {
		// Some servers reject HEAD — try GET
		const controller2 = new AbortController();
		const timer2 = setTimeout(() => controller2.abort(), timeoutMs);

		try {
			const res = await fetch(url, {
				method: 'GET',
				signal: controller2.signal,
				redirect: 'follow',
				headers: {
					'User-Agent': 'GoodNewsToday-LinkAuditor/1.0 (+https://goodnewstoday.davidtphung.com)',
					'Accept': 'text/html,application/xhtml+xml'
				}
			});

			clearTimeout(timer2);

			return {
				status: res.status,
				ok: res.ok
			};
		} catch (getErr) {
			clearTimeout(timer2);
			const errMsg = getErr instanceof Error ? getErr.message : String(getErr);

			if (errMsg.includes('abort')) {
				return { status: 0, ok: false, error: 'timeout' };
			}

			return { status: 0, ok: false, error: errMsg.slice(0, 100) };
		}
	} finally {
		clearTimeout(timer);
	}
}

/** Audit a single story's source URL */
async function auditStoryLink(story: { id: string; title: string; category: string; source_url: string }): Promise<LinkAuditResult> {
	const base: Omit<LinkAuditResult, 'status' | 'httpCode' | 'error' | 'redirectUrl'> = {
		url: story.source_url,
		storyId: story.id,
		storyTitle: story.title,
		category: story.category,
		checkedAt: new Date().toISOString()
	};

	// Empty URL check
	if (!story.source_url || story.source_url.trim() === '') {
		return { ...base, status: 'empty' };
	}

	// Placeholder/hub URL check
	if (isPlaceholderUrl(story.source_url)) {
		return { ...base, status: 'placeholder' };
	}

	// HTTP check
	const result = await checkUrl(story.source_url);

	if (result.error === 'timeout') {
		return { ...base, status: 'timeout', error: 'Request timed out after 10s' };
	}

	if (result.error) {
		return { ...base, status: 'error', error: result.error };
	}

	if (result.redirectUrl) {
		return { ...base, status: 'redirect', httpCode: result.status, redirectUrl: result.redirectUrl };
	}

	if (!result.ok) {
		return { ...base, status: 'broken', httpCode: result.status };
	}

	return { ...base, status: 'ok', httpCode: result.status };
}

/**
 * Run a full link audit on all provided stories.
 * Processes in batches to avoid overwhelming servers.
 */
export async function runLinkAudit(
	stories: { id: string; title: string; category: string; source_url: string }[],
	triggeredBy: AuditReport['triggeredBy'] = 'manual'
): Promise<AuditReport> {
	const startedAt = new Date().toISOString();
	const start = Date.now();
	const results: LinkAuditResult[] = [];

	// Process in batches of 5
	const batchSize = 5;
	for (let i = 0; i < stories.length; i += batchSize) {
		const batch = stories.slice(i, i + batchSize);
		const batchResults = await Promise.allSettled(
			batch.map((s) => auditStoryLink(s))
		);

		for (const r of batchResults) {
			if (r.status === 'fulfilled') {
				results.push(r.value);
			}
		}

		// Small delay between batches to be respectful
		if (i + batchSize < stories.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	const report: AuditReport = {
		totalChecked: results.length,
		ok: results.filter((r) => r.status === 'ok').length,
		broken: results.filter((r) => r.status === 'broken').length,
		placeholders: results.filter((r) => r.status === 'placeholder' || r.status === 'empty').length,
		redirects: results.filter((r) => r.status === 'redirect').length,
		errors: results.filter((r) => r.status === 'error' || r.status === 'timeout').length,
		results,
		startedAt,
		completedAt: new Date().toISOString(),
		durationMs: Date.now() - start,
		triggeredBy
	};

	// Cache the report (2 hours TTL)
	try {
		await setCache('link-audit:latest', report, 7200);
	} catch {
		// Cache write failure is non-critical
	}

	console.log(`[LinkAuditor] Audit complete: ${report.ok}/${report.totalChecked} OK, ${report.broken} broken, ${report.placeholders} placeholders, ${report.errors} errors (${report.durationMs}ms)`);

	return report;
}

/**
 * Quick audit for newly ingested stories only.
 * Called automatically by the ingestion pipeline after new stories are stored.
 */
export async function auditNewStories(
	stories: { id: string; title: string; category: string; source_url: string }[]
): Promise<LinkAuditResult[]> {
	if (stories.length === 0) return [];

	console.log(`[LinkAuditor] Auditing ${stories.length} newly ingested stories...`);
	const results: LinkAuditResult[] = [];

	for (const story of stories) {
		const result = await auditStoryLink(story);
		results.push(result);

		if (result.status !== 'ok') {
			console.warn(`[LinkAuditor] Issue found: ${result.status} — ${result.url} (${result.storyTitle})`);
		}
	}

	return results;
}

/** Get the most recent cached audit report */
export async function getLatestAuditReport(): Promise<AuditReport | null> {
	return getCached<AuditReport>('link-audit:latest');
}
