import { test, expect } from '@playwright/test';

test.describe('Layout 링크 라우팅 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid로 식별)
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test('헤더 로고 클릭 시 일기목록 페이지로 이동', async ({ page }) => {
    // 헤더 로고 클릭
    await page.click('[data-testid="layout-logo"]');

    // URL 확인
    await expect(page).toHaveURL('/diaries');

    // 일기보관함 탭 액티브 상태 확인
    const diariesTab = page.locator('[data-testid="nav-tab-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);
  });

  test('일기보관함 네비게이션 클릭 시 일기목록 페이지로 이동 및 액티브 상태 변경', async ({
    page,
  }) => {
    // 일기보관함 탭 클릭
    await page.click('[data-testid="nav-tab-diaries"]');

    // URL 확인
    await expect(page).toHaveURL('/diaries');

    // 일기보관함 탭 액티브 상태 확인
    const diariesTab = page.locator('[data-testid="nav-tab-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);

    // 사진보관함 탭 비활성 상태 확인
    const picturesTab = page.locator('[data-testid="nav-tab-pictures"]');
    await expect(picturesTab).not.toHaveClass(/tabActive/);
  });

  test('사진보관함 네비게이션 클릭 시 사진목록 페이지로 이동 및 액티브 상태 변경', async ({
    page,
  }) => {
    // 사진보관함 탭 클릭
    await page.click('[data-testid="nav-tab-pictures"]');

    // URL 확인
    await expect(page).toHaveURL('/pictures');

    // 사진보관함 탭 액티브 상태 확인
    const picturesTab = page.locator('[data-testid="nav-tab-pictures"]');
    await expect(picturesTab).toHaveClass(/tabActive/);

    // 일기보관함 탭 비활성 상태 확인
    const diariesTab = page.locator('[data-testid="nav-tab-diaries"]');
    await expect(diariesTab).not.toHaveClass(/tabActive/);
  });

  test('일기보관함에서 사진보관함으로 이동 후 다시 일기보관함으로 이동 시 액티브 상태 정상 동작', async ({
    page,
  }) => {
    // 일기보관함 탭 액티브 확인
    const diariesTab = page.locator('[data-testid="nav-tab-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);

    // 사진보관함으로 이동
    await page.click('[data-testid="nav-tab-pictures"]');
    await expect(page).toHaveURL('/pictures');

    // 사진보관함 탭 액티브 확인
    const picturesTab = page.locator('[data-testid="nav-tab-pictures"]');
    await expect(picturesTab).toHaveClass(/tabActive/);
    await expect(diariesTab).not.toHaveClass(/tabActive/);

    // 다시 일기보관함으로 이동
    await page.click('[data-testid="nav-tab-diaries"]');
    await expect(page).toHaveURL('/diaries');

    // 일기보관함 탭 액티브 확인
    await expect(diariesTab).toHaveClass(/tabActive/);
    await expect(picturesTab).not.toHaveClass(/tabActive/);
  });
});
