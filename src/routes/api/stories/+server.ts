import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getCached, setCache, isRateLimited } from '$lib/server/cache.js';
import { getStories } from '$lib/server/db.js';
import { invalidateCache } from '$lib/server/cache.js';
import { runIngestionPipeline } from '$lib/server/scheduler.js';
import { env } from '$env/dynamic/private';
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

	try {
		const stories = await getStories({ category: category ?? undefined, limit, offset });
		if (stories.length > 0) {
			await setCache(cacheKey, stories, 900); // 15 min cache
		}
		return json({ stories, cached: false });
	} catch {
		// Fallback: return empty if DB not configured
		return json({ stories: [], cached: false, note: 'Database not configured' });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	const cronSecret = env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return error(401, 'Unauthorized');
	}

	const body = await request.json().catch(() => ({}));
	const action = (body as Record<string, string>).action;

	if (action === 'refresh') {
		try {
			const result = await runIngestionPipeline();
			await invalidateCache('stories:*');
			return json(result);
		} catch (err) {
			console.error('[API] Refresh failed:', err);
			return error(500, 'Refresh failed');
		}
	}

	return error(400, 'Invalid action');
};
