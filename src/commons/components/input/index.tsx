"use client";

import React, {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
} from "react";
import styles from "./styles.module.css";

/**
 * Input Variant Types
 */
export type InputVariant = "primary" | "secondary" | "tertiary";
export type InputSize = "small" | "medium" | "large";
export type InputTheme = "light" | "dark";

/**
 * Input Component Props
 */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * 인풋의 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: InputVariant;

  /**
   * 인풋의 크기
   * @default 'medium'
   */
  size?: InputSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: InputTheme;

  /**
   * 인풋의 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 에러 상태
   * @default false
   */
  error?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  /**
   * 왼쪽 아이콘/요소
   */
  leftIcon?: ReactNode;

  /**
   * 오른쪽 아이콘/요소
   */
  rightIcon?: ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 인풋 wrapper 클래스명
   */
  wrapperClassName?: string;

  /**
   * 라벨
   */
  label?: string;

  /**
   * 라벨 위치
   * @default 'top'
   */
  labelPosition?: "top" | "left";
}

/**
 * Input Component
 *
 * 완전한 variant 시스템을 갖춘 인풋 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Input
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 *   placeholder="텍스트를 입력하세요"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      fullWidth = false,
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      className = "",
      wrapperClassName = "",
      label,
      labelPosition = "top",
      disabled = false,
      type = "text",
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // wrapper 클래스명 조합
    const wrapperClasses = [
      styles.wrapper,
      labelPosition === "left" && styles.wrapperRow,
      fullWidth && styles.fullWidth,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(" ");

    // input container 클래스명 조합
    const containerClasses = [
      styles.inputContainer,
      styles[variant],
      styles[size],
      styles[theme],
      error && styles.error,
      isFocused && styles.focused,
      disabled && styles.disabled,
      leftIcon && styles.hasLeftIcon,
      rightIcon && styles.hasRightIcon,
    ]
      .filter(Boolean)
      .join(" ");

    // input 클래스명 조합
    const inputClasses = [styles.input, className].filter(Boolean).join(" ");

    // label 클래스명 조합
    const labelClasses = [
      styles.label,
      styles[theme],
      labelPosition === "left" && styles.labelLeft,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && <label className={labelClasses}>{label}</label>}
        <div className={containerClasses}>
          {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-invalid={error}
            {...rest}
          />
          {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </div>
        {error && errorMessage && (
          <span className={`${styles.errorMessage} ${styles[theme]}`}>
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
