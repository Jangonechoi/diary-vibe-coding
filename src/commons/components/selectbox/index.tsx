"use client";

import React, {
  SelectHTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import styles from "./styles.module.css";

/**
 * Selectbox Option Type
 */
export interface SelectboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

/**
 * Selectbox Variant Types
 */
export type SelectboxVariant = "primary" | "secondary" | "tertiary";
export type SelectboxSize = "small" | "medium" | "large";
export type SelectboxTheme = "light" | "dark";

/**
 * Selectbox Component Props
 */
export interface SelectboxProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * 셀렉트박스의 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: SelectboxVariant;

  /**
   * 셀렉트박스의 크기
   * @default 'medium'
   */
  size?: SelectboxSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: SelectboxTheme;

  /**
   * 셀렉트박스의 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 옵션 목록
   */
  options: SelectboxOption[];

  /**
   * placeholder 텍스트
   * @default '선택하세요'
   */
  placeholder?: string;

  /**
   * 값 변경 핸들러
   */
  onValueChange?: (value: string | number) => void;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * wrapper 클래스명
   */
  wrapperClassName?: string;

  /**
   * 에러 상태
   */
  error?: boolean;

  /**
   * 에러 메시지
   */
  errorMessage?: string;

  /**
   * 라벨
   */
  label?: ReactNode;

  /**
   * 라벨 위치
   */
  labelPosition?: "top" | "left";

  /**
   * 테스트용 식별자
   */
  "data-testid"?: string;
}

/**
 * Selectbox Component
 *
 * 완전한 variant 시스템을 갖춘 셀렉트박스 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Selectbox
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 *   placeholder="전체"
 *   options={[
 *     { value: 'all', label: '전체' },
 *     { value: 'option1', label: '옵션1' },
 *     { value: 'option2', label: '옵션2' },
 *   ]}
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const Selectbox = forwardRef<HTMLSelectElement, SelectboxProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      fullWidth = false,
      options = [],
      placeholder = "선택하세요",
      onValueChange,
      className = "",
      wrapperClassName = "",
      disabled = false,
      error = false,
      errorMessage,
      label,
      labelPosition = "top",
      value: controlledValue,
      onChange,
      "data-testid": dataTestId,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number>("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // controlled vs uncontrolled
    const value =
      controlledValue !== undefined ? controlledValue : internalValue;

    // 선택된 옵션 찾기
    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    // wrapper 클래스명 조합
    const wrapperClasses = [
      styles.wrapper,
      labelPosition === "left" && styles.wrapperRow,
      fullWidth && styles.fullWidth,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(" ");

    // selectbox container 클래스명 조합
    const containerClasses = [
      styles.selectboxContainer,
      styles[variant],
      styles[size],
      styles[theme],
      isFocused && styles.focused,
      isOpen && styles.open,
      disabled && styles.disabled,
      error && styles.error,
      !selectedOption && styles.placeholder,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // dropdown 클래스명 조합
    const dropdownClasses = [
      styles.dropdown,
      styles[variant],
      styles[size],
      styles[theme],
      isOpen && styles.open,
    ]
      .filter(Boolean)
      .join(" ");

    // label 클래스명 조합
    const labelClasses = [
      styles.label,
      styles[theme],
      labelPosition === "left" && styles.labelLeft,
    ]
      .filter(Boolean)
      .join(" ");

    // 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // 토글 핸들러
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setIsFocused(!isOpen);
      }
    };

    // 옵션 선택 핸들러
    const handleOptionClick = (optionValue: string | number) => {
      if (controlledValue === undefined) {
        setInternalValue(optionValue);
      }

      if (onValueChange) {
        onValueChange(optionValue);
      }

      if (onChange) {
        const event = {
          target: { value: String(optionValue) },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }

      setIsOpen(false);
      setIsFocused(false);
    };

    // 키보드 핸들러
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          setIsOpen(!isOpen);
          break;
        case "Escape":
          setIsOpen(false);
          setIsFocused(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            // 다음 옵션으로 이동
            const currentIndex = options.findIndex(
              (opt) => opt.value === value
            );
            const nextIndex = Math.min(currentIndex + 1, options.length - 1);
            const nextOption = options[nextIndex];
            if (nextOption && !nextOption.disabled) {
              handleOptionClick(nextOption.value);
            }
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            // 이전 옵션으로 이동
            const currentIndex = options.findIndex(
              (opt) => opt.value === value
            );
            const prevIndex = Math.max(currentIndex - 1, 0);
            const prevOption = options[prevIndex];
            if (prevOption && !prevOption.disabled) {
              handleOptionClick(prevOption.value);
            }
          }
          break;
      }
    };

    return (
      <div className={wrapperClasses}>
        {label && <label className={labelClasses}>{label}</label>}
        <div className={styles.selectboxWrapper} ref={dropdownRef}>
          <div
            className={containerClasses}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            data-testid={dataTestId}
          >
            <div className={styles.selectContent}>
              <span className={styles.selectText}>{displayText}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={styles.dropdownIcon}
              >
                <path
                  d="M11.4752 14.475L7.8502 10.85C7.8002 10.8 7.7627 10.7458 7.7377 10.6875C7.7127 10.6292 7.7002 10.5667 7.7002 10.5C7.7002 10.3667 7.74603 10.25 7.8377 10.15C7.92936 10.05 8.0502 10 8.2002 10H15.8002C15.9502 10 16.071 10.05 16.1627 10.15C16.2544 10.25 16.3002 10.3667 16.3002 10.5C16.3002 10.5333 16.2502 10.65 16.1502 10.85L12.5252 14.475C12.4419 14.5583 12.3585 14.6167 12.2752 14.65C12.1919 14.6833 12.1002 14.7 12.0002 14.7C11.9002 14.7 11.8085 14.6833 11.7252 14.65C11.6419 14.6167 11.5585 14.5583 11.4752 14.475Z"
                  fill="#333333"
                />
              </svg>
            </div>
          </div>
          {isOpen && (
            <div className={dropdownClasses} role="listbox">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${
                    option.value === value ? styles.selected : ""
                  } ${option.disabled ? styles.optionDisabled : ""}`}
                  onClick={() =>
                    !option.disabled && handleOptionClick(option.value)
                  }
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  data-testid={`filter-option-${option.value}`}
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  {option.value === value && (
                    <Image
                      src="/icons/check_outline_light_xs.svg"
                      alt="selected"
                      width={16}
                      height={16}
                      className={styles.checkIcon}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Hidden native select for form compatibility */}
          <select
            ref={ref}
            className={styles.hiddenSelect}
            {...(onChange ? { value, onChange } : { defaultValue: value })}
            disabled={disabled}
            {...rest}
          >
            {!selectedOption && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
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

Selectbox.displayName = "Selectbox";

export default Selectbox;
