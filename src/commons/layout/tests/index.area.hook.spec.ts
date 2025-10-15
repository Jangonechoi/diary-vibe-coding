import { test, expect } from '@playwright/test';

test.describe('Layout Area Hook 테스트', () => {
  test('일기목록 페이지에서 모든 영역이 노출됨', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="layout-header"]');

    // header, logo, banner, navigation, footer 모두 노출
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-banner"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-navigation"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-footer"]')).toBeVisible();
  });

  test('일기 상세 페이지에서 header, logo, footer만 노출됨', async ({ page }) => {
    await page.goto('/diaries/1');
    await page.waitForSelector('[data-testid="layout-header"]');

    // header, logo, footer 노출
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-footer"]')).toBeVisible();

    // banner, navigation 미노출
    await expect(page.locator('[data-testid="layout-banner"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="layout-navigation"]')).not.toBeVisible();
  });

  test('일기 작성 페이지에서 header, logo, footer만 노출됨', async ({ page }) => {
    await page.goto('/diaries/new');
    await page.waitForSelector('[data-testid="layout-header"]');

    // header, logo, footer 노출
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="layout-footer"]')).toBeVisible();

    // banner, navigation 미노출
    await expect(page.locator('[data-testid="layout-banner"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="layout-navigation"]')).not.toBeVisible();
  });
});
