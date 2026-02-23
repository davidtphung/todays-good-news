import type { Story, StoryCategory } from '$lib/types/story.js';
import { STORIES_PER_PAGE } from '$lib/config.js';

interface StoriesState {
	byCategory: Record<string, Story[]>;
	loading: boolean;
	error: string | null;
	hasMore: Record<string, boolean>;
}

const state = $state<StoriesState>({
	byCategory: {},
	loading: false,
	error: null,
	hasMore: {}
});

export const stories = {
	get byCategory() {
		return state.byCategory;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},

	forCategory(category: StoryCategory): Story[] {
		return state.byCategory[category] ?? [];
	},

	hasMore(category: StoryCategory): boolean {
		return state.hasMore[category] ?? true;
	},

	setStories(data: Record<string, Story[]>) {
		state.byCategory = data;
		state.loading = false;
		state.error = null;
		for (const key of Object.keys(data)) {
			state.hasMore[key] = data[key].length >= STORIES_PER_PAGE;
		}
	},

	appendStories(category: StoryCategory, newStories: Story[]) {
		const existing = state.byCategory[category] ?? [];
		state.byCategory[category] = [...existing, ...newStories];
		state.hasMore[category] = newStories.length >= STORIES_PER_PAGE;
	},

	prependStory(story: Story) {
		const existing = state.byCategory[story.category] ?? [];
		state.byCategory[story.category] = [story, ...existing];
	},

	setLoading(loading: boolean) {
		state.loading = loading;
	},

	setError(error: string | null) {
		state.error = error;
		state.loading = false;
	},

	get allStories(): Story[] {
		return Object.values(state.byCategory).flat();
	},

	get featured(): Story[] {
		return this.allStories
			.filter((s) => s.is_featured)
			.sort((a, b) => b.positivity_score - a.positivity_score);
	}
};
