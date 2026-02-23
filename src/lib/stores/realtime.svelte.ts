import type { Story } from '$lib/types/story.js';

interface RealtimeState {
	newStories: Story[];
	connected: boolean;
	lastUpdate: string | null;
}

const state = $state<RealtimeState>({
	newStories: [],
	connected: false,
	lastUpdate: null
});

export const realtime = {
	get newStories() {
		return state.newStories;
	},
	get hasNew() {
		return state.newStories.length > 0;
	},
	get count() {
		return state.newStories.length;
	},
	get connected() {
		return state.connected;
	},
	get lastUpdate() {
		return state.lastUpdate;
	},

	addStory(story: Story) {
		state.newStories = [story, ...state.newStories];
		state.lastUpdate = new Date().toISOString();
	},

	clear() {
		state.newStories = [];
	},

	setConnected(connected: boolean) {
		state.connected = connected;
	}
};
