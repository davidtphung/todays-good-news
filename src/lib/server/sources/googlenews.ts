import type { RawArticle, SourceAdapter } from '$lib/types/source.js';

/**
 * Google News RSS adapter — no API key needed.
 * Uses Google News RSS search endpoint to find positive stories.
 */
const GOOD_NEWS_QUERIES = [
	'breakthrough discovery',
	'community hero',
	'scientific achievement',
	'environmental restoration',
	'medical breakthrough',
	'renewable energy milestone',
	'species recovery',
	'education innovation',
	'humanitarian aid success',
	'technology for good'
];

export const googleNewsAdapter: SourceAdapter = {
	name: 'GoogleNews',
	async fetch(): Promise<RawArticle[]> {
		const articles: RawArticle[] = [];

		// Pick 3 random queries each run to avoid rate limiting
		const shuffled = GOOD_NEWS_QUERIES.sort(() => Math.random() - 0.5);
		const queries = shuffled.slice(0, 3);

		for (const q of queries) {
			try {
				const encoded = encodeURIComponent(q);
				const url = `https://news.google.com/rss/search?q=${encoded}&hl=en-US&gl=US&ceid=US:en`;

				const res = await fetch(url, {
					headers: {
						'User-Agent': 'GoodNewsDashboard/1.0'
					}
				});
				if (!res.ok) continue;

				const xml = await res.text();
				const items = parseGoogleNewsItems(xml);
				articles.push(...items);
			} catch {
				continue;
			}
		}

		return articles;
	}
};

function parseGoogleNewsItems(xml: string): RawArticle[] {
	const items: RawArticle[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;
	let match;

	while ((match = itemRegex.exec(xml)) !== null) {
		const itemXml = match[1];
		const title = extractTag(itemXml, 'title');
		const link = extractTag(itemXml, 'link');
		const pubDate = extractTag(itemXml, 'pubDate');
		const sourceName = extractTag(itemXml, 'source');

		if (title && link) {
			items.push({
				title: stripCDATA(title).replace(/ - .*$/, ''), // Strip " - Source Name" suffix
				description: null,
				url: stripCDATA(link),
				source: sourceName ? stripCDATA(sourceName) : 'Google News',
				published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
				image_url: null,
				content: null
			});
		}
	}

	return items;
}

function extractTag(xml: string, tag: string): string | null {
	const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
	const match = xml.match(regex);
	return match?.[1] ?? null;
}

function stripCDATA(str: string): string {
	return str.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
}
