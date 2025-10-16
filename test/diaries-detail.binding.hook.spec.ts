import { test, expect } from "@playwright/test";

test.describe("일기 상세 바인딩 훅 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터를 로컬스토리지에 설정
    await page.goto("/diaries");

    await page.evaluate(() => {
      const testDiaries = [
        {
          id: 1,
          title: "첫 번째 일기",
          content:
            "이것은 첫 번째 일기의 내용입니다. 오늘은 정말 좋은 날씨였어요. 친구들과 함께 공원에서 시간을 보냈고, 매우 즐거웠습니다.",
          emotion: "Happy",
          createdAt: "2024. 07. 12",
        },
        {
          id: 2,
          title: "두 번째 일기",
          content:
            "이것은 두 번째 일기의 내용입니다. 오늘은 조금 슬펐어요. 생각이 많은 하루였던 것 같습니다.",
          emotion: "Sad",
          createdAt: "2024. 07. 13",
        },
        {
          id: 3,
          title: "세 번째 일기",
          content: "이것은 세 번째 일기의 내용입니다. 오늘 정말 화났어요.",
          emotion: "Angry",
          createdAt: "2024. 07. 14",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });
  });

  test("ID가 1인 일기가 상세 페이지에서 정확히 바인딩된다", async ({
    page,
  }) => {
    // /diaries/1 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-detail-container"]', {
      timeout: 500,
    });

    // 제목 확인
    const title = page.locator("h1.typo-headline-headline02");
    await expect(title).toHaveText("첫 번째 일기");

    // 감정 텍스트 확인
    const emotionText = page.locator(".typo-headline-headline03");
    await expect(emotionText).toHaveText("행복해요");

    // 작성 날짜 확인
    const dateText = page.locator("span.typo-body-body02-regular");
    await expect(dateText).toContainText("2024. 07. 12");

    // 내용 확인
    const contentText = page.locator(".typo-body-body01-medium");
    await expect(contentText).toContainText("이것은 첫 번째 일기의 내용입니다");
  });

  test("ID가 2인 일기가 상세 페이지에서 정확히 바인딩된다", async ({
    page,
  }) => {
    // /diaries/2 페이지로 이동
    await page.goto("/diaries/2");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', {
      timeout: 500,
    });

    // 제목 확인
    const title = page.locator("h1.typo-headline-headline02");
    await expect(title).toHaveText("두 번째 일기");

    // 감정 텍스트 확인
    const emotionText = page.locator(".typo-headline-headline03");
    await expect(emotionText).toHaveText("슬퍼요");

    // 작성 날짜 확인
    const dateText = page.locator("span.typo-body-body02-regular");
    await expect(dateText).toContainText("2024. 07. 13");
  });

  test("ID가 3인 일기의 감정이 '화나요'로 정확히 바인딩된다", async ({
    page,
  }) => {
    // /diaries/3 페이지로 이동
    await page.goto("/diaries/3");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', {
      timeout: 500,
    });

    // 감정 텍스트 확인
    const emotionText = page.locator(".typo-headline-headline03");
    await expect(emotionText).toHaveText("화나요");

    // 감정 이미지 확인
    const emotionImage = page.locator("img[alt='화나요']");
    await expect(emotionImage).toBeVisible();
  });

  test("존재하지 않는 ID로 접근하면 페이지가 적절히 처리한다", async ({
    page,
  }) => {
    // /diaries/999 페이지로 이동
    await page.goto("/diaries/999");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', {
      timeout: 500,
    });

    // Mock 데이터가 아닌 다른 데이터가 표시되지 않음을 확인
    // (로컬스토리지에 ID 999인 데이터가 없으므로)
    const title = page.locator("h1.typo-headline-headline02");

    // 제목이 "이것은 타이틀 입니다."(mock)가 아닌지 확인
    const titleText = await title.textContent();
    expect(titleText).not.toBe("이것은 타이틀 입니다.");
  });

  test("여러 일기 중 특정 ID의 일기만 정확히 바인딩된다", async ({ page }) => {
    // /diaries/2 페이지로 이동
    await page.goto("/diaries/2");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]', {
      timeout: 500,
    });

    // 제목이 "두 번째 일기"임을 확인
    const title = page.locator("h1.typo-headline-headline02");
    await expect(title).toHaveText("두 번째 일기");

    // 내용이 두 번째 일기의 내용임을 확인
    const contentText = page.locator(".typo-body-body01-medium");
    await expect(contentText).toContainText("이것은 두 번째 일기의 내용입니다");

    // 첫 번째 일기의 내용이 표시되지 않음을 확인
    await expect(contentText).not.toContainText(
      "이것은 첫 번째 일기의 내용입니다"
    );
  });
});
