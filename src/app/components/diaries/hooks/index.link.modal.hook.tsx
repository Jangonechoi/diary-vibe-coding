"use client";

import { useCallback } from "react";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import DiariesNew from "@/app/components/diaries-new";

/**
 * 일기쓰기 모달 관리 훅
 *
 * 일기쓰기 버튼 클릭 시 권한을 검증하고, 권한이 있는 경우에만 모달을 열어 일기쓰기 컴포넌트를 표시합니다.
 * 권한이 없는 경우 로그인 요청 모달이 표시됩니다.
 *
 * @returns {Object} openWriteModal - 일기쓰기 모달을 여는 함수 (권한 검증 포함)
 */
export const useDiaryWriteModal = () => {
  const { openModal, closeModal } = useModal();
  const { guard } = useAuthGuard();

  const openWriteModal = useCallback(async () => {
    // 권한 검증 후 일기쓰기 모달 열기
    await guard(() => {
      openModal(<DiariesNew />);
    });
  }, [guard, openModal]);

  return {
    openWriteModal,
    closeModal,
  };
};
