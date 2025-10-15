'use client';

import React, { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

/**
 * Searchbar Variant Types
 */
export type SearchbarVariant = 'primary' | 'secondary' | 'tertiary';
export type SearchbarSize = 'small' | 'medium' | 'large';
export type SearchbarTheme = 'light' | 'dark';

/**
 * Searchbar Component Props
 */
export interface SearchbarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 검색바의 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: SearchbarVariant;

  /**
   * 검색바의 크기
   * @default 'medium'
   */
  size?: SearchbarSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: SearchbarTheme;

  /**
   * 검색바의 전체 너비 사용 여부
   * @default false
   */
  fullWidth?: boolean;

  /**
   * 검색 버튼 클릭 핸들러
   */
  onSearch?: (value: string) => void;

  /**
   * 검색 아이콘 표시 여부
   * @default true
   */
  showSearchIcon?: boolean;

  /**
   * 클리어 버튼 표시 여부
   * @default true
   */
  showClearButton?: boolean;

  /**
   * 오른쪽 아이콘/요소 (커스텀)
   */
  rightIcon?: ReactNode;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * wrapper 클래스명
   */
  wrapperClassName?: string;
}

/**
 * Searchbar Component
 *
 * 완전한 variant 시스템을 갖춘 검색바 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Searchbar
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 *   placeholder="검색어를 입력해 주세요."
 *   onSearch={(value) => console.log(value)}
 * />
 * ```
 */
export const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      fullWidth = false,
      onSearch,
      showSearchIcon = true,
      showClearButton = true,
      rightIcon,
      className = '',
      wrapperClassName = '',
      disabled = false,
      placeholder = '검색어를 입력해 주세요.',
      value: controlledValue,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    // controlled vs uncontrolled
    const value = controlledValue !== undefined ? controlledValue : internalValue;
    const hasValue = value ? String(value).length > 0 : false;

    // wrapper 클래스명 조합
    const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth, wrapperClassName]
      .filter(Boolean)
      .join(' ');

    // searchbar container 클래스명 조합
    const containerClasses = [
      styles.searchbarContainer,
      styles[variant],
      styles[size],
      styles[theme],
      isFocused && styles.focused,
      disabled && styles.disabled,
      showSearchIcon && styles.hasSearchIcon,
      (hasValue && showClearButton) || rightIcon ? styles.hasRightIcon : '',
    ]
      .filter(Boolean)
      .join(' ');

    // input 클래스명 조합
    const inputClasses = [styles.input, className].filter(Boolean).join(' ');

    // 검색 실행
    const handleSearch = () => {
      if (onSearch && value) {
        onSearch(String(value));
      }
    };

    // Enter 키 처리
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    // Clear 버튼 클릭
    const handleClear = () => {
      if (controlledValue !== undefined && onChange) {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      } else {
        setInternalValue('');
      }
    };

    // onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (controlledValue === undefined) {
        setInternalValue(e.target.value);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className={wrapperClasses}>
        <div className={containerClasses}>
          {showSearchIcon && (
            <button
              type="button"
              className={styles.searchIconButton}
              onClick={handleSearch}
              disabled={disabled}
              aria-label="검색"
            >
              <Image
                src="/icons/search_outline_light_m.svg"
                alt="search"
                width={24}
                height={24}
                className={styles.searchIcon}
              />
            </button>
          )}
          <input
            ref={ref}
            type="text"
            className={inputClasses}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...rest}
          />
          {hasValue && showClearButton && !rightIcon && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
              disabled={disabled}
              aria-label="clear"
            >
              <Image
                src="/icons/close_outline_light_s.svg"
                alt="clear"
                width={24}
                height={24}
                className={styles.clearIcon}
              />
            </button>
          )}
          {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
      </div>
    );
  }
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
