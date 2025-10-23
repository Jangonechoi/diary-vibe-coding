/**
 * 일기 mock 데이터를 로컬스토리지에 등록하는 스크립트
 *
 * 사용법:
 * 1. 브라우저 개발자 도구 콘솔에서 실행
 * 2. 또는 HTML 파일에서 script 태그로 로드
 */

// EmotionType 정의
const EMOTION_TYPES = ["Happy", "Sad", "Angry", "Surprise", "Etc"];

// Mock 데이터 생성 함수
function generateMockDiaries(count = 50) {
  const titles = [
    "오늘의 하루",
    "기분 좋은 날",
    "힘든 하루",
    "새로운 시작",
    "추억이 되는 날",
    "특별한 순간",
    "평범한 하루",
    "감동적인 하루",
    "복잡한 마음",
    "평화로운 하루",
    "바쁜 하루",
    "여유로운 하루",
    "즐거운 하루",
    "피곤한 하루",
    "신나는 하루",
    "조용한 하루",
    "활기찬 하루",
    "차분한 하루",
    "밝은 하루",
    "어두운 하루",
    "따뜻한 하루",
    "차가운 하루",
    "달콤한 하루",
    "쓴 하루",
    "맛있는 하루",
    "배고픈 하루",
    "배부른 하루",
    "목마른 하루",
    "시원한 하루",
    "뜨거운 하루",
  ];

  const contents = [
    "오늘은 정말 특별한 하루였어요. 아침에 일어나서 창밖을 보니 날씨가 정말 좋았고, 마음도 한결 가벼워졌어요.",
    "오늘 하루 종일 기분이 좋았어요. 친구들과 함께 시간을 보내면서 정말 즐거웠어요.",
    "오늘은 조금 힘든 하루였어요. 하지만 그럼에도 불구하고 작은 기쁨들을 찾을 수 있었어요.",
    "새로운 도전을 시작한 하루였어요. 조금은 두렵지만 설레기도 해요.",
    "오늘은 정말 감동적인 하루였어요. 예상치 못한 일들이 일어나면서 마음이 따뜻해졌어요.",
    "평범한 하루였지만 그 평범함이 소중하게 느껴졌어요. 작은 행복들을 발견할 수 있었어요.",
    "오늘은 정말 바쁜 하루였어요. 하지만 그 바쁨 속에서도 의미 있는 일들을 할 수 있었어요.",
    "여유로운 하루였어요. 책을 읽고 음악을 들으며 마음의 평화를 찾을 수 있었어요.",
    "오늘은 정말 즐거운 하루였어요. 웃음이 끊이지 않았고, 마음이 가벼워졌어요.",
    "조금 피곤한 하루였지만, 그 피로도 의미 있는 것들이라 생각해요.",
    "오늘은 정말 신나는 하루였어요. 새로운 경험을 하면서 정말 즐거웠어요.",
    "조용한 하루였어요. 혼자만의 시간을 보내면서 마음의 안정을 찾을 수 있었어요.",
    "활기찬 하루였어요. 에너지가 넘쳐서 정말 좋았어요.",
    "차분한 하루였어요. 마음이 평온했고, 작은 것들에도 감사할 수 있었어요.",
    "오늘은 정말 밝은 하루였어요. 햇살이 마음까지 따뜻하게 해주었어요.",
    "조금 어두운 하루였지만, 그 어둠 속에서도 희망을 찾을 수 있었어요.",
    "따뜻한 하루였어요. 사람들의 따뜻함을 느낄 수 있었어요.",
    "차가운 하루였지만, 그 차가움 속에서도 따뜻한 마음을 유지할 수 있었어요.",
    "달콤한 하루였어요. 작은 기쁨들이 마음을 달콤하게 해주었어요.",
    "조금 쓴 하루였지만, 그 쓴맛도 인생의 한 부분이라고 생각해요.",
  ];

  const mockDiaries = [];

  for (let i = 1; i <= count; i++) {
    const randomEmotion =
      EMOTION_TYPES[Math.floor(Math.random() * EMOTION_TYPES.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];

    // 날짜를 최근 6개월 내에서 랜덤하게 생성
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    const randomDate = new Date(
      sixMonthsAgo.getTime() +
        Math.random() * (now.getTime() - sixMonthsAgo.getTime())
    );

    mockDiaries.push({
      id: i,
      title: `${randomTitle} ${i}`,
      content: randomContent,
      emotion: randomEmotion,
      createdAt: randomDate.toISOString(),
    });
  }

  // 날짜순으로 정렬 (최신순)
  return mockDiaries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// 로컬스토리지에 mock 데이터 등록
function registerMockDataToLocalStorage(count = 50) {
  const mockDiaries = generateMockDiaries(count);
  localStorage.setItem("diaries", JSON.stringify(mockDiaries));
  console.log(
    `✅ ${count}개의 일기 mock 데이터가 로컬스토리지에 등록되었습니다.`
  );
  console.log(`📊 데이터 통계:`);
  console.log(`   - 총 일기 수: ${mockDiaries.length}`);
  console.log(
    `   - 감정별 분포:`,
    mockDiaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {})
  );
  return mockDiaries;
}

// 로컬스토리지에서 mock 데이터 제거
function clearMockDataFromLocalStorage() {
  localStorage.removeItem("diaries");
  console.log("🗑️ 로컬스토리지의 일기 데이터가 제거되었습니다.");
}

// 로컬스토리지의 mock 데이터 확인
function checkMockDataInLocalStorage() {
  const data = localStorage.getItem("diaries");
  if (data) {
    const diaries = JSON.parse(data);
    console.log(`📋 현재 로컬스토리지에 저장된 일기 수: ${diaries.length}`);
    return diaries;
  }
  console.log("📭 로컬스토리지에 일기 데이터가 없습니다.");
  return null;
}

// 전역 함수로 등록 (브라우저 콘솔에서 사용 가능)
window.registerMockData = registerMockDataToLocalStorage;
window.clearMockData = clearMockDataFromLocalStorage;
window.checkMockData = checkMockDataInLocalStorage;

// 자동으로 50개의 mock 데이터 등록
console.log("🚀 일기 mock 데이터 스크립트가 로드되었습니다.");
console.log("사용 가능한 함수들:");
console.log("  - registerMockData(count): mock 데이터 등록 (기본값: 50개)");
console.log("  - clearMockData(): mock 데이터 제거");
console.log("  - checkMockData(): 현재 데이터 확인");

// 기본적으로 50개의 mock 데이터 등록
registerMockDataToLocalStorage(50);
