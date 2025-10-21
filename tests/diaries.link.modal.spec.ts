import { test, expect } from "@playwright/test";

test.describe("일기쓰기 모달 테스트", () => {
  test("일기쓰기 버튼 클릭 시 모달이 열린다", async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 찾기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await expect(writeButton).toBeVisible();

    // 일기쓰기 버튼 클릭
    await writeButton.click();

    // 일기쓰기 컴포넌트의 헤더가 보이는지 확인 (모달이 열렸는지)
    const modalHeader = page.getByText("일기 쓰기");
    await expect(modalHeader).toBeVisible({ timeout: 1000 });

    // 모달 컨텐츠가 보이는지 확인
    const modalContent = page.locator('[class*="modalWrapper"]');
    await expect(modalContent).toBeVisible();
  });

  test("모달 백드롭 클릭 시 모달이 닫힌다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modalHeader = page.getByText("일기 쓰기");
    await expect(modalHeader).toBeVisible({ timeout: 1000 });

    // 백드롭 클릭 (모달 컨텐츠가 아닌 백드롭 영역)
    const modalBackdrop = page.locator('[class*="backdrop"]');
    await modalBackdrop.click({ position: { x: 10, y: 10 } });

    // 모달이 닫혔는지 확인
    await expect(modalHeader).not.toBeVisible();
  });

  test("모달 내부 닫기 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modalHeader = page.getByText("일기 쓰기");
    await expect(modalHeader).toBeVisible({ timeout: 1000 });

    // 모달 내부의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // 등록취소 확인 모달이 열렸는지 확인
    await expect(page.getByText("등록 취소")).toBeVisible({ timeout: 1000 });

    // 등록취소 버튼 클릭하여 모달 닫기
    const cancelConfirmButton = page.locator('button:has-text("등록취소")');
    await expect(cancelConfirmButton).toBeVisible();
    await cancelConfirmButton.click();

    // 모달이 닫혔는지 확인
    await expect(modalHeader).not.toBeVisible();
  });
});
