import { test, expect } from "@playwright/test";

test.describe("일기 수정 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 테스트용 일기 데이터 설정
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용입니다.",
      emotion: "Happy",
      createdAt: "2024-01-01T00:00:00.000Z",
    };

    // 로컬스토리지에 테스트 데이터 저장
    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // 일기 상세 페이지로 이동
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');
  });

  test("일기 상세 페이지 로드 확인", async ({ page }) => {
    // 페이지 로드 확인
    await expect(
      page.locator('[data-testid="diary-detail-container"]')
    ).toBeVisible();

    // 일기 제목 확인
    await expect(page.locator("h1")).toContainText("테스트 일기");

    // 일기 내용 확인
    await expect(page.locator(".contentText")).toContainText(
      "테스트 내용입니다."
    );

    // 감정 표시 확인
    await expect(page.locator(".emotionText")).toContainText("행복해요");
  });

  test("수정 버튼 클릭 시 수정 모드로 전환", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 수정 모드 UI 확인
    await expect(page.locator("text=오늘 기분은 어땟나요?")).toBeVisible();
    await expect(page.locator("text=제목")).toBeVisible();
    await expect(page.locator("text=내용")).toBeVisible();

    // 기존 데이터가 폼에 채워져 있는지 확인
    await expect(page.locator('input[value="테스트 일기"]')).toBeVisible();
    await expect(page.locator("textarea")).toContainText("테스트 내용입니다.");
  });

  test("수정 중일 때 회고 입력창 비활성화", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 회고 입력창이 비활성화되어 있는지 확인
    await expect(
      page.locator("text=수정중일땐 회고를 작성할 수 없어요.")
    ).toBeVisible();

    // 회고 입력 버튼이 비활성화되어 있는지 확인
    const retrospectButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(retrospectButton).toBeDisabled();
  });

  test("일기 수정 완료", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 제목 수정
    await page.fill('input[value="테스트 일기"]', "수정된 제목");

    // 내용 수정
    await page.fill("textarea", "수정된 내용입니다.");

    // 감정 변경 (슬퍼요로)
    await page.click("text=슬퍼요");

    // 수정하기 버튼 클릭
    await page.click('[data-testid="update-submit-button"]');

    // 수정 완료 후 원래 화면으로 돌아가는지 확인
    await expect(page.locator("h1")).toContainText("수정된 제목");
    await expect(page.locator(".contentText")).toContainText(
      "수정된 내용입니다."
    );
    await expect(page.locator(".emotionText")).toContainText("슬퍼요");
  });

  test("수정 취소", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 제목 수정
    await page.fill('input[value="테스트 일기"]', "수정 시도");

    // 취소 버튼 클릭
    await page.click('[data-testid="update-cancel-button"]');

    // 원래 데이터로 돌아가는지 확인
    await expect(page.locator("h1")).toContainText("테스트 일기");
    await expect(page.locator(".contentText")).toContainText(
      "테스트 내용입니다."
    );
  });

  test("폼 검증 - 제목 필수 입력", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 제목을 비우기
    await page.fill('input[value="테스트 일기"]', "");

    // 수정하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="update-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("폼 검증 - 내용 필수 입력", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 내용을 비우기
    await page.fill("textarea", "");

    // 수정하기 버튼이 비활성화되어 있는지 확인
    const submitButton = page.locator('[data-testid="update-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("감정 선택 변경", async ({ page }) => {
    // 수정 버튼 클릭
    await page.click('[data-testid="edit-button"]');

    // 다른 감정 선택
    await page.click("text=화나요");

    // 선택된 감정이 변경되었는지 확인
    const selectedEmotion = page.locator('input[type="radio"]:checked');
    await expect(selectedEmotion).toHaveValue("Angry");
  });
});
