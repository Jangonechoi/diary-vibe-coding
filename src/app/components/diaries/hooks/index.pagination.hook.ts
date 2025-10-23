"use client";

import { useState, useMemo } from "react";

/**
 * 페이지네이션 훅의 인터페이스
 */
export interface PaginationHookProps {
  data: unknown[];
  itemsPerPage?: number;
  initialPage?: number;
}

/**
 * 페이지네이션 훅의 반환 타입
 */
export interface PaginationHookReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  currentPageData: unknown[];
  handlePageChange: (page: number) => void;
  resetPagination: () => void;
}

/**
 * 페이지네이션 기능을 제공하는 커스텀 훅
 *
 * @param data - 페이지네이션할 데이터 배열
 * @param itemsPerPage - 페이지당 아이템 수 (기본값: 12)
 * @param initialPage - 초기 페이지 번호 (기본값: 1)
 * @returns 페이지네이션 관련 상태와 함수들
 */
export const usePagination = ({
  data,
  itemsPerPage = 12,
  initialPage = 1,
}: PaginationHookProps): PaginationHookReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // 현재 페이지의 데이터 계산
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 페이지네이션 초기화
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    currentPageData,
    handlePageChange,
    resetPagination,
  };
};
