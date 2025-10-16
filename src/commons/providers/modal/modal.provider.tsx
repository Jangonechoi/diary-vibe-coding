"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

/**
 * Modal 스택 아이템 인터페이스
 */
interface ModalStackItem {
  id: string;
  content: ReactNode;
}

/**
 * Modal Context 타입 정의
 */
interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalStack: ModalStackItem[];
}

/**
 * Modal Context 생성
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Modal Provider Props
 */
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Modal Provider 컴포넌트
 *
 * 중첩 모달을 지원하는 애플리케이션 전역 모달 관리 기능을 제공합니다.
 * - 중첩 모달 스택 관리
 * - 각 모달별 독립적인 backdrop
 * - 모달이 열려있을 때 body 스크롤 제어
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 portal 사용
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // body 스크롤 제어: 모달이 1개라도 열려있으면 스크롤 제거
  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalStack.length]);

  /**
   * 모달 열기
   * - 새로운 모달을 스택에 추가
   */
  const openModal = useCallback((modalContent: ReactNode) => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    setModalStack((prev) => [...prev, { id, content: modalContent }]);
  }, []);

  /**
   * 모달 닫기
   * - 스택에서 가장 최근 모달 제거
   */
  const closeModal = useCallback(() => {
    setModalStack((prev) => prev.slice(0, -1));
  }, []);

  const value = {
    isOpen: modalStack.length > 0,
    openModal,
    closeModal,
    modalStack,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted &&
        modalStack.map((modal, index) =>
          createPortal(
            <div
              key={modal.id}
              className={styles.modalOverlay}
              style={{
                zIndex: 50 + index * 10,
              }}
              onClick={closeModal}
            >
              {/* Backdrop - 각 모달마다 독립적인 backdrop */}
              <div className={styles.backdrop} aria-hidden="true" />

              {/* Modal Content Wrapper */}
              <div
                className={styles.modalWrapper}
                onClick={(e) => e.stopPropagation()}
              >
                {modal.content}
              </div>
            </div>,
            document.body
          )
        )}
    </ModalContext.Provider>
  );
};

/**
 * Modal Hook
 *
 * Modal Context를 사용하기 위한 커스텀 훅
 *
 * @returns {ModalContextType} Modal 컨텍스트
 * @throws {Error} ModalProvider 외부에서 사용 시 에러 발생
 *
 * @example
 * const { openModal, closeModal } = useModal();
 * openModal(<div>Modal Content</div>);
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
