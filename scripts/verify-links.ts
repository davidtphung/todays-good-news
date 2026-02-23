/**
 * Link & Video Verification Agent
 * Checks all source URLs and YouTube video IDs for 404s / broken links.
 * Run with: npx tsx scripts/verify-links.ts
 */

const SOURCE_URLS: { category: string; index: number; url: string; name: string }[] = [
	{ category: 'science', index: 0, url: 'https://www.nrel.gov/news/press/2022/nrel-creates-highest-efficiency-solar-cell.html', name: 'NREL' },
	{ category: 'science', index: 1, url: 'https://www.nature.com/articles/d41586-023-03590-6', name: 'Nature' },
	{ category: 'science', index: 2, url: 'https://www.science.org/doi/10.1126/science.abo6587', name: 'Science' },
	{ category: 'health', index: 0, url: 'https://www.nih.gov/news-events/news-releases/nih-clinical-trial-universal-influenza-vaccine-candidate-begins', name: 'NIH' },
	{ category: 'health', index: 1, url: 'https://www.nature.com/articles/s41591-023-02332-5', name: 'Nature Medicine' },
	{ category: 'health', index: 2, url: 'https://www.who.int/news/item/17-06-2022-who-highlights-urgent-need-to-transform-mental-health-and-mental-health-care', name: 'WHO' },
	{ category: 'environment', index: 0, url: 'https://www.aims.gov.au/monitoring/reef-monitoring/annual-summary', name: 'AIMS' },
	{ category: 'environment', index: 1, url: 'https://www.bbc.com/news/world-latin-america-56188985', name: 'BBC News' },
	{ category: 'environment', index: 2, url: 'https://theoceancleanup.com/updates/', name: 'The Ocean Cleanup' },
	{ category: 'technology', index: 0, url: 'https://www.technologyreview.com/topic/artificial-intelligence/', name: 'MIT Tech Review' },
	{ category: 'technology', index: 1, url: 'https://www.nature.com/articles/s41560-023-01208-9', name: 'Nature Energy' },
	{ category: 'technology', index: 2, url: 'https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx', name: 'ITU' },
	{ category: 'community', index: 0, url: 'https://www.habitat.org/newsroom', name: 'Habitat for Humanity' },
	{ category: 'community', index: 1, url: 'https://www.volunteermatch.org/', name: 'VolunteerMatch' },
	{ category: 'community', index: 2, url: 'https://www.reuters.com/business/environment/', name: 'Reuters' },
	{ category: 'education', index: 0, url: 'https://www.bbc.com/news/education', name: 'BBC Education' },
	{ category: 'education', index: 1, url: 'https://www.goodnewsnetwork.org/category/inspiring/', name: 'Good News Network' },
	{ category: 'education', index: 2, url: 'https://www.unesco.org/en/literacy', name: 'UNESCO' },
	{ category: 'arts', index: 0, url: 'https://www.theguardian.com/artanddesign', name: 'The Guardian' },
	{ category: 'arts', index: 1, url: 'https://www.bbc.com/news/technology', name: 'BBC News' },
	{ category: 'arts', index: 2, url: 'https://www.npr.org/sections/music-articles/', name: 'NPR Music' },
	{ category: 'animals', index: 0, url: 'https://www.worldwildlife.org/species/giant-panda', name: 'WWF' },
	{ category: 'animals', index: 1, url: 'https://www.nationalgeographic.com/animals/', name: 'National Geographic' },
	{ category: 'animals', index: 2, url: 'https://www.reuters.com/lifestyle/science/', name: 'Reuters' },
	{ category: 'economy', index: 0, url: 'https://www.bbc.com/worklife/article/20210819-the-case-for-a-four-day-work-week', name: 'BBC Worklife' },
	{ category: 'economy', index: 1, url: 'https://www.worldbank.org/en/topic/financialinclusion', name: 'World Bank' },
	{ category: 'economy', index: 2, url: 'https://apnews.com/business', name: 'AP News' },
	{ category: 'space', index: 0, url: 'https://www.nasa.gov/mission/webb/', name: 'NASA' },
	{ category: 'space', index: 1, url: 'https://www.space.com/spacex-starship', name: 'Space.com' },
	{ category: 'space', index: 2, url: 'https://www.esa.int/Enabling_Support/Preparing_for_the_Future/Discovery_and_Preparation/Moon_Village', name: 'ESA' },
	{ category: 'sports', index: 0, url: 'https://www.olympics.com/ioc/refugee-olympic-team', name: 'Olympics.com' },
	{ category: 'sports', index: 1, url: 'https://www.paralympic.org/news', name: 'Paralympic.org' },
	{ category: 'sports', index: 2, url: 'https://www.unicef.org/sports', name: 'UNICEF' },
];

