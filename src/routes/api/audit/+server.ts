import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';
import { runLinkAudit, getLatestAuditReport } from '$lib/server/link-auditor.js';

let isAuditing = false;

/**
 * GET /api/audit — Link audit agent
 *
 * Query params:
 *   ?action=run    — Trigger a full audit (requires auth or cron secret)
 *   ?action=status — Get the latest cached audit report (default)
 */
export const GET: RequestHandler = async ({ url, request, fetch: svelteFetch }) => {
	const action = url.searchParams.get('action') ?? 'status';

	if (action === 'status') {
		const report = await getLatestAuditReport();
		if (!report) {
			return json({
				status: 'no_report',
				message: 'No audit has been run yet. Trigger one with POST /api/audit or GET ?action=run',
				timestamp: new Date().toISOString()
			});
		}
		return json(report);
	}

	if (action === 'run') {
		const authHeader = request.headers.get('authorization');
		const cronSecret = env.CRON_SECRET;
		if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
			return error(401, 'Unauthorized');
		}
		return await triggerAudit(svelteFetch, 'api');
	}

	return error(400, `Unknown action: ${action}`);
};

/**
 * POST /api/audit — Trigger a full audit (requires auth)
 */
export const POST: RequestHandler = async ({ request, fetch: svelteFetch }) => {
	const authHeader = request.headers.get('authorization');
	const cronSecret = env.CRON_SECRET;
	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return error(401, 'Unauthorized');
	}
	return await triggerAudit(svelteFetch, 'manual');
};

async function triggerAudit(
	svelteFetch: typeof fetch,
	triggeredBy: 'api' | 'manual'
) {
	if (isAuditing) {
		return json({ error: 'Audit is already running' }, { status: 409 });
	}

	isAuditing = true;
	try {
		const stories = await loadAllStories(svelteFetch);
		if (stories.length === 0) {
			return json({
				status: 'no_stories',
				message: 'No stories found to audit',
				timestamp: new Date().toISOString()
			});
		}
		const report = await runLinkAudit(stories, triggeredBy);
		return json(report);
	} catch (err) {
		console.error('[Audit API] Error:', err);
		return error(500, 'Audit failed');
	} finally {
		isAuditing = false;
	}
}

/** Load all current stories — tries live DB, falls back to fetching page data */
async function loadAllStories(
	svelteFetch: typeof fetch
): Promise<{ id: string; title: string; category: string; source_url: string }[]> {
	// Try live DB
	try {
		const { getStoriesByCategories } = await import('$lib/server/db.js');
		const grouped = await getStoriesByCategories();
		const all = Object.values(grouped).flat();
		if (all.length > 0) {
			return all.map((s) => ({
				id: s.id,
				title: s.title,
				category: s.category,
				source_url: s.source_url
			}));
		}
	} catch {
		// DB not configured — fall through
	}

	// Fall back: fetch the page's JSON data via SvelteKit internal fetch
	try {
		const res = await svelteFetch('/__data.json?x-sveltekit-invalidated=1');
		if (res.ok) {
			const pageData = await res.json();
			// Extract stories from the page data
			// SvelteKit __data.json returns nodes array — stories is in the load data
			if (pageData?.nodes) {
				for (const node of pageData.nodes) {
					if (node?.data?.stories) {
						const grouped = node.data.stories as Record<string, { id: string; title: string; category: string; source_url: string }[]>;
						return Object.values(grouped).flat().map((s) => ({
							id: s.id,
							title: s.title,
							category: s.category,
							source_url: s.source_url
						}));
					}
				}
			}
		}
	} catch {
		// __data.json fallback failed
	}

	return [];
}
