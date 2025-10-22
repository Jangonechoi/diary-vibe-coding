import { test, expect } from "@playwright/test";

test.describe("Auth Login Form Hook", () => {
  test.beforeEach(async ({ page }) => {
    // /auth/login 페이지로 이동
    await page.goto("/auth/login");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="auth-login-page"]', {
      timeout: 2000,
    });
  });

  test.describe("폼 유효성 검사", () => {
    test("모든 필드가 비어있을 때 로그인 버튼이 비활성화되어야 함", async ({
      page,
    }) => {
      const submitButton = page.getByTestId("login-submit-button");
      await expect(submitButton).toBeDisabled();
    });

    test("이메일만 입력했을 때 로그인 버튼이 비활성화되어야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");
      const submitButton = page.getByTestId("login-submit-button");

      await emailInput.fill("test@example.com");
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호만 입력했을 때 로그인 버튼이 비활성화되어야 함", async ({
      page,
    }) => {
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      await passwordInput.fill("password123");
      await expect(submitButton).toBeDisabled();
    });

    test("올바른 이메일과 비밀번호를 입력했을 때 로그인 버튼이 활성화되어야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      await emailInput.fill("a@c.com");
      await passwordInput.fill("1234qwer");
      await expect(submitButton).toBeEnabled();
    });

    test("잘못된 이메일 형식일 때 에러 메시지가 표시되어야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");

      await emailInput.fill("invalid-email");
      await emailInput.blur();

      // 에러 메시지 확인 (Input 컴포넌트의 error prop으로 표시)
      await expect(
        page.locator("text=올바른 이메일 형식이 아닙니다")
      ).toBeVisible();
    });

    test("이메일이 비어있을 때 에러 메시지가 표시되어야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");

      await emailInput.focus();
      await emailInput.blur();

      // 에러 메시지 확인
      await expect(page.locator("text=이메일을 입력해주세요")).toBeVisible();
    });

    test("비밀번호가 비어있을 때 에러 메시지가 표시되어야 함", async ({
      page,
    }) => {
      const passwordInput = page.getByTestId("login-password-input");

      await passwordInput.focus();
      await passwordInput.blur();

      // 에러 메시지 확인
      await expect(page.locator("text=비밀번호를 입력해주세요")).toBeVisible();
    });
  });

  test.describe("로그인 성공 시나리오", () => {
    test("올바른 계정으로 로그인 시 성공 모달이 표시되고 일기 목록 페이지로 이동해야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      // 로그인 정보 입력
      await emailInput.fill("a@c.com");
      await passwordInput.fill("1234qwer");

      // 로그인 버튼 클릭
      await submitButton.click();

      // 로딩 상태 확인
      await expect(submitButton).toHaveText("로그인 중...");
      await expect(submitButton).toBeDisabled();

      // 성공 모달 확인
      await expect(page.locator("text=로그인 완료")).toBeVisible({
        timeout: 2000,
      });
      await expect(page.locator("text=로그인에 성공했습니다.")).toBeVisible();

      // 모달 확인 버튼 클릭
      await page.getByRole("button", { name: "확인" }).click();

      // 일기 목록 페이지로 이동 확인
      await expect(page).toHaveURL("/diaries");
    });

    test("로그인 성공 시 로컬스토리지에 accessToken과 user 정보가 저장되어야 함", async ({
      page,
    }) => {
      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      // 로그인 정보 입력
      await emailInput.fill("a@c.com");
      await passwordInput.fill("1234qwer");

      // 로그인 버튼 클릭
      await submitButton.click();

      // 성공 모달 확인
      await expect(page.locator("text=로그인 완료")).toBeVisible({
        timeout: 2000,
      });

      // 로컬스토리지 확인
      const accessToken = await page.evaluate(() =>
        localStorage.getItem("accessToken")
      );
      const user = await page.evaluate(() => localStorage.getItem("user"));

      expect(accessToken).toBeTruthy();
      expect(user).toBeTruthy();

      // user 정보 파싱 및 검증
      const userData = JSON.parse(user);
      expect(userData).toHaveProperty("id");
      expect(userData).toHaveProperty("name");
    });
  });

  test.describe("로그인 실패 시나리오", () => {
    test("잘못된 계정으로 로그인 시 실패 모달이 표시되어야 함", async ({
      page,
    }) => {
      // API 모킹 설정
      await page.route("**/graphql", async (route) => {
        const request = route.request();
        const postData = request.postData();

        if (postData && postData.includes("loginUser")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              errors: [
                {
                  message: "이메일 또는 비밀번호가 올바르지 않습니다.",
                },
              ],
            }),
          });
        } else {
          await route.continue();
        }
      });

      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      // 잘못된 로그인 정보 입력
      await emailInput.fill("wrong@example.com");
      await passwordInput.fill("wrongpassword");

      // 로그인 버튼 클릭
      await submitButton.click();

      // 실패 모달 확인
      await expect(page.locator("text=로그인 실패")).toBeVisible({
        timeout: 2000,
      });
      await expect(
        page.locator("text=이메일 또는 비밀번호가 올바르지 않습니다.")
      ).toBeVisible();

      // 모달 확인 버튼 클릭
      await page.getByRole("button", { name: "확인" }).click();

      // 모달이 닫혔는지 확인
      await expect(page.locator("text=로그인 실패")).not.toBeVisible();
    });

    test("네트워크 오류 시 실패 모달이 표시되어야 함", async ({ page }) => {
      // API 모킹 설정 (네트워크 오류)
      await page.route("**/graphql", async (route) => {
        const request = route.request();
        const postData = request.postData();

        if (postData && postData.includes("loginUser")) {
          await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({
              error: "Internal Server Error",
            }),
          });
        } else {
          await route.continue();
        }
      });

      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      // 로그인 정보 입력
      await emailInput.fill("a@c.com");
      await passwordInput.fill("1234qwer");

      // 로그인 버튼 클릭
      await submitButton.click();

      // 실패 모달 확인
      await expect(page.locator("text=로그인 실패")).toBeVisible({
        timeout: 2000,
      });
    });
  });

  test.describe("폼 상태 관리", () => {
    test("로그인 중일 때 버튼이 비활성화되고 로딩 텍스트가 표시되어야 함", async ({
      page,
    }) => {
      // 느린 응답을 위한 API 모킹
      await page.route("**/graphql", async (route) => {
        const request = route.request();
        const postData = request.postData();

        if (postData && postData.includes("loginUser")) {
          // 1초 지연
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              data: {
                loginUser: {
                  accessToken: "test-token",
                },
              },
            }),
          });
        } else {
          await route.continue();
        }
      });

      const emailInput = page.getByTestId("login-email-input");
      const passwordInput = page.getByTestId("login-password-input");
      const submitButton = page.getByTestId("login-submit-button");

      // 로그인 정보 입력
      await emailInput.fill("a@c.com");
      await passwordInput.fill("1234qwer");

      // 로그인 버튼 클릭
      await submitButton.click();

      // 로딩 상태 확인
      await expect(submitButton).toHaveText("로그인 중...");
      await expect(submitButton).toBeDisabled();
    });
  });
});
