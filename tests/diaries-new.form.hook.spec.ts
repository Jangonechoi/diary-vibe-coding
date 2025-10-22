import { test, expect } from "@playwright/test";

test.describe("일기쓰기 폼 등록 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 - data-testid로 식별
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      timeout: 2000,
    });

    // 일기쓰기 버튼 클릭하여 일기쓰기 모달 열기
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click({ force: true });

    // 일기쓰기 모달이 열렸는지 확인 (timeout: 500ms 미만)
    await expect(page.locator("text=일기 쓰기")).toBeVisible({ timeout: 400 });
  });

  test("모든 인풋이 입력되면 등록하기 버튼이 활성화된다", async ({ page }) => {
    // 제목 입력
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("오늘의 일기");

    // 내용 입력
    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("오늘은 좋은 날씨였어요.");

    // 감정 선택 (기본값은 Happy이므로 이미 선택됨)
    // 등록하기 버튼 확인 - 활성화 상태
    const submitButton = page.locator('button:has-text("등록하기")');
    await expect(submitButton).toBeEnabled();
  });

  test("등록하기 버튼 클릭 시 로컬스토리지에 새로운 일기가 저장된다", async ({
    page,
  }) => {
    // 초기 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    // 제목 입력
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("첫번째 일기");

    // 내용 입력
    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("첫번째 일기의 내용입니다.");

    // 감정 선택: Sad
    const sadEmotionRadio = page.locator("input[value='Sad']");
    await sadEmotionRadio.check();

    // 등록하기 버튼 클릭
    const submitButton = page.locator('button:has-text("등록하기")');
    await submitButton.click({ force: true });

    // 등록완료모달이 나타나는지 확인 (timeout: 400ms)
    await expect(page.locator("text=등록 완료")).toBeVisible({ timeout: 400 });

    // 로컬스토리지에서 데이터 확인
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem("diaries");
      return data ? JSON.parse(data) : null;
    });

    // 저장된 데이터 검증
    expect(diariesData).toBeTruthy();
    expect(diariesData).toHaveLength(1);
    expect(diariesData[0]).toMatchObject({
      id: 1,
      title: "첫번째 일기",
      content: "첫번째 일기의 내용입니다.",
      emotion: "Sad",
    });
    expect(diariesData[0].createdAt).toBeTruthy();
  });

  test("등록하기 버튼 클릭 시 기존 일기에 새로운 일기가 추가된다", async ({
    page,
  }) => {
    // 초기 데이터 설정
    await page.evaluate(() => {
      const existingDiaries = [
        {
          id: 1,
          title: "기존 일기",
          content: "기존 일기 내용",
          emotion: "Happy",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(existingDiaries));
    });

    // 페이지 새로고침 (로컬스토리지 데이터 로드)
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diary-write-button"]');

    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click({ force: true });

    // 일기쓰기 모달 대기
    await expect(page.locator("text=일기 쓰기")).toBeVisible({ timeout: 400 });

    // 제목 입력
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("두번째 일기");

    // 내용 입력
    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("두번째 일기의 내용입니다.");

    // 감정 선택: Angry
    const angryEmotionRadio = page.locator("input[value='Angry']");
    await angryEmotionRadio.check();

    // 등록하기 버튼 클릭
    const submitButton = page.locator('button:has-text("등록하기")');
    await submitButton.click({ force: true });

    // 등록완료모달 대기
    await expect(page.locator("text=등록 완료")).toBeVisible({ timeout: 400 });

    // 로컬스토리지에서 데이터 확인
    const diariesData = await page.evaluate(() => {
      const data = localStorage.getItem("diaries");
      return data ? JSON.parse(data) : null;
    });

    // 저장된 데이터 검증 - 2개의 일기가 있어야 함
    expect(diariesData).toHaveLength(2);
    expect(diariesData[1]).toMatchObject({
      id: 2,
      title: "두번째 일기",
      content: "두번째 일기의 내용입니다.",
      emotion: "Angry",
    });
  });

  test("등록완료모달의 확인 버튼 클릭 시 일기상세페이지로 이동하고 모든 모달이 닫힌다", async ({
    page,
  }) => {
    // 제목 입력
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("등록완료 테스트");

    // 내용 입력
    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("등록 후 이동 테스트입니다.");

    // 감정 선택: Surprise
    const surpriseEmotionRadio = page.locator("input[value='Surprise']");
    await surpriseEmotionRadio.check();

    // 등록하기 버튼 클릭
    const submitButton = page.locator('button:has-text("등록하기")');
    await submitButton.click({ force: true });

    // 등록완료모달 대기
    const completeModal = page.locator("text=등록 완료");
    await expect(completeModal).toBeVisible({ timeout: 400 });

    // 등록완료모달의 확인 버튼 클릭
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ force: true });

    // 일기상세페이지로 이동했는지 확인 (URL 확인)
    await expect(page).toHaveURL(/\/diaries\/\d+$/);

    // 등록완료모달이 닫혔는지 확인 (timeout: 400ms)
    await expect(completeModal).not.toBeVisible({ timeout: 400 });

    // 일기쓰기 모달이 닫혔는지 확인
    const writeModalHeader = page.locator("text=일기 쓰기");
    await expect(writeModalHeader).not.toBeVisible();
  });

  test("필드가 비어있으면 등록하기 버튼이 비활성화된다", async ({ page }) => {
    // 제목만 입력
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("제목만 입력");

    // 내용은 입력하지 않음
    const submitButton = page.locator('button:has-text("등록하기")');

    // 내용이 없으므로 버튼이 비활성화되어야 함
    await expect(submitButton).toBeDisabled();

    // 내용 입력
    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("이제 내용을 입력했습니다.");

    // 이제 버튼이 활성화되어야 함
    await expect(submitButton).toBeEnabled();
  });

  test("등록하기 후 폼이 초기화되고 다시 등록할 수 있다", async ({ page }) => {
    // 첫번째 일기 등록
    const titleInput = page.locator("input[placeholder='제목을 입력합니다.']");
    await titleInput.fill("첫번째 일기");

    const contentTextarea = page.locator(
      "textarea[placeholder='내용을 입력합니다.']"
    );
    await contentTextarea.fill("첫번째 내용");

    // 등록
    const submitButton = page.locator('button:has-text("등록하기")');
    await submitButton.click({ force: true });

    // 등록완료모달 대기
    await expect(page.locator("text=등록 완료")).toBeVisible({ timeout: 400 });

    // 등록완료모달의 확인 버튼 클릭 - 모달 닫기
    const confirmButton = page.locator('button:has-text("확인")');
    await confirmButton.click({ force: true });

    // 페이지 이동 대기
    await page.waitForURL("**/diaries/**", { timeout: 5000 });

    // 다시 일기쓰기 페이지로 돌아가기
    await page.goto("/diaries", { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="diary-write-button"]', {
      state: "visible",
    });

    // React가 완전히 초기화될 때까지 추가 대기
    await page.waitForTimeout(500);

    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="diary-write-button"]');
    await writeButton.click();

    // 일기쓰기 모달 대기
    await expect(page.locator("text=일기 쓰기")).toBeVisible({
      timeout: 5000,
    });

    // 입력 필드가 초기화되어 있는지 확인
    const titleInputValue = await titleInput.inputValue();
    expect(titleInputValue).toBe("");

    const contentTextareaValue = await contentTextarea.textContent();
    expect(contentTextareaValue).toBe("");
  });
});
