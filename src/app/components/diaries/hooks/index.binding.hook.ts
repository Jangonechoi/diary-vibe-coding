"use client";

import { useEffect, useState } from "react";
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
 * 화면에 표시될 일기 카드 타입
 */
export interface DiaryCard {
  id: string;
  emotion: EmotionType;
  date: string;
  title: string;
}

/**
 * 일기 목록 바인딩 훅
 *
 * 로컬스토리지에서 일기 데이터를 조회하여 목록에 바인딩
 * - 저장소: 로컬스토리지 (key: "diaries")
 * - 바인딩 데이터: 로컬스토리지의 diaries 배열
 *
 * @returns 바인딩된 일기 목록 데이터
 */
export const useBindingDiaries = () => {
  const [diaries, setDiaries] = useState<DiaryCard[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 로컬스토리지에서 일기 목록 조회
   */
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    try {
      const data = localStorage.getItem("diaries");
      if (!data) {
        setDiaries([]);
        setLoading(false);
        return;
      }

      const storedDiaries: StoredDiary[] = JSON.parse(data);

      // StoredDiary를 DiaryCard 형식으로 변환
      const transformedDiaries: DiaryCard[] = storedDiaries.map((diary) => ({
        id: String(diary.id),
        emotion: diary.emotion,
        date: diary.createdAt,
        title: diary.title,
      }));

      setDiaries(transformedDiaries);
    } catch (err) {
      console.error("로컬스토리지 조회 실패:", err);
      setDiaries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    diaries,
    loading,
  };
};
