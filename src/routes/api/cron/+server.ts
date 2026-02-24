import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';
import { runIngestionPipeline } from '$lib/server/scheduler.js';

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

		return json({
			success: true,
			...result
		});
	} catch (err) {
		console.error('[Cron] Pipeline failed:', err);
		return error(500, 'Pipeline execution failed');
	}
};
