import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { AI_MODEL } from '$lib/config.js';
import type { ClassificationResult } from '$lib/types/source.js';
import type { StoryCategory } from '$lib/types/story.js';

const CATEGORIES: StoryCategory[] = [
	'science', 'health', 'environment', 'technology', 'community',
	'education', 'arts', 'animals', 'economy', 'space', 'sports'
];

export async function classifyStory(
	title: string,
	description: string | null
): Promise<ClassificationResult | null> {
	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) return null;

	const client = new Anthropic({ apiKey });

	const prompt = `You are a news classifier for a "Good News" dashboard. Your job is to determine if a news story is genuinely positive and uplifting, and categorize it.

CRITICAL RULES:
- Reject stories that are "positive framing of negative events" (e.g., "death toll lower than expected", "fewer layoffs than feared")
- Reject stories about conflict, violence, political controversy, or tragedy — even if there's a silver lining
- Accept stories about breakthroughs, achievements, acts of kindness, environmental wins, scientific progress, community resilience, cultural milestones
- The story must make a reader's day genuinely better

Story title: ${title}
${description ? `Description: ${description}` : ''}

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "is_positive": boolean,
  "confidence": number between 0 and 1,
  "category": one of [${CATEGORIES.map((c) => `"${c}"`).join(', ')}],
  "reasoning": "brief explanation"
}`;

	try {
		const response = await client.messages.create({
			model: AI_MODEL,
			max_tokens: 300,
			messages: [{ role: 'user', content: prompt }]
		});

		const text = response.content[0].type === 'text' ? response.content[0].text : '';
		const result = JSON.parse(text) as ClassificationResult;
		return result;
	} catch {
		return null;
	}
}
