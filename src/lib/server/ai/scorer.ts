import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { AI_MODEL } from '$lib/config.js';
import type { ScoringResult } from '$lib/types/source.js';

export async function scoreStory(
	title: string,
	description: string | null,
	category: string
): Promise<ScoringResult | null> {
	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) return null;

	const client = new Anthropic({ apiKey });

	const prompt = `You are a positivity scorer for a "Good News" dashboard. Score this positive news story on three dimensions, then compute an overall positivity score.

Story title: ${title}
${description ? `Description: ${description}` : ''}
Category: ${category}

Score each dimension from 0 to 100:
- impact_breadth: How many people does this positively affect? (local=20-40, national=40-70, global=70-100)
- novelty: How surprising or unprecedented is this? (routine=10-30, notable=30-60, groundbreaking=60-100)
- emotional_uplift: How much does this brighten someone's day? (mild=20-40, warm=40-70, deeply moving=70-100)

The overall positivity_score is a weighted average: 40% impact + 30% novelty + 30% uplift.

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "positivity_score": number 0-100,
  "impact_breadth": number 0-100,
  "novelty": number 0-100,
  "emotional_uplift": number 0-100
}`;

	try {
		const response = await client.messages.create({
			model: AI_MODEL,
			max_tokens: 200,
			messages: [{ role: 'user', content: prompt }]
		});

		const text = response.content[0].type === 'text' ? response.content[0].text : '';
		return JSON.parse(text) as ScoringResult;
	} catch {
		return null;
	}
}
