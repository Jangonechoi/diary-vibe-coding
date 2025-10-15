/**
 * Typography System
 *
 * 국문: Pretendard
 * 영문/숫자: SUIT Variable
 *
 * 모바일과 데스크톱 분기 가능
 */

// Font Weights
export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

// Font Families
export const FONT_FAMILIES = {
  korean:
    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  english:
    "SUIT Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
  default:
    "Pretendard, SUIT Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif",
} as const;

// Typography Token Type
export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}

// Web Headline (웹 헤드라인)
export const WEB_HEADLINE = {
  headline01: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 48,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 60,
  },
  headline02: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 36,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 48,
  },
  headline03: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 36,
  },
} as const;

// Headline (헤드라인)
export const HEADLINE = {
  headline01: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
  },
  headline02: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 22,
    fontWeight: FONT_WEIGHTS.extrabold,
    lineHeight: 30,
  },
  headline03: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 28,
  },
} as const;

// Title (타이틀)
export const TITLE = {
  title01: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 24,
  },
  title02: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 22,
  },
  title03: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 20,
  },
  subtitle01: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 22,
  },
  subtitle02: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 18,
  },
} as const;

// Body (본문)
export const BODY = {
  body01_medium: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 24,
  },
  body02_medium: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 22,
  },
  body03_medium: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 18,
  },
  body01_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 22,
  },
  body02_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 20,
  },
  body03_regular: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: 16,
  },
} as const;

// Caption (캡션)
export const CAPTION = {
  caption01_semibold: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 14,
  },
  caption02_semibold: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 12,
  },
  caption02_medium: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 12,
  },
  caption03: {
    fontFamily: FONT_FAMILIES.korean,
    fontSize: 8,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 10,
  },
} as const;

// Responsive Typography (모바일/데스크톱 분기)
export interface ResponsiveTypography {
  mobile: TypographyToken;
  desktop: TypographyToken;
}

// 반응형 헤드라인 예시
export const RESPONSIVE_HEADLINE: Record<string, ResponsiveTypography> = {
  hero: {
    mobile: HEADLINE.headline01,
    desktop: WEB_HEADLINE.headline01,
  },
  section: {
    mobile: HEADLINE.headline02,
    desktop: WEB_HEADLINE.headline02,
  },
  subsection: {
    mobile: HEADLINE.headline03,
    desktop: WEB_HEADLINE.headline03,
  },
} as const;

// 전체 Typography 통합 객체
export const TYPOGRAPHY = {
  webHeadline: WEB_HEADLINE,
  headline: HEADLINE,
  title: TITLE,
  body: BODY,
  caption: CAPTION,
  responsive: RESPONSIVE_HEADLINE,
} as const;

// 타입 추출
export type TypographyKey = keyof typeof TYPOGRAPHY;
export type WebHeadlineKey = keyof typeof WEB_HEADLINE;
export type HeadlineKey = keyof typeof HEADLINE;
export type TitleKey = keyof typeof TITLE;
export type BodyKey = keyof typeof BODY;
export type CaptionKey = keyof typeof CAPTION;

// Utility: CSS 문자열 생성 함수
export const getTypographyStyle = (token: TypographyToken): string => {
  return `
    font-family: ${token.fontFamily};
    font-size: ${token.fontSize}px;
    font-weight: ${token.fontWeight};
    line-height: ${token.lineHeight}px;
  `.trim();
};

// Utility: Tailwind 클래스 생성 함수
export const getTypographyClass = (
  category: string,
  variant: string
): string => {
  return `typo-${category}-${variant}`;
};

export default TYPOGRAPHY;
