export interface Story {
	id: string;
	title: string;
	summary: string;
	source_url: string;
	source_name: string;
	category: StoryCategory;
	positivity_score: number;
	image_url: string | null;
	location_lat: number | null;
	location_lon: number | null;
	location_name: string | null;
	published_at: string;
	ingested_at: string;
	ai_classification: AIClassification | null;
	is_featured: boolean;
	created_at: string;
}

export interface AIClassification {
	is_positive: boolean;
	confidence: number;
	reasoning: string;
	rejected_reason?: string;
}

export type StoryCategory =
	| 'science'
	| 'health'
	| 'environment'
	| 'technology'
	| 'community'
	| 'education'
	| 'arts'
	| 'animals'
	| 'economy'
	| 'space'
	| 'sports';

export interface StoryFilters {
	category?: StoryCategory;
	minScore?: number;
	featured?: boolean;
	limit?: number;
	offset?: number;
}

export interface DailyDigest {
	id: string;
	date: string;
	summary: string;
	top_story_ids: string[];
	category_counts: Record<StoryCategory, number>;
	avg_positivity: number;
	created_at: string;
}
