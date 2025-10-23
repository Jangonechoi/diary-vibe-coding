"use client";

import { useRouter } from "next/navigation";
import { getDiaryDetailUrl } from "@/commons/constants/url";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";

/**
 * 일기 카드 라우팅 훅
 *
 * 일기 카드 클릭 시 일기 상세 페이지로 이동하는 기능을 제공합니다.
 * - url.ts에 정의된 경로를 사용하여 하드코딩을 방지합니다.
 * - 삭제 아이콘 클릭 시에는 페이지 이동을 차단합니다.
 * - 권한 검증을 통해 비로그인 사용자는 로그인 모달이 표시됩니다.
 *
 * @returns 일기 카드 클릭 핸들러와 삭제 아이콘 클릭 핸들러
 */
export const useLinkRoutingDiaries = () => {
  const router = useRouter();
  const { guard } = useAuthGuard();

  /**
   * 일기 카드 클릭 핸들러
   * 권한 검증 후 일기 상세 페이지로 이동합니다.
   * @param id - 일기 ID
   */
  const handleDiaryCardClick = async (id: string | number) => {
    await guard(() => {
      const url = getDiaryDetailUrl(id);
      router.push(url);
    });
  };

  /**
   * 삭제 아이콘 클릭 핸들러
   * 이벤트 전파를 차단하여 카드 클릭 이벤트가 발생하지 않도록 합니다.
   * @param event - 마우스 이벤트
   */
  const handleDeleteIconClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    // TODO: 삭제 기능 구현
  };

  return {
    handleDiaryCardClick,
    handleDeleteIconClick,
  };
};
