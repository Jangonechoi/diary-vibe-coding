"use client";

import styles from "./styles.module.css";
import Selectbox from "@/commons/components/selectbox";
import Searchbar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import { EMOTION } from "@/commons/constants/enum";
import Image from "next/image";
import { useState } from "react";
import { useDiaryWriteModal } from "./hooks/index.link.modal.hook";
import { useBindingDiaries } from "./hooks/index.binding.hook";
import { useLinkRoutingDiaries } from "./hooks/index.link.routing.hook";
import { useSearchDiaries } from "./hooks/index.search.hook";
import { useFilterDiaries } from "./hooks/index.filter.hook";

export default function Diaries() {
  const { openWriteModal } = useDiaryWriteModal();
  const { diaries } = useBindingDiaries();
  const { handleDiaryCardClick, handleDeleteIconClick } =
    useLinkRoutingDiaries();
  const {
    searchQuery,
    filteredDiaries: searchFilteredDiaries,
    searchDiaries,
    clearSearch,
    handleSearchQueryChange,
  } = useSearchDiaries();

  // 필터 기능 추가
  const {
    selectedFilter,
    filterOptions,
    filteredDiaries: emotionFilteredDiaries,
    handleFilterChange,
  } = useFilterDiaries(diaries);

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4x3 그리드

  // 검색과 필터 결과를 결합하여 최종 데이터 결정
  const getFinalData = () => {
    // 검색 결과가 있으면 검색 결과에 필터 적용
    if (searchFilteredDiaries.length > 0) {
      return emotionFilteredDiaries.filter((diary) =>
        searchFilteredDiaries.some((searchDiary) => searchDiary.id === diary.id)
      );
    }
    // 검색 결과가 없으면 필터 결과 사용
    return emotionFilteredDiaries;
  };

  const dataToUse = getFinalData();
  const totalPages = Math.ceil(dataToUse.length / itemsPerPage);

  // 검색 핸들러
  const handleSearch = (value: string) => {
    searchDiaries(value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

  // 필터 변경 핸들러
  const handleFilterChangeWrapper = (value: string | number) => {
    handleFilterChange(String(value));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
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
    return dataToUse.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <div className={styles.searchContent}>
          <div className={styles.searchWrapper}>
            <Selectbox
              variant="primary"
              size="medium"
              theme="light"
              placeholder="전체"
              options={filterOptions}
              onValueChange={handleFilterChangeWrapper}
              className={styles.filterSelect}
              value={selectedFilter}
              data-testid="filter-select"
            />
            <Searchbar
              variant="primary"
              size="medium"
              theme="light"
              placeholder="검색어를 입력해 주세요."
              onSearch={handleSearch}
              onChange={handleSearchQueryChange}
              className={styles.searchInput}
              value={searchQuery}
              data-testid="search-input"
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
        {searchQuery && searchFilteredDiaries.length === 0 ? (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다.</p>
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              onClick={clearSearch}
            >
              검색 초기화
            </Button>
          </div>
        ) : (
          <div className={styles.diaryGrid}>
            {getCurrentPageDiaries().map((diary) => (
              <div
                key={diary.id}
                className={styles.diaryCard}
                onClick={async () => await handleDiaryCardClick(diary.id)}
                data-testid={`diary-card-${diary.id}`}
              >
                <div className={styles.cardImage}>
                  <Image
                    src={`/images/${EMOTION[
                      diary.emotion
                    ].images.medium.replace(".svg", ".png")}`}
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
                      style={{
                        color: `var(--${EMOTION[diary.emotion].color})`,
                      }}
                      data-testid="emotion-text"
                    >
                      {EMOTION[diary.emotion].label}
                    </span>
                    <span className={styles.dateText}>
                      {new Date(diary.date)
                        .toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\./g, ". ")
                        .replace(/\s+/g, " ")
                        .trim()
                        .replace(/\.$/, "")}
                    </span>
                  </div>
                  <div className={styles.cardTitle}>{diary.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
