import { test, expect } from "@playwright/test";

test.describe("Layout 인증 상태 UI 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test("비로그인 상태 - 인증 상태 UI 미노출", async ({ page }) => {
    // 인증 상태 UI 미노출 확인
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(authStatus).not.toBeVisible();
  });

  test("로그인 상태 - 인증 상태 UI 노출", async ({ page }) => {
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
    });

    // 페이지 새로고침하여 인증 상태 반영
    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 인증 상태 UI 노출 확인
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(authStatus).toBeVisible();

    // 사용자 이름 표시 확인
    const userName = page.locator('[data-testid="layout-user-name"]');
    await expect(userName).toHaveText("홍길동");

    // 로그아웃 버튼 표시 확인
    const logoutButton = page.locator('[data-testid="layout-logout-button"]');
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toHaveText("로그아웃");
  });

  test("로그아웃 버튼 클릭 시 로그인 페이지로 이동", async ({ page }) => {
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
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 로그아웃 버튼 클릭
    const logoutButton = page.locator('[data-testid="layout-logout-button"]');
    await logoutButton.click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL("/auth/login");

    // 로컬스토리지에서 토큰 제거 확인
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken")
    );
    expect(accessToken).toBeNull();

    const user = await page.evaluate(() => localStorage.getItem("user"));
    expect(user).toBeNull();
  });

  test("다른 사용자로 로그인 시 사용자 이름 변경", async ({ page }) => {
    // 첫 번째 사용자로 로그인
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "test-token-1");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          email: "user1@example.com",
          name: "테스트 사용자 1",
        })
      );
    });

    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 첫 번째 사용자 이름 확인
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    const userName = page.locator('[data-testid="layout-user-name"]');
    await expect(userName).toHaveText("김철수");

    // 두 번째 사용자로 변경
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "test-token-2");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "2",
          email: "user2@example.com",
          name: "테스트 사용자 2",
        })
      );
    });

    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 두 번째 사용자 이름 확인
    await expect(userName).toHaveText("이영희");
  });

  test("로그아웃 후 다시 로그인 시 인증 상태 UI 정상 동작", async ({
    page,
  }) => {
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
    });

    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 인증 상태 UI 노출 확인
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(authStatus).toBeVisible();

    // 로그아웃
    const logoutButton = page.locator('[data-testid="layout-logout-button"]');
    await logoutButton.click();
    await expect(page).toHaveURL("/auth/login");

    // 다시 로그인
    await page.evaluate(() => {
      localStorage.setItem("accessToken", "new-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "2",
          email: "newuser@example.com",
          name: "테스트 사용자 3",
        })
      );
    });

    // 일기목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 새로운 사용자 인증 상태 UI 확인
    const newAuthStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(newAuthStatus).toBeVisible();

    const newUserName = page.locator('[data-testid="layout-user-name"]');
    await expect(newUserName).toHaveText("박민수");
  });

  test("인증 상태 UI 스타일링 확인", async ({ page }) => {
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
    });

    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // 인증 상태 UI 스타일 확인
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(authStatus).toBeVisible();

    // 사용자 이름 스타일 확인
    const userName = page.locator('[data-testid="layout-user-name"]');
    await expect(userName).toHaveCSS("font-family", /Pretendard/);
    await expect(userName).toHaveCSS("font-size", "16px");
    await expect(userName).toHaveCSS("font-weight", "500");
    await expect(userName).toHaveCSS("color", "rgb(0, 0, 0)");

    // 로그아웃 버튼 스타일 확인
    const logoutButton = page.locator('[data-testid="layout-logout-button"]');
    await expect(logoutButton).toHaveCSS("height", "32px");
    await expect(logoutButton).toHaveCSS("font-size", "14px");
  });

  test("Header 영역에서 인증 상태 UI 위치 확인", async ({ page }) => {
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
    });

    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });

    // Header 영역 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // Header 내부 요소들 확인
    const logo = page.locator('[data-testid="layout-logo"]');
    const authStatus = page.locator('[data-testid="layout-auth-status"]');

    await expect(logo).toBeVisible();
    await expect(authStatus).toBeVisible();

    // Header가 flex로 정렬되어 있는지 확인
    await expect(header).toHaveCSS("display", "flex");
    await expect(header).toHaveCSS("justify-content", "space-between");
  });
});
