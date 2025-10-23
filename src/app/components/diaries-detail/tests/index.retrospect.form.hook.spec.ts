import { test, expect } from "@playwright/test";

test.describe("회고쓰기 폼 등록 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지 초기화
    await page.goto("/diaries/1");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("회고 등록 인풋이 입력되면 입력버튼이 활성화된다", async ({ page }) => {
    // /diaries/[id]에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 회고 입력 필드 찾기
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');

    // 초기 상태에서 입력 버튼이 비활성화되어 있는지 확인
    await expect(submitButton).toBeDisabled();

    // 회고 내용 입력
    await retrospectInput.fill("오늘은 정말 좋은 하루였다");

    // 입력 후 버튼이 활성화되는지 확인
    await expect(submitButton).toBeEnabled();
  });

  test("회고 등록시 로컬스토리지에 데이터가 저장된다 (기존 데이터 없음)", async ({ page }) => {
    // /diaries/[id]에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 회고 입력 및 등록
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');

    await retrospectInput.fill("첫 번째 회고입니다");
    await submitButton.click();

    // 로컬스토리지에 데이터가 저장되었는지 확인
    const storedData = await page.evaluate(() => {
      const retrospects = localStorage.getItem("retrospects");
      return retrospects ? JSON.parse(retrospects) : null;
    });

    expect(storedData).toBeTruthy();
    expect(storedData).toHaveLength(1);
    expect(storedData[0]).toMatchObject({
      id: 1,
      content: "첫 번째 회고입니다",
      diaryId: 1,
      createdAt: expect.any(String),
    });
  });

  test("회고 등록시 기존 데이터가 있으면 기존 데이터에 추가된다", async ({ page }) => {
    // 기존 회고 데이터 설정
    await page.goto("/diaries/1");
    await page.evaluate(() => {
      const existingRetrospects = [
        {
          id: 1,
          content: "기존 회고 1",
          diaryId: 1,
          createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          content: "기존 회고 2",
          diaryId: 1,
          createdAt: "2024-01-02T00:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(existingRetrospects));
    });

    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 새로운 회고 입력 및 등록
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');

    await retrospectInput.fill("새로운 회고입니다");
    await submitButton.click();

    // 로컬스토리지에 기존 데이터 + 새 데이터가 저장되었는지 확인
    const storedData = await page.evaluate(() => {
      const retrospects = localStorage.getItem("retrospects");
      return retrospects ? JSON.parse(retrospects) : null;
    });

    expect(storedData).toHaveLength(3);
    expect(storedData[2]).toMatchObject({
      id: 3, // 기존 최대 id(2) + 1
      content: "새로운 회고입니다",
      diaryId: 1,
      createdAt: expect.any(String),
    });
  });

  test("회고 등록 완료 후 페이지가 새로고침된다", async ({ page }) => {
    // /diaries/[id]에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 회고 입력 및 등록
    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');

    await retrospectInput.fill("새로고침 테스트 회고");
    await submitButton.click();

    // 페이지가 새로고침되어 다시 로드되는지 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    
    // 입력 필드가 초기화되었는지 확인
    await expect(retrospectInput).toHaveValue("");
  });

  test("빈 내용으로는 회고를 등록할 수 없다", async ({ page }) => {
    // /diaries/[id]에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');
    const submitButton = page.locator('button:has-text("입력")');

    // 빈 내용 입력
    await retrospectInput.fill("   "); // 공백만 입력
    await expect(submitButton).toBeDisabled();

    // 빈 내용으로 시도
    await retrospectInput.fill("");
    await expect(submitButton).toBeDisabled();
  });

  test("Enter 키로 회고를 등록할 수 있다", async ({ page }) => {
    // /diaries/[id]에 접속하여 페이지 로드 확인
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    const retrospectInput = page.locator('input[placeholder="회고를 남겨보세요."]');

    // Enter 키로 회고 등록
    await retrospectInput.fill("Enter 키로 등록한 회고");
    await retrospectInput.press("Enter");

    // 로컬스토리지에 데이터가 저장되었는지 확인
    const storedData = await page.evaluate(() => {
      const retrospects = localStorage.getItem("retrospects");
      return retrospects ? JSON.parse(retrospects) : null;
    });

    expect(storedData).toBeTruthy();
    expect(storedData).toHaveLength(1);
    expect(storedData[0].content).toBe("Enter 키로 등록한 회고");
  });
});
