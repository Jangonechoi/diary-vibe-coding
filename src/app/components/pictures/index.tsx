"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Selectbox } from "@/commons/components/selectbox";
import { useBindingPictures } from "./hooks/index.binding.hook";
import { useFilter } from "./hooks/index.filter.hook";
import { FilterType } from "@/commons/constants/enum";
import styles from "./styles.module.css";

/**
 * Pictures Component
 *
 * 강아지 사진 갤러리 컴포넌트
 * - filter 영역: 필터 선택박스 (Figma 노드ID: 3:140)
 * - main 영역: 사진 그리드 (Figma 노드ID: 3:146)
 *
 * 피그마 디자인 사양:
 * - Filter 영역: 1168 x 48px
 * - SelectBox: 120 x 48px, cornerRadius: 8px, border: #c7c7c7
 * - Main 영역: 1168 x auto (1열 세로 배치)
 * - 이미지 카드: 640 x 640px, cornerRadius: 24px, gap: 40px
 */
export default function Pictures() {
  // 필터 기능 훅 사용
  const { selectedFilter, imageSize, setFilter, filterOptions } = useFilter();

  // 강아지 사진 데이터 바인딩
  const {
    dogImages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useBindingPictures();

  // 무한 스크롤을 위한 Intersection Observer
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 마지막에서 2번째 이미지가 화면에 보이면 다음 페이지 로드
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className={styles.container}>
      {/* Gap 1: 32px */}
      <div className={styles.gap1} />

      {/* Filter 영역: 1168 x 48 */}
      <div className={styles.filterArea}>
        <Selectbox
          variant="primary"
          theme="light"
          size="medium"
          options={filterOptions}
          value={selectedFilter}
          onValueChange={(value) => setFilter(value as FilterType)}
          className={styles.selectbox}
          data-testid="pictures-filter-selectbox"
        />
      </div>

      {/* Gap 2: 42px */}
      <div className={styles.gap2} />

      {/* Main 영역: 1168 x auto */}
      <div className={styles.mainArea}>
        {/* 로딩 중 스플래시 스크린 표시 */}
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`splash-${index}`}
              className={styles.splashScreen}
              style={{
                width: `${imageSize.width}px`,
                height: `${imageSize.height}px`,
              }}
              data-testid="splash-screen"
            />
          ))}

        {/* 에러 메시지 표시 */}
        {isError && (
          <div className={styles.errorMessage} data-testid="error-message">
            강아지 사진을 불러오는데 실패했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </div>
        )}

        {/* 강아지 사진 목록 */}
        {!isLoading &&
          !isError &&
          dogImages.map((image, index) => (
            <div
              key={image.id}
              className={styles.imageCard}
              style={{
                width: `${imageSize.width}px`,
                height: `${imageSize.height}px`,
              }}
              ref={index === dogImages.length - 2 ? observerRef : null}
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={imageSize.width}
                height={imageSize.height}
                className={styles.image}
              />
            </div>
          ))}

        {/* 추가 로딩 중 표시 */}
        {isFetchingNextPage &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className={styles.splashScreen}
              style={{
                width: `${imageSize.width}px`,
                height: `${imageSize.height}px`,
              }}
              data-testid="splash-screen"
            />
          ))}
      </div>
    </div>
  );
}
