import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ request }) => {
	// Verify cron secret (Vercel sends this header)
	const authHeader = request.headers.get('authorization');
	const cronSecret = env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return error(401, 'Unauthorized');
	}

	try {
		// In production:
		// import { runIngestionPipeline } from '$lib/server/scheduler.js';
		// const result = await runIngestionPipeline();
		// return json({ success: true, ...result });

		return json({
			success: true,
			message: 'Cron endpoint ready. Connect data sources to enable.',
			timestamp: new Date().toISOString()
		});
	} catch (err) {
		console.error('Cron pipeline failed:', err);
		return error(500, 'Pipeline execution failed');
	}
};
