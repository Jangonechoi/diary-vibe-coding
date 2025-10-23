/**
 * 페이지네이션 테스트를 위한 추가 mock 데이터 생성 스크립트
 *
 * 사용법:
 * 1. 브라우저 개발자 도구 콘솔에서 실행
 * 2. 또는 HTML 파일에서 script 태그로 로드
 */

// EmotionType 정의
const EMOTION_TYPES = ["Happy", "Sad", "Angry", "Surprise", "Etc"];

// 페이지네이션 테스트용 Mock 데이터 생성 함수
function generatePaginationTestData(count = 100) {
  const titles = [
    "페이지네이션 테스트",
    "데이터 로딩 테스트",
    "UI 렌더링 테스트",
    "성능 테스트",
    "메모리 사용량 테스트",
    "스크롤 테스트",
    "필터링 테스트",
    "검색 테스트",
    "정렬 테스트",
    "반응형 테스트",
    "접근성 테스트",
    "크로스 브라우저 테스트",
    "모바일 테스트",
    "태블릿 테스트",
    "데스크톱 테스트",
    "터치 테스트",
    "키보드 테스트",
    "마우스 테스트",
    "드래그 테스트",
    "드롭 테스트",
    "애니메이션 테스트",
    "전환 효과 테스트",
    "로딩 상태 테스트",
    "에러 상태 테스트",
    "빈 상태 테스트",
    "로딩 실패 테스트",
    "네트워크 오류 테스트",
    "권한 오류 테스트",
    "세션 만료 테스트",
    "토큰 갱신 테스트",
    "캐시 테스트",
    "지속성 테스트",
    "동기화 테스트",
    "충돌 해결 테스트",
    "버전 관리 테스트",
    "마이그레이션 테스트",
    "백업 테스트",
    "복원 테스트",
    "암호화 테스트",
    "보안 테스트",
    "인증 테스트",
    "인가 테스트",
    "로깅 테스트",
    "모니터링 테스트",
    "알림 테스트",
    "이메일 테스트",
    "SMS 테스트",
    "푸시 테스트",
  ];

  const contents = [
    "이 일기는 페이지네이션 기능을 테스트하기 위해 생성되었습니다. 다양한 데이터를 통해 UI의 반응성을 확인할 수 있습니다.",
    "데이터 로딩 성능을 테스트하기 위한 일기입니다. 대량의 데이터를 처리할 때의 성능을 측정할 수 있습니다.",
    "UI 렌더링 성능을 확인하기 위한 테스트 일기입니다. 컴포넌트의 렌더링 속도와 메모리 사용량을 모니터링할 수 있습니다.",
    "전체 시스템의 성능을 평가하기 위한 일기입니다. CPU 사용률, 메모리 사용량, 네트워크 대역폭 등을 측정할 수 있습니다.",
    "메모리 사용량을 모니터링하기 위한 테스트 일기입니다. 메모리 누수나 과도한 메모리 사용을 감지할 수 있습니다.",
    "스크롤 성능을 테스트하기 위한 일기입니다. 부드러운 스크롤과 가상화 기능을 확인할 수 있습니다.",
    "필터링 기능을 테스트하기 위한 일기입니다. 다양한 조건으로 데이터를 필터링할 때의 성능을 측정할 수 있습니다.",
    "검색 기능의 성능을 평가하기 위한 테스트 일기입니다. 대량의 데이터에서 검색할 때의 속도를 확인할 수 있습니다.",
    "데이터 정렬 기능을 테스트하기 위한 일기입니다. 다양한 기준으로 정렬할 때의 성능을 측정할 수 있습니다.",
    "반응형 디자인을 테스트하기 위한 일기입니다. 다양한 화면 크기에서의 레이아웃을 확인할 수 있습니다.",
    "접근성 기능을 테스트하기 위한 일기입니다. 스크린 리더와 키보드 네비게이션을 확인할 수 있습니다.",
    "크로스 브라우저 호환성을 테스트하기 위한 일기입니다. 다양한 브라우저에서의 동작을 확인할 수 있습니다.",
    "모바일 환경에서의 사용성을 테스트하기 위한 일기입니다. 터치 인터페이스와 모바일 최적화를 확인할 수 있습니다.",
    "태블릿 환경에서의 사용성을 테스트하기 위한 일기입니다. 태블릿에 최적화된 UI를 확인할 수 있습니다.",
    "데스크톱 환경에서의 사용성을 테스트하기 위한 일기입니다. 마우스와 키보드 인터페이스를 확인할 수 있습니다.",
    "터치 인터페이스를 테스트하기 위한 일기입니다. 터치 제스처와 반응성을 확인할 수 있습니다.",
    "키보드 네비게이션을 테스트하기 위한 일기입니다. 키보드만으로 모든 기능을 사용할 수 있는지 확인할 수 있습니다.",
    "마우스 인터페이스를 테스트하기 위한 일기입니다. 마우스 이벤트와 반응성을 확인할 수 있습니다.",
    "드래그 앤 드롭 기능을 테스트하기 위한 일기입니다. 파일 업로드와 요소 이동을 확인할 수 있습니다.",
    "애니메이션 효과를 테스트하기 위한 일기입니다. 부드러운 전환과 시각적 피드백을 확인할 수 있습니다.",
    "로딩 상태를 테스트하기 위한 일기입니다. 데이터 로딩 중의 UI 상태를 확인할 수 있습니다.",
    "에러 상태를 테스트하기 위한 일기입니다. 오류 발생 시의 사용자 경험을 확인할 수 있습니다.",
    "빈 상태를 테스트하기 위한 일기입니다. 데이터가 없을 때의 UI를 확인할 수 있습니다.",
    "네트워크 오류를 테스트하기 위한 일기입니다. 연결 실패 시의 처리를 확인할 수 있습니다.",
    "권한 오류를 테스트하기 위한 일기입니다. 접근 권한이 없을 때의 처리를 확인할 수 있습니다.",
    "세션 만료를 테스트하기 위한 일기입니다. 세션이 만료되었을 때의 처리를 확인할 수 있습니다.",
    "토큰 갱신을 테스트하기 위한 일기입니다. 인증 토큰 갱신 과정을 확인할 수 있습니다.",
    "캐시 기능을 테스트하기 위한 일기입니다. 데이터 캐싱과 무효화를 확인할 수 있습니다.",
    "데이터 지속성을 테스트하기 위한 일기입니다. 데이터 저장과 복원을 확인할 수 있습니다.",
    "동기화 기능을 테스트하기 위한 일기입니다. 여러 클라이언트 간의 데이터 동기화를 확인할 수 있습니다.",
    "충돌 해결을 테스트하기 위한 일기입니다. 동시 편집 시의 충돌 해결을 확인할 수 있습니다.",
    "버전 관리를 테스트하기 위한 일기입니다. 데이터 버전 관리와 히스토리를 확인할 수 있습니다.",
    "마이그레이션을 테스트하기 위한 일기입니다. 데이터 구조 변경 시의 마이그레이션을 확인할 수 있습니다.",
    "백업 기능을 테스트하기 위한 일기입니다. 데이터 백업과 복원을 확인할 수 있습니다.",
    "암호화 기능을 테스트하기 위한 일기입니다. 데이터 암호화와 복호화를 확인할 수 있습니다.",
    "보안 기능을 테스트하기 위한 일기입니다. 보안 취약점과 방어 기능을 확인할 수 있습니다.",
    "인증 기능을 테스트하기 위한 일기입니다. 사용자 인증 과정을 확인할 수 있습니다.",
    "인가 기능을 테스트하기 위한 일기입니다. 권한 기반 접근 제어를 확인할 수 있습니다.",
    "로깅 기능을 테스트하기 위한 일기입니다. 시스템 로그와 사용자 행동 로그를 확인할 수 있습니다.",
    "모니터링 기능을 테스트하기 위한 일기입니다. 시스템 상태 모니터링을 확인할 수 있습니다.",
    "알림 기능을 테스트하기 위한 일기입니다. 실시간 알림과 푸시 알림을 확인할 수 있습니다.",
    "이메일 기능을 테스트하기 위한 일기입니다. 이메일 발송과 수신을 확인할 수 있습니다.",
    "SMS 기능을 테스트하기 위한 일기입니다. SMS 발송과 수신을 확인할 수 있습니다.",
    "푸시 알림을 테스트하기 위한 일기입니다. 모바일 푸시 알림을 확인할 수 있습니다.",
  ];

  const mockDiaries = [];

  for (let i = 1; i <= count; i++) {
    const randomEmotion =
      EMOTION_TYPES[Math.floor(Math.random() * EMOTION_TYPES.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];

    // 날짜를 최근 1년 내에서 랜덤하게 생성
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const randomDate = new Date(
      oneYearAgo.getTime() +
        Math.random() * (now.getTime() - oneYearAgo.getTime())
    );

    mockDiaries.push({
      id: i,
      title: `${randomTitle} #${i}`,
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

// 페이지네이션 테스트용 데이터 등록
function registerPaginationTestData(count = 100) {
  const mockDiaries = generatePaginationTestData(count);
  localStorage.setItem("diaries", JSON.stringify(mockDiaries));
  console.log(
    `✅ ${count}개의 페이지네이션 테스트용 일기 데이터가 등록되었습니다.`
  );
  console.log(`📊 페이지네이션 정보:`);
  console.log(`   - 총 일기 수: ${mockDiaries.length}`);
  console.log(`   - 페이지당 아이템 수: 12개`);
  console.log(`   - 총 페이지 수: ${Math.ceil(mockDiaries.length / 12)}페이지`);
  console.log(
    `   - 감정별 분포:`,
    mockDiaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1;
      return acc;
    }, {})
  );
  return mockDiaries;
}

// 대용량 페이지네이션 테스트용 데이터 등록 (500개)
function registerLargePaginationTestData() {
  return registerPaginationTestData(500);
}

// 극대용량 페이지네이션 테스트용 데이터 등록 (1000개)
function registerXLargePaginationTestData() {
  return registerPaginationTestData(1000);
}

// 페이지네이션 성능 테스트
function testPaginationPerformance() {
  const data = localStorage.getItem("diaries");
  if (!data) {
    console.log(
      "❌ 테스트할 데이터가 없습니다. 먼저 mock 데이터를 생성해주세요."
    );
    return;
  }

  const diaries = JSON.parse(data);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(diaries.length / itemsPerPage);

  console.log(`🚀 페이지네이션 성능 테스트 시작`);
  console.log(
    `📊 테스트 데이터: ${diaries.length}개 일기, ${totalPages}페이지`
  );

  const startTime = performance.now();

  // 모든 페이지의 데이터를 순차적으로 처리
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = diaries.slice(startIndex, endIndex);

    // 페이지 데이터 처리 시뮬레이션
    pageData.forEach((diary) => {
      // 간단한 데이터 처리 시뮬레이션
      const processed = {
        id: diary.id,
        title: diary.title,
        emotion: diary.emotion,
        date: new Date(diary.createdAt).toLocaleDateString(),
      };
    });
  }

  const endTime = performance.now();
  const processingTime = endTime - startTime;

  console.log(`⏱️ 성능 테스트 결과:`);
  console.log(`   - 처리 시간: ${processingTime.toFixed(2)}ms`);
  console.log(
    `   - 평균 페이지 처리 시간: ${(processingTime / totalPages).toFixed(2)}ms`
  );
  console.log(
    `   - 초당 처리 가능한 페이지 수: ${(
      totalPages /
      (processingTime / 1000)
    ).toFixed(2)}페이지/초`
  );
}

// 전역 함수로 등록
window.registerPaginationTestData = registerPaginationTestData;
window.registerLargePaginationTestData = registerLargePaginationTestData;
window.registerXLargePaginationTestData = registerXLargePaginationTestData;
window.testPaginationPerformance = testPaginationPerformance;

console.log("🚀 페이지네이션 테스트 스크립트가 로드되었습니다.");
console.log("사용 가능한 함수들:");
console.log(
  "  - registerPaginationTestData(count): 페이지네이션 테스트용 데이터 생성 (기본값: 100개)"
);
console.log(
  "  - registerLargePaginationTestData(): 대용량 테스트용 데이터 생성 (500개)"
);
console.log(
  "  - registerXLargePaginationTestData(): 극대용량 테스트용 데이터 생성 (1000개)"
);
console.log("  - testPaginationPerformance(): 페이지네이션 성능 테스트 실행");

// 기본적으로 100개의 테스트 데이터 등록
registerPaginationTestData(100);
