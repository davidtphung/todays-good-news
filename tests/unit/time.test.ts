import { describe, it, expect } from 'vitest';
import { timeAgo, todayISO } from '$lib/utils/time.js';

describe('time utilities', () => {
	describe('timeAgo', () => {
		it('returns "just now" for recent timestamps', () => {
			const now = new Date().toISOString();
			expect(timeAgo(now)).toBe('just now');
		});

		it('returns minutes ago', () => {
			const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
			expect(timeAgo(fiveMinAgo)).toBe('5m ago');
		});

		it('returns hours ago', () => {
			const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
			expect(timeAgo(threeHoursAgo)).toBe('3h ago');
		});

		it('returns days ago', () => {
			const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
			expect(timeAgo(twoDaysAgo)).toBe('2d ago');
		});
	});

	describe('todayISO', () => {
		it('returns today in YYYY-MM-DD format', () => {
			const result = todayISO();
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});
	});
});
