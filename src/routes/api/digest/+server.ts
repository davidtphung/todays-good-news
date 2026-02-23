import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getCached, setCache } from '$lib/server/cache.js';
import type { DailyDigest } from '$lib/types/story.js';

export const GET: RequestHandler = async () => {
	const cacheKey = 'digest:today';
	const cached = await getCached<DailyDigest>(cacheKey);
	if (cached) {
		return json({ digest: cached, cached: true });
	}

	// In production:
	// import { getTodayDigest } from '$lib/server/db.js';
	// const digest = await getTodayDigest();

	return json({ digest: null, cached: false });
};

export const POST: RequestHandler = async () => {
	// In production: generate a new daily digest using AI
	// import { getStories, upsertDigest } from '$lib/server/db.js';
	// ... AI summarization of top stories

	return json({
		success: true,
		message: 'Digest generation not connected in dev mode'
	});
};
