import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getCached, setCache, isRateLimited } from '$lib/server/cache.js';
import type { Story, StoryCategory } from '$lib/types/story.js';

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
	// Rate limiting
	const clientIp = getClientAddress();
	const limited = await isRateLimited(`stories:${clientIp}`, 60, 60);
	if (limited) {
		return error(429, 'Too many requests');
	}

	const category = url.searchParams.get('category') as StoryCategory | null;
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 100);
	const offset = parseInt(url.searchParams.get('offset') ?? '0');

	const cacheKey = `stories:${category ?? 'all'}:${limit}:${offset}`;
	const cached = await getCached<Story[]>(cacheKey);
	if (cached) {
		return json({ stories: cached, cached: true });
	}

	// In production, replace with:
	// import { getStories } from '$lib/server/db.js';
	// const stories = await getStories({ category, limit, offset });

	return json({ stories: [], cached: false });
};

export const POST: RequestHandler = async ({ request }) => {
	const { action } = await request.json();

	if (action === 'refresh') {
		// In production:
		// import { runIngestionPipeline } from '$lib/server/scheduler.js';
		// const result = await runIngestionPipeline();
		// await invalidateCache('stories:*');
		// return json(result);

		return json({ fetched: 0, classified: 0, stored: 0, message: 'Pipeline not connected in dev mode' });
	}

	return error(400, 'Invalid action');
};
