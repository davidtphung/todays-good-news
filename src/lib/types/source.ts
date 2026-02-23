export interface RawArticle {
	title: string;
	description: string | null;
	url: string;
	source: string;
	published_at: string;
	image_url: string | null;
	content: string | null;
}

export interface SourceAdapter {
	name: string;
	fetch(): Promise<RawArticle[]>;
}

export interface ClassificationResult {
	is_positive: boolean;
	confidence: number;
	category: string;
	reasoning: string;
}

export interface ScoringResult {
	positivity_score: number;
	impact_breadth: number;
	novelty: number;
	emotional_uplift: number;
}

export interface SummaryResult {
	summary: string;
	location_name: string | null;
	location_lat: number | null;
	location_lon: number | null;
}
