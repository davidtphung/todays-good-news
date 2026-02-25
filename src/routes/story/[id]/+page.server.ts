import type { PageServerLoad } from './$types.js';
import type { Story, StoryCategory } from '$lib/types/story.js';
import { STORY_POOL, getTodayDateStr, getStoriesForDate } from '$lib/data/story-pool.js';

export const load: PageServerLoad = async ({ params, url }) => {
	// Try live DB first
	try {
		const { getStoryById } = await import('$lib/server/db.js');
		const story = await getStoryById(params.id);
		if (story) return { story };
	} catch {
		// DB not configured — fall through to mock
	}

	// Mock: generate a story from the ID pattern (category-index)
	const [category, indexStr] = params.id.split('-');
	const index = parseInt(indexStr ?? '0');

	// Check if there's a date param (from archive) or use today
	const dateStr = url.searchParams.get('date') ?? getTodayDateStr();
	const dailyStories = getStoriesForDate(dateStr);
	const stories = dailyStories[category];

	if (!stories || !stories[index]) {
		// Fall back to full pool if daily rotation doesn't have this index
		const poolStories = STORY_POOL[category];
		if (!poolStories || !poolStories[index]) {
			return { story: null };
		}
		const s = poolStories[index];
		return { story: buildStory(params.id, s, category, index) };
	}

	const s = stories[index];
	return { story: buildStory(params.id, s, category, index) };
};

function buildStory(
	id: string,
	s: { title: string; summary: string; source_url: string; source_name: string; location: { name: string; lat: number; lon: number } },
	category: string,
	index: number
): Story {
	return {
		id,
		title: s.title,
		summary: s.summary,
		source_url: s.source_url,
		source_name: s.source_name,
		category: category as StoryCategory,
		positivity_score: 75 + ((category.length + index * 7) % 25),
		image_url: null,
		location_lat: s.location.lat,
		location_lon: s.location.lon,
		location_name: s.location.name,
		published_at: new Date(Date.now() - index * 3600000).toISOString(),
		ingested_at: new Date().toISOString(),
		ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
		is_featured: index === 0,
		created_at: new Date().toISOString()
	};
}
