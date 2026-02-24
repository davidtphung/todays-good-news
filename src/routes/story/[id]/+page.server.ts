import type { PageServerLoad } from './$types.js';
import type { Story, StoryCategory } from '$lib/types/story.js';

export const load: PageServerLoad = async ({ params }) => {
	// Try live DB first
	try {
		const { getStoryById } = await import('$lib/server/db.js');
		const story = await getStoryById(params.id);
		if (story) return { story };
	} catch {
		// DB not configured — fall through to mock
	}

	// Mock: generate a story from the ID pattern (category-index)
	const [category, indexStr] = params.id.split('-');
	const index = parseInt(indexStr ?? '0');

	const mockStories: Record<string, { title: string; summary: string; source_url: string; source_name: string; location: { name: string; lat: number; lon: number } }[]> = {
		science: [
			{ title: 'New solar cell achieves 47% efficiency, shattering previous record', summary: 'Researchers at NREL have developed a six-junction solar cell that converts nearly half of sunlight into electricity, paving the way for ultra-efficient solar panels.', source_url: 'https://www.nrel.gov/pv/cell-efficiency.html', source_name: 'NREL', location: { name: 'Golden, Colorado', lat: 39.74, lon: -105.18 } },
			{ title: 'CRISPR therapy cures sickle cell disease in landmark clinical trial', summary: 'The first gene-editing treatment has shown complete remission in 30 patients over two years, marking a new era for genetic medicine.', source_url: 'https://www.nature.com/articles/d41586-023-03590-6', source_name: 'Nature', location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 } },
			{ title: 'Quantum computer solves optimization problem 100 million times faster', summary: 'A new quantum processor demonstrates practical advantage for real-world logistics problems that classical computers struggle with.', source_url: 'https://www.quantamagazine.org/quantum-speedup-found-for-huge-class-of-hard-problems-20250317/', source_name: 'Quanta Magazine', location: { name: 'Zurich, Switzerland', lat: 47.37, lon: 8.54 } }
		],
		health: [
			{ title: 'Universal flu vaccine enters Phase 3 trials with promising results', summary: 'A single-shot vaccine targeting all influenza strains could end seasonal flu outbreaks within a decade.', source_url: 'https://www.pfizer.com/news/press-release/press-release-detail/pfizer-initiates-phase-3-study-mrna-based-influenza-vaccine', source_name: 'Pfizer', location: { name: 'Bethesda, Maryland', lat: 38.98, lon: -77.09 } },
			{ title: 'AI system detects pancreatic cancer 18 months earlier than current methods', summary: 'Machine learning model trained on medical records identifies early-stage cancer with 95% accuracy, potentially saving thousands of lives.', source_url: 'https://www.nature.com/articles/s41591-023-02332-5', source_name: 'Nature Medicine', location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 } },
			{ title: 'Mental health first aid training now mandatory in 12 countries', summary: 'Global initiative brings psychological support skills to millions of community responders and first responders worldwide.', source_url: 'https://www.who.int/news/item/17-06-2022-who-highlights-urgent-need-to-transform-mental-health-and-mental-health-care', source_name: 'WHO', location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 } }
		],
		environment: [
			{ title: 'Great Barrier Reef shows highest coral cover in 36 years', summary: 'Marine surveys reveal unprecedented recovery following conservation efforts and favorable ocean conditions.', source_url: 'https://www.cnn.com/2022/08/04/australia/great-barrier-reef-high-coral-report-australia-climate-intl-hnk/index.html', source_name: 'National Geographic', location: { name: 'Townsville, Australia', lat: -19.26, lon: 146.80 } },
			{ title: 'Costa Rica generates 100% renewable electricity for fifth consecutive year', summary: 'The Central American nation continues to lead the world in clean energy adoption through hydropower, wind, and geothermal.', source_url: 'https://en.wikipedia.org/wiki/Renewable_energy_in_Costa_Rica', source_name: 'Wikipedia', location: { name: 'San José, Costa Rica', lat: 9.93, lon: -84.08 } },
			{ title: 'Ocean plastic cleanup removes 10 million kg from the Great Pacific Garbage Patch', summary: 'The Ocean Cleanup project reaches a major milestone in its mission to rid the oceans of plastic pollution.', source_url: 'https://theoceancleanup.com/press/press-releases/the-ocean-cleanup-breaks-10000000-kg-barrier/', source_name: 'The Ocean Cleanup', location: { name: 'Rotterdam, Netherlands', lat: 51.92, lon: 4.48 } }
		],
		technology: [
			{ title: 'Open-source AI model matches GPT-4 performance at 1/10th the cost', summary: 'Democratizing access to powerful AI tools accelerates innovation across developing nations and small businesses.', source_url: 'https://fortune.com/2024/04/08/open-source-ai-boom-openai-gpt-4/', source_name: 'Fortune', location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 } },
			{ title: 'New battery technology enables electric planes with 500-mile range', summary: 'Solid-state batteries with 3x energy density open the door to commercial electric aviation within the decade.', source_url: 'https://www.nature.com/articles/s41560-023-01208-9', source_name: 'Nature Energy', location: { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 } },
			{ title: 'Internet access reaches 90% of global population for the first time', summary: 'Satellite internet and infrastructure investments close the digital divide, connecting billions to information and opportunity.', source_url: 'https://www.itu.int/itu-d/reports/statistics/2024/11/10/ff24-internet-use/', source_name: 'ITU', location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 } }
		],
		community: [
			{ title: 'Neighbors build 200 homes in one weekend through community barn-raising program', summary: 'Revived tradition combines modern construction with collective action to house families in need.', source_url: 'https://www.nbcnews.com/better/health/why-volunteering-habitat-humanity-so-meaningful-ncna814931', source_name: 'NBC News', location: { name: 'Atlanta, Georgia', lat: 33.75, lon: -84.39 } },
			{ title: 'Retired teachers launch free tutoring network reaching 50,000 students', summary: 'Volunteer educators provide personalized learning support to underserved communities across the country.', source_url: 'https://www.learntobe.org/intergenerational-tutoring', source_name: 'Learn To Be', location: { name: 'Chicago, Illinois', lat: 41.88, lon: -87.63 } },
			{ title: 'City converts abandoned lots into community gardens, feeds 10,000 families', summary: 'Urban farming initiative transforms blight into abundance across 340 neighborhood gardens.', source_url: 'https://modernfarmer.com/2024/09/philadephia-vacant-lots-urban-garden/', source_name: 'Modern Farmer', location: { name: 'Detroit, Michigan', lat: 42.33, lon: -83.05 } }
		],
		education: [
			{ title: 'Finland shares education model with 30 developing nations', summary: 'Teacher training and curriculum design expertise exported to improve learning outcomes worldwide.', source_url: 'https://www.aljazeera.com/economy/2022/5/4/finlands-big-new-export-to-india-school-education', source_name: 'Al Jazeera', location: { name: 'Helsinki, Finland', lat: 60.17, lon: 24.94 } },
			{ title: '15-year-old inventor creates low-cost water purifier from recycled materials', summary: 'Young scientist wins global prize for device that provides clean water for under $5 per unit.', source_url: 'https://time.com/5916772/kid-of-the-year-2020/', source_name: 'TIME', location: { name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82 } },
			{ title: 'Global literacy rate reaches 95% for the first time in human history', summary: 'Decades of investment in education bear fruit as reading skills become nearly universal across all regions.', source_url: 'https://ourworldindata.org/literacy', source_name: 'UNESCO', location: { name: 'Paris, France', lat: 48.86, lon: 2.35 } }
		],
		arts: [
			{ title: 'Street art festival transforms industrial district into open-air gallery', summary: 'Over 200 murals by international artists bring color and culture to a forgotten neighborhood.', source_url: 'https://fadmagazine.com/2024/09/17/street-art-revolution-how-murals-are-transforming-urban-landscapes/', source_name: 'The Guardian', location: { name: 'Berlin, Germany', lat: 52.52, lon: 13.41 } },
			{ title: 'Indigenous language preservation app reaches 1 million downloads', summary: 'Technology helps communities teach and preserve endangered languages through interactive stories and games.', source_url: 'https://www.howwegettonext.com/apps-are-helping-keep-indigenous-languages-alive-online/', source_name: 'How We Get To Next', location: { name: 'Auckland, New Zealand', lat: -36.85, lon: 174.76 } },
			{ title: 'Community orchestra model goes viral, launching 500 new ensembles worldwide', summary: 'Inclusive music programs prove that orchestras thrive when they welcome all skill levels and backgrounds.', source_url: 'https://www.npr.org/2011/03/15/134567922/the-road-to-an-american-el-sistema', source_name: 'NPR', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } }
		],
		animals: [
			{ title: 'Giant panda officially removed from endangered species list', summary: 'Conservation success story sees wild panda population grow 68% over two decades through habitat protection.', source_url: 'https://www.nationalgeographic.com/animals/article/pandas-vulnerable-endangered-species', source_name: 'National Geographic', location: { name: 'Chengdu, China', lat: 30.57, lon: 104.07 } },
			{ title: 'Coral reef fish populations recover after marine sanctuary expansion', summary: 'No-take zones show dramatic increase in biodiversity and fish biomass after just three years.', source_url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8907626/', source_name: 'NIH PMC', location: { name: 'Belize City, Belize', lat: 17.50, lon: -88.20 } },
			{ title: 'Therapy animal programs reduce hospital stays by 25%', summary: 'Study across 100 hospitals shows trained therapy animals accelerate patient recovery and improve mental health outcomes.', source_url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10986847/', source_name: 'NIH PMC', location: { name: 'Melbourne, Australia', lat: -37.81, lon: 144.96 } }
		],
		economy: [
			{ title: 'Four-day work week trial shows 40% productivity boost', summary: 'Companies across 20 countries report higher output and happier workers with reduced hours.', source_url: 'https://www.npr.org/2019/11/04/776163853/microsoft-japan-says-4-day-workweek-boosted-workers-productivity-by-40', source_name: 'NPR', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
			{ title: 'Microfinance program lifts 2 million families above poverty line', summary: 'Small loans with mentorship create sustainable businesses in rural communities across South Asia.', source_url: 'https://www.worldbank.org/en/topic/poverty/overview', source_name: 'World Bank', location: { name: 'Dhaka, Bangladesh', lat: 23.81, lon: 90.41 } },
			{ title: 'Worker-owned cooperatives grow 300% as alternative business model thrives', summary: 'Employee ownership proves resilient and equitable across manufacturing and tech sectors worldwide.', source_url: 'https://institute.coop/what-worker-cooperative', source_name: 'Institute for Cooperative Development', location: { name: 'Mondragon, Spain', lat: 43.06, lon: -2.49 } }
		],
		space: [
			{ title: 'James Webb discovers water vapor on rocky exoplanet in habitable zone', summary: 'The finding marks the first detection of water on a potentially Earth-like world orbiting a distant star.', source_url: 'https://webbtelescope.org/contents/news-releases/2023/news-2023-120.html', source_name: 'Webb Space Telescope', location: { name: 'Greenbelt, Maryland', lat: 39.00, lon: -76.88 } },
			{ title: 'SpaceX Starship completes first orbital flight, opening era of cheap space access', summary: 'Fully reusable rocket reduces launch costs by 90%, enabling new space industries and exploration.', source_url: 'https://www.nbcnews.com/science/space/live-blog/live-updates-spacex-starship-mega-rocket-launch-rcna155687', source_name: 'NBC News', location: { name: 'Boca Chica, Texas', lat: 25.99, lon: -97.16 } },
			{ title: 'International Moon Village project breaks ground with 12-nation partnership', summary: 'Collaborative lunar base aims to advance science and inspire unprecedented global cooperation.', source_url: 'https://blogs.esa.int/janwoerner/2016/11/23/moon-village/', source_name: 'ESA Blog', location: { name: 'Darmstadt, Germany', lat: 49.87, lon: 8.65 } }
		],
		sports: [
			{ title: 'Refugee Olympic team wins first-ever gold medal', summary: 'Historic achievement inspires millions and highlights the resilience of displaced athletes around the world.', source_url: 'https://www.npr.org/2024/08/09/nx-s1-5069315/olympic-refugee-team-medal-boxer-cindy-ngamba', source_name: 'NPR', location: { name: 'Paris, France', lat: 48.86, lon: 2.35 } },
			{ title: 'Adaptive sports participation doubles globally in past three years', summary: 'Investment in accessibility removes barriers and creates champions in parasports across every continent.', source_url: 'https://www.espn.com/olympics/story/_/id/41000000/paralympics-2024-paris', source_name: 'ESPN', location: { name: 'Bonn, Germany', lat: 50.73, lon: 7.10 } },
			{ title: 'Youth sports program reduces juvenile crime by 60% in pilot cities', summary: 'After-school athletics combined with mentorship transform outcomes for at-risk teens in 15 cities.', source_url: 'https://www.eugenecivicalliance.org/preventing-juvenile-delinquency-through-sports/', source_name: 'Eugene Civic Alliance', location: { name: 'São Paulo, Brazil', lat: -23.55, lon: -46.63 } }
		]
	};

	const stories = mockStories[category];
	if (!stories || !stories[index]) {
		return { story: null };
	}

	const s = stories[index];
	const story: Story = {
		id: params.id,
		title: s.title,
		summary: s.summary,
		source_url: s.source_url,
		source_name: s.source_name,
		category: category as StoryCategory,
		positivity_score: 75 + Math.floor(Math.random() * 25),
		image_url: null,
		location_lat: s.location.lat,
		location_lon: s.location.lon,
		location_name: s.location.name,
		published_at: new Date(Date.now() - index * 3600000).toISOString(),
		ingested_at: new Date().toISOString(),
		ai_classification: { is_positive: true, confidence: 0.95, reasoning: 'Genuinely positive story' },
		is_featured: index === 0,
		created_at: new Date().toISOString()
	};

	return { story };
};
