import type { PageServerLoad } from './$types.js';
import type { Story, StoryCategory } from '$lib/types/story.js';

export const load: PageServerLoad = async ({ params }) => {
	// In production:
	// import { getStoryById } from '$lib/server/db.js';
	// const story = await getStoryById(params.id);

	// Mock: generate a story from the ID pattern (category-index)
	const [category, indexStr] = params.id.split('-');
	const index = parseInt(indexStr ?? '0');

	const mockTitles: Record<string, string[]> = {
		science: ['New solar cell achieves 47% efficiency, shattering previous record', 'CRISPR therapy cures sickle cell disease in landmark clinical trial', 'Quantum computer solves optimization problem 100 million times faster'],
		health: ['Universal flu vaccine enters Phase 3 trials with promising results', 'AI system detects pancreatic cancer 18 months earlier than current methods', 'Mental health first aid training now mandatory in 12 countries'],
		environment: ['Great Barrier Reef shows highest coral cover in 36 years', 'Costa Rica generates 100% renewable electricity for fifth consecutive year', 'Ocean plastic cleanup removes 10 million kg from the Great Pacific Garbage Patch'],
		technology: ['Open-source AI model matches GPT-4 performance at 1/10th the cost', 'New battery technology enables electric planes with 500-mile range', 'Internet access reaches 90% of global population for the first time'],
		community: ['Neighbors build 200 homes in one weekend through community barn-raising program', 'Retired teachers launch free tutoring network reaching 50,000 students', 'City converts abandoned lots into community gardens, feeds 10,000 families'],
		education: ['Finland shares education model with 30 developing nations', '15-year-old inventor creates low-cost water purifier from recycled materials', 'Global literacy rate reaches 95% for the first time in human history'],
		arts: ['Street art festival transforms industrial district into open-air gallery', 'Indigenous language preservation app reaches 1 million downloads', 'Community orchestra model goes viral, launching 500 new ensembles worldwide'],
		animals: ['Giant panda officially removed from endangered species list', 'Coral reef fish populations recover after marine sanctuary expansion', 'Therapy animal programs reduce hospital stays by 25%'],
		economy: ['Four-day work week trial shows 40% productivity boost', 'Microfinance program lifts 2 million families above poverty line', 'Worker-owned cooperatives grow 300% as alternative business model thrives'],
		space: ['James Webb discovers water vapor on rocky exoplanet in habitable zone', 'SpaceX Starship completes first orbital flight, opening era of cheap space access', 'International Moon Village project breaks ground with 12-nation partnership'],
		sports: ['Refugee Olympic team wins first-ever gold medal', 'Adaptive sports participation doubles globally in past three years', 'Youth sports program reduces juvenile crime by 60% in pilot cities']
	};

	const titles = mockTitles[category];
	if (!titles || !titles[index]) {
		return { story: null };
	}

	const story: Story = {
		id: params.id,
		title: titles[index],
		summary: `This is a remarkable development in the ${category} space. The story represents a significant positive impact on communities worldwide and demonstrates the power of human ingenuity, compassion, and collective action.`,
		source_url: `https://example.com/${category}/${index}`,
		source_name: ['Reuters', 'AP News', 'BBC', 'Nature', 'NPR'][index % 5],
		category: category as StoryCategory,
		positivity_score: 75 + Math.floor(Math.random() * 25),
		image_url: null,
		location_lat: 40.71,
		location_lon: -74.01,
		location_name: 'New York, USA',
		published_at: new Date(Date.now() - index * 3600000).toISOString(),
		ingested_at: new Date().toISOString(),
		ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
		is_featured: index === 0,
		created_at: new Date().toISOString()
	};

	return { story };
};
