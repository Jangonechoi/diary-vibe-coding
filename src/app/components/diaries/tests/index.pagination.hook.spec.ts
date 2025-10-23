import { test, expect } from "@playwright/test";
import { EMOTION, EmotionType } from "@/commons/constants/enum";

test.describe("일기 페이지네이션 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 실제 데이터를 로컬스토리지에 설정
    const testDiaries = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      title: `일기 제목 ${index + 1}`,
      content: `일기 내용 ${index + 1}`,
      emotion: Object.keys(EMOTION)[
        index % Object.keys(EMOTION).length
      ] as EmotionType,
      createdAt: new Date(2024, 0, index + 1).toISOString(),
    }));

    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
  });

  test("페이지 로드 확인", async ({ page }) => {
    await page.goto("/diaries");

    // data-testid로 페이지 로드 확인 (networkidle 금지)
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 페이지 제목 확인
    await expect(page).toHaveTitle(/일기/);
  });

  test("한 페이지에 3행 4열로 총 12개의 일기카드가 노출되는지 확인", async ({
    page,
  }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 첫 페이지에 정확히 12개의 일기 카드가 있는지 확인
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(12);

    // 첫 페이지의 일기 카드 ID가 1-12인지 확인
    for (let i = 1; i <= 12; i++) {
      const card = page.locator(`[data-testid="diary-card-${i}"]`);
      await expect(card).toBeVisible();
    }
  });

  test("페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되는지 확인", async ({
    page,
  }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 페이지네이션 컴포넌트가 있는지 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // 페이지 번호들이 정확히 표시되는지 확인 (1, 2, 3 형태 - 25개 데이터로 3페이지)
    const pageNumbers = page.locator('[data-testid^="page-number-"]');
    const pageCount = await pageNumbers.count();
    expect(pageCount).toBe(3); // 25개 데이터로 3페이지

    // 각 페이지 번호가 정확히 표시되는지 확인
    for (let i = 1; i <= 3; i++) {
      const pageNumber = page.locator(`[data-testid="page-number-${i}"]`);
      await expect(pageNumber).toBeVisible();
    }
  });

  test("페이지번호 클릭 및 해당 페이지번호에 맞는 일기 컨텐츠목록 보여지는지 확인", async ({
    page,
  }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 두 번째 페이지로 이동
    const page2Button = page.locator('[data-testid="page-number-2"]');
    await expect(page2Button).toBeVisible();
    await page2Button.click();

    // 페이지 변경 후 로딩 대기
    await page.waitForSelector('[data-testid="diary-card-13"]', {
      timeout: 300,
    });

    // 두 번째 페이지의 일기 카드가 13-24번인지 확인
    for (let i = 13; i <= 24; i++) {
      const card = page.locator(`[data-testid="diary-card-${i}"]`);
      await expect(card).toBeVisible();
    }

    // 두 번째 페이지에 정확히 12개의 일기 카드가 있는지 확인
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(12);
  });

  test("검색결과 페이지네이션하기", async ({ page }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 1. 검색창에 검색어를 입력하여 검색
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("일기 제목 1");
    await searchInput.press("Enter");

    // 검색 결과 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 검색 결과에 맞는 일기 카드가 표시되는지 확인
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(1); // 정확히 1개의 검색 결과

    // 2. 검색 결과에 맞게 페이지 수가 변경되었는지 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // 검색 결과 페이지네이션 확인 (1개 결과이므로 1페이지)
    const pageNumbers = page.locator('[data-testid^="page-number-"]');
    const pageCount = await pageNumbers.count();
    expect(pageCount).toBe(1); // 검색 결과가 1개이므로 1페이지만 표시
  });

  test("필터결과 페이지네이션하기", async ({ page }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 1. 필터선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-select"]');
    await filterSelect.click();

    // 필터 옵션이 표시되는지 확인
    const filterOptions = page.locator('[data-testid^="filter-option-"]');
    await expect(filterOptions.first()).toBeVisible();

    // 2. 메뉴 선택시, 선택한 emotion과 일치하는 일기 카드들로 페이지 수가 변경되었는지 확인
    const happyOption = page.locator('[data-testid="filter-option-Happy"]');
    await expect(happyOption).toBeVisible();
    await happyOption.click();

    // 필터 적용 후 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 필터 결과에 맞는 일기 카드가 표시되는지 확인
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBeGreaterThan(0);

    // 필터 결과에 맞게 페이지 수가 변경되었는지 확인
    const pagination = page.locator('[data-testid="pagination"]');
    await expect(pagination).toBeVisible();

    // 필터 결과 페이지네이션 확인
    const pageNumbers = page.locator('[data-testid^="page-number-"]');
    const pageCount = await pageNumbers.count();
    expect(pageCount).toBeGreaterThan(0);
  });

  test("페이지네이션 경계값 테스트", async ({ page }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-card-1"]', {
      timeout: 300,
    });

    // 마지막 페이지로 이동
    const lastPageButton = page.locator('[data-testid="page-number-3"]'); // 25개 데이터로 3페이지
    await expect(lastPageButton).toBeVisible();
    await lastPageButton.click();

    // 페이지 변경 후 로딩 대기
    await page.waitForSelector('[data-testid="diary-card-25"]', {
      timeout: 300,
    });

    // 마지막 페이지의 일기 카드 수 확인 (25개 데이터의 마지막 페이지는 1개)
    const diaryCards = await page
      .locator('[data-testid^="diary-card-"]')
      .count();
    expect(diaryCards).toBe(1);

    // 마지막 페이지의 일기 카드가 25번인지 확인
    const lastCard = page.locator('[data-testid="diary-card-25"]');
    await expect(lastCard).toBeVisible();
  });

  test("빈 데이터 상태 처리", async ({ page }) => {
    // 빈 데이터로 로컬스토리지 설정
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.setItem("diaries", JSON.stringify([]));
    });

    await page.reload();

    // 빈 상태 메시지 확인
    const noResults = page.locator('[data-testid="no-results"]');
    await expect(noResults).toBeVisible();
  });
});
