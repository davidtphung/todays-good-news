import { describe, it, expect } from 'vitest';
import { similarity, isDuplicate } from '$lib/utils/dedup.js';

describe('dedup', () => {
	describe('similarity', () => {
		it('returns 1 for identical strings', () => {
			expect(similarity('hello world', 'hello world')).toBe(1);
		});

		it('returns 0 for completely different strings', () => {
			expect(similarity('cats dogs birds', 'quantum physics math')).toBe(0);
		});

		it('returns high similarity for near-duplicates', () => {
			const a = 'Scientists discover new species of deep sea fish';
			const b = 'Scientists discover a new species of deep-sea fish in the Pacific';
			expect(similarity(a, b)).toBeGreaterThanOrEqual(0.5);
		});

		it('returns low similarity for different stories', () => {
			const a = 'Solar panel efficiency breaks world record';
			const b = 'Community garden feeds thousands of families';
			expect(similarity(a, b)).toBeLessThan(0.3);
		});

		it('handles empty strings', () => {
			expect(similarity('', 'hello')).toBe(0);
			expect(similarity('hello', '')).toBe(0);
			expect(similarity('', '')).toBe(0);
		});
	});

	describe('isDuplicate', () => {
		it('detects duplicate titles', () => {
			const existing = [
				'Scientists discover breakthrough in cancer treatment',
				'New renewable energy record set by wind farm'
			];
			expect(
				isDuplicate('Scientists discover major breakthrough in cancer treatment', existing)
			).toBe(true);
		});

		it('does not flag different stories', () => {
			const existing = [
				'Scientists discover breakthrough in cancer treatment',
				'New renewable energy record set by wind farm'
			];
			expect(
				isDuplicate('Community builds 100 homes for the homeless', existing)
			).toBe(false);
		});

		it('handles empty existing titles', () => {
			expect(isDuplicate('Any title here', [])).toBe(false);
		});
	});
});
