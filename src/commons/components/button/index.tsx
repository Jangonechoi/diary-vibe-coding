"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.css";

/**
 * Button Variant Types
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonTheme = "light" | "dark";

/**
 * Button Component Props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * 버튼의 크기
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: ButtonTheme;

  /**
   * 버튼의 내용 (텍스트, 아이콘 등)
   */
  children: ReactNode;

  /**
   * 버튼의 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태
   * @default false
   */
  loading?: boolean;

  /**
   * 왼쪽 아이콘
   */
  leftIcon?: ReactNode;

  /**
   * 오른쪽 아이콘
   */
  rightIcon?: ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Button Component
 *
 * 완전한 variant 시스템을 갖춘 버튼 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" theme="light">
 *   클릭하세요
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      children,
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled = false,
      onClick,
      type = "button",
      ...rest
    },
    ref
  ) => {
    // 클래스명 조합
    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      styles[theme],
      fullWidth && styles.fullWidth,
      loading && styles.loading,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 클릭 핸들러
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...rest}
      >
        {!loading && leftIcon && (
          <span className={styles.icon}>{leftIcon}</span>
        )}
        {!loading && <span>{children}</span>}
        {!loading && rightIcon && (
          <span className={styles.icon}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
