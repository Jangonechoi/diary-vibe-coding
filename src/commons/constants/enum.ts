/**
 * 감정(Emotion) 타입 정의
 */
export type EmotionType = "Happy" | "Sad" | "Angry" | "Surprise" | "Etc";

/**
 * 감정 데이터 인터페이스
 */
export interface EmotionData {
  label: string;
  images: {
    medium: string;
    small: string;
  };
  color: string;
}

/**
 * 감정(Emotion) Enum 데이터
 *
 * 각 감정은 화면에 표시될 텍스트, 이미지 경로(medium, small), 색상을 포함합니다.
 */
export const EMOTION: Record<EmotionType, EmotionData> = {
  Happy: {
    label: "행복해요",
    images: {
      medium: "emotion-happy-m.svg",
      small: "emotion-happy-s.svg",
    },
    color: "red60",
  },
  Sad: {
    label: "슬퍼요",
    images: {
      medium: "emotion-sad-m.svg",
      small: "emotion-sad-s.svg",
    },
    color: "blue60",
  },
  Angry: {
    label: "화나요",
    images: {
      medium: "emotion-angry-m.svg",
      small: "emotion-angry-s.svg",
    },
    color: "gray60",
  },
  Surprise: {
    label: "놀랐어요",
    images: {
      medium: "emotion-surprise-m.svg",
      small: "emotion-surprise-s.svg",
    },
    color: "yellow60",
  },
  Etc: {
    label: "기타",
    images: {
      medium: "emotion-etc-m.svg",
      small: "emotion-etc-s.svg",
    },
    color: "green60",
  },
} as const;

/**
 * 감정 키 배열
 */
export const EMOTION_KEYS = Object.keys(EMOTION) as EmotionType[];

/**
 * 감정 타입 가드 함수
 */
export const isEmotionType = (value: unknown): value is EmotionType => {
  return typeof value === "string" && value in EMOTION;
};

/**
 * 필터 타입 정의
 */
export type FilterType = "default" | "horizontal" | "vertical";

/**
 * 필터 데이터 인터페이스
 */
export interface FilterData {
  label: string;
  imageSize: {
    width: number;
    height: number;
  };
}

/**
 * 필터 Enum 데이터
 *
 * 각 필터는 화면에 표시될 텍스트와 이미지 크기를 포함합니다.
 */
export const FILTER: Record<FilterType, FilterData> = {
  default: {
    label: "기본",
    imageSize: {
      width: 640,
      height: 640,
    },
  },
  horizontal: {
    label: "가로형",
    imageSize: {
      width: 640,
      height: 480,
    },
  },
  vertical: {
    label: "세로형",
    imageSize: {
      width: 480,
      height: 640,
    },
  },
} as const;

/**
 * 필터 키 배열
 */
export const FILTER_KEYS = Object.keys(FILTER) as FilterType[];

/**
 * 필터 타입 가드 함수
 */
export const isFilterType = (value: unknown): value is FilterType => {
  return typeof value === "string" && value in FILTER;
};
