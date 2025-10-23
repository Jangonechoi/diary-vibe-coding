import { EmotionType } from "@/commons/constants/enum";

/**
 * 로컬스토리지에 저장될 일기 타입
 */
export interface StoredDiary {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 mock 데이터 생성 함수
 */
export const generateMockDiaries = (count: number = 50): StoredDiary[] => {
  const emotions: EmotionType[] = ["Happy", "Sad", "Angry", "Surprise", "Etc"];
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
    "시원한 하루",
    "따뜻한 하루",
    "차가운 하루",
    "부드러운 하루",
    "거친 하루",
    "부드러운 하루",
    "딱딱한 하루",
    "유연한 하루",
    "경직된 하루",
    "자유로운 하루",
    "구속된 하루",
    "열린 하루",
    "닫힌 하루",
    "넓은 하루",
    "좁은 하루",
    "높은 하루",
    "낮은 하루",
    "깊은 하루",
    "얕은 하루",
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
    "맛있는 하루였어요. 좋은 음식을 먹으면서 정말 행복했어요.",
    "배고픈 하루였지만, 그 배고픔도 인생의 한 부분이에요.",
    "배부른 하루였어요. 맛있는 음식을 많이 먹어서 정말 만족스러웠어요.",
    "목마른 하루였지만, 그 목마름도 인생의 한 부분이에요.",
    "시원한 하루였어요. 더위를 잊고 정말 시원하게 보낼 수 있었어요.",
    "뜨거운 하루였지만, 그 뜨거움도 인생의 한 부분이에요.",
    "시원한 하루였어요. 더위를 잊고 정말 시원하게 보낼 수 있었어요.",
    "따뜻한 하루였어요. 사람들의 따뜻함을 느낄 수 있었어요.",
    "차가운 하루였지만, 그 차가움 속에서도 따뜻한 마음을 유지할 수 있었어요.",
    "부드러운 하루였어요. 마음이 부드럽게 느껴졌어요.",
    "조금 거친 하루였지만, 그 거친 것들도 인생의 한 부분이에요.",
    "부드러운 하루였어요. 마음이 부드럽게 느껴졌어요.",
    "딱딱한 하루였지만, 그 딱딱함도 인생의 한 부분이에요.",
    "유연한 하루였어요. 상황에 맞게 유연하게 대처할 수 있었어요.",
    "조금 경직된 하루였지만, 그 경직도 인생의 한 부분이에요.",
    "자유로운 하루였어요. 마음이 자유롭게 느껴졌어요.",
    "조금 구속된 하루였지만, 그 구속도 인생의 한 부분이에요.",
    "열린 하루였어요. 마음이 열려서 정말 좋았어요.",
    "조금 닫힌 하루였지만, 그 닫힘도 인생의 한 부분이에요.",
    "넓은 하루였어요. 마음이 넓어져서 정말 좋았어요.",
    "조금 좁은 하루였지만, 그 좁음도 인생의 한 부분이에요.",
    "높은 하루였어요. 마음이 높아져서 정말 좋았어요.",
    "조금 낮은 하루였지만, 그 낮음도 인생의 한 부분이에요.",
    "깊은 하루였어요. 마음이 깊어져서 정말 좋았어요.",
    "조금 얕은 하루였지만, 그 얕음도 인생의 한 부분이에요.",
  ];

  const mockDiaries: StoredDiary[] = [];

  for (let i = 1; i <= count; i++) {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
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
};

/**
 * 로컬스토리지에 mock 데이터 등록
 */
export const registerMockDataToLocalStorage = (count: number = 50): void => {
  const mockDiaries = generateMockDiaries(count);
  localStorage.setItem("diaries", JSON.stringify(mockDiaries));
  console.log(`${count}개의 일기 mock 데이터가 로컬스토리지에 등록되었습니다.`);
};

/**
 * 로컬스토리지에서 mock 데이터 제거
 */
export const clearMockDataFromLocalStorage = (): void => {
  localStorage.removeItem("diaries");
  console.log("로컬스토리지의 일기 데이터가 제거되었습니다.");
};

/**
 * 로컬스토리지의 mock 데이터 확인
 */
export const checkMockDataInLocalStorage = (): StoredDiary[] | null => {
  const data = localStorage.getItem("diaries");
  if (data) {
    return JSON.parse(data);
  }
  return null;
};
