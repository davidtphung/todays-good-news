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

	try {
		const { getTodayDigest } = await import('$lib/server/db.js');
		const digest = await getTodayDigest();
		if (digest) {
			await setCache(cacheKey, digest, 3600);
		}
		return json({ digest, cached: false });
	} catch {
		return json({ digest: null, cached: false, note: 'Database not configured' });
	}
};

export const POST: RequestHandler = async () => {
	try {
		const { getFeaturedStories, upsertDigest } = await import('$lib/server/db.js');
		const stories = await getFeaturedStories(10);

		if (stories.length === 0) {
			return json({ success: false, message: 'No stories to summarize' });
		}

		const categoryCounts: Record<string, number> = {};
		for (const s of stories) {
			categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
		}
		const avgPositivity = Math.round(stories.reduce((sum, s) => sum + s.positivity_score, 0) / stories.length);

		const today = new Date().toISOString().split('T')[0];
		const digest = {
			date: today,
			summary: `Today's highlights: ${stories.slice(0, 3).map((s) => s.title).join('. ')}`,
			top_story_ids: stories.map((s) => s.id),
			category_counts: categoryCounts,
			avg_positivity: avgPositivity
		};

		await upsertDigest(digest);
		return json({ success: true, digest });
	} catch (err) {
		return json({ success: false, message: String(err) });
	}
};
