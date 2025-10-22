"use client";

import React, { useEffect, useState, useCallback, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import {
  URLS,
  getUrlMetaByPath,
  isAuthenticationRequired,
} from "@/commons/constants/url";

/**
 * 테스트 환경을 위한 전역 타입 선언
 */
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

/**
 * AuthGuard Props 타입
 */
interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard 컴포넌트
 *
 * 페이지별 권한 검증 및 리다이렉션을 담당합니다.
 * - 인증이 필요한 페이지에 비로그인 사용자가 접근 시 로그인 모달 표시
 * - 테스트 환경과 실제 환경을 구분하여 처리
 * - AuthProvider 초기화 완료 후 권한 검증 수행
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { openModal, closeModal } = useModal();

  // 권한 검증 완료 상태
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  // 모달 표시 여부 (중복 표시 방지)
  const [isModalShown, setIsModalShown] = useState(false);

  /**
   * 현재 경로의 URL 메타데이터 조회
   */
  const getCurrentUrlMeta = useCallback(() => {
    return getUrlMetaByPath(pathname);
  }, [pathname]);

  /**
   * 테스트 환경 여부 확인
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
   */
  const handleLoginConfirm = useCallback(() => {
    // 모든 모달 닫기
    closeModal();
    // 로그인 페이지로 이동
    router.push(URLS.LOGIN.path);
  }, [closeModal, router]);

  /**
   * 모달 닫기 핸들러
   */
  const handleModalClose = useCallback(() => {
    setIsModalShown(false);
  }, []);

  /**
   * 로그인 모달 표시
   */
  const showLoginModal = useCallback(() => {
    const modalContent = (
      <Modal
        variant="info"
        actions="single"
        title="로그인이 필요합니다"
        message="로그인 후 이용해 주세요."
        confirmText="로그인하기"
        onConfirm={handleLoginConfirm}
        onClose={handleModalClose}
      />
    );

    openModal(modalContent);
  }, [openModal, handleLoginConfirm, handleModalClose]);

  /**
   * 권한 검증 로직
   */
  const checkPermission = useCallback(() => {
    // AuthProvider 로딩 중이면 대기
    if (isLoading) {
      return;
    }

    // 테스트 환경에서는 모든 페이지 접근 허용 (가장 먼저 확인)
    if (isTestEnvironment()) {
      console.log("AuthGuard: 테스트 환경 감지 - 모든 페이지 접근 허용");
      setIsAuthChecked(true);
      return;
    }

    const urlMeta = getCurrentUrlMeta();

    // URL 메타데이터가 없으면 공개 페이지로 간주
    if (!urlMeta) {
      console.log("AuthGuard: URL 메타데이터 없음 - 공개 페이지로 간주");
      setIsAuthChecked(true);
      return;
    }

    // 실제 환경에서의 권한 검증
    const requiresAuth = isAuthenticationRequired(
      Object.keys(URLS).find(
        (key) => URLS[key as keyof typeof URLS].path === urlMeta.path
      ) as keyof typeof URLS
    );

    console.log("AuthGuard: 권한 검증", {
      path: pathname,
      requiresAuth,
      isAuthenticated,
      urlMeta: urlMeta.path,
    });

    if (requiresAuth && !isAuthenticated) {
      // 인증이 필요한 페이지에 비로그인 사용자가 접근
      console.log("AuthGuard: 인증 필요 - 로그인 모달 표시");
      if (!isModalShown) {
        showLoginModal();
        setIsModalShown(true);
      }
      setIsAuthChecked(false);
    } else {
      // 권한 검증 통과
      console.log("AuthGuard: 권한 검증 통과");
      setIsAuthChecked(true);
    }
  }, [
    isLoading,
    isAuthenticated,
    isModalShown,
    getCurrentUrlMeta,
    showLoginModal,
    isTestEnvironment,
    pathname,
  ]);

  // AuthProvider 로딩 상태와 경로 변경에 따른 권한 검증
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // 로딩 중이거나 권한 검증이 완료되지 않은 경우 빈 화면 표시
  if (isLoading || !isAuthChecked) {
    return <div data-testid="auth-guard-loading" />;
  }

  // 권한 검증 통과 시 children 렌더링
  return <>{children}</>;
}

export default AuthGuard;
