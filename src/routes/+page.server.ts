import type { PageServerLoad } from './$types.js';
import type { Story, DailyDigest, StoryCategory } from '$lib/types/story.js';
import { PANELS } from '$lib/config.js';
import { getTodayInHistory } from '$lib/utils/history.js';

// Mock data for development — replaced by Supabase in production
function generateMockStories(): Record<string, Story[]> {
	const categories = PANELS.filter((p) => p.category).map((p) => p.category!);
	const grouped: Record<string, Story[]> = {};

	const sampleStories: Record<string, { title: string; summary: string }[]> = {
		science: [
			{ title: 'New solar cell achieves 47% efficiency, shattering previous record', summary: 'Researchers at NREL have developed a six-junction solar cell that converts nearly half of sunlight into electricity.' },
			{ title: 'CRISPR therapy cures sickle cell disease in landmark clinical trial', summary: 'The first gene-editing treatment has shown complete remission in 30 patients over two years.' },
			{ title: 'Quantum computer solves optimization problem 100 million times faster', summary: 'A new quantum processor demonstrates practical advantage for real-world logistics problems.' }
		],
		health: [
			{ title: 'Universal flu vaccine enters Phase 3 trials with promising results', summary: 'A single-shot vaccine targeting all influenza strains could end seasonal flu outbreaks.' },
			{ title: 'AI system detects pancreatic cancer 18 months earlier than current methods', summary: 'Machine learning model trained on medical records identifies early-stage cancer with 95% accuracy.' },
			{ title: 'Mental health first aid training now mandatory in 12 countries', summary: 'Global initiative brings psychological support skills to millions of community responders.' }
		],
		environment: [
			{ title: 'Great Barrier Reef shows highest coral cover in 36 years', summary: 'Marine surveys reveal unprecedented recovery following conservation efforts and cooler water temperatures.' },
			{ title: 'Costa Rica generates 100% renewable electricity for fifth consecutive year', summary: 'The Central American nation continues to lead the world in clean energy adoption.' },
			{ title: 'Ocean plastic cleanup removes 10 million kg from the Great Pacific Garbage Patch', summary: 'The Ocean Cleanup project reaches a major milestone in its mission to rid the oceans of plastic.' }
		],
		technology: [
			{ title: 'Open-source AI model matches GPT-4 performance at 1/10th the cost', summary: 'Democratizing access to powerful AI tools accelerates innovation across developing nations.' },
			{ title: 'New battery technology enables electric planes with 500-mile range', summary: 'Solid-state batteries with 3x energy density open the door to commercial electric aviation.' },
			{ title: 'Internet access reaches 90% of global population for the first time', summary: 'Satellite internet and infrastructure investments close the digital divide.' }
		],
		community: [
			{ title: 'Neighbors build 200 homes in one weekend through community barn-raising program', summary: 'Revived tradition combines modern construction with collective action to house families.' },
			{ title: 'Retired teachers launch free tutoring network reaching 50,000 students', summary: 'Volunteer educators provide personalized learning support to underserved communities.' },
			{ title: 'City converts abandoned lots into community gardens, feeds 10,000 families', summary: 'Urban farming initiative transforms blight into abundance across 340 neighborhood gardens.' }
		],
		education: [
			{ title: 'Finland shares education model with 30 developing nations', summary: 'Teacher training and curriculum design expertise exported to improve learning worldwide.' },
			{ title: '15-year-old inventor creates low-cost water purifier from recycled materials', summary: 'Young scientist wins global prize for device that provides clean water for under $5.' },
			{ title: 'Global literacy rate reaches 95% for the first time in human history', summary: 'Decades of investment in education bear fruit as reading skills become nearly universal.' }
		],
		arts: [
			{ title: 'Street art festival transforms industrial district into open-air gallery', summary: 'Over 200 murals by international artists bring color and culture to a forgotten neighborhood.' },
			{ title: 'Indigenous language preservation app reaches 1 million downloads', summary: 'Technology helps communities teach and preserve endangered languages through interactive stories.' },
			{ title: 'Community orchestra model goes viral, launching 500 new ensembles worldwide', summary: 'Inclusive music programs prove that orchestras thrive when they welcome all skill levels.' }
		],
		animals: [
			{ title: 'Giant panda officially removed from endangered species list', summary: 'Conservation success story sees wild panda population grow 68% over two decades.' },
			{ title: 'Coral reef fish populations recover after marine sanctuary expansion', summary: 'No-take zones show dramatic increase in biodiversity and fish biomass.' },
			{ title: 'Therapy animal programs reduce hospital stays by 25%', summary: 'Study across 100 hospitals shows trained therapy animals accelerate patient recovery.' }
		],
		economy: [
			{ title: 'Four-day work week trial shows 40% productivity boost', summary: 'Companies across 20 countries report higher output and happier workers with reduced hours.' },
			{ title: 'Microfinance program lifts 2 million families above poverty line', summary: 'Small loans with mentorship create sustainable businesses in rural communities.' },
			{ title: 'Worker-owned cooperatives grow 300% as alternative business model thrives', summary: 'Employee ownership proves resilient and equitable across manufacturing and tech sectors.' }
		],
		space: [
			{ title: 'James Webb discovers water vapor on rocky exoplanet in habitable zone', summary: 'The finding marks the first detection of water on a potentially Earth-like world.' },
			{ title: 'SpaceX Starship completes first orbital flight, opening era of cheap space access', summary: 'Fully reusable rocket reduces launch costs by 90%, enabling new space industries.' },
			{ title: 'International Moon Village project breaks ground with 12-nation partnership', summary: 'Collaborative lunar base aims to advance science and inspire global cooperation.' }
		],
		sports: [
			{ title: 'Refugee Olympic team wins first-ever gold medal', summary: 'Historic achievement inspires millions and highlights resilience of displaced athletes.' },
			{ title: 'Adaptive sports participation doubles globally in past three years', summary: 'Investment in accessibility removes barriers and creates champions in parasports.' },
			{ title: 'Youth sports program reduces juvenile crime by 60% in pilot cities', summary: 'After-school athletics combined with mentorship transform outcomes for at-risk teens.' }
		]
	};

	const locations = [
		{ name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 },
		{ name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82 },
		{ name: 'São Paulo, Brazil', lat: -23.55, lon: -46.63 },
		{ name: 'Berlin, Germany', lat: 52.52, lon: 13.41 },
		{ name: 'Melbourne, Australia', lat: -37.81, lon: 144.96 }
	];

	const sources = ['Reuters', 'AP News', 'BBC', 'Nature', 'NPR'];

	for (const category of categories) {
		const samples = sampleStories[category] ?? [];
		grouped[category] = samples.map((s, i) => ({
			id: `${category}-${i}`,
			title: s.title,
			summary: s.summary,
			source_url: `https://example.com/${category}/${i}`,
			source_name: sources[i % sources.length],
			category: category as StoryCategory,
			positivity_score: 65 + Math.floor(Math.random() * 35),
			image_url: null,
			location_lat: locations[i % locations.length].lat,
			location_lon: locations[i % locations.length].lon,
			location_name: locations[i % locations.length].name,
			published_at: new Date(Date.now() - i * 3600000).toISOString(),
			ingested_at: new Date().toISOString(),
			ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
			is_featured: i === 0,
			created_at: new Date().toISOString()
		}));
	}

	return grouped;
}

