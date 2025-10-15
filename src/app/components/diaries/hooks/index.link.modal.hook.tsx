import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal/modal.provider';
import DiariesNew from '@/app/components/diaries-new';

/**
 * 일기쓰기 모달 관리 훅
 *
 * 일기쓰기 버튼 클릭 시 모달을 열고, 일기쓰기 컴포넌트를 모달로 표시합니다.
 *
 * @returns {Object} openWriteModal - 일기쓰기 모달을 여는 함수
 */
export const useDiaryWriteModal = () => {
  const { openModal, closeModal } = useModal();

  const openWriteModal = useCallback(() => {
    openModal(<DiariesNew />);
  }, [openModal]);

  return {
    openWriteModal,
    closeModal,
  };
};
