import type { PageServerLoad } from './$types.js';
import type { Story, DailyDigest, StoryCategory } from '$lib/types/story.js';
import { PANELS } from '$lib/config.js';
import { getTodayInHistory } from '$lib/utils/history.js';
import { getDailyQuote } from '$lib/utils/quotes.js';
import { getDailyVideo } from '$lib/utils/videos.js';

/**
 * Attempts to load live stories from Supabase.
 * Returns null if database is not configured or empty.
 */
async function loadLiveStories(): Promise<Record<string, Story[]> | null> {
	try {
		const { getStoriesByCategories } = await import('$lib/server/db.js');
		const grouped = await getStoriesByCategories();
		const totalStories = Object.values(grouped).flat().length;
		if (totalStories === 0) return null;
		return grouped;
	} catch {
		return null;
	}
}

/**
 * Attempts to load live digest from Supabase.
 */
async function loadLiveDigest(): Promise<DailyDigest | null> {
	try {
		const { getTodayDigest } = await import('$lib/server/db.js');
		return await getTodayDigest();
	} catch {
		return null;
	}
}

/**
 * Attempts to load stories with geo coordinates for the 3D globe.
 */
async function loadLiveGeoStories(): Promise<Story[] | null> {
	try {
		const { getStoriesWithLocation } = await import('$lib/server/db.js');
		const stories = await getStoriesWithLocation();
		return stories.length > 0 ? stories : null;
	} catch {
		return null;
	}
}

