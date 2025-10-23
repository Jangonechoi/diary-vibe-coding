"use client";

import { useCallback, useState } from "react";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
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
   * 삭제 모달 표시 여부
   */
  isDeleteModalOpen: boolean;
  /**
   * 삭제할 일기 ID
   */
  deleteTargetId: number | null;
  /**
   * 일기 삭제 핸들러 (권한 검증 포함)
   */
  handleDeleteDiary: (diaryId: number) => Promise<void>;
  /**
   * 삭제 모달 닫기 핸들러
   */
  closeDeleteModal: () => void;
  /**
   * 삭제 확인 핸들러
   */
  confirmDelete: () => void;
}

/**
 * 일기 삭제 훅
 *
 * 권한 검증을 통한 일기 삭제 기능을 제공합니다.
 * - AuthGuard를 통한 권한 검증
 * - 삭제 확인 모달 표시
 * - 로컬스토리지에서 일기 데이터 삭제
 * - 페이지 새로고침
 *
 * @returns {UseDeleteDiaryReturn} 삭제 관련 함수와 상태를 포함한 객체
 */
export function useDeleteDiary(): UseDeleteDiaryReturn {
  const { guard } = useAuthGuard();
  const { openModal, closeModal } = useModal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터 삭제
   * @param diaryId - 삭제할 일기 ID
   */
  const deleteDiaryFromStorage = useCallback((diaryId: number) => {
    try {
      const diariesData = localStorage.getItem("diaries");
      if (!diariesData) {
        console.warn("삭제할 일기 데이터가 없습니다.");
        return;
      }

      const diaries: DiaryData[] = JSON.parse(diariesData);
      const updatedDiaries = diaries.filter((diary) => diary.id !== diaryId);

      localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
      console.log(`일기 ID ${diaryId} 삭제 완료`);
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
    }
  }, []);

  /**
   * 삭제 확인 핸들러
   */
  const confirmDelete = useCallback(() => {
    if (deleteTargetId !== null) {
      deleteDiaryFromStorage(deleteTargetId);
      closeDeleteModal();
      // 페이지 새로고침
      window.location.reload();
    }
  }, [deleteTargetId, deleteDiaryFromStorage]);

  /**
   * 삭제 모달 닫기 핸들러
   */
  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    closeModal();
  }, [closeModal]);

  /**
   * 삭제 모달 표시
   * @param diaryId - 삭제할 일기 ID
   */
  const showDeleteModal = useCallback(
    (diaryId: number) => {
      setDeleteTargetId(diaryId);
      setIsDeleteModalOpen(true);

      const modalContent = (
        <Modal
          variant="danger"
          actions="dual"
          title="일기 삭제"
          message="정말로 이 일기를 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      );

      openModal(modalContent);
    },
    [openModal, confirmDelete, closeDeleteModal]
  );

  /**
   * 일기 삭제 핸들러 (권한 검증 포함)
   * @param diaryId - 삭제할 일기 ID
   */
  const handleDeleteDiary = useCallback(
    async (diaryId: number) => {
      await guard(() => {
        showDeleteModal(diaryId);
      });
    },
    [guard, showDeleteModal]
  );

  return {
    isDeleteModalOpen,
    deleteTargetId,
    handleDeleteDiary,
    closeDeleteModal,
    confirmDelete,
  };
}

export default useDeleteDiary;
