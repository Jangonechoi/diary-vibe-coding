"use client";

import { useState, useCallback, useEffect } from "react";
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
 * - 기본: 640 x 640px (767px 이하: 280 x 280px)
 * - 가로형: 640 x 480px (767px 이하: 280 x 210px)
 * - 세로형: 480 x 640px (767px 이하: 280 x 372px)
 *
 * @returns 필터 상태 및 제어 함수들
 */
export function useFilter(): UseFilterReturn {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("default");
  const [isMobile, setIsMobile] = useState(false);

  /**
   * 브레이크포인트 확인 (767px)
   */
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  /**
   * 필터 타입에 따른 이미지 크기 계산
   * 브레이크포인트 기반 반응형 적용
   * @param filter - 필터 타입
   * @returns 이미지 크기 객체
   */
  const getImageSize = useCallback(
    (filter: FilterType) => {
      const baseSize = FILTER[filter].imageSize;

      if (isMobile) {
        // 767px 이하에서 각 필터 타입별로 축소된 크기 반환
        // 피그마 디자인 반영: 모든 카드 폭은 280px로 통일
        switch (filter) {
          case "default":
            // 640 x 640 -> 280 x 280 (43.75% 축소)
            return { width: 280, height: 280 };
          case "horizontal":
            // 640 x 480 -> 280 x 210 (43.75% 축소)
            return { width: 280, height: 210 };
          case "vertical":
            // 480 x 640 -> 280 x 372 (58.125% 폭 축소, 피그마 디자인 반영)
            return { width: 280, height: 372 };
        }
      }

      return baseSize;
    },
    [isMobile]
  );

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
