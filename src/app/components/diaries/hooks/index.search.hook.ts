"use client";

import { useState, useCallback } from "react";
import { EmotionType } from "@/commons/constants/enum";

/**
 * 일기 데이터 타입 정의 (DiaryCard와 호환)
 */
export interface DiaryData {
  id: string;
  title: string;
  emotion: EmotionType;
  date: string;
}

/**
 * 검색 기능을 위한 커스텀 훅
 */
export const useSearchDiaries = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryData[]>([]);

  /**
   * 로컬스토리지에서 일기 데이터를 가져오는 함수
   */
  const getDiariesFromStorage = useCallback((): DiaryData[] => {
    try {
      const stored = localStorage.getItem("diaries");
      if (!stored) return [];

      const storedDiaries = JSON.parse(stored);
      if (!Array.isArray(storedDiaries)) return [];

      // StoredDiary를 DiaryData 형식으로 변환
      return storedDiaries.map((diary: Record<string, unknown>) => ({
        id: String(diary.id),
        title: String(diary.title),
        emotion: diary.emotion as EmotionType,
        date: String(diary.createdAt),
      }));
    } catch (error) {
      console.error("일기 데이터를 불러오는 중 오류가 발생했습니다:", error);
      return [];
    }
  }, []);

  /**
   * 검색어에 따라 일기를 필터링하는 함수
   * @param query 검색어
   */
  const searchDiaries = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredDiaries([]);
        return;
      }

      const allDiaries = getDiariesFromStorage();
      const filtered = allDiaries.filter((diary) =>
        diary.title.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredDiaries(filtered);
    },
    [getDiariesFromStorage]
  );

  /**
   * 검색어 변경 시 자동으로 검색 실행
   */
  const handleSearchQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredDiaries([]);
        return;
      }

      const allDiaries = getDiariesFromStorage();
      const filtered = allDiaries.filter((diary) =>
        diary.title.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredDiaries(filtered);
    },
    [getDiariesFromStorage]
  );

  /**
   * 검색 결과를 초기화하는 함수
   */
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredDiaries([]);
  }, []);

  /**
   * 검색 결과가 있는지 확인하는 함수
   */
  const hasSearchResults = useCallback(() => {
    return filteredDiaries.length > 0;
  }, [filteredDiaries.length]);

  return {
    searchQuery,
    filteredDiaries,
    searchDiaries,
    clearSearch,
    hasSearchResults,
    handleSearchQueryChange,
  };
};
