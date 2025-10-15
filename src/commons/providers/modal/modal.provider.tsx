'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal Context 타입 정의
 */
interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
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
 * 애플리케이션 전역에서 사용할 수 있는 모달 관리 기능을 제공합니다.
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 portal 사용
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // 애니메이션을 위한 약간의 지연 후 content 초기화
    setTimeout(() => {
      setContent(null);
    }, 300);
  }, []);

  const value = {
    isOpen,
    content,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 transition-opacity" aria-hidden="true" />

            {/* Modal Content Wrapper */}
            <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
              {content}
            </div>
          </div>,
          document.body
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
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
