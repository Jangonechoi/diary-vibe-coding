import { useCallback } from "react";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";

/**
 * 일기쓰기 닫기 모달 관리 훅
 *
 * 닫기 버튼 클릭 시 등록취소 확인 모달을 중첩 모달로 띄우고,
 * 사용자의 선택에 따라 모달을 닫거나 계속 작성하도록 합니다.
 *
 * @returns {Object} openCloseConfirmModal - 등록취소 확인 모달을 여는 함수
 */
export const useLinkModalClose = () => {
  const { openModal, closeModal } = useModal();

  const openCloseConfirmModal = useCallback(() => {
    // 등록취소 확인 모달 열기 (중첩 모달)
    openModal(
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="등록 취소"
        message="일기 등록을 취소 하시겠어요?"
        confirmText="등록취소"
        cancelText="계속작성"
        onConfirm={() => {
          // 등록취소: 일기쓰기폼모달(부모)도 닫기
          closeModal(); // 일기쓰기폼모달(부모) 닫기
        }}
        onCancel={() => {
          // 계속작성: 등록취소모달(자식)만 닫기, 일기쓰기폼모달(부모)는 유지
          // 아무것도 하지 않음 (Modal이 onClose를 호출하여 등록취소모달만 닫힘)
        }}
        onClose={() => {
          // Modal 내부에서 호출되어 등록취소모달(자식) 닫기
          closeModal();
        }}
        data-testid="cancel-confirm-modal"
      />
    );
  }, [openModal, closeModal]);

  return {
    openCloseConfirmModal,
  };
};
