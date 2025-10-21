"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
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
 * 사용자 정보 인터페이스
 */
export interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * AuthContext 타입 정의
 */
interface AuthContextType {
  // 상태
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  // 액션
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

/**
 * AuthContext 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Props 타입
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider 컴포넌트
 *
 * 인증 상태를 관리하고 하위 컴포넌트에 인증 관련 기능을 제공합니다.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  // 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * 로그인 상태 검증
   * 로컬스토리지의 accessToken 존재 여부로 로그인 상태를 확인합니다.
   * 테스트 환경에서는 window.__TEST_BYPASS__ 플래그를 확인합니다.
   */
  const checkAuthStatus = useCallback(() => {
    try {
      // 테스트 환경에서 로그인 우회 설정 확인
      if (typeof window !== "undefined" && window.__TEST_BYPASS__ === false) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (accessToken && userData) {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth status check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 로그인 함수
   * 사용자 정보와 액세스 토큰을 로컬스토리지에 저장하고 상태를 업데이트합니다.
   */
  const login = useCallback((userData: User, accessToken: string) => {
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  }, []);

  /**
   * 로그아웃 함수
   * 로컬스토리지에서 토큰과 사용자 정보를 제거하고 로그인 페이지로 이동합니다.
   */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUser(null);
      router.push(URLS.LOGIN.path);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 로컬스토리지 변경 감지 (다른 탭에서의 로그인/로그아웃 감지)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "user") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuthStatus]);

  // Context 값
  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth 훅
 * AuthContext를 사용하기 위한 커스텀 훅입니다.
 *
 * @returns {AuthContextType} Auth 컨텍스트
 * @throws {Error} AuthProvider 외부에서 사용 시 에러 발생
 *
 * @example
 * const { isAuthenticated, login, logout } = useAuth();
 * if (isAuthenticated) { ... }
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthProvider;
