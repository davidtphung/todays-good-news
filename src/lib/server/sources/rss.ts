import { env } from '$env/dynamic/private';
import type { RawArticle, SourceAdapter } from '$lib/types/source.js';
import { RSS_DEFAULT_FEEDS } from '$lib/utils/constants.js';

export const rssAdapter: SourceAdapter = {
	name: 'RSS',
	async fetch(): Promise<RawArticle[]> {
		const customFeeds = env.RSS_FEED_URLS?.split(',').filter(Boolean) ?? [];
		const feeds = [...RSS_DEFAULT_FEEDS, ...customFeeds];
		const articles: RawArticle[] = [];

		for (const feedUrl of feeds) {
			try {
				const res = await fetch(feedUrl);
				if (!res.ok) continue;
				const xml = await res.text();
				const items = parseRSSItems(xml);
				articles.push(...items);
			} catch {
				continue;
			}
		}

		return articles;
	}
};

function parseRSSItems(xml: string): RawArticle[] {
	const items: RawArticle[] = [];
	const itemRegex = /<item>([\s\S]*?)<\/item>/g;
	let match;

	while ((match = itemRegex.exec(xml)) !== null) {
		const itemXml = match[1];
		const title = extractTag(itemXml, 'title');
		const link = extractTag(itemXml, 'link');
		const description = extractTag(itemXml, 'description');
		const pubDate = extractTag(itemXml, 'pubDate');
		const source = extractTag(itemXml, 'dc:creator') || extractTag(itemXml, 'source') || 'RSS';

		if (title && link) {
			const imageMatch =
				itemXml.match(/<media:content[^>]*url="([^"]*)"/) ||
				itemXml.match(/<enclosure[^>]*url="([^"]*)"/) ||
				description?.match(/<img[^>]*src="([^"]*)"/);

			items.push({
				title: stripCDATA(title),
				description: description ? stripHTML(stripCDATA(description)) : null,
				url: stripCDATA(link),
				source: stripCDATA(source),
				published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
				image_url: imageMatch?.[1] ?? null,
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

function stripHTML(str: string): string {
	return str.replace(/<[^>]*>/g, '').trim();
}
