"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { URLS } from "@/commons/constants/url";

/**
 * 테스트 환경을 위한 전역 타입 선언
 */
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

/**
 * AuthGuardHook 반환 타입
 */
export interface AuthGuardHookReturn {
  /**
   * 권한 검증 함수
   * @param action - 실행할 액션 함수
   * @returns Promise<boolean> - 권한 검증 성공 여부
   */
  guard: (action: () => void | Promise<void>) => Promise<boolean>;
}

/**
 * useAuthGuard 훅
 *
 * 권한 여부를 검증하는 GUARD 기능을 제공합니다.
 * - 액션 GUARD 구현
 * - 인증 프로바이더를 활용한 로그인 유/무 판단
 * - 인가 실패 시 로그인 모달 표시
 * - 테스트 환경과 실제 환경 분리
 *
 * @returns {AuthGuardHookReturn} 권한 검증 함수를 포함한 객체
 *
 * @example
 * const { guard } = useAuthGuard();
 * const success = await guard(() => {
 *   // 보호된 액션 실행
 *   console.log('권한이 있는 사용자만 실행됩니다');
 * });
 */
export function useAuthGuard(): AuthGuardHookReturn {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { openModal, closeModal } = useModal();

  /**
   * 테스트 환경 여부 확인
   * 클라이언트 사이드에서 NEXT_PUBLIC_TEST_ENV 환경변수를 확인합니다.
   * 서버 사이드에서는 항상 false를 반환하여 권한 검증을 수행합니다.
   */
  const isTestEnvironment = useCallback(() => {
    // 클라이언트 사이드에서 환경변수 확인
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_TEST_ENV === "test";
    }
    // 서버 사이드에서는 false (SSR 시에는 권한 검증 수행)
    return false;
  }, []);

  /**
   * 로그인 모달 확인 버튼 클릭 핸들러
   * 모든 모달을 닫고 로그인 페이지로 이동합니다.
   */
  const handleLoginConfirm = useCallback(() => {
    // 모든 모달 닫기
    closeModal();
    // 로그인 페이지로 이동
    router.push(URLS.LOGIN.path);
  }, [closeModal, router]);

  /**
   * 모달 닫기 핸들러
   * 모달을 닫고 중복 표시를 방지합니다.
   */
  const handleModalClose = useCallback(() => {
    // 모달 닫기 (중복 표시 방지를 위한 추가 로직은 필요시 구현)
  }, []);

  /**
   * 로그인 모달 표시
   * 권한이 없는 사용자에게 로그인을 요청하는 모달을 표시합니다.
   */
  const showLoginModal = useCallback(() => {
    const modalContent = (
      <Modal
        variant="info"
        actions="dual"
        title="로그인이 필요합니다"
        message="로그인 후 이용해 주세요."
        confirmText="로그인하러가기"
        cancelText="취소"
        onConfirm={handleLoginConfirm}
        onCancel={handleModalClose}
        onClose={handleModalClose}
      />
    );

    openModal(modalContent);
  }, [openModal, handleLoginConfirm, handleModalClose]);

  /**
   * 권한 검증 함수
   *
   * 액션 실행 전 권한을 검증합니다.
   * - 테스트 환경에서는 window.__TEST_BYPASS__ 플래그에 따라 검증 여부 결정
   * - 실제 환경에서는 항상 인증 상태를 확인
   * - 권한이 없으면 로그인 모달을 표시하고 액션 실행을 중단
   *
   * @param action - 실행할 액션 함수
   * @returns Promise<boolean> - 권한 검증 성공 여부
   */
  const guard = useCallback(
    async (action: () => void | Promise<void>): Promise<boolean> => {
      // AuthProvider 로딩 중이면 대기
      if (isLoading) {
        console.log("AuthGuard: AuthProvider 로딩 중 - 권한 검증 대기");
        return false;
      }

      // 테스트 환경에서는 window.__TEST_BYPASS__ 플래그 확인
      if (isTestEnvironment()) {
        // 테스트 환경에서 window.__TEST_BYPASS__가 false인 경우에만 권한 검증 수행
        if (typeof window !== "undefined" && window.__TEST_BYPASS__ === false) {
          console.log(
            "AuthGuard: 테스트 환경 - 비회원 가드 테스트를 위해 권한 검증 수행"
          );
          if (!isAuthenticated) {
            showLoginModal();
            return false;
          }
        } else {
          // 테스트 환경에서 기본적으로 로그인 검사 패스
          console.log("AuthGuard: 테스트 환경 - 로그인 검사 패스");
          await action();
          return true;
        }
      }

      // 실제 환경에서는 항상 권한 검증 수행
      console.log("AuthGuard: 실제 환경 - 권한 검증 수행", {
        isAuthenticated,
        isLoading,
      });

      if (!isAuthenticated) {
        // 비로그인 사용자 - 로그인 모달 표시
        console.log("AuthGuard: 비로그인 사용자 - 로그인 모달 표시");
        showLoginModal();
        return false;
      }

      // 로그인된 사용자 - 액션 실행
      console.log("AuthGuard: 로그인된 사용자 - 액션 실행");
      await action();
      return true;
    },
    [isLoading, isAuthenticated, isTestEnvironment, showLoginModal]
  );

  return {
    guard,
  };
}

export default useAuthGuard;
