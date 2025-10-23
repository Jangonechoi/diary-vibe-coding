"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { URLS } from "@/commons/constants/url";

/**
 * 일기 삭제 데이터 인터페이스
 */
export interface DiaryDeleteData {
  id: number;
}

/**
 * 일기 삭제 훅의 반환 타입
 */
export interface UseDiaryDeleteReturn {
  isDeleting: boolean;
  isModalOpen: boolean;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  handleDelete: () => Promise<void>;
}

/**
 * 일기 삭제 훅
 *
 * @param diaryId - 삭제할 일기의 ID
 * @returns 일기 삭제 관련 상태와 함수들
 */
export const useDiaryDelete = (diaryId: number): UseDiaryDeleteReturn => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 삭제 모달 열기
   */
  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 삭제 모달 닫기
   */
  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  /**
   * 일기 삭제 처리
   */
  const handleDelete = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
      setIsDeleting(true);

      // 로컬스토리지에서 일기 데이터 가져오기
      const storedDiaries = localStorage.getItem("diaries");
      if (!storedDiaries) {
        throw new Error("일기 데이터를 찾을 수 없습니다.");
      }

      const diaries = JSON.parse(storedDiaries);

      // 해당 일기 ID와 일치하는 일기 찾기
      const diaryIndex = diaries.findIndex(
        (diary: { id: number }) => diary.id === diaryId
      );

      if (diaryIndex === -1) {
        throw new Error("삭제할 일기를 찾을 수 없습니다.");
      }

      // 일기 삭제
      diaries.splice(diaryIndex, 1);

      // 로컬스토리지에 업데이트된 일기 목록 저장
      localStorage.setItem("diaries", JSON.stringify(diaries));

      // 모달 닫기
      setIsModalOpen(false);

      // 일기 목록 페이지로 이동
      router.push(URLS.DIARIES.path);
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
      // 에러 처리 (실제 구현에서는 토스트 등 사용)
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
};