// Mock data for development — replaced by live data when Supabase is configured
function generateMockStories(): Record<string, Story[]> {
	const grouped: Record<string, Story[]> = {};

	const sampleStories: Record<string, { title: string; summary: string; source_url: string; source_name: string; location: { name: string; lat: number; lon: number } }[]> = {
		science: [
			{
				title: 'New solar cell achieves 47% efficiency, shattering previous record',
				summary: 'Researchers at NREL have developed a six-junction solar cell that converts nearly half of sunlight into electricity, paving the way for ultra-efficient solar panels.',
				source_url: 'https://www.nrel.gov/pv/cell-efficiency.html',
				source_name: 'NREL',
				location: { name: 'Golden, Colorado', lat: 39.74, lon: -105.18 }
			},
			{
				title: 'CRISPR therapy cures sickle cell disease in landmark clinical trial',
				summary: 'The first gene-editing treatment has shown complete remission in 30 patients over two years, marking a new era for genetic medicine.',
				source_url: 'https://www.nature.com/articles/d41586-023-03590-6',
				source_name: 'Nature',
				location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 }
			},
			{
				title: 'Quantum computer solves optimization problem 100 million times faster',
				summary: 'A new quantum processor demonstrates practical advantage for real-world logistics problems that classical computers struggle with.',
				source_url: 'https://news.mit.edu/topic/quantum-computing',
				source_name: 'MIT News',
				location: { name: 'Zurich, Switzerland', lat: 47.37, lon: 8.54 }
			}
		],
		health: [
			{
				title: 'Universal flu vaccine enters Phase 3 trials with promising results',
				summary: 'A single-shot vaccine targeting all influenza strains could end seasonal flu outbreaks within a decade.',
				source_url: 'https://www.nih.gov/news-events/nih-research-matters',
				source_name: 'NIH',
				location: { name: 'Bethesda, Maryland', lat: 38.98, lon: -77.09 }
			},
			{
				title: 'AI system detects pancreatic cancer 18 months earlier than current methods',
				summary: 'Machine learning model trained on medical records identifies early-stage cancer with 95% accuracy, potentially saving thousands of lives.',
				source_url: 'https://www.nature.com/articles/s41591-023-02332-5',
				source_name: 'Nature Medicine',
				location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 }
			},
			{
				title: 'Mental health first aid training now mandatory in 12 countries',
				summary: 'Global initiative brings psychological support skills to millions of community responders and first responders worldwide.',
				source_url: 'https://www.who.int/news/item/17-06-2022-who-highlights-urgent-need-to-transform-mental-health-and-mental-health-care',
				source_name: 'WHO',
				location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 }
			}
		],
		environment: [
			{
				title: 'Great Barrier Reef shows highest coral cover in 36 years',
				summary: 'Marine surveys reveal unprecedented recovery following conservation efforts and favorable ocean conditions.',
				source_url: 'https://www.nationalgeographic.com/environment/article/great-barrier-reef',
				source_name: 'National Geographic',
				location: { name: 'Townsville, Australia', lat: -19.26, lon: 146.80 }
			},
			{
				title: 'Costa Rica generates 100% renewable electricity for fifth consecutive year',
				summary: 'The Central American nation continues to lead the world in clean energy adoption through hydropower, wind, and geothermal.',
				source_url: 'https://apnews.com/hub/renewable-energy',
				source_name: 'AP News',
				location: { name: 'San José, Costa Rica', lat: 9.93, lon: -84.08 }
			},
			{
				title: 'Ocean plastic cleanup removes 10 million kg from the Great Pacific Garbage Patch',
				summary: 'The Ocean Cleanup project reaches a major milestone in its mission to rid the oceans of plastic pollution.',
				source_url: 'https://theoceancleanup.com/updates/',
				source_name: 'The Ocean Cleanup',
				location: { name: 'Rotterdam, Netherlands', lat: 51.92, lon: 4.48 }
			}
		],
		technology: [
			{
				title: 'Open-source AI model matches GPT-4 performance at 1/10th the cost',
				summary: 'Democratizing access to powerful AI tools accelerates innovation across developing nations and small businesses.',
				source_url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
				source_name: 'MIT Tech Review',
				location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 }
			},
			{
				title: 'New battery technology enables electric planes with 500-mile range',
				summary: 'Solid-state batteries with 3x energy density open the door to commercial electric aviation within the decade.',
				source_url: 'https://www.nature.com/articles/s41560-023-01208-9',
				source_name: 'Nature Energy',
				location: { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 }
			},
			{
				title: 'Internet access reaches 90% of global population for the first time',
				summary: 'Satellite internet and infrastructure investments close the digital divide, connecting billions to information and opportunity.',
				source_url: 'https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx',
				source_name: 'ITU',
				location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 }
			}
		],
		community: [
			{
				title: 'Neighbors build 200 homes in one weekend through community barn-raising program',
				summary: 'Revived tradition combines modern construction with collective action to house families in need.',
				source_url: 'https://www.habitat.org/newsroom',
				source_name: 'Habitat for Humanity',
				location: { name: 'Atlanta, Georgia', lat: 33.75, lon: -84.39 }
			},
			{
				title: 'Retired teachers launch free tutoring network reaching 50,000 students',
				summary: 'Volunteer educators provide personalized learning support to underserved communities across the country.',
				source_url: 'https://www.volunteermatch.org/',
				source_name: 'VolunteerMatch',
				location: { name: 'Chicago, Illinois', lat: 41.88, lon: -87.63 }
			},
			{
				title: 'City converts abandoned lots into community gardens, feeds 10,000 families',
				summary: 'Urban farming initiative transforms blight into abundance across 340 neighborhood gardens.',
				source_url: 'https://apnews.com/hub/environment',
				source_name: 'AP News',
				location: { name: 'Detroit, Michigan', lat: 42.33, lon: -83.05 }
			}
		],
		education: [
			{
				title: 'Finland shares education model with 30 developing nations',
				summary: 'Teacher training and curriculum design expertise exported to improve learning outcomes worldwide.',
				source_url: 'https://www.bbc.com/news/education',
				source_name: 'BBC Education',
				location: { name: 'Helsinki, Finland', lat: 60.17, lon: 24.94 }
			},
			{
				title: '15-year-old inventor creates low-cost water purifier from recycled materials',
				summary: 'Young scientist wins global prize for device that provides clean water for under $5 per unit.',
				source_url: 'https://www.goodnewsnetwork.org/category/inspiring/',
				source_name: 'Good News Network',
				location: { name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82 }
			},
			{
				title: 'Global literacy rate reaches 95% for the first time in human history',
				summary: 'Decades of investment in education bear fruit as reading skills become nearly universal across all regions.',
				source_url: 'https://www.unesco.org/en/literacy',
				source_name: 'UNESCO',
				location: { name: 'Paris, France', lat: 48.86, lon: 2.35 }
			}
		],
		arts: [
			{
				title: 'Street art festival transforms industrial district into open-air gallery',
				summary: 'Over 200 murals by international artists bring color and culture to a forgotten neighborhood.',
				source_url: 'https://www.theguardian.com/artanddesign',
				source_name: 'The Guardian',
				location: { name: 'Berlin, Germany', lat: 52.52, lon: 13.41 }
			},
			{
				title: 'Indigenous language preservation app reaches 1 million downloads',
				summary: 'Technology helps communities teach and preserve endangered languages through interactive stories and games.',
				source_url: 'https://www.bbc.com/news/technology',
				source_name: 'BBC News',
				location: { name: 'Auckland, New Zealand', lat: -36.85, lon: 174.76 }
			},
			{
				title: 'Community orchestra model goes viral, launching 500 new ensembles worldwide',
				summary: 'Inclusive music programs prove that orchestras thrive when they welcome all skill levels and backgrounds.',
				source_url: 'https://www.npr.org/music',
				source_name: 'NPR Music',
				location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 }
			}
		],
		animals: [
			{
				title: 'Giant panda officially removed from endangered species list',
				summary: 'Conservation success story sees wild panda population grow 68% over two decades through habitat protection.',
				source_url: 'https://en.wikipedia.org/wiki/Giant_panda',
				source_name: 'Wikipedia',
				location: { name: 'Chengdu, China', lat: 30.57, lon: 104.07 }
			},
			{
				title: 'Coral reef fish populations recover after marine sanctuary expansion',
				summary: 'No-take zones show dramatic increase in biodiversity and fish biomass after just three years.',
				source_url: 'https://www.nationalgeographic.com/animals/',
				source_name: 'National Geographic',
				location: { name: 'Belize City, Belize', lat: 17.50, lon: -88.20 }
			},
			{
				title: 'Therapy animal programs reduce hospital stays by 25%',
				summary: 'Study across 100 hospitals shows trained therapy animals accelerate patient recovery and improve mental health outcomes.',
				source_url: 'https://apnews.com/hub/science',
				source_name: 'AP News',
				location: { name: 'Melbourne, Australia', lat: -37.81, lon: 144.96 }
			}
		],
		economy: [
			{
				title: 'Four-day work week trial shows 40% productivity boost',
				summary: 'Companies across 20 countries report higher output and happier workers with reduced hours.',
				source_url: 'https://www.bbc.co.uk/worklife',
				source_name: 'BBC Worklife',
				location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 }
			},
			{
				title: 'Microfinance program lifts 2 million families above poverty line',
				summary: 'Small loans with mentorship create sustainable businesses in rural communities across South Asia.',
				source_url: 'https://www.worldbank.org/en/topic/financialinclusion',
				source_name: 'World Bank',
				location: { name: 'Dhaka, Bangladesh', lat: 23.81, lon: 90.41 }
			},
			{
				title: 'Worker-owned cooperatives grow 300% as alternative business model thrives',
				summary: 'Employee ownership proves resilient and equitable across manufacturing and tech sectors worldwide.',
				source_url: 'https://apnews.com/business',
				source_name: 'AP News',
				location: { name: 'Mondragon, Spain', lat: 43.06, lon: -2.49 }
			}
		],
		space: [
			{
				title: 'James Webb discovers water vapor on rocky exoplanet in habitable zone',
				summary: 'The finding marks the first detection of water on a potentially Earth-like world orbiting a distant star.',
				source_url: 'https://www.nasa.gov/webb/',
				source_name: 'NASA',
				location: { name: 'Greenbelt, Maryland', lat: 39.00, lon: -76.88 }
			},
			{
				title: 'SpaceX Starship completes first orbital flight, opening era of cheap space access',
				summary: 'Fully reusable rocket reduces launch costs by 90%, enabling new space industries and exploration.',
				source_url: 'https://apnews.com/hub/space-exploration',
				source_name: 'AP News',
				location: { name: 'Boca Chica, Texas', lat: 25.99, lon: -97.16 }
			},
			{
				title: 'International Moon Village project breaks ground with 12-nation partnership',
				summary: 'Collaborative lunar base aims to advance science and inspire unprecedented global cooperation.',
				source_url: 'https://www.esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/Moon',
				source_name: 'ESA',
				location: { name: 'Darmstadt, Germany', lat: 49.87, lon: 8.65 }
			}
		],
		sports: [
			{
				title: 'Refugee Olympic team wins first-ever gold medal',
				summary: 'Historic achievement inspires millions and highlights the resilience of displaced athletes around the world.',
				source_url: 'https://www.bbc.com/sport/olympics',
				source_name: 'BBC Sport',
				location: { name: 'Paris, France', lat: 48.86, lon: 2.35 }
			},
			{
				title: 'Adaptive sports participation doubles globally in past three years',
				summary: 'Investment in accessibility removes barriers and creates champions in parasports across every continent.',
				source_url: 'https://www.paralympic.org/news',
				source_name: 'Paralympic.org',
				location: { name: 'Bonn, Germany', lat: 50.73, lon: 7.10 }
			},
			{
				title: 'Youth sports program reduces juvenile crime by 60% in pilot cities',
				summary: 'After-school athletics combined with mentorship transform outcomes for at-risk teens in 15 cities.',
				source_url: 'https://apnews.com/hub/olympic-games',
				source_name: 'AP News',
				location: { name: 'São Paulo, Brazil', lat: -23.55, lon: -46.63 }
			}
		]
	};

	const categories = PANELS.filter((p) => p.category).map((p) => p.category!);

	for (const category of categories) {
		const samples = sampleStories[category] ?? [];
		grouped[category] = samples.map((s, i) => ({
			id: `${category}-${i}`,
			title: s.title,
			summary: s.summary,
			source_url: s.source_url,
			source_name: s.source_name,
			category: category as StoryCategory,
			positivity_score: 65 + Math.floor(Math.random() * 35),
			image_url: null,
			location_lat: s.location.lat,
			location_lon: s.location.lon,
			location_name: s.location.name,
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
	// Try live data first, fall back to mock
	const liveStories = await loadLiveStories();
	const stories = liveStories ?? generateMockStories();

	const liveDigest = await loadLiveDigest();
	const digest = liveDigest ?? generateMockDigest();

	const allStories = Object.values(stories).flat();

	// Try live geo stories, fall back to filtering all stories
	const liveGeo = await loadLiveGeoStories();
	const geoStories = liveGeo ?? allStories.filter((s) => s.location_lat != null && s.location_lon != null);

	const history = getTodayInHistory();
	const quote = getDailyQuote();
	const video = getDailyVideo();

	return {
		stories,
		digest,
		geoStories,
		history,
		quote,
		video,
		isLive: liveStories !== null
	};
};
