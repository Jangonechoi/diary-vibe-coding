import { test, expect } from "@playwright/test";

test.describe("Layout 인증 기능 테스트", () => {
  test("비로그인 유저 시나리오", async ({ page }) => {
    // 1. 비회원으로 /diaries에 접속하여 페이지 로드 확인
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 2. layout의 로그인버튼 노출여부 확인
    const loginButton = page.locator('[data-testid="layout-login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText("로그인");

    // 3. 로그인버튼 클릭하여 /auth/login 페이지로 이동
    await loginButton.click();
    await expect(page).toHaveURL("/auth/login");
  });

  test("로그인 유저 시나리오", async ({ page }) => {
    // 1. 비회원으로 /auth/login에 접속하여 페이지 로드 확인
    await page.goto("/auth/login");
    // 로그인 페이지는 header가 표시되지 않으므로 로그인 폼이 로드되는지 확인
    await page.waitForSelector('input[type="email"]');

    // 2. 로그인시도
    // email: a@c.com, password: 1234qwer
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginSubmitButton = page.locator('button[type="submit"]');

    await emailInput.fill("a@c.com");
    await passwordInput.fill("1234qwer");
    await loginSubmitButton.click();

    // 3. 로그인 성공 후, 완료 모달 클릭하여 /diaries 페이지 로드 확인
    // 모달이 나타날 때까지 대기
    await page.waitForSelector('[data-testid="modal"]', {
      timeout: 2000,
    });
    const modalCloseButton = page.locator('[data-testid="modal"] button');
    await modalCloseButton.click();

    // /diaries 페이지로 이동 확인
    await expect(page).toHaveURL("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 4. layout에서 유저이름, 로그아웃버튼 노출여부 확인
    // 인증 상태 UI가 나타날 때까지 대기
    await page.waitForSelector('[data-testid="layout-auth-status"]', {
      timeout: 2000,
    });
    const authStatus = page.locator('[data-testid="layout-auth-status"]');
    await expect(authStatus).toBeVisible();

    const userName = authStatus.locator(".userName");
    await expect(userName).toBeVisible();

    const logoutButton = page.locator('[data-testid="layout-logout-button"]');
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toHaveText("로그아웃");

    // 5. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인
    await logoutButton.click();
    await expect(page).toHaveURL("/auth/login");

    // 6. /diaries에 접속하여 페이지 로드 확인
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 7. layout에 로그인버튼 노출여부 확인
    const loginButton = page.locator('[data-testid="layout-login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText("로그인");
  });
});
