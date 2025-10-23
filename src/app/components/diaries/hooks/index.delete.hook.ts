"use client";

import { useCallback, useState } from "react";
import { EmotionType } from "@/commons/constants/enum";

/**
 * 일기 데이터 타입 정의
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
}

/**
 * 삭제 훅 반환 타입
 */
export interface UseDeleteDiaryReturn {
  /**
   * 삭제 중인지 여부
   */
  isDeleting: boolean;
  /**
   * 삭제 모달 표시 여부
   */
  isModalOpen: boolean;
  /**
   * 삭제할 일기 ID
   */
  deleteTargetId: number | null;
  /**
   * 삭제 모달 열기
   */
  openDeleteModal: (diaryId: number) => void;
  /**
   * 삭제 모달 닫기
   */
  closeDeleteModal: () => void;
  /**
   * 삭제 실행
   */
  handleDelete: () => Promise<void>;
}

/**
 * 일기 삭제 훅
 *
 * 일기 삭제 기능을 제공합니다.
 * - 로컬스토리지에서 일기 데이터 삭제
 * - 삭제 후 일기 목록 페이지로 이동
 *
 * @returns {UseDeleteDiaryReturn} 삭제 관련 함수와 상태를 포함한 객체
 */
export function useDeleteDiary(): UseDeleteDiaryReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  /**
   * 삭제 모달 열기
   * @param diaryId - 삭제할 일기 ID
   */
  const openDeleteModal = useCallback((diaryId: number) => {
    setDeleteTargetId(diaryId);
    setIsModalOpen(true);
  }, []);

  /**
   * 삭제 모달 닫기
   */
  const closeDeleteModal = useCallback(() => {
    setIsModalOpen(false);
    setDeleteTargetId(null);
  }, []);

  /**
   * 일기 삭제 실행
   */
  const handleDelete = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined" || deleteTargetId === null) return;

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
        (diary: { id: number }) => diary.id === deleteTargetId
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
      setDeleteTargetId(null);

      // 현재 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
      // 에러 처리 (실제 구현에서는 토스트 등 사용)
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTargetId]);

  return {
    isDeleting,
    isModalOpen,
    deleteTargetId,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}

export default useDeleteDiary;
