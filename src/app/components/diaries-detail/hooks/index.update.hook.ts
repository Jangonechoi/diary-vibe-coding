"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmotionType, EMOTION_KEYS } from "@/commons/constants/enum";

/**
 * 일기 수정 폼 데이터 타입
 */
export interface DiaryUpdateData {
  emotion: EmotionType;
  title: string;
  content: string;
}

/**
 * 일기 수정 폼 스키마
 */
const diaryUpdateSchema = z.object({
  emotion: z.enum(EMOTION_KEYS as [EmotionType, ...EmotionType[]], {
    message: "감정을 선택해주세요.",
  }),
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(100, "제목은 100자 이하로 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(1000, "내용은 1000자 이하로 입력해주세요."),
});

/**
 * 일기 수정 훅
 *
 * @param diaryId - 수정할 일기 ID
 * @param initialData - 초기 데이터 (기존 일기 데이터)
 * @returns 일기 수정 관련 상태와 함수들
 */
export const useDiaryUpdate = (
  diaryId: number,
  initialData?: DiaryUpdateData
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 설정
  const form = useForm<DiaryUpdateData>({
    resolver: zodResolver(diaryUpdateSchema),
    defaultValues: initialData || {
      emotion: "Happy",
      title: "",
      content: "",
    },
  });

  // initialData가 변경될 때 폼 업데이트
  useEffect(() => {
    if (initialData) {
      console.log("useEffect에서 폼 업데이트:", initialData);
      form.setValue("emotion", initialData.emotion);
      form.setValue("title", initialData.title);
      form.setValue("content", initialData.content);
    }
  }, [initialData, form]);

  /**
   * 수정 모드 시작
   */
  const startEditing = () => {
    console.log("수정 모드 시작, initialData:", initialData);
    setIsEditing(true);
    // 수정 모드로 들어갈 때 기존 데이터로 폼 초기화
    if (initialData) {
      console.log("폼 리셋 실행:", initialData);
      // reset과 setValue 조합 사용
      form.reset(initialData, { keepDefaultValues: false });
      console.log("폼 값 설정 완료:", form.getValues());
    }
    // 수정 모드로 전환 시 제목 필드에 포커스
    setTimeout(() => {
      const titleInput = document.querySelector(
        'input[name="title"]'
      ) as HTMLInputElement;
      if (titleInput) {
        titleInput.focus();
        titleInput.select(); // 기존 텍스트 선택
      }
    }, 100);
  };

  /**
   * 수정 모드 취소
   */
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    // 폼을 초기값으로 리셋
    if (initialData) {
      form.setValue("emotion", initialData.emotion);
      form.setValue("title", initialData.title);
      form.setValue("content", initialData.content);
    }
  }, [initialData, form]);

  /**
   * 일기 수정 제출
   */
  const onSubmit = async (data: DiaryUpdateData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 로컬스토리지에서 기존 일기 데이터 가져오기
      const storedDiaries = localStorage.getItem("diaries");
      if (!storedDiaries) {
        throw new Error("일기 데이터를 찾을 수 없습니다.");
      }

      const diaries = JSON.parse(storedDiaries);
      const diaryIndex = diaries.findIndex(
        (diary: { id: number }) => diary.id === diaryId
      );

      if (diaryIndex === -1) {
        throw new Error("수정할 일기를 찾을 수 없습니다.");
      }

      // 일기 데이터 업데이트
      const updatedDiary = {
        ...diaries[diaryIndex],
        emotion: data.emotion,
        title: data.title,
        content: data.content,
        updatedAt: new Date().toISOString(),
      };

      diaries[diaryIndex] = updatedDiary;

      // 로컬스토리지에 저장
      localStorage.setItem("diaries", JSON.stringify(diaries));

      // 수정 모드 종료
      setIsEditing(false);
      setIsSubmitting(false);

      // 페이지 새로고침으로 데이터 반영
      window.location.reload();
    } catch (error) {
      console.error("일기 수정 중 오류 발생:", error);
      setIsSubmitting(false);
      alert("일기 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = form.handleSubmit(onSubmit);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing) {
        // ESC 키로 수정 모드 취소
        if (event.key === "Escape") {
          cancelEditing();
        }
        // Ctrl+Enter 또는 Cmd+Enter로 저장
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
          event.preventDefault();
          handleSubmit();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, handleSubmit, cancelEditing]);

  /**
   * 수정 가능 여부 (폼이 유효하고 제출 중이 아니며 변경사항이 있을 때)
   */
  const canSubmit =
    form.formState.isValid && !isSubmitting && form.formState.isDirty;

  return {
    // 상태
    isEditing,
    isSubmitting,
    canSubmit,

    // 폼
    form,

    // 함수
    startEditing,
    cancelEditing,
    handleSubmit,

    // 추가 정보
    hasChanges: form.formState.isDirty,
    isFormValid: form.formState.isValid,
  };
};
