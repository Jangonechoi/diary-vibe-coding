'use client';

import { usePathname } from 'next/navigation';
import { getUrlMetaByPath } from '@/commons/constants/url';
import type { LayoutVisibility } from '@/commons/constants/url';

/**
 * 레이아웃 영역 가시성 Hook
 *
 * 현재 경로에 따라 레이아웃 각 영역의 노출 여부를 반환합니다.
 */
export const useLayoutArea = (): LayoutVisibility => {
  const pathname = usePathname();

  const urlMeta = getUrlMetaByPath(pathname);

  // URL 메타데이터가 없는 경우 기본값 반환 (모든 영역 노출)
  if (!urlMeta) {
    return {
      header: true,
      logo: true,
      darkModeToggle: false,
      banner: true,
      navigation: true,
      footer: true,
    };
  }

  return urlMeta.visibility;
};
