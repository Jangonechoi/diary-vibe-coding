import { test, expect } from "@playwright/test";

test.describe("Layout 영역 노출 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 먼저 페이지를 로드한 후 로컬스토리지 설정
    await page.goto("/diaries");

    // 로그인 상태 설정
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          email: "test@example.com",
          name: "테스트 사용자",
        })
      );

      // 테스트용 일기 데이터 설정
      const testDiaries = [
        {
          id: 1,
          title: "테스트 일기",
          content: "테스트 일기 내용입니다.",
          emotion: "Happy",
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });
  });

  test("일기목록 페이지 - 모든 영역 노출", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // header 영역 노출 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // logo 노출 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();

    // banner 영역 노출 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();

    // navigation 영역 노출 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();

    // footer 영역 노출 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test("일기 상세 페이지 - header, logo, footer만 노출", async ({ page }) => {
    // 일기 상세 페이지로 이동 (예시 ID: 1)
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="layout-header"]');

    // header 영역 노출 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // logo 노출 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();

    // banner 영역 미노출 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();

    // navigation 영역 미노출 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();

    // footer 영역 노출 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test("일기 작성 페이지 - header, logo, footer만 노출", async ({ page }) => {
    await page.goto("/diaries/new");
    await page.waitForSelector('[data-testid="layout-header"]');

    // header 영역 노출 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // logo 노출 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();

    // banner 영역 미노출 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();

    // navigation 영역 미노출 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();

    // footer 영역 노출 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test("일기목록에서 상세로 이동 후 다시 목록으로 이동 - 영역 노출 정상 동작", async ({
    page,
  }) => {
    // 일기목록 페이지
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    const banner = page.locator('[data-testid="layout-banner"]');
    const navigation = page.locator('[data-testid="layout-navigation"]');

    // 일기목록: banner, navigation 노출
    await expect(banner).toBeVisible();
    await expect(navigation).toBeVisible();

    // 일기 상세 페이지로 이동
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 일기 상세: banner, navigation 미노출
    await expect(banner).not.toBeVisible();
    await expect(navigation).not.toBeVisible();

    // 다시 일기목록으로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 일기목록: banner, navigation 노출
    await expect(banner).toBeVisible();
    await expect(navigation).toBeVisible();
  });
});
