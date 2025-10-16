import { test, expect } from "@playwright/test";

test.describe("일기 목록 바인딩 훅 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터를 로컬스토리지에 설정
    await page.goto("/diaries");

    await page.evaluate(() => {
      const testDiaries = [
        {
          id: 1,
          title: "첫 번째 일기 제목",
          content: "첫 번째 일기 내용입니다.",
          emotion: "Happy",
          createdAt: "2024. 07. 12",
        },
        {
          id: 2,
          title: "두 번째 일기 제목",
          content: "두 번째 일기 내용입니다.",
          emotion: "Sad",
          createdAt: "2024. 07. 13",
        },
        {
          id: 3,
          title: "세 번째 일기 제목",
          content: "세 번째 일기 내용입니다.",
          emotion: "Angry",
          createdAt: "2024. 07. 14",
        },
        {
          id: 4,
          title: "네 번째 일기 제목",
          content: "네 번째 일기 내용입니다.",
          emotion: "Surprise",
          createdAt: "2024. 07. 15",
        },
        {
          id: 5,
          title:
            "다섯 번째 일기 제목 - 매우 긴 제목이 있을 때 말줄임표로 처리되는지 확인하기 위한 긴 텍스트입니다",
          content: "다섯 번째 일기 내용입니다.",
          emotion: "Etc",
          createdAt: "2024. 07. 16",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });
  });

  test("일기 목록 페이지에 로컬스토리지 데이터가 정확히 바인딩된다", async ({
    page,
  }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 - data-testid로 식별 (timeout 없음)
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기 카드들이 표시되는지 확인 (5개)
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(5);
  });

  test("일기 카드에 제목이 정확히 바인딩된다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드의 제목 확인
    const firstCardTitle = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator('[class*="cardTitle"]');
    await expect(firstCardTitle).toContainText("첫 번째 일기 제목");

    // 두 번째 카드의 제목 확인
    const secondCardTitle = page
      .locator('[class*="diaryCard"]')
      .nth(1)
      .locator('[class*="cardTitle"]');
    await expect(secondCardTitle).toContainText("두 번째 일기 제목");
  });

  test("일기 카드에 감정 텍스트가 정확히 바인딩된다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드 - Happy -> 행복해요
    const firstCardEmotion = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator('[class*="emotionText"]');
    await expect(firstCardEmotion).toHaveText("행복해요");

    // 두 번째 카드 - Sad -> 슬퍼요
    const secondCardEmotion = page
      .locator('[class*="diaryCard"]')
      .nth(1)
      .locator('[class*="emotionText"]');
    await expect(secondCardEmotion).toHaveText("슬퍼요");

    // 세 번째 카드 - Angry -> 화나요
    const thirdCardEmotion = page
      .locator('[class*="diaryCard"]')
      .nth(2)
      .locator('[class*="emotionText"]');
    await expect(thirdCardEmotion).toHaveText("화나요");

    // 네 번째 카드 - Surprise -> 놀랐어요
    const fourthCardEmotion = page
      .locator('[class*="diaryCard"]')
      .nth(3)
      .locator('[class*="emotionText"]');
    await expect(fourthCardEmotion).toHaveText("놀랐어요");

    // 다섯 번째 카드 - Etc -> 기타
    const fifthCardEmotion = page
      .locator('[class*="diaryCard"]')
      .nth(4)
      .locator('[class*="emotionText"]');
    await expect(fifthCardEmotion).toHaveText("기타");
  });

  test("일기 카드에 작성일이 정확히 바인딩된다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드의 날짜 확인
    const firstCardDate = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator('[class*="dateText"]');
    await expect(firstCardDate).toHaveText("2024. 07. 12");

    // 두 번째 카드의 날짜 확인
    const secondCardDate = page
      .locator('[class*="diaryCard"]')
      .nth(1)
      .locator('[class*="dateText"]');
    await expect(secondCardDate).toHaveText("2024. 07. 13");
  });

  test("일기 카드에 감정에 맞는 이미지가 표시된다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 첫 번째 카드 - Happy 이미지
    const firstCardImage = page
      .locator('[class*="diaryCard"]')
      .first()
      .locator("img[alt='행복해요']");
    await expect(firstCardImage).toBeVisible();
    const firstSrc = await firstCardImage.getAttribute("src");
    expect(firstSrc).toContain("emotion-happy-m");

    // 두 번째 카드 - Sad 이미지
    const secondCardImage = page
      .locator('[class*="diaryCard"]')
      .nth(1)
      .locator("img[alt='슬퍼요']");
    await expect(secondCardImage).toBeVisible();
    const secondSrc = await secondCardImage.getAttribute("src");
    expect(secondSrc).toContain("emotion-sad-m");

    // 세 번째 카드 - Angry 이미지
    const thirdCardImage = page
      .locator('[class*="diaryCard"]')
      .nth(2)
      .locator("img[alt='화나요']");
    await expect(thirdCardImage).toBeVisible();
    const thirdSrc = await thirdCardImage.getAttribute("src");
    expect(thirdSrc).toContain("emotion-angry-m");
  });

  test("Mock 데이터가 제거되고 실제 로컬스토리지 데이터만 표시된다", async ({
    page,
  }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기 카드가 5개인지 확인 (로컬스토리지 데이터 개수)
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(5);

    // Mock 데이터에 있던 제목이 표시되지 않는지 확인
    const allTitles = await page
      .locator('[class*="cardTitle"]')
      .allTextContents();

    // Mock 데이터의 기본 제목 "타이틀 영역 입니다."가 없어야 함
    const hasMockTitle = allTitles.some((title) =>
      title.includes("타이틀 영역 입니다.")
    );
    expect(hasMockTitle).toBe(false);

    // 실제 데이터의 제목만 있어야 함
    const hasRealTitle = allTitles.some((title) =>
      title.includes("첫 번째 일기 제목")
    );
    expect(hasRealTitle).toBe(true);
  });

  test("로컬스토리지에 데이터가 없을 때 빈 목록이 표시된다", async ({
    page,
  }) => {
    // 로컬스토리지를 비우고 페이지 이동
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });
    await page.reload();

    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기 카드가 없어야 함
    const diaryCards = page.locator('[class*="diaryCard"]');
    await expect(diaryCards).toHaveCount(0);
  });

  test("긴 제목이 카드 사이즈를 넘어가지 않도록 처리된다", async ({ page }) => {
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 다섯 번째 카드의 제목 요소 (매우 긴 제목)
    const fifthCardTitle = page
      .locator('[class*="diaryCard"]')
      .nth(4)
      .locator('[class*="cardTitle"]');

    // 제목이 표시되는지 확인
    await expect(fifthCardTitle).toBeVisible();

    // CSS overflow 또는 text-overflow 속성이 적용되어 있는지 확인
    const titleElement = await fifthCardTitle.elementHandle();
    if (titleElement) {
      const textOverflow = await titleElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          overflow: styles.overflow,
          textOverflow: styles.textOverflow,
          whiteSpace: styles.whiteSpace,
        };
      });

      // text-overflow: ellipsis 또는 overflow: hidden이 적용되어야 함
      expect(
        textOverflow.textOverflow === "ellipsis" ||
          textOverflow.overflow === "hidden"
      ).toBe(true);
    }
  });
});
