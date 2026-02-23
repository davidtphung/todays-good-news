import { env } from '$env/dynamic/private';
import type { RawArticle, SourceAdapter } from '$lib/types/source.js';

const POSITIVE_SUBREDDITS = [
	'UpliftingNews',
	'HumansBeingBros',
	'MadeMeSmile',
	'wholesome',
	'goodnews'
];

export const redditAdapter: SourceAdapter = {
	name: 'Reddit',
	async fetch(): Promise<RawArticle[]> {
		const clientId = env.REDDIT_CLIENT_ID;
		const clientSecret = env.REDDIT_CLIENT_SECRET;
		if (!clientId || !clientSecret) return [];

		const token = await getRedditToken(clientId, clientSecret);
		if (!token) return [];

		const articles: RawArticle[] = [];

		for (const sub of POSITIVE_SUBREDDITS) {
			try {
				const res = await fetch(`https://oauth.reddit.com/r/${sub}/hot?limit=10`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'User-Agent': 'GoodNewsDashboard/1.0'
					}
				});
				if (!res.ok) continue;

				const data = await res.json();
				for (const child of data.data?.children ?? []) {
					const post = child.data;
					if (post.is_self || post.stickied) continue;

					articles.push({
						title: post.title ?? '',
						description: post.selftext?.slice(0, 500) ?? null,
						url: post.url ?? '',
						source: `r/${sub}`,
						published_at: post.created_utc
							? new Date(post.created_utc * 1000).toISOString()
							: new Date().toISOString(),
						image_url: post.thumbnail?.startsWith('http') ? post.thumbnail : null,
						content: null
					});
				}
			} catch {
				continue;
			}
		}

		return articles;
	}
};

async function getRedditToken(
	clientId: string,
	clientSecret: string
): Promise<string | null> {
	try {
		const credentials = `${clientId}:${clientSecret}`;
		const encoded = btoa(credentials);
		const res = await fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${encoded}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'grant_type=client_credentials'
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data.access_token ?? null;
	} catch {
		return null;
	}
}
