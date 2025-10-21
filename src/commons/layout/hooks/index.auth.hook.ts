"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import { URLS } from "@/commons/constants/url";

/**
 * Layout 인증 관련 훅
 *
 * 인증 상태에 따른 UI 분기 및 인증 관련 액션을 제공합니다.
 */
export function useLayoutAuth() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  /**
   * 로그인 페이지로 이동
   */
  const handleLogin = () => {
    router.push(URLS.LOGIN.path);
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    logout();
  };

  return {
    // 상태
    isAuthenticated,
    user,

    // 액션
    handleLogin,
    handleLogout,
  };
}
