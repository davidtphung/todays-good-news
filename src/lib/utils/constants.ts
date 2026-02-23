export const CATEGORY_COLORS: Record<string, string> = {
	science: '#10b981',
	health: '#f59e0b',
	environment: '#22c55e',
	technology: '#6366f1',
	community: '#ec4899',
	education: '#8b5cf6',
	arts: '#f97316',
	animals: '#14b8a6',
	economy: '#eab308',
	space: '#3b82f6',
	sports: '#ef4444'
};

export const POSITIVITY_THRESHOLDS = {
	low: 40,
	medium: 65,
	high: 85
} as const;

export const RSS_DEFAULT_FEEDS = [
	'https://www.goodnewsnetwork.org/feed/',
	'https://www.positive.news/feed/',
	'https://reasonstobecheerful.world/feed/'
];
