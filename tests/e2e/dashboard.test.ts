import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
	test('loads with panels visible', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('[data-panel]')).toHaveCount(14);
	});

	test('displays story cards with titles', async ({ page }) => {
		await page.goto('/');
		const firstStory = page.locator('[data-story-id]').first();
		await expect(firstStory).toBeVisible();
	});

	test('header shows brand name', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('header')).toContainText('Good News');
	});

	test('settings modal opens and closes', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Open settings' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('button', { name: 'Close settings' }).click();
		await expect(page.getByRole('dialog')).toBeHidden();
	});

	test('story detail page loads', async ({ page }) => {
		await page.goto('/');
		const firstStory = page.locator('[data-story-id]').first();
		await firstStory.click();
		await expect(page.locator('article')).toBeVisible();
		await expect(page.locator('text=Dashboard')).toBeVisible();
	});

	test('responsive layout on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');
		const panel = page.locator('[data-panel]').first();
		await expect(panel).toBeVisible();
	});
});
