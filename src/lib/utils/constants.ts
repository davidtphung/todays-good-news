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

/**
 * Curated RSS feeds for good news monitoring.
 * These are free, publicly accessible feeds focused on positive news.
 */
export const RSS_DEFAULT_FEEDS = [
	// Dedicated good news outlets
	'https://www.goodnewsnetwork.org/feed/',
	'https://www.positive.news/feed/',
	'https://reasonstobecheerful.world/feed/',

	// Science & discovery
	'https://www.sciencedaily.com/rss/all.xml',
	'https://phys.org/rss-feed/',

	// Environment & climate wins
	'https://grist.org/feed/',
	'https://earth.org/feed/',

	// Health breakthroughs
	'https://medicalxpress.com/rss-feed/',

	// Technology for good
	'https://singularityhub.com/feed/',

	// Space & exploration
	'https://www.nasa.gov/feed/',
	'https://spacenews.com/feed/',

	// Community & humanity
	'https://www.shareable.net/feed/',

	// Animals & wildlife / sustainability
	'https://www.ecowatch.com/feed',
	'https://inhabitat.com/feed/',

	// General news (filtered by AI for positive stories)
	'https://feeds.bbci.co.uk/news/rss.xml',
	'https://rss.nytimes.com/services/xml/rss/nyt/Science.xml',
	'https://www.theguardian.com/science/rss',
	'https://www.theguardian.com/environment/rss'
];
