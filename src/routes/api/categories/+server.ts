import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { CATEGORIES } from '$lib/config.js';

export const GET: RequestHandler = async () => {
	return json({ categories: CATEGORIES });
};
