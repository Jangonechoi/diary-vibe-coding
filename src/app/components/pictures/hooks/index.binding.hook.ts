"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * Dog CEO API 응답 타입
 */
interface DogApiResponse {
  message: string[];
  status: string;
}

/**
 * 강아지 사진 데이터 타입
 */
export interface DogImage {
  id: string;
  url: string;
  alt: string;
}

/**
 * 강아지 사진 목록 조회 API
 */
const fetchDogImages = async (): Promise<DogApiResponse> => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random/6", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("강아지 사진 조회 실패");
  }

  return response.json();
};

/**
 * 사진 목록 바인딩 훅
 *
 * Dog CEO API에서 강아지 사진을 조회하여 무한 스크롤로 표시
 * - API: https://dog.ceo/api/breeds/image/random/6
 * - 무한 스크롤: useInfiniteQuery 사용
 * - 초기 로딩: 6개의 스플래시 스크린 표시
 *
 * @returns 바인딩된 사진 목록 데이터
 */
export const useBindingPictures = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["dogImages"],
    queryFn: () => fetchDogImages(),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 무한 스크롤을 위해 다음 페이지 번호 반환
      return allPages.length;
    },
    retry: 1,
  });

  // API 응답 데이터를 DogImage 배열로 변환
  const dogImages: DogImage[] =
    data?.pages.flatMap((page, pageIndex) =>
      page.message.map((url, index) => ({
        id: `${pageIndex}-${index}`,
        url,
        alt: `강아지 사진 ${pageIndex * 6 + index + 1}`,
      }))
    ) ?? [];

  return {
    dogImages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  };
};
