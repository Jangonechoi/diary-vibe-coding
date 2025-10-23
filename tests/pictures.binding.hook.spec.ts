import { test, expect } from "@playwright/test";

test.describe("사진 목록 바인딩 훅 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto("/pictures");
  });

  test("페이지 로드 시 강아지 사진 API를 호출하고 6개의 이미지가 표시된다", async ({
    page,
  }) => {
    // 페이지 로드 대기 - Filter 영역의 SelectBox Container로 식별
    await page.waitForSelector('[class*="selectboxContainer"]', {
      timeout: 2000,
    });

    // 이미지 카드가 6개 표시되는지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    await expect(imageCards).toHaveCount(6, { timeout: 2000 });
  });

  test("API로부터 받은 강아지 사진 주소에 dog.ceo가 포함되어 있다", async ({
    page,
  }) => {
    await page.waitForSelector('[class*="selectboxContainer"]', {
      timeout: 2000,
    });

    // 첫 번째 이미지 카드 내의 img 태그 확인
    const firstImage = page
      .locator('[class*="imageCard"]')
      .first()
      .locator("img");

    await expect(firstImage).toBeVisible({ timeout: 2000 });

    // src 속성이 dog.ceo를 포함하는지 확인
    const src = await firstImage.getAttribute("src");
    expect(src).toContain("dog.ceo");
  });

  test("로딩 중에는 6개의 스플래시 스크린이 표시된다", async ({ page }) => {
    // API를 더 느리게 만들어서 로딩 상태를 확실히 캡처
    await page.route("**/breeds/image/random/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      route.continue();
    });

    // 페이지로 이동하자마자 스플래시 스크린 확인
    const loadingPromise = page.goto("/pictures");

    // 스플래시 스크린이 표시되는지 확인 (data-testid 사용)
    const splashScreens = page.locator('[data-testid="splash-screen"]');

    // 스플래시 스크린이 6개인지 확인 (더 긴 대기 시간)
    await expect(splashScreens).toHaveCount(6, { timeout: 5000 });

    await loadingPromise;
  });

  test("스크롤 시 추가 강아지 사진을 요청하여 바인딩한다", async ({ page }) => {
    await page.waitForSelector('[class*="selectboxContainer"]', {
      timeout: 2000,
    });

    // 초기 6개 이미지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    await expect(imageCards).toHaveCount(6, { timeout: 2000 });

    // 마지막에서 2번째 이미지로 스크롤
    const fourthImage = imageCards.nth(4);
    await fourthImage.scrollIntoViewIfNeeded();

    // 추가 이미지가 로드될 때까지 대기 (6개 초과)
    await expect(imageCards).toHaveCount(12, { timeout: 2000 });
  });

  test("무한 스크롤로 여러 번 스크롤하면 계속 이미지가 추가된다", async ({
    page,
  }) => {
    await page.waitForSelector('[class*="selectboxContainer"]', {
      timeout: 2000,
    });

    // 초기 6개 확인
    const imageCards = page.locator('[class*="imageCard"]');
    await expect(imageCards).toHaveCount(6, { timeout: 2000 });

    // 첫 번째 스크롤
    await imageCards.nth(4).scrollIntoViewIfNeeded();
    await expect(imageCards).toHaveCount(12, { timeout: 2000 });

    // 두 번째 스크롤
    await imageCards.nth(10).scrollIntoViewIfNeeded();
    await expect(imageCards).toHaveCount(18, { timeout: 2000 });
  });

  test("API 요청 실패 시 에러 상태를 표시한다", async ({ page }) => {
    // API 요청을 차단하여 실패 시나리오 생성
    await page.route("**/breeds/image/random/**", (route) => {
      route.abort();
    });

    await page.goto("/pictures");

    // 에러 메시지가 표시될 때까지 대기
    const errorElement = page.locator('[data-testid="error-message"]');
    await expect(errorElement).toBeVisible({ timeout: 3000 });
  });

  test("Mock 데이터가 제거되고 실제 API 데이터만 표시된다", async ({
    page,
  }) => {
    await page.waitForSelector('[class*="selectboxContainer"]', {
      timeout: 2000,
    });

    // 이미지 카드의 img 태그들을 모두 가져오기
    const images = page.locator('[class*="imageCard"] img');

    // 이미지가 로드될 때까지 대기
    await expect(images).toHaveCount(6, { timeout: 2000 });

    const count = await images.count();

    // 최소 6개의 이미지가 있어야 함
    expect(count).toBeGreaterThanOrEqual(6);

    // 모든 이미지 src가 /images/dog-1.jpg가 아닌지 확인 (Mock 데이터)
    for (let i = 0; i < Math.min(count, 6); i++) {
      const src = await images.nth(i).getAttribute("src");
      expect(src).not.toContain("/images/dog-1.jpg");
      expect(src).toContain("dog.ceo");
    }
  });
});
