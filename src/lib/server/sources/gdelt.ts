import type { RawArticle, SourceAdapter } from '$lib/types/source.js';

export const gdeltAdapter: SourceAdapter = {
	name: 'GDELT',
	async fetch(): Promise<RawArticle[]> {
		const articles: RawArticle[] = [];

		try {
			const url = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
			url.searchParams.set('query', 'positive OR breakthrough OR achievement');
			url.searchParams.set('mode', 'ArtList');
			url.searchParams.set('maxrecords', '30');
			url.searchParams.set('format', 'json');
			url.searchParams.set('sort', 'DateDesc');
			url.searchParams.set('sourcelang', 'english');

			const res = await fetch(url.toString());
			if (!res.ok) return [];

			const data = await res.json();
			for (const article of data.articles ?? []) {
				articles.push({
					title: article.title ?? '',
					description: null,
					url: article.url ?? '',
					source: article.domain ?? 'GDELT',
					published_at: article.seendate
						? new Date(article.seendate).toISOString()
						: new Date().toISOString(),
					image_url: article.socialimage ?? null,
					content: null
				});
			}
		} catch {
			// GDELT can be unreliable
		}

		return articles;
	}
};
