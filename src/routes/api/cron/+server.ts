import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';
import { runIngestionPipeline } from '$lib/server/scheduler.js';
import { runLinkAudit } from '$lib/server/link-auditor.js';

export const GET: RequestHandler = async ({ request }) => {
	// Verify cron secret (Vercel sends this header)
	const authHeader = request.headers.get('authorization');
	const cronSecret = env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return error(401, 'Unauthorized');
	}

	try {
		console.log('[Cron] Starting good news monitoring pipeline...');
		const result = await runIngestionPipeline();
		console.log(`[Cron] Pipeline complete: fetched=${result.fetched}, classified=${result.classified}, stored=${result.stored}`);

		// Also run a full link audit after ingestion
		let auditSummary = null;
		try {
			const { getStoriesByCategories } = await import('$lib/server/db.js');
			const grouped = await getStoriesByCategories();
			const allStories = Object.values(grouped).flat();
			if (allStories.length > 0) {
				const audit = await runLinkAudit(
					allStories.map((s) => ({ id: s.id, title: s.title, category: s.category, source_url: s.source_url })),
					'cron'
				);
				auditSummary = {
					checked: audit.totalChecked,
					ok: audit.ok,
					broken: audit.broken,
					placeholders: audit.placeholders
				};
			}
		} catch {
			// Audit is non-critical
		}

		return json({
			success: true,
			...result,
			audit: auditSummary
		});
	} catch (err) {
		console.error('[Cron] Pipeline failed:', err);
		return error(500, 'Pipeline execution failed');
	}
};