const YOUTUBE_IDS = [
	'7BiYLBfrS0I', 'A7E8t1bUGVs', 'kkGhG5kyjHU', 'nwAYpLVyeFU',
	'yJmUbJCDJQs', 'gXDMoiEkyuQ', 'auSo1MyWf8g'
];

async function checkUrl(url: string, timeout = 15000): Promise<{ status: number | string; ok: boolean; redirected?: string }> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);
	try {
		const res = await fetch(url, {
			method: 'HEAD',
			signal: controller.signal,
			redirect: 'follow',
			headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) GoodNewsDashboard/1.0' }
		});
		clearTimeout(timeoutId);
		// Some sites block HEAD, try GET
		if (res.status === 405 || res.status === 403) {
			const res2 = await fetch(url, {
				method: 'GET',
				signal: AbortSignal.timeout(timeout),
				redirect: 'follow',
				headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) GoodNewsDashboard/1.0' }
			});
			return { status: res2.status, ok: res2.ok };
		}
		return { status: res.status, ok: res.ok };
	} catch (err: any) {
		clearTimeout(timeoutId);
		if (err.name === 'AbortError') return { status: 'TIMEOUT', ok: false };
		return { status: err.message || 'ERROR', ok: false };
	}
}

async function checkYouTubeVideo(videoId: string): Promise<{ ok: boolean; status: string }> {
	try {
		const url = `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`;
		const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
		if (res.ok) return { ok: true, status: 'AVAILABLE' };
		if (res.status === 401 || res.status === 403) return { ok: false, status: 'UNAVAILABLE/RESTRICTED' };
		return { ok: false, status: `HTTP ${res.status}` };
	} catch (err: any) {
		return { ok: false, status: err.message || 'ERROR' };
	}
}

async function main() {
	console.log('=== GOOD NEWS DASHBOARD — LINK & VIDEO VERIFICATION AGENT ===\n');

	// Check source URLs
	console.log('--- CHECKING SOURCE URLs (33 links) ---\n');
	const broken: typeof SOURCE_URLS[number][] = [];
	const results = await Promise.all(
		SOURCE_URLS.map(async (link) => {
			const result = await checkUrl(link.url);
			const icon = result.ok ? '✅' : '❌';
			console.log(`${icon} [${link.category}/${link.index}] ${link.name} — ${result.status} — ${link.url}`);
			if (!result.ok) broken.push(link);
			return { ...link, result };
		})
	);

	console.log(`\nSource URLs: ${results.length - broken.length}/${results.length} passed`);
	if (broken.length > 0) {
		console.log('\n🔴 BROKEN SOURCE URLs:');
		for (const b of broken) console.log(`   ${b.category}/${b.index}: ${b.url}`);
	}

	// Check YouTube video IDs
	console.log('\n--- CHECKING YOUTUBE VIDEO IDs ---\n');
	const brokenVideos: string[] = [];
	const videoResults = await Promise.all(
		YOUTUBE_IDS.map(async (id) => {
			const result = await checkYouTubeVideo(id);
			const icon = result.ok ? '✅' : '❌';
			console.log(`${icon} ${id} — ${result.status}`);
			if (!result.ok) brokenVideos.push(id);
			return { id, result };
		})
	);

	console.log(`\nYouTube Videos: ${videoResults.length - brokenVideos.length}/${videoResults.length} passed`);
	if (brokenVideos.length > 0) {
		console.log('\n🔴 BROKEN YOUTUBE IDs:');
		for (const id of brokenVideos) console.log(`   ${id}`);
	}

	// Summary
	console.log('\n=== AUDIT SUMMARY ===');
	console.log(`Source URLs:   ${broken.length === 0 ? '✅ ALL PASS' : `❌ ${broken.length} BROKEN`}`);
	console.log(`YouTube IDs:   ${brokenVideos.length === 0 ? '✅ ALL PASS' : `❌ ${brokenVideos.length} BROKEN`}`);

	if (broken.length > 0 || brokenVideos.length > 0) {
		process.exit(1);
	} else {
		console.log('\n🎉 All links and videos verified!');
		process.exit(0);
	}
}

main();
