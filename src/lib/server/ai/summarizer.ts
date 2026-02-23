import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { AI_MODEL } from '$lib/config.js';
import type { SummaryResult } from '$lib/types/source.js';

export async function summarizeStory(
	title: string,
	description: string | null,
	content: string | null
): Promise<SummaryResult | null> {
	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) return null;

	const client = new Anthropic({ apiKey });

	const bodyText = content || description || '';
	const prompt = `You are a summarizer for a "Good News" dashboard. Create a concise, uplifting 1-2 sentence summary optimized for dashboard display.

Title: ${title}
${bodyText ? `Content: ${bodyText.slice(0, 1000)}` : ''}

Guidelines:
- Keep it to 1-2 sentences (under 200 characters if possible)
- Focus on the positive impact and what happened
- Use active, energetic language
- If you can infer a geographic location, include it

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "summary": "1-2 sentence summary",
  "location_name": "City, Country" or null,
  "location_lat": number or null,
  "location_lon": number or null
}`;

	try {
		const response = await client.messages.create({
			model: AI_MODEL,
			max_tokens: 300,
			messages: [{ role: 'user', content: prompt }]
		});

		const text = response.content[0].type === 'text' ? response.content[0].text : '';
		return JSON.parse(text) as SummaryResult;
	} catch {
		return null;
	}
}
