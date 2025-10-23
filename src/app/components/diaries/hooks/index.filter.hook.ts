"use client";

import { useState, useMemo } from "react";
import { EmotionType, EMOTION_KEYS, EMOTION } from "@/commons/constants/enum";
import { DiaryCard } from "./index.binding.hook";

export type Diary = DiaryCard;

export interface FilterOption {
  value: string;
  label: string;
}

export interface UseFilterDiariesReturn {
  selectedFilter: string;
  filterOptions: FilterOption[];
  filteredDiaries: Diary[];
  handleFilterChange: (value: string) => void;
  applyFilter: (diaries: Diary[], filterValue: string) => Diary[];
}

/**
 * 일기 필터링 기능을 제공하는 커스텀 훅
 *
 * @param diaries - 필터링할 일기 목록
 * @returns 필터링 관련 상태와 함수들
 */
export const useFilterDiaries = (diaries: Diary[]): UseFilterDiariesReturn => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // 필터 옵션 생성 - ENUM 활용
  const filterOptions: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "전체" },
      ...EMOTION_KEYS.map((emotion) => ({
        value: emotion.toLowerCase(),
        label: EMOTION[emotion].label,
      })),
    ],
    []
  );

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  // 필터 적용 함수
  const applyFilter = (diaries: Diary[], filterValue: string): Diary[] => {
    if (filterValue === "all") {
      return diaries;
    }

    // emotion enum과 매칭되는 필터만 허용
    const emotionKey = EMOTION_KEYS.find(
      (key) => key.toLowerCase() === filterValue
    ) as EmotionType | undefined;

    if (!emotionKey) {
      return diaries;
    }

    return diaries.filter((diary) => diary.emotion === emotionKey);
  };

  // 필터링된 일기 목록
  const filteredDiaries = useMemo(() => {
    return applyFilter(diaries, selectedFilter);
  }, [diaries, selectedFilter]);

  return {
    selectedFilter,
    filterOptions,
    filteredDiaries,
    handleFilterChange,
    applyFilter,
  };
};
