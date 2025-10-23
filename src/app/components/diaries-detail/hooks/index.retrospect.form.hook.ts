"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";

/**
 * 회고 데이터 타입
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 데이터 타입
 */
export interface RetrospectFormData {
  content: string;
}

/**
 * 회고쓰기 폼 훅 반환 타입
 */
export interface UseRetrospectFormReturn {
  form: ReturnType<typeof useForm<RetrospectFormData>>;
  onSubmit: (data: RetrospectFormData) => void;
  isSubmitEnabled: boolean;
}

/**
 * Zod 검증 스키마
 */
const retrospectFormSchema = z.object({
  content: z.string().min(1, "회고 내용을 입력해주세요."),
});

/**
 * 회고쓰기 폼 등록 훅
 *
 * react-hook-form과 zod를 사용하여 회고 폼 관리
 * - 검증: zod 스키마
 * - 저장소: 로컬스토리지 (key: "retrospects")
 * - 상태관리: useForm 훅
 *
 * @param diaryId - 연결된 일기 ID
 * @returns 폼 제어 객체 및 상태
 */
export const useRetrospectForm = (diaryId: number): UseRetrospectFormReturn => {
  const form = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    defaultValues: {
      content: "",
    },
  });

  /**
   * 로컬스토리지에서 기존 회고 데이터 조회
   */
  const getExistingRetrospects = useCallback((): RetrospectData[] => {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem("retrospects");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  /**
   * 로컬스토리지에 회고 데이터 저장
   */
  const saveRetrospectsToLocalStorage = useCallback(
    (retrospects: RetrospectData[]) => {
      if (typeof window === "undefined") return;

      try {
        localStorage.setItem("retrospects", JSON.stringify(retrospects));
      } catch {
        // 에러 발생 시 조용히 처리
      }
    },
    []
  );

  /**
   * 회고 등록 처리
   */
  const onSubmit = useCallback(
    (data: RetrospectFormData) => {
      const existingRetrospects = getExistingRetrospects();

      // 가장 큰 ID + 1 또는 1 설정
      const newId =
        existingRetrospects.length > 0
          ? Math.max(...existingRetrospects.map((r) => r.id)) + 1
          : 1;

      // 새로운 회고 데이터 생성
      const newRetrospect: RetrospectData = {
        id: newId,
        content: data.content.trim(),
        diaryId: diaryId,
        createdAt: new Date().toISOString(),
      };

      // 기존 회고 목록에 새 회고 추가
      const updatedRetrospects = [...existingRetrospects, newRetrospect];
      saveRetrospectsToLocalStorage(updatedRetrospects);

      // 폼 초기화
      form.reset();

      // 페이지 새로고침
      window.location.reload();
    },
    [diaryId, form, getExistingRetrospects, saveRetrospectsToLocalStorage]
  );

  /**
   * 입력 버튼 활성화 여부 확인
   */
  const isSubmitEnabled = form.watch("content")?.trim().length > 0;

  return {
    form,
    onSubmit,
    isSubmitEnabled,
  };
};
