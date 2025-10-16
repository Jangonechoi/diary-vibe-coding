"use client";

import { useCallback, useEffect, useState } from "react";
import { EmotionType } from "@/commons/constants/enum";

/**
 * 로컬스토리지에 저장될 일기 타입
 */
export interface StoredDiary {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 일기 상세 바인딩 훅
 *
 * 로컬스토리지에서 일기 ID로 데이터를 조회하여 바인딩
 * - 저장소: 로컬스토리지 (key: "diaries")
 * - 바인딩 데이터: ID와 일치하는 일기 객체
 *
 * @param diaryId - 조회할 일기 ID
 * @returns 바인딩된 일기 데이터 및 상태
 */
export const useBindingDiary = (diaryId?: string) => {
  const [diary, setDiary] = useState<StoredDiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 조회
   */
  const fetchDiaryById = useCallback((): StoredDiary | null => {
    if (typeof window === "undefined") return null;

    try {
      const data = localStorage.getItem("diaries");
      if (!data) return null;

      const diaries: StoredDiary[] = JSON.parse(data);

      if (!diaryId) return null;

      const numericId = Number(diaryId);
      if (isNaN(numericId)) return null;

      const foundDiary = diaries.find((d) => d.id === numericId);
      return foundDiary || null;
    } catch (err) {
      console.error("로컬스토리지 조회 실패:", err);
      return null;
    }
  }, [diaryId]);

  /**
   * 일기 데이터 로드
   */
  useEffect(() => {
    const foundDiary = fetchDiaryById();
    if (foundDiary) {
      setDiary(foundDiary);
      setError(null);
    } else {
      setDiary(null);
      setError(diaryId ? "일기를 찾을 수 없습니다." : null);
    }
    setLoading(false);
  }, [diaryId, fetchDiaryById]);

  return {
    diary,
    loading,
    error,
  };
};
