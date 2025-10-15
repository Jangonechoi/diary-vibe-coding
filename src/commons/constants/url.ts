/**
 * URL 경로 관리 시스템
 *
 * 모든 URL 경로를 중앙에서 관리하며, 다이나믹 라우팅을 지원합니다.
 * Link 컴포넌트에서 사용할 수 있도록 설계되었습니다.
 */

/**
 * 접근 권한 타입
 */
export type AccessType = 'PUBLIC' | 'AUTHENTICATED';

/**
 * 레이아웃 요소 가시성 인터페이스
 */
export interface LayoutVisibility {
  header: boolean;
  logo: boolean;
  darkModeToggle: boolean;
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

/**
 * URL 메타데이터 인터페이스
 */
export interface UrlMeta {
  path: string;
  accessType: AccessType;
  visibility: LayoutVisibility;
}

/**
 * URL 경로 키 타입
 */
export type UrlKey = 'LOGIN' | 'SIGNUP' | 'DIARIES' | 'DIARY_DETAIL' | 'DIARY_NEW' | 'PICTURES';

/**
 * URL 경로 상수
 *
 * 각 URL은 경로, 접근 권한, 레이아웃 가시성 정보를 포함합니다.
 */
export const URLS: Record<UrlKey, UrlMeta> = {
  LOGIN: {
    path: '/auth/login',
    accessType: 'PUBLIC',
    visibility: {
      header: false,
      logo: false,
      darkModeToggle: false,
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  SIGNUP: {
    path: '/auth/signup',
    accessType: 'PUBLIC',
    visibility: {
      header: false,
      logo: false,
      darkModeToggle: false,
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  DIARIES: {
    path: '/diaries',
    accessType: 'PUBLIC',
    visibility: {
      header: true,
      logo: true,
      darkModeToggle: false,
      banner: true,
      navigation: true,
      footer: true,
    },
  },
  DIARY_DETAIL: {
    path: '/diaries/[id]',
    accessType: 'AUTHENTICATED',
    visibility: {
      header: true,
      logo: true,
      darkModeToggle: false,
      banner: false,
      navigation: false,
      footer: true,
    },
  },
  DIARY_NEW: {
    path: '/diaries/new',
    accessType: 'AUTHENTICATED',
    visibility: {
      header: true,
      logo: true,
      darkModeToggle: false,
      banner: false,
      navigation: false,
      footer: true,
    },
  },
  PICTURES: {
    path: '/pictures',
    accessType: 'PUBLIC',
    visibility: {
      header: true,
      logo: true,
      darkModeToggle: false,
      banner: true,
      navigation: true,
      footer: true,
    },
  },
} as const;

/**
 * URL 키 배열
 */
export const URL_KEYS = Object.keys(URLS) as UrlKey[];

/**
 * 다이나믹 경로 생성 함수: 일기 상세 페이지
 *
 * @param id - 일기 ID (문자열 또는 숫자)
 * @returns 완성된 일기 상세 페이지 경로
 *
 * @example
 * getDiaryDetailUrl(123) // "/diaries/123"
 * getDiaryDetailUrl("abc") // "/diaries/abc"
 */
export const getDiaryDetailUrl = (id: string | number): string => {
  return `/diaries/${id}`;
};

/**
 * 경로로 URL 메타데이터 조회
 *
 * @param path - 조회할 경로 (예: "/diaries/123")
 * @returns URL 메타데이터 또는 undefined
 *
 * @example
 * getUrlMetaByPath("/diaries/123") // DIARY_DETAIL의 메타데이터 반환
 */
export const getUrlMetaByPath = (path: string): UrlMeta | undefined => {
  return Object.values(URLS).find((url) => {
    // 다이나믹 라우트 패턴 매칭 ([id] -> [^/]+)
    const pattern = url.path.replace(/\[.*?\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};

/**
 * 특정 URL의 인증 필요 여부 확인
 *
 * @param urlKey - URL 키
 * @returns 인증이 필요하면 true, 아니면 false
 *
 * @example
 * isAuthenticationRequired("DIARY_DETAIL") // true
 * isAuthenticationRequired("LOGIN") // false
 */
export const isAuthenticationRequired = (urlKey: UrlKey): boolean => {
  return URLS[urlKey].accessType === 'AUTHENTICATED';
};

/**
 * 레이아웃 요소 가시성 조회
 *
 * @param urlKey - URL 키
 * @returns 레이아웃 요소 가시성 객체
 *
 * @example
 * getLayoutVisibility("DIARIES") // { header: true, logo: true, ... }
 */
export const getLayoutVisibility = (urlKey: UrlKey): LayoutVisibility => {
  return URLS[urlKey].visibility;
};

/**
 * URL 키 타입 가드 함수
 *
 * @param value - 검증할 값
 * @returns URL 키이면 true, 아니면 false
 */
export const isUrlKey = (value: unknown): value is UrlKey => {
  return typeof value === 'string' && value in URLS;
};

/**
 * 접근 타입 타입 가드 함수
 *
 * @param value - 검증할 값
 * @returns 접근 타입이면 true, 아니면 false
 */
export const isAccessType = (value: unknown): value is AccessType => {
  return value === 'PUBLIC' || value === 'AUTHENTICATED';
};

export default URLS;
