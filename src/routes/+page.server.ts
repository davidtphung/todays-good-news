import type { PageServerLoad } from './$types.js';
import type { Story, DailyDigest, StoryCategory } from '$lib/types/story.js';
import { PANELS } from '$lib/config.js';
import { getTodayInHistory } from '$lib/utils/history.js';
import { getDailyQuote } from '$lib/utils/quotes.js';
import { getDailyVideo } from '$lib/utils/videos.js';
import { getStoriesForDate, getTodayDateStr } from '$lib/data/story-pool.js';

/**
 * Attempts to load live stories from Supabase.
 * Returns null if database is not configured or empty.
 */
async function loadLiveStories(): Promise<Record<string, Story[]> | null> {
	try {
		const { getStoriesByCategories } = await import('$lib/server/db.js');
		const grouped = await getStoriesByCategories();
		const totalStories = Object.values(grouped).flat().length;
		if (totalStories === 0) return null;
		return grouped;
	} catch {
		return null;
	}
}

/**
 * Attempts to load live digest from Supabase.
 */
async function loadLiveDigest(): Promise<DailyDigest | null> {
	try {
		const { getTodayDigest } = await import('$lib/server/db.js');
		return await getTodayDigest();
	} catch {
		return null;
	}
}

/**
 * Attempts to load stories with geo coordinates for the 3D globe.
 */
async function loadLiveGeoStories(): Promise<Story[] | null> {
	try {
		const { getStoriesWithLocation } = await import('$lib/server/db.js');
		const stories = await getStoriesWithLocation();
		return stories.length > 0 ? stories : null;
	} catch {
		return null;
	}
}

/**
 * Generate mock stories for a given date using the shared story pool.
 * Different stories appear each day via date-based rotation.
 */
function generateMockStoriesForDate(dateStr: string): Record<string, Story[]> {
	const grouped: Record<string, Story[]> = {};
	const dailyStories = getStoriesForDate(dateStr);
	const categories = PANELS.filter((p) => p.category).map((p) => p.category!);

	// Seeded random based on date for consistent positivity scores
	const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);

	for (const category of categories) {
		const samples = dailyStories[category] ?? [];
		grouped[category] = samples.map((s, i) => ({
			id: `${category}-${i}`,
			title: s.title,
			summary: s.summary,
			source_url: s.source_url,
			source_name: s.source_name,
			category: category as StoryCategory,
			positivity_score: 65 + ((seed + i * 7 + category.length * 3) % 35),
			image_url: null,
			location_lat: s.location.lat,
			location_lon: s.location.lon,
			location_name: s.location.name,
			published_at: new Date(new Date(dateStr).getTime() + (2 - i) * 3600000).toISOString(),
			ingested_at: new Date(dateStr).toISOString(),
			ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
			is_featured: i === 0,
			created_at: new Date(dateStr).toISOString()
		}));
	}

	return grouped;
}

function generateMockDigest(dateStr: string): DailyDigest {
	const stories = generateMockStoriesForDate(dateStr);
	const allStories = Object.values(stories).flat();
	const top = allStories.sort((a, b) => b.positivity_score - a.positivity_score).slice(0, 5);
	const avg = Math.round(allStories.reduce((s, st) => s + st.positivity_score, 0) / allStories.length);

	return {
		id: `digest-${dateStr}`,
		date: dateStr,
		summary: `Good news from around the world on ${new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. Stories include breakthroughs in science and technology, environmental wins, community achievements, and inspiring human stories that remind us the world is getting better.`,
		top_story_ids: top.map((s) => s.id),
		category_counts: Object.fromEntries(
			Object.entries(stories).map(([cat, arr]) => [cat, arr.length])
		) as Record<StoryCategory, number>,
		avg_positivity: avg,
		created_at: new Date(dateStr).toISOString()
	};
}

export const load: PageServerLoad = async () => {
	const todayStr = getTodayDateStr();

	// Try live data first, fall back to date-rotated mock
	const liveStories = await loadLiveStories();
	const stories = liveStories ?? generateMockStoriesForDate(todayStr);

	const liveDigest = await loadLiveDigest();
	const digest = liveDigest ?? generateMockDigest(todayStr);

	const allStories = Object.values(stories).flat();

	// Try live geo stories, fall back to filtering all stories
	const liveGeo = await loadLiveGeoStories();
	const geoStories = liveGeo ?? allStories.filter((s) => s.location_lat != null && s.location_lon != null);

	const history = getTodayInHistory();
	const quote = getDailyQuote();
	const video = getDailyVideo();

	return {
		stories,
		digest,
		geoStories,
		history,
		quote,
		video,
		isLive: liveStories !== null,
		currentDate: todayStr
	};
};
