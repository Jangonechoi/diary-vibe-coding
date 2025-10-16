"use client";

import React from "react";
import { Button } from "../button";
import styles from "./styles.module.css";

/**
 * Modal Variant Types
 */
export type ModalVariant = "info" | "danger";
export type ModalActions = "single" | "dual";
export type ModalTheme = "light" | "dark";

/**
 * Modal Component Props
 */
export interface ModalProps {
  /**
   * 모달의 시각적 스타일 변형
   * @default 'info'
   */
  variant?: ModalVariant;

  /**
   * 모달의 액션 타입 (버튼 개수)
   * @default 'single'
   */
  actions?: ModalActions;

  /**
   * 테마 (라이트/다크 모드)
   * @default 'light'
   */
  theme?: ModalTheme;

  /**
   * 모달 타이틀
   */
  title: string;

  /**
   * 모달 설명 메시지
   */
  message: string;

  /**
   * 확인 버튼 텍스트
   * @default '확인'
   */
  confirmText?: string;

  /**
   * 취소 버튼 텍스트 (actions: 'dual'일 때만 사용)
   * @default '취소'
   */
  cancelText?: string;

  /**
   * 확인 버튼 클릭 핸들러
   */
  onConfirm?: () => void;

  /**
   * 취소 버튼 클릭 핸들러 (actions: 'dual'일 때만 사용)
   */
  onCancel?: () => void;

  /**
   * 모달 닫기 핸들러
   */
  onClose?: () => void;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Modal Component
 *
 * 완전한 variant 시스템을 갖춘 모달 컴포넌트
 * - variant: info, danger
 * - actions: single, dual
 * - theme: light, dark
 *
 * @example
 * ```tsx
 * <Modal
 *   variant="info"
 *   actions="single"
 *   theme="light"
 *   title="일기 등록 완료"
 *   message="등록이 완료 되었습니다."
 *   confirmText="확인"
 *   onConfirm={() => console.log('confirmed')}
 * />
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  variant = "info",
  actions = "single",
  theme = "light",
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  onClose,
  className = "",
}) => {
  // 클래스명 조합
  const modalClasses = [styles.modal, styles[variant], styles[theme], className]
    .filter(Boolean)
    .join(" ");

  const contentClasses = [styles.content, styles[theme]]
    .filter(Boolean)
    .join(" ");

  const titleClasses = [styles.title, styles[theme]].filter(Boolean).join(" ");

  const messageClasses = [styles.message, styles[theme]]
    .filter(Boolean)
    .join(" ");

  const actionsClasses = [styles.actions, styles[actions], styles[theme]]
    .filter(Boolean)
    .join(" ");

  // 버튼 variant 결정
  const confirmButtonVariant = variant === "danger" ? "primary" : "primary";
  const cancelButtonVariant = "secondary";

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        <div className={titleClasses}>{title}</div>
        <div className={messageClasses}>{message}</div>
      </div>

      <div className={actionsClasses}>
        {actions === "dual" && (
          <Button
            variant={cancelButtonVariant}
            size="large"
            theme="light"
            onClick={handleCancel}
            className={styles.buttonDual}
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={confirmButtonVariant}
          size="large"
          theme="light"
          onClick={handleConfirm}
          className={
            actions === "single" ? styles.buttonSingle : styles.buttonDual
          }
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

Modal.displayName = "Modal";

export default Modal;
