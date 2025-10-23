import { test, expect } from "@playwright/test";

test.describe("일기 검색 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 좋은 하루",
        content: "오늘은 정말 좋은 하루였다.",
        emotion: "Happy",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬펐다.",
        emotion: "Sad",
        createdAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: 3,
        title: "화나는 일",
        content: "오늘은 정말 화가 났다.",
        emotion: "Angry",
        createdAt: "2024-01-03T00:00:00.000Z",
      },
      {
        id: 4,
        title: "놀라운 순간",
        content: "오늘은 놀라운 일이 있었다.",
        emotion: "Surprise",
        createdAt: "2024-01-04T00:00:00.000Z",
      },
      {
        id: 5,
        title: "기타 감정",
        content: "오늘은 복잡한 감정이었다.",
        emotion: "Etc",
        createdAt: "2024-01-05T00:00:00.000Z",
      },
    ];

    await page.goto("/diaries");

    // 로컬스토리지에 테스트 데이터 설정
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침하여 데이터 로드
    await page.reload();

    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      timeout: 2000,
    });
  });

  test("검색창에 검색어 입력 시 엔터키로 검색 가능", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill("좋은");

    // 엔터키로 검색 실행
    await searchInput.press("Enter");

    // 검색 결과 확인 (제목에 "좋은"이 포함된 일기만 표시되어야 함)
    const diaryCards = page.locator('[class*="diaryCard"]');
    const cardCount = await diaryCards.count();

    // 검색 결과가 1개여야 함 (id: 1 - "오늘은 좋은 하루")
    expect(cardCount).toBe(1);

    // 검색 결과의 제목 확인
    const firstCardTitle = diaryCards.first().locator('[class*="cardTitle"]');
    await expect(firstCardTitle).toContainText("오늘은 좋은 하루");
  });

  test("검색창에 검색어 입력 시 돋보기 버튼으로 검색 가능", async ({
    page,
  }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill("슬픈");

    // 돋보기 버튼 클릭 (Searchbar 컴포넌트의 검색 버튼)
    const searchButton = page.locator('button[type="submit"]');
    await searchButton.click();

    // 검색 결과 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    const cardCount = await diaryCards.count();

    // 검색 결과가 1개여야 함 (id: 2 - "슬픈 하루")
    expect(cardCount).toBe(1);

    // 검색 결과의 제목 확인
    const firstCardTitle = diaryCards.first().locator('[class*="cardTitle"]');
    await expect(firstCardTitle).toContainText("슬픈 하루");
  });

  test("검색어가 없을 때는 모든 일기가 표시됨", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 빈 검색어로 검색
    await searchInput.fill("");
    await searchInput.press("Enter");

    // 모든 일기가 표시되어야 함 (5개)
    const diaryCards = page.locator('[class*="diaryCard"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBe(5);
  });

  test("존재하지 않는 검색어로 검색 시 결과 없음", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 존재하지 않는 검색어 입력
    await searchInput.fill("존재하지않는제목");
    await searchInput.press("Enter");

    // 검색 결과가 없을 때 "검색 결과가 없습니다" 메시지가 표시되어야 함
    const noResultsMessage = page.locator("text=검색 결과가 없습니다");
    await expect(noResultsMessage).toBeVisible();
  });

  test("대소문자 구분 없이 검색 가능", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 대문자로 검색
    await searchInput.fill("화나는");
    await searchInput.press("Enter");

    // 검색 결과 확인
    const diaryCards = page.locator('[class*="diaryCard"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBe(1);

    // 검색 결과의 제목 확인
    const firstCardTitle = diaryCards.first().locator('[class*="cardTitle"]');
    await expect(firstCardTitle).toContainText("화나는 일");
  });

  test("부분 검색어로 검색 가능", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 부분 검색어 입력
    await searchInput.fill("하루");
    await searchInput.press("Enter");

    // 검색 결과 확인 (2개여야 함: "오늘은 좋은 하루", "슬픈 하루")
    const diaryCards = page.locator('[class*="diaryCard"]');
    const cardCount = await diaryCards.count();
    expect(cardCount).toBe(2);
  });
});
