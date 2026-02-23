import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import type { Story, StoryFilters, DailyDigest, StoryCategory } from '$lib/types/story.js';

function getClient() {
	const url = env.SUPABASE_URL;
	const key = env.SUPABASE_SERVICE_KEY;
	if (!url || !key) throw new Error('Missing Supabase credentials');
	return createClient(url, key);
}

export async function getStories(filters: StoryFilters = {}): Promise<Story[]> {
	const supabase = getClient();
	let query = supabase
		.from('stories')
		.select('*')
		.order('published_at', { ascending: false });

	if (filters.category) query = query.eq('category', filters.category);
	if (filters.minScore) query = query.gte('positivity_score', filters.minScore);
	if (filters.featured) query = query.eq('is_featured', true);
	query = query.range(filters.offset ?? 0, (filters.offset ?? 0) + (filters.limit ?? 20) - 1);

	const { data, error } = await query;
	if (error) throw error;
	return (data ?? []) as Story[];
}

export async function getStoriesByCategories(): Promise<Record<StoryCategory, Story[]>> {
	const supabase = getClient();
	const { data, error } = await supabase
		.from('stories')
		.select('*')
		.gte('positivity_score', 40)
		.order('published_at', { ascending: false })
		.limit(200);

	if (error) throw error;
	const stories = (data ?? []) as Story[];

	const grouped: Record<string, Story[]> = {};
	for (const story of stories) {
		if (!grouped[story.category]) grouped[story.category] = [];
		grouped[story.category].push(story);
	}
	return grouped as Record<StoryCategory, Story[]>;
}

export async function getStoryById(id: string): Promise<Story | null> {
	const supabase = getClient();
	const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
	if (error) return null;
	return data as Story;
}

export async function upsertStories(stories: Omit<Story, 'id' | 'created_at' | 'ingested_at'>[]): Promise<void> {
	const supabase = getClient();
	const { error } = await supabase.from('stories').upsert(stories, { onConflict: 'source_url' });
	if (error) throw error;
}

export async function getRecentTitles(hours = 48): Promise<string[]> {
	const supabase = getClient();
	const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
	const { data, error } = await supabase
		.from('stories')
		.select('title')
		.gte('ingested_at', since);
	if (error) throw error;
	return (data ?? []).map((d) => d.title);
}

export async function getTodayDigest(): Promise<DailyDigest | null> {
	const supabase = getClient();
	const today = new Date().toISOString().split('T')[0];
	const { data, error } = await supabase
		.from('daily_digests')
		.select('*')
		.eq('date', today)
		.single();
	if (error) return null;
	return data as DailyDigest;
}

export async function upsertDigest(digest: Omit<DailyDigest, 'id' | 'created_at'>): Promise<void> {
	const supabase = getClient();
	const { error } = await supabase.from('daily_digests').upsert(digest, { onConflict: 'date' });
	if (error) throw error;
}

export async function getFeaturedStories(limit = 5): Promise<Story[]> {
	const supabase = getClient();
	const { data, error } = await supabase
		.from('stories')
		.select('*')
		.eq('is_featured', true)
		.order('positivity_score', { ascending: false })
		.limit(limit);
	if (error) throw error;
	return (data ?? []) as Story[];
}

export async function getStoriesWithLocation(): Promise<Story[]> {
	const supabase = getClient();
	const { data, error } = await supabase
		.from('stories')
		.select('*')
		.not('location_lat', 'is', null)
		.not('location_lon', 'is', null)
		.order('published_at', { ascending: false })
		.limit(100);
	if (error) throw error;
	return (data ?? []) as Story[];
}
