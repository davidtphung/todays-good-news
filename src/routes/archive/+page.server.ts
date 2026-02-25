import type { PageServerLoad } from './$types.js';
import type { Story, StoryCategory } from '$lib/types/story.js';
import { PANELS } from '$lib/config.js';
import { getStoriesForDate, getPastDates, getTodayDateStr } from '$lib/data/story-pool.js';

export interface ArchiveDay {
	date: string;
	dateLabel: string;
	storyCount: number;
	topStories: { id: string; title: string; category: string; source_name: string; positivity_score: number }[];
}

function buildStoriesForDate(dateStr: string): Story[] {
	const dailyStories = getStoriesForDate(dateStr);
	const categories = PANELS.filter((p) => p.category).map((p) => p.category!);
	const seed = dateStr.split('-').reduce((a, b) => a + parseInt(b), 0);

	const allStories: Story[] = [];

	for (const category of categories) {
		const samples = dailyStories[category] ?? [];
		for (let i = 0; i < samples.length; i++) {
			const s = samples[i];
			allStories.push({
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
			});
		}
	}

	return allStories;
}

export const load: PageServerLoad = async ({ url }) => {
	const selectedDate = url.searchParams.get('date');
	const today = getTodayDateStr();

	// Generate archive index: past 30 days
	const pastDates = getPastDates(30);
	const archive: ArchiveDay[] = pastDates.map((dateStr) => {
		const stories = buildStoriesForDate(dateStr);
		const top = stories
			.sort((a, b) => b.positivity_score - a.positivity_score)
			.slice(0, 5);

		return {
			date: dateStr,
			dateLabel: new Date(dateStr + 'T12:00:00Z').toLocaleDateString('en-US', {
				weekday: 'long',
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			}),
			storyCount: stories.length,
			topStories: top.map((s) => ({
				id: s.id,
				title: s.title,
				category: s.category,
				source_name: s.source_name,
				positivity_score: s.positivity_score
			}))
		};
	});

	// If a specific date is selected, also return full stories for that day
	let selectedStories: Record<string, Story[]> | null = null;
	let selectedDateLabel = '';

	if (selectedDate) {
		const dailyStories = getStoriesForDate(selectedDate);
		const categories = PANELS.filter((p) => p.category).map((p) => p.category!);
		const seed = selectedDate.split('-').reduce((a, b) => a + parseInt(b), 0);

		selectedStories = {};
		for (const category of categories) {
			const samples = dailyStories[category] ?? [];
			selectedStories[category] = samples.map((s, i) => ({
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
				published_at: new Date(new Date(selectedDate).getTime() + (2 - i) * 3600000).toISOString(),
				ingested_at: new Date(selectedDate).toISOString(),
				ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
				is_featured: i === 0,
				created_at: new Date(selectedDate).toISOString()
			}));
		}

		selectedDateLabel = new Date(selectedDate + 'T12:00:00Z').toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}

	return {
		archive,
		selectedDate,
		selectedDateLabel,
		selectedStories,
		today
	};
};
