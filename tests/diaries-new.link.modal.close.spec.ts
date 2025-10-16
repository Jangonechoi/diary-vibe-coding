import { test, expect } from "@playwright/test";

test.describe("일기쓰기 모달 닫기 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      timeout: 5000,
    });

    // 일기쓰기 버튼 클릭하여 일기쓰기 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click({ force: true });

    // 일기쓰기 모달이 열렸는지 확인 (timeout: 500ms 미만)
    await expect(page.locator("text=일기 쓰기")).toBeVisible({ timeout: 400 });
  });

  test("닫기 버튼 클릭 시 등록취소 확인 모달(자식)이 중첩 모달로 열린다", async ({
    page,
  }) => {
    // 일기쓰기 모달의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await expect(closeButton).toBeVisible();
    await closeButton.click({ force: true });

    // 등록취소 확인 모달이 중첩 모달로 열렸는지 확인 (timeout: 500ms 미만)
    const cancelModal = page.locator("text=등록 취소");
    await expect(cancelModal).toBeVisible({ timeout: 400 });

    // 확인 메시지가 표시되는지 확인
    const cancelMessage = page.locator(
      "text=작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?"
    );
    await expect(cancelMessage).toBeVisible();

    // 계속작성 버튼이 표시되는지 확인
    const continueButton = page.locator('button:has-text("계속작성")');
    await expect(continueButton).toBeVisible();

    // 등록취소 버튼이 표시되는지 확인
    const confirmCancelButton = page.locator('button:has-text("등록취소")');
    await expect(confirmCancelButton).toBeVisible();

    // 중첩 모달이므로 일기쓰기 모달도 여전히 DOM에 존재하는지 확인
    const writeModalHeader = page.locator("text=일기 쓰기");
    await expect(writeModalHeader).toBeAttached();
  });

  test("등록취소 확인 모달의 계속작성 버튼 클릭 시 등록취소 모달(자식)만 닫힌다", async ({
    page,
  }) => {
    // 일기쓰기 모달의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await closeButton.click({ force: true });

    // 등록취소 확인 모달이 열렸는지 확인
    await expect(page.locator("text=등록 취소")).toBeVisible({ timeout: 400 });

    // 계속작성 버튼 클릭
    const continueButton = page.locator('button:has-text("계속작성")');
    await continueButton.click({ force: true });

    // 등록취소 확인 모달(자식)이 닫혔는지 확인 (timeout: 500ms 미만)
    await expect(page.locator("text=등록 취소")).not.toBeVisible({
      timeout: 400,
    });

    // 일기쓰기 모달(부모)은 여전히 열려있는지 확인
    const writeModalHeader = page.locator("text=일기 쓰기");
    await expect(writeModalHeader).toBeVisible();

    // 일기쓰기 모달의 닫기 버튼이 여전히 보이는지 확인
    await expect(closeButton).toBeVisible();
  });

  test("등록취소 확인 모달의 등록취소 버튼 클릭 시 등록취소 모달(자식)과 일기쓰기 모달(부모) 모두 닫힌다", async ({
    page,
  }) => {
    // 일기쓰기 모달의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await closeButton.click({ force: true });

    // 등록취소 확인 모달이 열렸는지 확인
    await expect(page.locator("text=등록 취소")).toBeVisible({ timeout: 400 });

    // 등록취소 버튼 클릭
    const confirmCancelButton = page.locator('button:has-text("등록취소")');
    await confirmCancelButton.click({ force: true });

    // 등록취소 확인 모달(자식)이 닫혔는지 확인 (timeout: 500ms 미만)
    await expect(page.locator("text=등록 취소")).not.toBeVisible({
      timeout: 400,
    });

    // 일기쓰기 모달(부모)도 닫혔는지 확인
    const writeModalHeader = page.locator("text=일기 쓰기");
    await expect(writeModalHeader).not.toBeVisible();

    // /diaries 페이지로 돌아왔는지 확인 (일기쓰기 버튼이 다시 보임)
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await expect(writeButton).toBeVisible();
  });

  test("중첩 모달의 backdrop이 각각 독립적으로 쌓인다", async ({ page }) => {
    // 일기쓰기 모달의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await closeButton.click({ force: true });

    // 등록취소 확인 모달이 열렸는지 확인
    await expect(page.locator("text=등록 취소")).toBeVisible({ timeout: 400 });

    // CSS로 backdrop 요소들을 찾기 (modalProvider의 backdrop 클래스)
    // 중첩 모달이므로 2개의 backdrop이 있어야 함
    const backdrops = page.locator('[class*="backdrop"]');
    const backdropCount = await backdrops.count();

    // 최소 2개 이상의 backdrop이 있어야 함 (일기쓰기 모달 + 등록취소 모달)
    expect(backdropCount).toBeGreaterThanOrEqual(2);
  });

  test("중첩 모달에서 바깥쪽 backdrop 클릭 시 최상위 모달(자식)만 닫힌다", async ({
    page,
  }) => {
    // 일기쓰기 모달의 닫기 버튼 클릭
    const closeButton = page.locator('button:has-text("닫기")');
    await closeButton.click({ force: true });

    // 등록취소 확인 모달이 열렸는지 확인
    await expect(page.locator("text=등록 취소")).toBeVisible({ timeout: 400 });

    // 최상위 모달 overlay를 찾아서 backdrop 영역 클릭
    // modalOverlay의 첫 번째 자식이 backdrop이므로, backdrop을 직접 찾아서 클릭
    const overlays = page.locator('[class*="modalOverlay"]');
    const overlayCount = await overlays.count();

    // 최상위 overlay (마지막 overlay)에서 backdrop을 클릭
    if (overlayCount > 0) {
      const topOverlay = overlays.nth(overlayCount - 1);
      // overlay를 클릭하면 closeModal이 호출됨 (overlay의 onClick)
      await topOverlay.click({ position: { x: 10, y: 10 } });
    }

    // 등록취소 확인 모달(자식)이 닫혔는지 확인 (timeout: 500ms 미만)
    await expect(page.locator("text=등록 취소")).not.toBeVisible({
      timeout: 400,
    });

    // 일기쓰기 모달(부모)은 여전히 열려있는지 확인
    const writeModalHeader = page.locator("text=일기 쓰기");
    await expect(writeModalHeader).toBeVisible();
  });
});
