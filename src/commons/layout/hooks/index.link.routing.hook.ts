'use client';

import { usePathname } from 'next/navigation';

/**
 * Layout 라우팅 훅
 *
 * 현재 경로를 기반으로 네비게이션 탭의 액티브 상태를 관리합니다.
 */
export function useLayoutRouting() {
  const pathname = usePathname();

  /**
   * 주어진 경로가 현재 액티브 상태인지 확인
   *
   * @param path - 확인할 경로
   * @returns 액티브 상태 여부
   */
  const isActive = (path: string): boolean => {
    return pathname === path;
  };

  return {
    pathname,
    isActive,
  };
}
