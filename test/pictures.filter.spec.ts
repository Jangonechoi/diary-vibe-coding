import { test, expect } from "@playwright/test";

test.describe("강아지 사진 필터 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto("/pictures");

    // 페이지 로드 대기 - Filter 영역의 SelectBox Container로 식별
    await page.waitForSelector('[data-testid="pictures-filter-selectbox"]', {
      timeout: 2000,
    });
  });

  test("필터 선택박스가 올바르게 표시되어야 한다", async ({ page }) => {
    // 필터 선택박스가 표시되는지 확인
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await expect(filterSelectbox).toBeVisible({ timeout: 500 });

    // 필터 옵션들이 올바르게 표시되는지 확인
    await filterSelectbox.click();

    // 기본, 가로형, 세로형 옵션이 있는지 확인
    const defaultOption = page.locator('text="기본"');
    const horizontalOption = page.locator('text="가로형"');
    const verticalOption = page.locator('text="세로형"');

    await expect(defaultOption).toBeVisible({ timeout: 500 });
    await expect(horizontalOption).toBeVisible({ timeout: 500 });
    await expect(verticalOption).toBeVisible({ timeout: 500 });
  });

  test("기본 필터가 초기 선택되어야 한다", async ({ page }) => {
    // 기본 필터가 선택되어 있는지 확인
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await expect(filterSelectbox).toContainText("기본", { timeout: 500 });

    // 이미지 카드들이 기본 크기(640x640)로 표시되는지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    const firstImageCard = imageCards.first();

    await expect(firstImageCard).toBeVisible({ timeout: 2000 });

    // 이미지 카드의 크기가 640x640인지 확인
    const boundingBox = await firstImageCard.boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(640);
  });

  test("가로형 필터로 변경시 이미지 크기가 640x480으로 변경되어야 한다", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();

    // 가로형 옵션 선택
    const horizontalOption = page.locator('text="가로형"');
    await horizontalOption.click({ timeout: 500 });

    // 선택된 필터가 가로형인지 확인
    await expect(filterSelectbox).toContainText("가로형", { timeout: 500 });

    // 이미지 카드들의 크기가 640x480으로 변경되었는지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    const firstImageCard = imageCards.first();

    await expect(firstImageCard).toBeVisible({ timeout: 2000 });

    const boundingBox = await firstImageCard.boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(480);
  });

  test("세로형 필터로 변경시 이미지 크기가 480x640으로 변경되어야 한다", async ({
    page,
  }) => {
    // 필터 선택박스 클릭
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();

    // 세로형 옵션 선택
    const verticalOption = page.locator('text="세로형"');
    await verticalOption.click({ timeout: 500 });

    // 선택된 필터가 세로형인지 확인
    await expect(filterSelectbox).toContainText("세로형", { timeout: 500 });

    // 이미지 카드들의 크기가 480x640으로 변경되었는지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    const firstImageCard = imageCards.first();

    await expect(firstImageCard).toBeVisible({ timeout: 2000 });

    const boundingBox = await firstImageCard.boundingBox();
    expect(boundingBox?.width).toBe(480);
    expect(boundingBox?.height).toBe(640);
  });

  test("필터 변경시 모든 이미지 카드의 크기가 동시에 변경되어야 한다", async ({
    page,
  }) => {
    // 초기 상태에서 모든 이미지 카드가 640x640인지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    await expect(imageCards).toHaveCount(6, { timeout: 2000 });

    // 모든 이미지 카드의 크기 확인
    for (let i = 0; i < 6; i++) {
      const card = imageCards.nth(i);
      const boundingBox = await card.boundingBox();
      expect(boundingBox?.width).toBe(640);
      expect(boundingBox?.height).toBe(640);
    }

    // 가로형 필터로 변경
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();

    const horizontalOption = page.locator('text="가로형"');
    await horizontalOption.click({ timeout: 500 });

    // 모든 이미지 카드의 크기가 640x480으로 변경되었는지 확인
    for (let i = 0; i < 6; i++) {
      const card = imageCards.nth(i);
      const boundingBox = await card.boundingBox();
      expect(boundingBox?.width).toBe(640);
      expect(boundingBox?.height).toBe(480);
    }
  });

  test("필터 변경시 스플래시 스크린도 동일한 크기로 표시되어야 한다", async ({
    page,
  }) => {
    // 가로형 필터로 변경
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();

    const horizontalOption = page.locator('text="가로형"');
    await horizontalOption.click({ timeout: 500 });

    // 페이지를 새로고침하여 로딩 상태 확인
    await page.reload();

    // 스플래시 스크린이 640x480 크기로 표시되는지 확인
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    await expect(splashScreens).toHaveCount(6, { timeout: 500 });

    const firstSplashScreen = splashScreens.first();
    const boundingBox = await firstSplashScreen.boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(480);
  });

  test("연속으로 필터를 변경해도 올바르게 동작해야 한다", async ({ page }) => {
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    const imageCards = page.locator('[class*="imageCard"]');

    // 기본 -> 가로형
    await filterSelectbox.click();
    await page.locator('text="가로형"').click({ timeout: 500 });

    let boundingBox = await imageCards.first().boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(480);

    // 가로형 -> 세로형
    await filterSelectbox.click();
    await page.locator('text="세로형"').click({ timeout: 500 });

    boundingBox = await imageCards.first().boundingBox();
    expect(boundingBox?.width).toBe(480);
    expect(boundingBox?.height).toBe(640);

    // 세로형 -> 기본
    await filterSelectbox.click();
    await page.locator('text="기본"').click({ timeout: 500 });

    boundingBox = await imageCards.first().boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(640);
  });

  test("필터 변경시 이미지의 aspect ratio가 올바르게 유지되어야 한다", async ({
    page,
  }) => {
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    const imageCards = page.locator('[class*="imageCard"]');

    // 가로형 필터 선택
    await filterSelectbox.click();
    await page.locator('text="가로형"').click({ timeout: 500 });

    // 이미지 카드의 aspect ratio가 4:3 (640:480)인지 확인
    const firstCard = imageCards.first();
    const boundingBox = await firstCard.boundingBox();
    const aspectRatio = (boundingBox?.width || 0) / (boundingBox?.height || 1);
    expect(aspectRatio).toBeCloseTo(4 / 3, 1);

    // 세로형 필터 선택
    await filterSelectbox.click();
    await page.locator('text="세로형"').click({ timeout: 500 });

    // 이미지 카드의 aspect ratio가 3:4 (480:640)인지 확인
    const newBoundingBox = await firstCard.boundingBox();
    const newAspectRatio =
      (newBoundingBox?.width || 0) / (newBoundingBox?.height || 1);
    expect(newAspectRatio).toBeCloseTo(3 / 4, 1);
  });

  test("페이지 새로고침 후에도 필터 상태가 유지되어야 한다", async ({
    page,
  }) => {
    // 가로형 필터로 변경
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();
    await page.locator('text="가로형"').click({ timeout: 500 });

    // 필터가 가로형으로 설정되었는지 확인
    await expect(filterSelectbox).toContainText("가로형", { timeout: 500 });

    // 페이지 새로고침
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="pictures-filter-selectbox"]', {
      timeout: 2000,
    });

    // 새로고침 후에도 가로형 필터가 유지되는지 확인
    await expect(filterSelectbox).toContainText("가로형", { timeout: 500 });

    // 이미지 크기도 가로형 크기로 유지되는지 확인
    const imageCards = page.locator('[class*="imageCard"]');
    const firstImageCard = imageCards.first();
    await expect(firstImageCard).toBeVisible({ timeout: 2000 });

    const boundingBox = await firstImageCard.boundingBox();
    expect(boundingBox?.width).toBe(640);
    expect(boundingBox?.height).toBe(480);
  });

  test("필터 변경시 이미지 로딩 중에도 올바른 크기로 표시되어야 한다", async ({
    page,
  }) => {
    // 네트워크 속도를 느리게 설정하여 로딩 상태 확인
    await page.route("**/api/breeds/image/random/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연
      await route.continue();
    });

    // 가로형 필터로 변경
    const filterSelectbox = page.locator(
      '[data-testid="pictures-filter-selectbox"]'
    );
    await filterSelectbox.click();
    await page.locator('text="가로형"').click({ timeout: 500 });

    // 로딩 중 스플래시 스크린이 가로형 크기로 표시되는지 확인
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    if ((await splashScreens.count()) > 0) {
      const firstSplashScreen = splashScreens.first();
      const boundingBox = await firstSplashScreen.boundingBox();
      expect(boundingBox?.width).toBe(640);
      expect(boundingBox?.height).toBe(480);
    }
  });
});
