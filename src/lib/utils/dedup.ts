/**
 * Simple fuzzy matching for deduplication.
 * Returns a similarity score between 0 and 1.
 */
export function similarity(a: string, b: string): number {
	const tokensA = normalize(a);
	const tokensB = normalize(b);
	if (tokensA.length === 0 || tokensB.length === 0) return 0;

	const setA = new Set(tokensA);
	const setB = new Set(tokensB);
	const intersection = new Set([...setA].filter((t) => setB.has(t)));
	const union = new Set([...setA, ...setB]);

	return intersection.size / union.size;
}

function normalize(text: string): string[] {
	return text
		.toLowerCase()
		.replace(/[^\w\s]/g, '')
		.split(/\s+/)
		.filter((t) => t.length > 2);
}

export function isDuplicate(
	title: string,
	existingTitles: string[],
	threshold = 0.6
): boolean {
	return existingTitles.some((existing) => similarity(title, existing) >= threshold);
}
