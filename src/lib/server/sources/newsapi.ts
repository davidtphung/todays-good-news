import { env } from '$env/dynamic/private';
import type { RawArticle, SourceAdapter } from '$lib/types/source.js';

export const newsapiAdapter: SourceAdapter = {
	name: 'NewsAPI',
	async fetch(): Promise<RawArticle[]> {
		const apiKey = env.NEWSAPI_KEY;
		if (!apiKey) return [];

		const queries = [
			'breakthrough discovery',
			'community hero',
			'scientific achievement',
			'environmental restoration',
			'medical breakthrough',
			'positive innovation'
		];

		const articles: RawArticle[] = [];

		for (const q of queries) {
			try {
				const url = new URL('https://newsapi.org/v2/everything');
				url.searchParams.set('q', q);
				url.searchParams.set('language', 'en');
				url.searchParams.set('sortBy', 'publishedAt');
				url.searchParams.set('pageSize', '10');
				url.searchParams.set('apiKey', apiKey);

				const res = await fetch(url.toString());
				if (!res.ok) continue;

				const data = await res.json();
				for (const article of data.articles ?? []) {
					articles.push({
						title: article.title ?? '',
						description: article.description ?? null,
						url: article.url ?? '',
						source: article.source?.name ?? 'NewsAPI',
						published_at: article.publishedAt ?? new Date().toISOString(),
						image_url: article.urlToImage ?? null,
						content: article.content ?? null
					});
				}
			} catch {
				continue;
			}
		}

		return articles;
	}
};
