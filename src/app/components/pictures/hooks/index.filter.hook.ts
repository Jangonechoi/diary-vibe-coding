"use client";

import { useState, useCallback } from "react";
import { FilterType, FILTER, FILTER_KEYS } from "@/commons/constants/enum";

export interface FilterState {
  selectedFilter: FilterType;
  imageSize: {
    width: number;
    height: number;
  };
}

export interface UseFilterReturn {
  selectedFilter: FilterType;
  imageSize: {
    width: number;
    height: number;
  };
  setFilter: (filter: FilterType) => void;
  filterOptions: Array<{
    value: FilterType;
    label: string;
  }>;
}

/**
 * 강아지 사진 필터 기능을 위한 커스텀 훅
 *
 * 필터 타입에 따라 이미지 크기를 조정하는 기능을 제공합니다.
 * - 기본: 640 x 640px
 * - 가로형: 640 x 480px
 * - 세로형: 480 x 640px
 *
 * @returns 필터 상태 및 제어 함수들
 */
export function useFilter(): UseFilterReturn {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("default");

  /**
   * 필터 타입에 따른 이미지 크기 계산
   * @param filter - 필터 타입
   * @returns 이미지 크기 객체
   */
  const getImageSize = useCallback((filter: FilterType) => {
    return FILTER[filter].imageSize;
  }, []);

  /**
   * 필터 변경 핸들러
   * @param filter - 변경할 필터 타입
   */
  const setFilter = useCallback((filter: FilterType) => {
    setSelectedFilter(filter);
  }, []);

  /**
   * 필터 옵션 목록 생성
   * enum 데이터를 기반으로 옵션 배열 생성
   */
  const filterOptions = FILTER_KEYS.map((key) => ({
    value: key,
    label: FILTER[key].label,
  }));

  return {
    selectedFilter,
    imageSize: getImageSize(selectedFilter),
    setFilter,
    filterOptions,
  };
}
