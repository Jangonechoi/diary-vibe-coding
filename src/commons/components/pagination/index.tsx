"use client";

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

/**
 * Pagination Variant Types
 */
export type PaginationVariant = "primary" | "secondary" | "tertiary";
export type PaginationSize = "small" | "medium" | "large";
export type PaginationTheme = "light" | "dark";

/**
 * Pagination Component Props
 */
export interface PaginationProps {
  /**
   * 현재 페이지 번호
   * @default 1
   */
  currentPage: number;

  /**
   * 전체 페이지 수
   */
  totalPages: number;

  /**
   * 페이지 변경 이벤트 핸들러
   */
  onPageChange: (page: number) => void;

  /**
   * 시각적 스타일 변형
   * @default 'primary'
   */
  variant?: PaginationVariant;

  /**
   * 크기
   * @default 'medium'
   */
  size?: PaginationSize;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: PaginationTheme;

  /**
   * 한 번에 표시할 페이지 버튼 개수
   * @default 5
   */
  visiblePages?: number;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Pagination Component
 *
 * 완전한 variant 시스템을 갖춘 페이지네이션 컴포넌트
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => console.log(page)}
 *   variant="primary"
 *   size="medium"
 *   theme="light"
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "primary",
  size = "medium",
  theme = "light",
  visiblePages = 5,
  className = "",
}) => {
  // 페이지 번호 범위 계산
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const halfVisible = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // 끝에 도달했을 때 시작 페이지 조정
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 이전 페이지로 이동
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 특정 페이지로 이동
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // 클래스명 조합
  const containerClasses = [
    styles.pagination,
    styles[variant],
    styles[size],
    styles[theme],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const prevButtonClasses = [
    styles.arrowButton,
    currentPage === 1 && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  const nextButtonClasses = [
    styles.arrowButton,
    currentPage === totalPages && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      role="navigation"
      aria-label="페이지네이션"
    >
      {/* 이전 페이지 버튼 */}
      <button
        type="button"
        className={prevButtonClasses}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <Image
          src={
            currentPage === 1
              ? "/icons/leftdisabled_outline_light_m.svg"
              : "/icons/leftenable_outline_light_m.svg"
          }
          alt="이전"
          width={24}
          height={24}
        />
      </button>

      {/* 페이지 번호 버튼들 */}
      <div className={styles.pageNumbers}>
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          const pageButtonClasses = [
            styles.pageButton,
            isActive && styles.active,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={page}
              type="button"
              className={pageButtonClasses}
              onClick={() => handlePageClick(page)}
              aria-label={`${page}페이지`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 다음 페이지 버튼 */}
      <button
        type="button"
        className={nextButtonClasses}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <Image
          src={
            currentPage === totalPages
              ? "/icons/rightdisabled_outline_light_m.svg"
              : "/icons/rightenable_outline_light_m.svg"
          }
          alt="다음"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

Pagination.displayName = "Pagination";

export default Pagination;
