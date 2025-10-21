"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { EmotionType } from "@/commons/constants/enum";
import { getDiaryDetailUrl } from "@/commons/constants/url";

/**
 * 일기 폼 데이터 타입
 */
export interface DiaryFormData {
  title: string;
  content: string;
  emotion: EmotionType;
}

/**
 * 로컬스토리지에 저장될 일기 타입
 */
export interface StoredDiary extends DiaryFormData {
  id: number;
  createdAt: string;
}

/**
 * Zod 검증 스키마
 */
const diaryFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(100, "제목은 100자 이내로 입력해주세요."),
  content: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .max(5000, "내용은 5000자 이내로 입력해주세요."),
  emotion: z.enum(["Happy", "Sad", "Angry", "Surprise", "Etc"] as const),
});

type DiaryFormSchema = z.infer<typeof diaryFormSchema>;

/**
 * 일기 폼 등록 훅
 *
 * react-hook-form과 zod를 사용하여 폼 관리
 * - 검증: zod 스키마
 * - 저장소: 로컬스토리지 (key: "diaries")
 * - 상태관리: useForm 훅
 *
 * @param onSuccess - 등록 성공 후 콜백 함수 (모달 닫기, 페이지 이동)
 * @returns 폼 제어 객체 및 상태
 */
export const useFormDiary = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<DiaryFormSchema>({
    resolver: zodResolver(diaryFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      emotion: "Happy",
    },
  });

  /**
   * 로컬스토리지에서 기존 일기 조회
   */
  const getExistingDiaries = useCallback((): StoredDiary[] => {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem("diaries");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  /**
   * 로컬스토리지에 일기 저장
   */
  const saveDiaryToLocalStorage = useCallback(
    (diary: DiaryFormSchema): number => {
      const existingDiaries = getExistingDiaries();

      // 가장 큰 ID + 1 또는 1 설정
      const newId =
        existingDiaries.length > 0
          ? Math.max(...existingDiaries.map((d) => d.id)) + 1
          : 1;

      // 새로운 일기 생성
      const newDiary: StoredDiary = {
        ...diary,
        id: newId,
        createdAt: new Date().toISOString(),
      };

      // 기존 일기에 추가 또는 새로 생성
      const updatedDiaries = [...existingDiaries, newDiary];
      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));

      return newId;
    },
    [getExistingDiaries]
  );

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = useCallback(
    async (data: DiaryFormSchema) => {
      try {
        // 로컬스토리지에 저장
        const diaryId = saveDiaryToLocalStorage(data);

        // 등록완료 모달 표시
        openModal(
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="등록 완료"
            message="일기가 등록되었습니다."
            confirmText="확인"
            onConfirm={() => {
              // 폼 초기화
              reset();
              // 모든 모달 닫기 및 페이지 이동
              closeModal(); // 등록완료 모달 닫기
              closeModal(); // 일기쓰기 모달 닫기
              router.push(getDiaryDetailUrl(diaryId));
            }}
            onClose={() => {
              closeModal();
            }}
          />
        );
      } catch (error) {
        console.error("일기 등록 실패:", error);
      }
    },
    [saveDiaryToLocalStorage, openModal, closeModal, router, reset]
  );

  // 현재 폼 상태 감시
  const currentValues = watch();

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    formValues: currentValues,
  };
};
