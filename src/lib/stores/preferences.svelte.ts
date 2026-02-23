const STORAGE_KEY = 'good-news-preferences';

type Theme = 'dark' | 'light' | 'system';

interface Preferences {
	reducedMotion: boolean;
	showToasts: boolean;
	autoRefresh: boolean;
	settingsOpen: boolean;
	theme: Theme;
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
		settingsOpen: false,
		theme: 'dark'
	};
}

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (theme === 'system') {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		root.classList.toggle('dark', prefersDark);
		root.classList.toggle('light', !prefersDark);
	} else {
		root.classList.toggle('dark', theme === 'dark');
		root.classList.toggle('light', theme === 'light');
	}
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
	get theme() {
		return state.theme;
	},

	init() {
		const loaded = loadPreferences();
		Object.assign(state, loaded);
		applyTheme(state.theme);

		if (typeof window !== 'undefined') {
			const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
			state.reducedMotion = mq.matches;
			mq.addEventListener('change', (e) => {
				state.reducedMotion = e.matches;
			});

			// Listen for system theme changes when theme is 'system'
			const colorMq = window.matchMedia('(prefers-color-scheme: dark)');
			colorMq.addEventListener('change', () => {
				if (state.theme === 'system') {
					applyTheme('system');
				}
			});
		}
	},

	toggleSettings() {
		state.settingsOpen = !state.settingsOpen;
	},

	closeSettings() {
		state.settingsOpen = false;
	},

	setTheme(theme: Theme) {
		state.theme = theme;
		applyTheme(theme);
		this.save();
	},

	toggleTheme() {
		const next = state.theme === 'dark' ? 'light' : 'dark';
		this.setTheme(next);
	},

	update(partial: Partial<Omit<Preferences, 'settingsOpen'>>) {
		Object.assign(state, partial);
		if ('theme' in partial && partial.theme) {
			applyTheme(partial.theme);
		}
		this.save();
	},

	save() {
		if (typeof window === 'undefined') return;
		const { settingsOpen: _, ...rest } = state;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
	}
};
