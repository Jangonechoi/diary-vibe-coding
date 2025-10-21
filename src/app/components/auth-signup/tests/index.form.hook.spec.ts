import { test, expect } from "@playwright/test";

test.describe("AuthSignup Form Hook", () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드
    await page.goto("/auth/signup");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="auth-signup-page"]');
  });

  test("모든 인풋이 입력되면 회원가입 버튼이 활성화된다", async ({ page }) => {
    // 초기 상태: 버튼이 비활성화되어 있어야 함
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await expect(submitButton).toBeDisabled();

    // 이메일 입력
    await page
      .locator('[data-testid="signup-email-input"]')
      .fill("test@example.com");

    // 비밀번호 입력 (영문 + 숫자 포함 8자리 이상)
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password123");

    // 비밀번호 확인 입력
    await page
      .locator('[data-testid="signup-password-confirm-input"]')
      .fill("password123");

    // 이름 입력
    await page.locator('[data-testid="signup-name-input"]').fill("테스터");

    // 모든 입력이 완료되면 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });

  test("이메일 검증: @ 포함되지 않으면 에러 메시지 표시", async ({ page }) => {
    // @ 없는 이메일 입력
    await page
      .locator('[data-testid="signup-email-input"]')
      .fill("invalidemail");

    // 다른 필드 클릭하여 blur 이벤트 발생
    await page.locator('[data-testid="signup-password-input"]').click();

    // 에러 메시지 확인
    const errorMessage = page.locator("text=@를 포함해야 합니다");
    await expect(errorMessage).toBeVisible();

    // 버튼이 비활성화되어야 함
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("비밀번호 검증: 영문 + 숫자 포함 8자리 미만이면 에러 메시지 표시", async ({
    page,
  }) => {
    // 8자 미만의 비밀번호 입력
    await page.locator('[data-testid="signup-password-input"]').fill("pass1");

    // 다른 필드 클릭하여 blur 이벤트 발생
    await page.locator('[data-testid="signup-email-input"]').click();

    // 에러 메시지 확인
    const errorMessage = page.locator("text=8자 이상이어야 합니다");
    await expect(errorMessage).toBeVisible();
  });

  test("비밀번호 검증: 영문만 있으면 에러 메시지 표시", async ({ page }) => {
    // 영문만 있는 비밀번호 입력
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password");

    // 다른 필드 클릭하여 blur 이벤트 발생
    await page.locator('[data-testid="signup-email-input"]').click();

    // 에러 메시지 확인
    const errorMessage = page.locator("text=영문과 숫자를 모두 포함");
    await expect(errorMessage).toBeVisible();
  });

  test("비밀번호 검증: 숫자만 있으면 에러 메시지 표시", async ({ page }) => {
    // 숫자만 있는 비밀번호 입력
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("12345678");

    // 다른 필드 클릭하여 blur 이벤트 발생
    await page.locator('[data-testid="signup-email-input"]').click();

    // 에러 메시지 확인
    const errorMessage = page.locator("text=영문과 숫자를 모두 포함");
    await expect(errorMessage).toBeVisible();
  });

  test("비밀번호 확인 검증: password와 다르면 에러 메시지 표시", async ({
    page,
  }) => {
    // 비밀번호 입력
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password123");

    // 다른 비밀번호 확인 입력
    await page
      .locator('[data-testid="signup-password-confirm-input"]')
      .fill("password456");

    // 다른 필드 클릭하여 blur 이벤트 발생
    await page.locator('[data-testid="signup-email-input"]').click();

    // 에러 메시지 확인
    const errorMessage = page.locator("text=일치하지 않습니다");
    await expect(errorMessage).toBeVisible();
  });

  test("이름 검증: 최소 1글자 이상", async ({ page }) => {
    // 이름 입력 필드에 포커스 후 다른 필드로 이동
    const nameInput = page.locator('[data-testid="signup-name-input"]');
    await nameInput.click();
    await nameInput.fill(""); // 명시적으로 빈 값 입력
    await page.locator('[data-testid="signup-email-input"]').click();

    // 버튼이 비활성화되어야 함
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("회원가입 성공 시나리오 (실제 API 호출)", async ({ page }) => {
    // 고유한 이메일 생성 (timestamp 사용)
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;

    // 폼 입력
    await page.locator('[data-testid="signup-email-input"]').fill(email);
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password123");
    await page
      .locator('[data-testid="signup-password-confirm-input"]')
      .fill("password123");
    await page.locator('[data-testid="signup-name-input"]').fill("테스터");

    // 회원가입 버튼 클릭
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 성공 모달이 표시될 때까지 대기 (최대 2초)
    const successModal = page.locator("text=가입 완료");
    await expect(successModal).toBeVisible({ timeout: 2000 });

    // 메시지 확인
    const successMessage = page.locator("text=회원가입이 완료되었습니다");
    await expect(successMessage).toBeVisible();

    // 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click();

    // 로그인 페이지로 이동했는지 확인
    await expect(page).toHaveURL("/auth/login", { timeout: 2000 });
  });

  test("회원가입 실패 시나리오 (API 모킹)", async ({ page }) => {
    // API 요청 가로채기 (실패 응답 반환)
    await page.route(
      "process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://main-practice.codebootcamp.co.kr/graphql"",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [
              {
                message: "이미 사용 중인 이메일입니다.",
              },
            ],
          }),
        });
      }
    );

    // 폼 입력
    await page
      .locator('[data-testid="signup-email-input"]')
      .fill("test@example.com");
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password123");
    await page
      .locator('[data-testid="signup-password-confirm-input"]')
      .fill("password123");
    await page.locator('[data-testid="signup-name-input"]').fill("테스터");

    // 회원가입 버튼 클릭
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await submitButton.click();

    // 실패 모달이 표시될 때까지 대기 (최대 2초)
    const failureModal = page.locator("text=가입 실패");
    await expect(failureModal).toBeVisible({ timeout: 2000 });

    // 메시지 확인
    const failureMessage = page.locator("text=회원가입에 실패했습니다");
    await expect(failureMessage).toBeVisible();

    // 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click();

    // 모달이 닫혔는지 확인
    await expect(failureModal).not.toBeVisible();

    // 여전히 회원가입 페이지에 있어야 함
    await expect(page).toHaveURL("/auth/signup");
  });

  test("모달은 한 번만 표시되어야 함 (중복 방지)", async ({ page }) => {
    // API 요청 가로채기 (실패 응답 반환)
    await page.route(
      "process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "https://main-practice.codebootcamp.co.kr/graphql"",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            errors: [{ message: "Error" }],
          }),
        });
      }
    );

    // 폼 입력
    await page
      .locator('[data-testid="signup-email-input"]')
      .fill("test@example.com");
    await page
      .locator('[data-testid="signup-password-input"]')
      .fill("password123");
    await page
      .locator('[data-testid="signup-password-confirm-input"]')
      .fill("password123");
    await page.locator('[data-testid="signup-name-input"]').fill("테스터");

    // 회원가입 버튼 클릭
    const submitButton = page.locator('[data-testid="signup-submit-button"]');
    await submitButton.click();

    // 모달이 표시될 때까지 대기
    const failureModal = page.locator("text=가입 실패");
    await expect(failureModal).toBeVisible({ timeout: 2000 });

    // 모달 개수 확인 (1개만 있어야 함)
    const modalCount = await page.locator("text=가입 실패").count();
    expect(modalCount).toBe(1);
  });
});
