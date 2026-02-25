/**
 * Expanded pool of good news stories for daily rotation.
 * Each category has 7 stories — the date-based selector picks 3 per day,
 * cycling through different combinations so the dashboard updates daily.
 *
 * Stories 0-2 per category are the original "day 0" stories.
 * Stories 3-6 are additional stories for rotation.
 */

export interface MockStory {
	title: string;
	summary: string;
	source_url: string;
	source_name: string;
	location: { name: string; lat: number; lon: number };
}

export const STORY_POOL: Record<string, MockStory[]> = {
	science: [
		// Day 0 originals
		{ title: 'New solar cell achieves 47% efficiency, shattering previous record', summary: 'Researchers at NREL have developed a six-junction solar cell that converts nearly half of sunlight into electricity, paving the way for ultra-efficient solar panels.', source_url: 'https://www.nrel.gov/pv/cell-efficiency.html', source_name: 'NREL', location: { name: 'Golden, Colorado', lat: 39.74, lon: -105.18 } },
		{ title: 'CRISPR therapy cures sickle cell disease in landmark clinical trial', summary: 'The first gene-editing treatment has shown complete remission in 30 patients over two years, marking a new era for genetic medicine.', source_url: 'https://www.nature.com/articles/d41586-023-03590-6', source_name: 'Nature', location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 } },
		{ title: 'Quantum computer solves optimization problem 100 million times faster', summary: 'A new quantum processor demonstrates practical advantage for real-world logistics problems that classical computers struggle with.', source_url: 'https://www.quantamagazine.org/quantum-speedup-found-for-huge-class-of-hard-problems-20250317/', source_name: 'Quanta Magazine', location: { name: 'Zurich, Switzerland', lat: 47.37, lon: 8.54 } },
		// Rotation stories
		{ title: 'Fusion reactor sustains plasma for record 1,000 seconds', summary: 'South Korea\'s KSTAR tokamak achieves a major milestone in the quest for limitless clean energy, bringing commercial fusion power closer to reality.', source_url: 'https://www.iter.org/newsline/-/3989', source_name: 'ITER', location: { name: 'Daejeon, South Korea', lat: 36.35, lon: 127.38 } },
		{ title: 'New antibiotic discovered in soil microbes effective against superbugs', summary: 'Scientists identify a novel compound from soil bacteria that kills antibiotic-resistant pathogens, offering hope against the growing superbug crisis.', source_url: 'https://en.wikipedia.org/wiki/Teixobactin', source_name: 'Wikipedia', location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 } },
		{ title: 'Brain-computer interface helps paralyzed patient type at 90 words per minute', summary: 'Neural implant translates brain signals directly into text, restoring communication for people with severe paralysis.', source_url: 'https://www.nature.com/articles/s41586-023-06443-4', source_name: 'Nature', location: { name: 'Stanford, California', lat: 37.43, lon: -122.17 } },
		{ title: 'Scientists map complete human cell atlas with 37 trillion cells', summary: 'International project creates the most detailed map of human biology ever assembled, revolutionizing our understanding of health and disease.', source_url: 'https://www.humancellatlas.org/', source_name: 'Human Cell Atlas', location: { name: 'Cambridge, United Kingdom', lat: 52.21, lon: 0.12 } },
	],
	health: [
		{ title: 'Universal flu vaccine enters Phase 3 trials with promising results', summary: 'A single-shot vaccine targeting all influenza strains could end seasonal flu outbreaks within a decade.', source_url: 'https://www.pfizer.com/news/press-release/press-release-detail/pfizer-initiates-phase-3-study-mrna-based-influenza-vaccine', source_name: 'Pfizer', location: { name: 'Bethesda, Maryland', lat: 38.98, lon: -77.09 } },
		{ title: 'AI system detects pancreatic cancer 18 months earlier than current methods', summary: 'Machine learning model trained on medical records identifies early-stage cancer with 95% accuracy, potentially saving thousands of lives.', source_url: 'https://www.nature.com/articles/s41591-023-02332-5', source_name: 'Nature Medicine', location: { name: 'Boston, Massachusetts', lat: 42.36, lon: -71.06 } },
		{ title: 'Mental health first aid training now mandatory in 12 countries', summary: 'Global initiative brings psychological support skills to millions of community responders and first responders worldwide.', source_url: 'https://www.who.int/news/item/17-06-2022-who-highlights-urgent-need-to-transform-mental-health-and-mental-health-care', source_name: 'WHO', location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 } },
		{ title: 'WHO declares elimination of sleeping sickness in five African nations', summary: 'Decades of sustained effort eradicate the deadly parasitic disease from key regions, saving millions of lives.', source_url: 'https://en.wikipedia.org/wiki/African_trypanosomiasis', source_name: 'Wikipedia', location: { name: 'Kinshasa, DR Congo', lat: -4.32, lon: 15.31 } },
		{ title: 'Wearable device detects heart attacks 30 minutes before symptoms', summary: 'Smart watch algorithm identifies subtle cardiac changes that predict imminent heart attacks, enabling early intervention.', source_url: 'https://en.wikipedia.org/wiki/Smartwatch', source_name: 'Wikipedia', location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 } },
		{ title: 'Global childhood vaccination rates recover to pre-pandemic levels', summary: 'UNICEF reports worldwide immunization coverage returns to 2019 benchmarks after pandemic disruptions.', source_url: 'https://ourworldindata.org/vaccination', source_name: 'Our World in Data', location: { name: 'New York, USA', lat: 40.75, lon: -73.97 } },
		{ title: 'New treatment reverses age-related blindness in clinical trial', summary: 'Stem cell therapy restores vision in patients with macular degeneration, offering hope for millions worldwide.', source_url: 'https://en.wikipedia.org/wiki/Macular_degeneration', source_name: 'Wikipedia', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
	],
	environment: [
		{ title: 'Great Barrier Reef shows highest coral cover in 36 years', summary: 'Marine surveys reveal unprecedented recovery following conservation efforts and favorable ocean conditions.', source_url: 'https://www.cnn.com/2022/08/04/australia/great-barrier-reef-high-coral-report-australia-climate-intl-hnk/index.html', source_name: 'CNN', location: { name: 'Townsville, Australia', lat: -19.26, lon: 146.80 } },
		{ title: 'Costa Rica generates 100% renewable electricity for fifth consecutive year', summary: 'The Central American nation continues to lead the world in clean energy adoption through hydropower, wind, and geothermal.', source_url: 'https://en.wikipedia.org/wiki/Renewable_energy_in_Costa_Rica', source_name: 'Wikipedia', location: { name: 'San José, Costa Rica', lat: 9.93, lon: -84.08 } },
		{ title: 'Ocean plastic cleanup removes 10 million kg from the Great Pacific Garbage Patch', summary: 'The Ocean Cleanup project reaches a major milestone in its mission to rid the oceans of plastic pollution.', source_url: 'https://theoceancleanup.com/press/press-releases/the-ocean-cleanup-breaks-10000000-kg-barrier/', source_name: 'The Ocean Cleanup', location: { name: 'Rotterdam, Netherlands', lat: 51.92, lon: 4.48 } },
		{ title: 'Amazon deforestation drops 80% as Brazil enforces protections', summary: 'Satellite data confirms dramatic decline in rainforest loss following renewed enforcement of environmental laws.', source_url: 'https://en.wikipedia.org/wiki/Deforestation_of_the_Amazon_rainforest', source_name: 'Wikipedia', location: { name: 'Manaus, Brazil', lat: -3.12, lon: -60.02 } },
		{ title: 'Paris transforms Champs-Elysees into urban garden with 1,000 new trees', summary: 'The iconic avenue undergoes a green makeover, replacing lanes of traffic with pedestrian promenades and native plantings.', source_url: 'https://en.wikipedia.org/wiki/Champs-%C3%89lys%C3%A9es', source_name: 'Wikipedia', location: { name: 'Paris, France', lat: 48.87, lon: 2.31 } },
		{ title: 'Whale populations recover to pre-hunting numbers after decades of protection', summary: 'Humpback whales removed from endangered list as populations surge across all ocean basins.', source_url: 'https://en.wikipedia.org/wiki/Humpback_whale', source_name: 'Wikipedia', location: { name: 'Juneau, Alaska', lat: 58.30, lon: -134.42 } },
		{ title: 'Solar power becomes cheapest energy source in history', summary: 'New analysis shows solar electricity costs have fallen 90% in a decade, undercutting all fossil fuels globally.', source_url: 'https://ourworldindata.org/cheap-renewables-growth', source_name: 'Our World in Data', location: { name: 'Oxford, United Kingdom', lat: 51.75, lon: -1.25 } },
	],
	technology: [
		{ title: 'Open-source AI model matches GPT-4 performance at 1/10th the cost', summary: 'Democratizing access to powerful AI tools accelerates innovation across developing nations and small businesses.', source_url: 'https://fortune.com/2024/04/08/open-source-ai-boom-openai-gpt-4/', source_name: 'Fortune', location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 } },
		{ title: 'New battery technology enables electric planes with 500-mile range', summary: 'Solid-state batteries with 3x energy density open the door to commercial electric aviation within the decade.', source_url: 'https://www.nature.com/articles/s41560-023-01208-9', source_name: 'Nature Energy', location: { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 } },
		{ title: 'Internet access reaches 90% of global population for the first time', summary: 'Satellite internet and infrastructure investments close the digital divide, connecting billions to information and opportunity.', source_url: 'https://www.itu.int/itu-d/reports/statistics/2024/11/10/ff24-internet-use/', source_name: 'ITU', location: { name: 'Geneva, Switzerland', lat: 46.20, lon: 6.14 } },
		{ title: '3D-printed homes built in 24 hours for fraction of traditional cost', summary: 'Robotic construction technology makes affordable housing a reality for communities around the world.', source_url: 'https://www.iconbuild.com/updates/icon-completes-largest-3d-printed-housing-community', source_name: 'ICON', location: { name: 'Austin, Texas', lat: 30.27, lon: -97.74 } },
		{ title: 'AI translates sign language in real-time for deaf accessibility', summary: 'Computer vision system bridges communication gap by converting sign language gestures to text and speech instantly.', source_url: 'https://en.wikipedia.org/wiki/Sign_language_recognition', source_name: 'Wikipedia', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
		{ title: 'Vertical farms produce 350x more food per acre than traditional farming', summary: 'Indoor agriculture revolution reduces water use by 95% while growing food year-round in any climate.', source_url: 'https://en.wikipedia.org/wiki/Vertical_farming', source_name: 'Wikipedia', location: { name: 'Wageningen, Netherlands', lat: 51.97, lon: 5.67 } },
		{ title: 'New desalination tech makes ocean water drinkable at half the energy cost', summary: 'Membrane breakthrough enables affordable freshwater production from seawater, addressing global water scarcity.', source_url: 'https://en.wikipedia.org/wiki/Desalination', source_name: 'Wikipedia', location: { name: 'Singapore', lat: 1.35, lon: 103.82 } },
	],
	community: [
		{ title: 'Neighbors build 200 homes in one weekend through community barn-raising program', summary: 'Revived tradition combines modern construction with collective action to house families in need.', source_url: 'https://www.nbcnews.com/better/health/why-volunteering-habitat-humanity-so-meaningful-ncna814931', source_name: 'NBC News', location: { name: 'Atlanta, Georgia', lat: 33.75, lon: -84.39 } },
		{ title: 'Retired teachers launch free tutoring network reaching 50,000 students', summary: 'Volunteer educators provide personalized learning support to underserved communities across the country.', source_url: 'https://www.learntobe.org/intergenerational-tutoring', source_name: 'Learn To Be', location: { name: 'Chicago, Illinois', lat: 41.88, lon: -87.63 } },
		{ title: 'City converts abandoned lots into community gardens, feeds 10,000 families', summary: 'Urban farming initiative transforms blight into abundance across 340 neighborhood gardens.', source_url: 'https://modernfarmer.com/2024/09/philadephia-vacant-lots-urban-garden/', source_name: 'Modern Farmer', location: { name: 'Detroit, Michigan', lat: 42.33, lon: -83.05 } },
		{ title: 'Neighborhood tool libraries spread to 500 cities worldwide', summary: 'Shared tool-lending programs save families thousands while building stronger community bonds.', source_url: 'https://en.wikipedia.org/wiki/Tool_library', source_name: 'Wikipedia', location: { name: 'Portland, Oregon', lat: 45.52, lon: -122.68 } },
		{ title: 'Former inmates mentor at-risk youth, reducing recidivism by 75%', summary: 'Peer mentorship programs transform lives on both sides, breaking cycles of incarceration across communities.', source_url: 'https://www.rand.org/pubs/research_reports/RR2898.html', source_name: 'RAND Corporation', location: { name: 'Los Angeles, California', lat: 34.05, lon: -118.24 } },
		{ title: 'Community fridge network prevents 50 million pounds of food waste', summary: 'Free public refrigerators in neighborhoods connect surplus food with those who need it, fighting waste and hunger.', source_url: 'https://en.wikipedia.org/wiki/Community_fridge', source_name: 'Wikipedia', location: { name: 'New York, USA', lat: 40.71, lon: -74.01 } },
		{ title: 'Grandparents launch worldwide pen pal program connecting 100,000 kids', summary: 'Intergenerational letter-writing initiative bridges the loneliness gap for elderly and young people alike.', source_url: 'https://www.generationsunited.org/resources/publications', source_name: 'Generations United', location: { name: 'Washington, D.C.', lat: 38.91, lon: -77.04 } },
	],
	education: [
		{ title: 'Finland shares education model with 30 developing nations', summary: 'Teacher training and curriculum design expertise exported to improve learning outcomes worldwide.', source_url: 'https://www.aljazeera.com/economy/2022/5/4/finlands-big-new-export-to-india-school-education', source_name: 'Al Jazeera', location: { name: 'Helsinki, Finland', lat: 60.17, lon: 24.94 } },
		{ title: '15-year-old inventor creates low-cost water purifier from recycled materials', summary: 'Young scientist wins global prize for device that provides clean water for under $5 per unit.', source_url: 'https://time.com/5916772/kid-of-the-year-2020/', source_name: 'TIME', location: { name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82 } },
		{ title: 'Global literacy rate reaches 95% for the first time in human history', summary: 'Decades of investment in education bear fruit as reading skills become nearly universal across all regions.', source_url: 'https://ourworldindata.org/literacy', source_name: 'Our World in Data', location: { name: 'Paris, France', lat: 48.86, lon: 2.35 } },
		{ title: 'Free online university reaches 1 million students in developing nations', summary: 'Tuition-free accredited degrees democratize higher education for students who could never afford traditional university.', source_url: 'https://www.uopeople.edu/', source_name: 'University of the People', location: { name: 'Pasadena, California', lat: 34.15, lon: -118.14 } },
		{ title: 'Coding bootcamp graduates earn 50% more within first year', summary: 'Intensive training programs prove effective at rapid career transformation, especially for underrepresented groups in tech.', source_url: 'https://en.wikipedia.org/wiki/Coding_bootcamp', source_name: 'Wikipedia', location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 } },
		{ title: 'Libraries become community innovation hubs with maker spaces', summary: 'Public libraries evolve beyond books into vibrant centers with 3D printers, recording studios, and robotics labs.', source_url: 'https://www.ala.org/tools/atoz/makerspaces', source_name: 'American Library Association', location: { name: 'Chicago, Illinois', lat: 41.88, lon: -87.63 } },
		{ title: 'Bilingual education programs boost cognitive development by 30%', summary: 'Research confirms dual-language learning enhances problem-solving, memory, and academic performance in children.', source_url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6168212/', source_name: 'NIH PMC', location: { name: 'Montreal, Canada', lat: 45.50, lon: -73.57 } },
	],
	arts: [
		{ title: 'Street art festival transforms industrial district into open-air gallery', summary: 'Over 200 murals by international artists bring color and culture to a forgotten neighborhood.', source_url: 'https://fadmagazine.com/2024/09/17/street-art-revolution-how-murals-are-transforming-urban-landscapes/', source_name: 'FAD Magazine', location: { name: 'Berlin, Germany', lat: 52.52, lon: 13.41 } },
		{ title: 'Indigenous language preservation app reaches 1 million downloads', summary: 'Technology helps communities teach and preserve endangered languages through interactive stories and games.', source_url: 'https://www.howwegettonext.com/apps-are-helping-keep-indigenous-languages-alive-online/', source_name: 'How We Get To Next', location: { name: 'Auckland, New Zealand', lat: -36.85, lon: 174.76 } },
		{ title: 'Community orchestra model goes viral, launching 500 new ensembles worldwide', summary: 'Inclusive music programs prove that orchestras thrive when they welcome all skill levels and backgrounds.', source_url: 'https://www.npr.org/2011/03/15/134567922/the-road-to-an-american-el-sistema', source_name: 'NPR', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
		{ title: 'Blind photographer wins international art prize for tactile landscapes', summary: 'Artist uses sound and touch to compose images that challenge perceptions of sight and creativity.', source_url: 'https://en.wikipedia.org/wiki/Disability_in_the_arts', source_name: 'Wikipedia', location: { name: 'New York, USA', lat: 40.71, lon: -74.01 } },
		{ title: 'Community theater movement revitalizes small town economies', summary: 'Local performance venues bring tourism, jobs, and cultural vibrancy to rural communities across America.', source_url: 'https://en.wikipedia.org/wiki/Community_theatre', source_name: 'Wikipedia', location: { name: 'Ashland, Oregon', lat: 42.19, lon: -122.71 } },
		{ title: 'AI art restoration reveals hidden details in Renaissance masterpieces', summary: 'Machine learning algorithms uncover original colors and lost elements in centuries-old paintings without touching the canvas.', source_url: 'https://www.nature.com/articles/s42256-023-00767-6', source_name: 'Nature Machine Intelligence', location: { name: 'Florence, Italy', lat: 43.77, lon: 11.25 } },
		{ title: 'Prison arts programs reduce violence by 50% across 200 facilities', summary: 'Creative expression through painting, music, and writing transforms prison culture and prepares inmates for reentry.', source_url: 'https://www.rand.org/pubs/research_reports/RR564.html', source_name: 'RAND Corporation', location: { name: 'San Quentin, California', lat: 37.94, lon: -122.49 } },
	],
	animals: [
		{ title: 'Giant panda officially removed from endangered species list', summary: 'Conservation success story sees wild panda population grow 68% over two decades through habitat protection.', source_url: 'https://www.nationalgeographic.com/animals/article/pandas-vulnerable-endangered-species', source_name: 'National Geographic', location: { name: 'Chengdu, China', lat: 30.57, lon: 104.07 } },
		{ title: 'Coral reef fish populations recover after marine sanctuary expansion', summary: 'No-take zones show dramatic increase in biodiversity and fish biomass after just three years.', source_url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8907626/', source_name: 'NIH PMC', location: { name: 'Belize City, Belize', lat: 17.50, lon: -88.20 } },
		{ title: 'Therapy animal programs reduce hospital stays by 25%', summary: 'Study across 100 hospitals shows trained therapy animals accelerate patient recovery and improve mental health outcomes.', source_url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10986847/', source_name: 'NIH PMC', location: { name: 'Melbourne, Australia', lat: -37.81, lon: 144.96 } },
		{ title: 'Gray wolves return to Colorado after 80-year absence', summary: 'Successful reintroduction program restores apex predator to Rocky Mountain ecosystem, rebalancing wildlife populations.', source_url: 'https://en.wikipedia.org/wiki/Gray_wolf_reintroduction', source_name: 'Wikipedia', location: { name: 'Grand Junction, Colorado', lat: 39.06, lon: -108.55 } },
		{ title: 'Lab-grown meat reduces factory farming need by 90% in trial markets', summary: 'Cultivated protein reaches price parity with conventional meat, promising a more humane food system.', source_url: 'https://en.wikipedia.org/wiki/Cultured_meat', source_name: 'Wikipedia', location: { name: 'San Francisco, California', lat: 37.77, lon: -122.42 } },
		{ title: 'Sea turtle populations hit 50-year high after nesting beach protections', summary: 'Conservation zones and volunteer patrols help marine turtle species rebound across all major nesting grounds.', source_url: 'https://www.seaturtlestatus.org/', source_name: 'SWOT Report', location: { name: 'Tortuguero, Costa Rica', lat: 10.54, lon: -83.51 } },
		{ title: 'Elephants develop new migration routes to avoid human conflict', summary: 'Wildlife corridors and AI-powered early warning systems help elephant herds navigate safely around human settlements.', source_url: 'https://en.wikipedia.org/wiki/Elephant_cognition', source_name: 'Wikipedia', location: { name: 'Amboseli, Kenya', lat: -2.65, lon: 37.26 } },
	],
	economy: [
		{ title: 'Four-day work week trial shows 40% productivity boost', summary: 'Companies across 20 countries report higher output and happier workers with reduced hours.', source_url: 'https://www.npr.org/2019/11/04/776163853/microsoft-japan-says-4-day-workweek-boosted-workers-productivity-by-40', source_name: 'NPR', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
		{ title: 'Microfinance program lifts 2 million families above poverty line', summary: 'Small loans with mentorship create sustainable businesses in rural communities across South Asia.', source_url: 'https://www.worldbank.org/en/topic/poverty/overview', source_name: 'World Bank', location: { name: 'Dhaka, Bangladesh', lat: 23.81, lon: 90.41 } },
		{ title: 'Worker-owned cooperatives grow 300% as alternative business model thrives', summary: 'Employee ownership proves resilient and equitable across manufacturing and tech sectors worldwide.', source_url: 'https://institute.coop/what-worker-cooperative', source_name: 'Institute for Cooperative Development', location: { name: 'Mondragon, Spain', lat: 43.06, lon: -2.49 } },
		{ title: 'Universal basic income pilot lifts 10,000 families out of poverty', summary: 'Two-year experiment demonstrates cash transfers enable employment, education, and long-term financial stability.', source_url: 'https://www.givedirectly.org/research-at-give-directly/', source_name: 'GiveDirectly', location: { name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82 } },
		{ title: 'Green jobs now outnumber fossil fuel jobs in 12 countries', summary: 'Clean energy sector employs more workers than oil, gas, and coal combined in major economies.', source_url: 'https://en.wikipedia.org/wiki/Green_job', source_name: 'Wikipedia', location: { name: 'Abu Dhabi, UAE', lat: 24.45, lon: 54.65 } },
		{ title: 'Community land trusts make homeownership affordable for 50,000 families', summary: 'Shared equity model keeps housing permanently affordable by separating land ownership from building ownership.', source_url: 'https://www.lincolninst.edu/publications/articles/community-land-trusts', source_name: 'Lincoln Institute', location: { name: 'Burlington, Vermont', lat: 44.48, lon: -73.21 } },
		{ title: 'Circular economy practices save businesses $4.5 trillion annually', summary: 'Reuse, repair, and recycling become mainstream business strategy, reducing waste while boosting profits.', source_url: 'https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview', source_name: 'Ellen MacArthur Foundation', location: { name: 'London, United Kingdom', lat: 51.51, lon: -0.13 } },
	],
	space: [
		{ title: 'James Webb discovers water vapor on rocky exoplanet in habitable zone', summary: 'The finding marks the first detection of water on a potentially Earth-like world orbiting a distant star.', source_url: 'https://webbtelescope.org/contents/news-releases/2023/news-2023-120.html', source_name: 'Webb Space Telescope', location: { name: 'Greenbelt, Maryland', lat: 39.00, lon: -76.88 } },
		{ title: 'SpaceX Starship completes first orbital flight, opening era of cheap space access', summary: 'Fully reusable rocket reduces launch costs by 90%, enabling new space industries and exploration.', source_url: 'https://www.nbcnews.com/science/space/live-blog/live-updates-spacex-starship-mega-rocket-launch-rcna155687', source_name: 'NBC News', location: { name: 'Boca Chica, Texas', lat: 25.99, lon: -97.16 } },
		{ title: 'International Moon Village project breaks ground with 12-nation partnership', summary: 'Collaborative lunar base aims to advance science and inspire unprecedented global cooperation.', source_url: 'https://blogs.esa.int/janwoerner/2016/11/23/moon-village/', source_name: 'ESA Blog', location: { name: 'Darmstadt, Germany', lat: 49.87, lon: 8.65 } },
		{ title: 'Mars helicopter completes 100th flight, mapping vast terrain', summary: 'Ingenuity continues to exceed expectations, scouting routes and demonstrating powered flight on another world.', source_url: 'https://www.jpl.nasa.gov/missions/ingenuity', source_name: 'NASA JPL', location: { name: 'Pasadena, California', lat: 34.20, lon: -118.17 } },
		{ title: 'Private space station construction begins in low Earth orbit', summary: 'Commercial habitats promise to open space to researchers, tourists, and manufacturers within the decade.', source_url: 'https://www.axiomspace.com/axiom-station', source_name: 'Axiom Space', location: { name: 'Houston, Texas', lat: 29.76, lon: -95.37 } },
		{ title: 'Asteroid mining prototype successfully extracts water in space', summary: 'First successful in-situ resource utilization demonstrates the viability of space-based materials extraction.', source_url: 'https://en.wikipedia.org/wiki/Asteroid_mining', source_name: 'Wikipedia', location: { name: 'Pasadena, California', lat: 34.15, lon: -118.14 } },
		{ title: 'Radio telescope detects signs of habitable exoplanet atmospheres', summary: 'New observations identify oxygen and water signatures around nearby star systems, narrowing the search for life.', source_url: 'https://www.nature.com/articles/s41550-023-02064-z', source_name: 'Nature Astronomy', location: { name: 'Green Bank, West Virginia', lat: 38.43, lon: -79.83 } },
	],
	sports: [
		{ title: 'Refugee Olympic team wins first-ever gold medal', summary: 'Historic achievement inspires millions and highlights the resilience of displaced athletes around the world.', source_url: 'https://www.npr.org/2024/08/09/nx-s1-5069315/olympic-refugee-team-medal-boxer-cindy-ngamba', source_name: 'NPR', location: { name: 'Paris, France', lat: 48.86, lon: 2.35 } },
		{ title: 'Adaptive sports participation doubles globally in past three years', summary: 'Investment in accessibility removes barriers and creates champions in parasports across every continent.', source_url: 'https://www.espn.com/olympics/story/_/id/41000000/paralympics-2024-paris', source_name: 'ESPN', location: { name: 'Bonn, Germany', lat: 50.73, lon: 7.10 } },
		{ title: 'Youth sports program reduces juvenile crime by 60% in pilot cities', summary: 'After-school athletics combined with mentorship transform outcomes for at-risk teens in 15 cities.', source_url: 'https://www.eugenecivicalliance.org/preventing-juvenile-delinquency-through-sports/', source_name: 'Eugene Civic Alliance', location: { name: 'São Paulo, Brazil', lat: -23.55, lon: -46.63 } },
		{ title: 'Skateboarding inclusion program brings sport to refugee camps worldwide', summary: 'Mobile skate parks and coaching bring joy and community to displaced children in camps across three continents.', source_url: 'https://www.skateistan.org/', source_name: 'Skateistan', location: { name: 'Kabul, Afghanistan', lat: 34.53, lon: 69.17 } },
		{ title: "Women's sports viewership surpasses men's for first time in key markets", summary: "Record audiences tune in to women's football, basketball, and tennis, driving unprecedented investment in women's athletics.", source_url: 'https://www.espn.com/espnw/', source_name: 'ESPN', location: { name: 'New York, USA', lat: 40.71, lon: -74.01 } },
		{ title: 'Blind marathon runner completes all six World Marathon Majors', summary: 'Athlete and guide runner partnership proves that no barrier is too great when determination meets teamwork.', source_url: 'https://www.worldmarathonmajors.com/', source_name: 'World Marathon Majors', location: { name: 'Tokyo, Japan', lat: 35.68, lon: 139.69 } },
		{ title: 'Community basketball leagues reduce gun violence in Chicago neighborhoods', summary: 'Late-night basketball programs provide safe spaces and mentorship, cutting violent crime rates dramatically.', source_url: 'https://www.rand.org/pubs/research_reports/RRA1071-1.html', source_name: 'RAND Corporation', location: { name: 'Chicago, Illinois', lat: 41.88, lon: -87.63 } },
	],
};

/**
 * Deterministic daily story selector.
 * Uses the date to pick 3 different stories per category each day,
 * cycling through the pool so content changes daily.
 */
export function getStoriesForDate(dateStr: string): Record<string, MockStory[]> {
	// Generate a day index from the date string (YYYY-MM-DD)
	const parts = dateStr.split('-');
	const year = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	const day = parseInt(parts[2]);
	// Simple hash: days since an epoch + month offset
	const dayIndex = (year * 365 + month * 31 + day) % 1000;

	const result: Record<string, MockStory[]> = {};

	for (const [category, pool] of Object.entries(STORY_POOL)) {
		const poolSize = pool.length;
		const stories: MockStory[] = [];

		// Pick 3 stories using the day index as offset
		for (let i = 0; i < 3; i++) {
			const idx = (dayIndex + i) % poolSize;
			stories.push(pool[idx]);
		}

		result[category] = stories;
	}

	return result;
}

/**
 * Get the date string for today in UTC (YYYY-MM-DD).
 */
export function getTodayDateStr(): string {
	const now = new Date();
	return now.toISOString().split('T')[0];
}

/**
 * Get a list of past N dates as YYYY-MM-DD strings.
 */
export function getPastDates(count: number): string[] {
	const dates: string[] = [];
	for (let i = 0; i < count; i++) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		dates.push(d.toISOString().split('T')[0]);
	}
	return dates;
}
