import type { PanelConfig } from './types/panel.js';

export const PANELS: PanelConfig[] = [
	{ id: 'science', title: 'Science & Discovery', icon: '🔬', contentType: 'stories', category: 'science', defaultWidth: 1, visible: true, order: 0 },
	{ id: 'health', title: 'Health & Medicine', icon: '🏥', contentType: 'stories', category: 'health', defaultWidth: 1, visible: true, order: 1 },
	{ id: 'environment', title: 'Environment & Climate', icon: '🌍', contentType: 'stories', category: 'environment', defaultWidth: 1, visible: true, order: 2 },
	{ id: 'technology', title: 'Tech for Good', icon: '💡', contentType: 'stories', category: 'technology', defaultWidth: 1, visible: true, order: 3 },
	{ id: 'community', title: 'Community & Kindness', icon: '🤝', contentType: 'stories', category: 'community', defaultWidth: 1, visible: true, order: 4 },
	{ id: 'education', title: 'Education & Youth', icon: '📚', contentType: 'stories', category: 'education', defaultWidth: 1, visible: true, order: 5 },
	{ id: 'arts', title: 'Arts & Culture', icon: '🎨', contentType: 'stories', category: 'arts', defaultWidth: 1, visible: true, order: 6 },
	{ id: 'animals', title: 'Animals & Wildlife', icon: '🐾', contentType: 'stories', category: 'animals', defaultWidth: 1, visible: true, order: 7 },
	{ id: 'economy', title: 'Economic Wins', icon: '📈', contentType: 'stories', category: 'economy', defaultWidth: 1, visible: true, order: 8 },
	{ id: 'space', title: 'Space & Exploration', icon: '🚀', contentType: 'stories', category: 'space', defaultWidth: 1, visible: true, order: 9 },
	{ id: 'sports', title: 'Sports & Achievement', icon: '🏆', contentType: 'stories', category: 'sports', defaultWidth: 1, visible: true, order: 10 },
	{ id: 'globe', title: 'Global Good Map', icon: '🗺️', contentType: 'map', defaultWidth: 4, visible: true, order: 11 },
	{ id: 'trending', title: 'Trending Good News', icon: '📊', contentType: 'trending', defaultWidth: 2, visible: true, order: 12 },
	{ id: 'digest', title: "Today's Digest", icon: '☀️', contentType: 'digest', defaultWidth: 2, visible: true, order: 13 },
	{ id: 'history', title: 'Today in History', icon: '📅', contentType: 'history', defaultWidth: 2, visible: true, order: 14 },
	{ id: 'video', title: "Today's Good News Video", icon: '🎬', contentType: 'video', defaultWidth: 2, visible: true, order: 15 },
	{ id: 'quote', title: 'Daily Inspiration', icon: '✦', contentType: 'quote', defaultWidth: 2, visible: true, order: 16 }
];

export const CATEGORIES = PANELS.filter((p) => p.contentType === 'stories').map((p) => ({
	id: p.category!,
	title: p.title,
	icon: p.icon
}));

export const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours
export const STORIES_PER_PAGE = 20;
export const MIN_POSITIVITY_SCORE = 40;
export const AI_MODEL = 'claude-sonnet-4-5-20250929';
