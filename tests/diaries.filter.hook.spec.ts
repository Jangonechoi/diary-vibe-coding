import { test, expect } from "@playwright/test";

test.describe("일기 필터 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 기본 설정 (권한 분기 규칙 준수)
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.setItem("auth-token", "test-token");
      localStorage.setItem("user", JSON.stringify({ name: "테스트유저" }));
    });

    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testData = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였다.",
        emotion: "Happy",
        createdAt: "2024-01-01T00:00:00.000Z",
        date: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 정말 슬픈 하루였다.",
        emotion: "Sad",
        createdAt: "2024-01-02T00:00:00.000Z",
        date: "2024-01-02T00:00:00.000Z",
      },
      {
        id: 3,
        title: "화난 하루",
        content: "오늘은 정말 화난 하루였다.",
        emotion: "Angry",
        createdAt: "2024-01-03T00:00:00.000Z",
        date: "2024-01-03T00:00:00.000Z",
      },
      {
        id: 4,
        title: "놀란 하루",
        content: "오늘은 정말 놀란 하루였다.",
        emotion: "Surprise",
        createdAt: "2024-01-04T00:00:00.000Z",
        date: "2024-01-04T00:00:00.000Z",
      },
      {
        id: 5,
        title: "기타 하루",
        content: "오늘은 정말 기타 하루였다.",
        emotion: "Etc",
        createdAt: "2024-01-05T00:00:00.000Z",
        date: "2024-01-05T00:00:00.000Z",
      },
    ];

    await page.evaluate((data) => {
      localStorage.setItem("diaries", JSON.stringify(data));
    }, testData);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();

    // 페이지 로드 대기 - data-testid 사용
    await page.waitForSelector('[data-testid="diary-write-button"]');
  });

  test("필터 선택박스 클릭 시 메뉴 확인", async ({ page }) => {
    // 필터 선택박스 클릭 - 커스텀 드롭다운 컨테이너 클릭
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();

    // 선택 가능한 메뉴 확인 - 드롭다운 내부의 옵션만 확인
    await expect(
      page.locator('[role="listbox"]').getByText("전체")
    ).toBeVisible();
    await expect(
      page.locator('[role="listbox"]').getByText("행복해요")
    ).toBeVisible();
    await expect(
      page.locator('[role="listbox"]').getByText("슬퍼요")
    ).toBeVisible();
    await expect(
      page.locator('[role="listbox"]').getByText("놀랐어요")
    ).toBeVisible();
    await expect(
      page.locator('[role="listbox"]').getByText("화나요")
    ).toBeVisible();
  });

  test("전체 필터 선택 시 모든 일기 카드 노출", async ({ page }) => {
    // 전체 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("전체").click();

    // 모든 일기 카드가 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);
  });

  test("행복해요 필터 선택 시 해당 일기만 노출", async ({ page }) => {
    // 행복해요 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("행복해요").click();

    // 행복한 일기만 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 해당 일기의 감정이 행복인지 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="emotion-text"]'
    );
    await expect(emotionText).toHaveText("행복해요");
  });

  test("슬퍼요 필터 선택 시 해당 일기만 노출", async ({ page }) => {
    // 슬퍼요 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("슬퍼요").click();

    // 슬픈 일기만 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 해당 일기의 감정이 슬픔인지 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-2"] [data-testid="emotion-text"]'
    );
    await expect(emotionText).toHaveText("슬퍼요");
  });

  test("놀랐어요 필터 선택 시 해당 일기만 노출", async ({ page }) => {
    // 놀랐어요 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("놀랐어요").click();

    // 놀란 일기만 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 해당 일기의 감정이 놀람인지 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-4"] [data-testid="emotion-text"]'
    );
    await expect(emotionText).toHaveText("놀랐어요");
  });

  test("화나요 필터 선택 시 해당 일기만 노출", async ({ page }) => {
    // 화나요 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("화나요").click();

    // 화난 일기만 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);

    // 해당 일기의 감정이 화남인지 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-3"] [data-testid="emotion-text"]'
    );
    await expect(emotionText).toHaveText("화나요");
  });

  test("검색 후 필터 적용 테스트", async ({ page }) => {
    // 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("하루");
    await searchInput.press("Enter");

    // 검색 결과 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);

    // 행복해요 필터 선택
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("행복해요").click();

    // 검색 결과 중에서 행복한 일기만 노출되는지 확인
    const filteredCards = page.locator('[data-testid^="diary-card-"]');
    await expect(filteredCards).toHaveCount(1);

    // 해당 일기의 감정이 행복인지 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="emotion-text"]'
    );
    await expect(emotionText).toHaveText("행복해요");
  });

  test("빈 데이터에서 필터 동작 확인", async ({ page }) => {
    // 빈 데이터로 로컬스토리지 설정
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.setItem("diaries", JSON.stringify([]));
    });
    await page.reload();
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 필터 선택박스 클릭
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();
    await page.locator('[role="listbox"]').getByText("행복해요").click();

    // 빈 데이터에서도 필터가 정상 작동하는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test("잘못된 필터 값 처리 확인", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page
      .locator('[data-testid="filter-select"]')
      .locator("..")
      .locator('div[role="button"]');
    await filterSelect.click();

    // 존재하지 않는 필터 옵션이 없는지 확인
    await expect(
      page.locator('[role="listbox"]').getByText("존재하지않는필터")
    ).not.toBeVisible();
  });
});
