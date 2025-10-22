import { test, expect } from "@playwright/test";

test.describe("Diaries - 일기쓰기 버튼 권한 분기 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경 설정
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      timeout: 2000,
    });
  });

  test("비로그인 유저 - 일기쓰기 버튼 클릭 시 로그인 요청 모달 노출", async ({
    page,
  }) => {
    // 테스트 환경에서 비회원 가드 테스트를 위해 window.__TEST_BYPASS__를 false로 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = false;
    });

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 로그인 요청 모달이 노출되는지 확인
    await expect(page.locator("text=로그인이 필요합니다")).toBeVisible({
      timeout: 500,
    });
    await expect(page.locator("text=로그인 후 이용해 주세요.")).toBeVisible({
      timeout: 500,
    });
    await expect(page.locator("text=로그인하러가기")).toBeVisible({
      timeout: 500,
    });
    await expect(page.locator("text=취소")).toBeVisible({ timeout: 500 });
  });

  test("비로그인 유저 - 로그인 요청 모달의 취소 버튼 클릭 시 모달이 닫힌다", async ({
    page,
  }) => {
    // 테스트 환경에서 비회원 가드 테스트를 위해 window.__TEST_BYPASS__를 false로 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = false;
    });

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 로그인 요청 모달이 노출되는지 확인
    await expect(page.locator("text=로그인이 필요합니다")).toBeVisible({
      timeout: 500,
    });

    // 취소 버튼 클릭
    await page.click('button:has-text("취소")');

    // 모달이 닫혔는지 확인
    await expect(page.locator("text=로그인이 필요합니다")).not.toBeVisible({
      timeout: 500,
    });

    // 일기쓰기 버튼이 다시 보이는지 확인 (모달이 완전히 닫혔는지 확인)
    await expect(
      page.locator('[data-testid="diary-write-button"]')
    ).toBeVisible();
  });

  test("로그인 유저 - 일기쓰기 버튼 클릭 시 일기쓰기 페이지 모달 노출", async ({
    page,
  }) => {
    // 테스트 환경에서 로그인 상태로 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = true;
    });

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="diary-write-button"]');

    // 일기쓰기 모달이 노출되는지 확인 (DiariesNew 컴포넌트가 렌더링되는지 확인)
    // DiariesNew 컴포넌트의 고유한 요소를 찾아서 확인
    await expect(page.locator("text=일기 쓰기")).toBeVisible({ timeout: 2000 });
  });
});
