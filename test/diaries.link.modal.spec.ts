import { test, expect } from '@playwright/test';

test.describe('일기쓰기 모달 테스트', () => {
  test('일기쓰기 버튼 클릭 시 모달이 열린다', async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto('/diaries');

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 찾기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await expect(writeButton).toBeVisible();

    // 모달이 처음엔 보이지 않음을 확인
    const modalBackdrop = page.locator('.fixed.inset-0.z-50');
    await expect(modalBackdrop).not.toBeVisible();

    // 일기쓰기 버튼 클릭 (force: true로 다른 요소에 가려져도 클릭)
    await writeButton.click({ force: true });

    // 모달 백드롭이 보이는지 확인 (짧은 timeout)
    await expect(modalBackdrop).toBeVisible({ timeout: 300 });

    // 모달 컨텐츠가 보이는지 확인
    const modalContent = page.locator('.relative.z-10.bg-white');
    await expect(modalContent).toBeVisible();

    // 일기쓰기 컴포넌트의 헤더가 보이는지 확인
    const modalHeader = page.locator('text=일기 쓰기');
    await expect(modalHeader).toBeVisible();
  });

  test('모달 백드롭 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click({ force: true });

    // 모달이 열렸는지 확인
    const modalBackdrop = page.locator('.fixed.inset-0.z-50');
    await expect(modalBackdrop).toBeVisible({ timeout: 300 });

    // 백드롭 클릭 (모달 컨텐츠가 아닌 백드롭 영역)
    await modalBackdrop.click({ position: { x: 10, y: 10 } });

    // 모달이 닫혔는지 확인
    await expect(modalBackdrop).not.toBeVisible();
  });

  test('모달 내부 닫기 버튼 클릭 시 모달이 닫힌다', async ({ page }) => {
    await page.goto('/diaries');
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click({ force: true });

    // 모달이 열렸는지 확인
    const modalBackdrop = page.locator('.fixed.inset-0.z-50');
    await expect(modalBackdrop).toBeVisible({ timeout: 300 });

    // 모달 내부의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await expect(closeButton).toBeVisible();
    await closeButton.click({ force: true });

    // 모달이 닫혔는지 확인
    await expect(modalBackdrop).not.toBeVisible();
  });
});
