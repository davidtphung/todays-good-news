const STORAGE_KEY = 'good-news-preferences';

interface Preferences {
	reducedMotion: boolean;
	showToasts: boolean;
	autoRefresh: boolean;
	settingsOpen: boolean;
}

function loadPreferences(): Preferences {
	if (typeof window === 'undefined') return defaults();
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (!saved) return defaults();
		return { ...defaults(), ...JSON.parse(saved) };
	} catch {
		return defaults();
	}
}

function defaults(): Preferences {
	return {
		reducedMotion: false,
		showToasts: true,
		autoRefresh: true,
		settingsOpen: false
	};
}

const state = $state<Preferences>(defaults());

export const preferences = {
	get reducedMotion() {
		return state.reducedMotion;
	},
	get showToasts() {
		return state.showToasts;
	},
	get autoRefresh() {
		return state.autoRefresh;
	},
	get settingsOpen() {
		return state.settingsOpen;
	},

	init() {
		const loaded = loadPreferences();
		Object.assign(state, loaded);

		if (typeof window !== 'undefined') {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
			state.reducedMotion = mq.matches;
			mq.addEventListener('change', (e) => {
				state.reducedMotion = e.matches;
			});
		}
	},

	toggleSettings() {
		state.settingsOpen = !state.settingsOpen;
	},

	closeSettings() {
		state.settingsOpen = false;
	},

	update(partial: Partial<Omit<Preferences, 'settingsOpen'>>) {
		Object.assign(state, partial);
		this.save();
	},

	save() {
		if (typeof window === 'undefined') return;
		const { settingsOpen: _, ...rest } = state;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
	}
};
