"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import styles from "./styles.module.css";

/**
 * Toggle Variant Types
 */
export type ToggleVariant = "primary" | "secondary" | "tertiary";
export type ToggleSize = "small" | "medium" | "large";
export type ToggleTheme = "light" | "dark";

/**
 * Toggle Component Props
 */
export interface ToggleProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  /**
   * 토글의 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: ToggleVariant;

  /**
   * 토글의 크기
   * @default 'medium'
   */
  size?: ToggleSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: ToggleTheme;

  /**
   * 토글 상태 (on/off)
   */
  checked?: boolean;

  /**
   * 토글 상태 변경 핸들러
   */
  onChange?: (checked: boolean) => void;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * wrapper 클래스명
   */
  wrapperClassName?: string;

  /**
   * 라벨 텍스트
   */
  label?: string;

  /**
   * 라벨 위치
   * @default 'right'
   */
  labelPosition?: "left" | "right";
}

/**
 * Toggle Component
 *
 * 완전한 variant 시스템을 갖춘 토글 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Toggle
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 *   checked={isOn}
 *   onChange={(checked) => setIsOn(checked)}
 *   label="알림 설정"
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      checked = false,
      onChange,
      disabled = false,
      className = "",
      wrapperClassName = "",
      label,
      labelPosition = "right",
      ...rest
    },
    ref
  ) => {
    // wrapper 클래스명 조합
    const wrapperClasses = [
      styles.wrapper,
      label && styles.hasLabel,
      labelPosition === "left" && styles.labelLeft,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(" ");

    // toggle container 클래스명 조합
    const containerClasses = [
      styles.toggleContainer,
      styles[variant],
      styles[size],
      styles[theme],
      checked && styles.checked,
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(" ");

    // input 클래스명 조합
    const inputClasses = [styles.input, className].filter(Boolean).join(" ");

    // handle 클래스명 조합
    const handleClasses = [styles.handle].filter(Boolean).join(" ");

    // label 클래스명 조합
    const labelClasses = [
      styles.label,
      styles[`label_${size}`],
      styles[`label_${theme}`],
      disabled && styles.labelDisabled,
    ]
      .filter(Boolean)
      .join(" ");

    // onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e.target.checked);
    };

    // 클릭 핸들러 (컨테이너 클릭 시 토글)
    const handleContainerClick = () => {
      if (disabled) return;
      onChange?.(!checked);
    };

    return (
      <div className={wrapperClasses}>
        {label && labelPosition === "left" && (
          <label className={labelClasses}>{label}</label>
        )}
        <div
          className={containerClasses}
          onClick={handleContainerClick}
          role="switch"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleContainerClick();
            }
          }}
          aria-checked={checked}
          aria-disabled={disabled}
        >
          <input
            ref={ref}
            type="checkbox"
            className={inputClasses}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            {...rest}
          />
          <span className={handleClasses} />
        </div>
        {label && labelPosition === "right" && (
          <label className={labelClasses}>{label}</label>
        )}
      </div>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
