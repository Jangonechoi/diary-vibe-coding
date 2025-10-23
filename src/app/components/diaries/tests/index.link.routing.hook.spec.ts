import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

// 테스트 환경을 위한 전역 타입 선언
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

test.describe("일기 목록 라우팅 훅 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터를 로컬스토리지에 설정
    await page.goto("/diaries");

    await page.evaluate(() => {
      // 테스트 환경에서 로그인 상태로 설정
      window.__TEST_BYPASS__ = true;

      const testDiaries = [
        {
          id: 1,
          title: "첫 번째 일기 제목",
          content: "첫 번째 일기 내용입니다.",
          emotion: "Happy" as EmotionType,
          createdAt: "2024. 07. 12",
        },
        {
          id: 2,
          title: "두 번째 일기 제목",
          content: "두 번째 일기 내용입니다.",
          emotion: "Sad" as EmotionType,
          createdAt: "2024. 07. 13",
        },
        {
          id: 3,
          title: "세 번째 일기 제목",
          content: "세 번째 일기 내용입니다.",
          emotion: "Angry" as EmotionType,
          createdAt: "2024. 07. 14",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });
  });

  test("일기 카드 클릭 시 해당 일기 상세 페이지(/diaries/[id])로 이동한다", async ({
    page,
  }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 일기 카드 클릭
    const firstCard = page.locator('[class*="diaryCard"]').first();
    await firstCard.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("두 번째 일기 카드 클릭 시 해당 ID의 상세 페이지로 이동한다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 두 번째 일기 카드 클릭
    const secondCard = page.locator('[class*="diaryCard"]').nth(1);
    await secondCard.click();

    // URL이 /diaries/2로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/2");
  });

  test("세 번째 일기 카드 클릭 시 해당 ID의 상세 페이지로 이동한다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 세 번째 일기 카드 클릭
    const thirdCard = page.locator('[class*="diaryCard"]').nth(2);
    await thirdCard.click();

    // URL이 /diaries/3으로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/3");
  });

  test("일기 카드에 cursor: pointer 스타일이 적용되어 있다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드의 cursor 스타일 확인
    const firstCard = page.locator('[class*="diaryCard"]').first();
    const cursorStyle = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });

    expect(cursorStyle).toBe("pointer");
  });

  test("삭제 아이콘 클릭 시 페이지 이동하지 않는다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 삭제 아이콘 클릭 전 URL 저장
    const urlBeforeClick = page.url();
    expect(urlBeforeClick).toContain("/diaries");

    // 첫 번째 카드의 삭제 아이콘 클릭
    const deleteIcon = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator('[class*="closeIcon"]');

    await deleteIcon.click();

    // URL이 변경되지 않았는지 즉시 확인
    const urlAfterClick = page.url();
    expect(urlAfterClick).toBe(urlBeforeClick);

    // 추가 검증: 여전히 /diaries 페이지에 있는지 확인
    await expect(page).toHaveURL(/\/diaries$/);
  });

  test("일기 카드의 다른 영역 클릭 시에도 페이지 이동한다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드의 제목 영역 클릭
    const firstCardTitle = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator('[class*="cardTitle"]');

    await firstCardTitle.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("일기 카드의 이미지 영역 클릭 시에도 페이지 이동한다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 두 번째 카드의 이미지 영역 클릭
    const secondCardImage = page
      .locator('[class*="diaryCard"]')
      .nth(1)
      .locator('[class*="cardImage"]');

    await secondCardImage.click();

    // URL이 /diaries/2로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/2");
  });

  test("여러 일기 카드를 순차적으로 클릭해도 각각 올바른 페이지로 이동한다", async ({
    page,
  }) => {
    // 첫 번째 카드 클릭
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    const firstCard = page.locator('[class*="diaryCard"]').first();
    await firstCard.click();
    await expect(page).toHaveURL("/diaries/1");

    // 뒤로가기
    await page.goBack();
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      timeout: 500,
    });

    // 세 번째 카드 클릭
    const thirdCard = page.locator('[class*="diaryCard"]').nth(2);
    await thirdCard.click();
    await expect(page).toHaveURL("/diaries/3");
  });

  test("비로그인 사용자 - 일기 카드 클릭 시 로그인 요청 모달 노출", async ({
    page,
  }) => {
    // 테스트 환경에서 비회원 가드 테스트를 위해 window.__TEST_BYPASS__를 false로 설정
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = false;
    });

    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 일기 카드 클릭
    const firstCard = page.locator('[class*="diaryCard"]').first();
    await firstCard.click();

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
});