function generateMockDigest(): DailyDigest {
	return {
		id: 'digest-today',
		date: new Date().toISOString().split('T')[0],
		summary: 'Today brought remarkable advances in renewable energy, with Costa Rica celebrating its fifth consecutive year of 100% clean electricity. In science, a breakthrough CRISPR therapy showed complete remission of sickle cell disease. Communities around the world came together, with neighbors building 200 homes in a single weekend. The Great Barrier Reef is recovering at its fastest rate in decades.',
		top_story_ids: ['science-0', 'environment-0', 'community-0', 'health-0', 'sports-0'],
		category_counts: {
			science: 3, health: 3, environment: 3, technology: 3,
			community: 3, education: 3, arts: 3, animals: 3,
			economy: 3, space: 3, sports: 3
		} as Record<StoryCategory, number>,
		avg_positivity: 82,
		created_at: new Date().toISOString()
	};
}

export const load: PageServerLoad = async () => {
	// In production, replace with:
	// import { getStoriesByCategories, getTodayDigest, getStoriesWithLocation } from '$lib/server/db.js';
	// const stories = await getStoriesByCategories();
	// const digest = await getTodayDigest();
	// const geoStories = await getStoriesWithLocation();

	const stories = generateMockStories();
	const digest = generateMockDigest();
	const allStories = Object.values(stories).flat();
	const geoStories = allStories.filter((s) => s.location_lat != null && s.location_lon != null);
	const history = getTodayInHistory();

	return {
		stories,
		digest,
		geoStories,
		history
	};
};
