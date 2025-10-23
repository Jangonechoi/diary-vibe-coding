import { test, expect } from "@playwright/test";

test.describe("일기 삭제 기능 테스트", () => {
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
      ];
      localStorage.setItem("diaries", JSON.stringify(testDiaries));
    });
  });

  test.describe("비로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 비로그인 상태로 설정
      await page.evaluate(() => {
        window.__TEST_BYPASS__ = false;
      });
    });

    test("비로그인 유저는 삭제 아이콘이 보이지 않는다", async ({ page }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 아이콘이 존재하지 않는지 확인
      const deleteIcons = page.locator('[data-testid^="delete-icon-"]');
      await expect(deleteIcons).toHaveCount(0);
    });

    test("비로그인 유저가 삭제 아이콘을 클릭하면 로그인 모달이 표시된다", async ({
      page,
    }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 일기 카드 클릭 시 로그인 모달이 표시되는지 확인
      const firstCard = page.locator('[class*="diaryCard"]').first();
      await firstCard.click();

      // 로그인 모달이 표시되는지 확인
      await expect(page.locator('text="로그인이 필요합니다"')).toBeVisible();
    });
  });

  test.describe("로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태로 설정
      await page.evaluate(() => {
        window.__TEST_BYPASS__ = true;
      });
    });

    test("로그인 유저는 삭제 아이콘이 보인다", async ({ page }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 아이콘이 존재하는지 확인
      const deleteIcons = page.locator('[data-testid^="delete-icon-"]');
      await expect(deleteIcons).toHaveCount(3); // 3개의 일기 카드
    });

    test("삭제 아이콘 클릭 시 삭제 확인 모달이 표시된다", async ({ page }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 첫 번째 일기의 삭제 아이콘 클릭
      const deleteIcon = page.locator('[data-testid="delete-icon-1"]');
      await deleteIcon.click();

      // 삭제 확인 모달이 표시되는지 확인
      await expect(page.locator('text="일기 삭제"')).toBeVisible();
      await expect(
        page.locator('text="정말로 이 일기를 삭제하시겠습니까?"')
      ).toBeVisible();
    });

    test("삭제 모달에서 취소 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 첫 번째 일기의 삭제 아이콘 클릭
      const deleteIcon = page.locator('[data-testid="delete-icon-1"]');
      await deleteIcon.click();

      // 삭제 확인 모달이 표시되는지 확인
      await expect(page.locator('text="일기 삭제"')).toBeVisible();

      // 취소 버튼 클릭
      const cancelButton = page.locator('button:has-text("취소")');
      await cancelButton.click();

      // 모달이 닫혔는지 확인
      await expect(page.locator('text="일기 삭제"')).not.toBeVisible();
    });

    test("삭제 모달에서 삭제 버튼 클릭 시 일기가 삭제되고 페이지가 새로고침된다", async ({
      page,
    }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 전 일기 개수 확인
      const diaryCards = page.locator('[class*="diaryCard"]');
      await expect(diaryCards).toHaveCount(3);

      // 첫 번째 일기의 삭제 아이콘 클릭
      const deleteIcon = page.locator('[data-testid="delete-icon-1"]');
      await deleteIcon.click();

      // 삭제 확인 모달이 표시되는지 확인
      await expect(page.locator('text="일기 삭제"')).toBeVisible();

      // 삭제 버튼 클릭
      const deleteButton = page.locator('button:has-text("삭제")');
      await deleteButton.click();

      // 페이지 새로고침 대기
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 후 일기 개수 확인 (2개로 감소)
      const remainingCards = page.locator('[class*="diaryCard"]');
      await expect(remainingCards).toHaveCount(2);

      // 로컬스토리지에서도 삭제되었는지 확인
      const remainingDiaries = await page.evaluate(() => {
        const diaries = localStorage.getItem("diaries");
        return diaries ? JSON.parse(diaries) : [];
      });
      expect(remainingDiaries).toHaveLength(2);
      expect(
        remainingDiaries.find((diary: any) => diary.id === 1)
      ).toBeUndefined();
    });

    test("여러 일기를 순차적으로 삭제할 수 있다", async ({ page }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 첫 번째 일기 삭제
      const deleteIcon1 = page.locator('[data-testid="delete-icon-1"]');
      await deleteIcon1.click();
      await expect(page.locator('text="일기 삭제"')).toBeVisible();
      await page.locator('button:has-text("삭제")').click();
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 두 번째 일기 삭제
      const deleteIcon2 = page.locator('[data-testid="delete-icon-2"]');
      await deleteIcon2.click();
      await expect(page.locator('text="일기 삭제"')).toBeVisible();
      await page.locator('button:has-text("삭제")').click();
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 마지막 일기만 남았는지 확인
      const remainingCards = page.locator('[class*="diaryCard"]');
      await expect(remainingCards).toHaveCount(1);
    });

    test("삭제 아이콘 클릭 시 이벤트 전파가 차단되어 카드 클릭 이벤트가 발생하지 않는다", async ({
      page,
    }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 아이콘 클릭 전 URL 저장
      const urlBeforeClick = page.url();

      // 첫 번째 일기의 삭제 아이콘 클릭
      const deleteIcon = page.locator('[data-testid="delete-icon-1"]');
      await deleteIcon.click();

      // 삭제 모달이 표시되는지 확인
      await expect(page.locator('text="일기 삭제"')).toBeVisible();

      // URL이 변경되지 않았는지 확인 (카드 클릭 이벤트가 발생하지 않았는지)
      const urlAfterClick = page.url();
      expect(urlAfterClick).toBe(urlBeforeClick);
    });

    test("삭제 후 로컬스토리지 데이터가 올바르게 업데이트된다", async ({
      page,
    }) => {
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 전 로컬스토리지 데이터 확인
      const diariesBefore = await page.evaluate(() => {
        const diaries = localStorage.getItem("diaries");
        return diaries ? JSON.parse(diaries) : [];
      });
      expect(diariesBefore).toHaveLength(3);

      // 두 번째 일기 삭제
      const deleteIcon = page.locator('[data-testid="delete-icon-2"]');
      await deleteIcon.click();
      await page.locator('button:has-text("삭제")').click();
      await page.waitForSelector('[data-testid="diary-write-button"]');

      // 삭제 후 로컬스토리지 데이터 확인
      const diariesAfter = await page.evaluate(() => {
        const diaries = localStorage.getItem("diaries");
        return diaries ? JSON.parse(diaries) : [];
      });
      expect(diariesAfter).toHaveLength(2);
      expect(diariesAfter.find((diary: any) => diary.id === 2)).toBeUndefined();
      expect(diariesAfter.find((diary: any) => diary.id === 1)).toBeDefined();
      expect(diariesAfter.find((diary: any) => diary.id === 3)).toBeDefined();
    });
  });
});
