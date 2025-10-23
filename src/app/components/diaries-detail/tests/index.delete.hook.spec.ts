import { test, expect } from "@playwright/test";

test.describe("일기 삭제 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiaries = [
      {
        id: 1,
        title: "테스트 일기 1",
        content: "테스트 내용 1",
        emotion: "Happy",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        title: "테스트 일기 2",
        content: "테스트 내용 2",
        emotion: "Sad",
        createdAt: "2024-01-02T00:00:00.000Z",
      },
    ];

    // 로컬스토리지에 테스트 데이터 설정
    await page.addInitScript((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
  });

  test("일기 삭제 모달 열기 및 취소", async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 삭제 버튼 클릭
    await page.click('button:has-text("삭제")');

    // 삭제 모달이 나타나는지 확인
    await expect(page.locator("text=일기 삭제")).toBeVisible();
    await expect(page.locator("text=일기를 삭제 하시겠어요?")).toBeVisible();

    // 취소 버튼 클릭
    await page.click('button:has-text("취소")');

    // 모달이 닫혔는지 확인
    await expect(page.locator("text=일기 삭제")).not.toBeVisible();

    // 일기 상세 페이지에 그대로 있는지 확인
    await expect(
      page.locator('[data-testid="diary-detail-container"]')
    ).toBeVisible();
  });

  test("일기 삭제 확인", async ({ page }) => {
    // 일기 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 삭제 버튼 클릭
    await page.click('button:has-text("삭제")');

    // 삭제 모달이 나타나는지 확인
    await expect(page.locator("text=일기 삭제")).toBeVisible();

    // 삭제 버튼 클릭
    await page.click('button:has-text("삭제")');

    // 일기 목록 페이지로 이동하는지 확인
    await page.waitForURL("/diaries");
    await expect(page.url()).toContain("/diaries");

    // 로컬스토리지에서 해당 일기가 삭제되었는지 확인
    const remainingDiaries = await page.evaluate(() => {
      const stored = localStorage.getItem("diaries");
      return stored ? JSON.parse(stored) : [];
    });

    // ID가 1인 일기가 삭제되었는지 확인
    const deletedDiary = remainingDiaries.find(
      (diary: { id: number }) => diary.id === 1
    );
    expect(deletedDiary).toBeUndefined();

    // 남은 일기는 1개여야 함
    expect(remainingDiaries).toHaveLength(1);
    expect(remainingDiaries[0].id).toBe(2);
  });

  test("존재하지 않는 일기 삭제 시도", async ({ page }) => {
    // 존재하지 않는 일기 ID로 접근
    await page.goto("/diaries/999");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // "일기를 찾을 수 없습니다" 메시지가 표시되는지 확인
    await expect(page.locator("text=일기를 찾을 수 없습니다")).toBeVisible();
  });
});
