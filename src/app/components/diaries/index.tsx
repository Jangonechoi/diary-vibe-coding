"use client";

import styles from "./styles.module.css";
import Selectbox from "@/commons/components/selectbox";
import Searchbar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import { EMOTION, EMOTION_KEYS } from "@/commons/constants/enum";
import Image from "next/image";
import { useState } from "react";
import { useDiaryWriteModal } from "./hooks/index.link.modal.hook";
import { useBindingDiaries } from "./hooks/index.binding.hook";
import { useLinkRoutingDiaries } from "./hooks/index.link.routing.hook";

export default function Diaries() {
  const { openWriteModal } = useDiaryWriteModal();
  const { diaries } = useBindingDiaries();
  const { handleDiaryCardClick, handleDeleteIconClick } =
    useLinkRoutingDiaries();

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4x3 그리드
  const totalPages = Math.ceil(diaries.length / itemsPerPage);

  // 필터 옵션 - ENUM 활용
  const filterOptions = [
    { value: "all", label: "전체" },
    ...EMOTION_KEYS.map((emotion) => ({
      value: emotion.toLowerCase(),
      label: EMOTION[emotion].label,
    })),
  ];

  // 검색 핸들러
  const handleSearch = (value: string) => {
    console.log("검색어:", value);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (value: string | number) => {
    console.log("필터 변경:", value);
  };

  // 일기쓰기 버튼 핸들러 - 모달로 열기
  const handleWriteDiary = () => {
    openWriteModal();
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 현재 페이지에 표시할 일기 데이터 계산
  const getCurrentPageDiaries = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return diaries.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap32}></div>
      <div className={styles.search}>
        <div className={styles.searchContent}>
          <div className={styles.searchWrapper}>
            <Selectbox
              variant="primary"
              size="medium"
              theme="light"
              placeholder="전체"
              options={filterOptions}
              onValueChange={handleFilterChange}
              className={styles.filterSelect}
              value="all"
            />
            <Searchbar
              variant="primary"
              size="medium"
              theme="light"
              placeholder="검색어를 입력해 주세요."
              onSearch={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteDiary}
            className={styles.writeButton}
            leftIcon={
              <Image
                src="/icons/plus_outline_light_m.svg"
                alt="일기쓰기"
                width={16}
                height={16}
              />
            }
            data-testid="diary-write-button"
          >
            일기쓰기
          </Button>
        </div>
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}>
        <div className={styles.diaryGrid}>
          {getCurrentPageDiaries().map((diary) => (
            <div
              key={diary.id}
              className={styles.diaryCard}
              onClick={() => handleDiaryCardClick(diary.id)}
            >
              <div className={styles.cardImage}>
                <Image
                  src={`/images/${EMOTION[diary.emotion].images.medium.replace(
                    ".svg",
                    ".png"
                  )}`}
                  alt={EMOTION[diary.emotion].label}
                  width={274}
                  height={208}
                  className={styles.image}
                />
                <div
                  className={styles.closeIcon}
                  onClick={handleDeleteIconClick}
                >
                  <Image
                    src="/icons/close_outline_light_m.svg"
                    alt="닫기"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.emotionText}
                    style={{ color: `var(--${EMOTION[diary.emotion].color})` }}
                  >
                    {EMOTION[diary.emotion].label}
                  </span>
                  <span className={styles.dateText}>{diary.date}</span>
                </div>
                <div className={styles.cardTitle}>{diary.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gap40}></div>
      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="primary"
          size="medium"
          theme="light"
          className={styles.paginationComponent}
        />
      </div>
      <div className={styles.gap40}></div>
    </div>
  );
}
