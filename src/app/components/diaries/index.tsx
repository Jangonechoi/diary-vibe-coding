"use client";

import styles from "./styles.module.css";
import Selectbox from "@/commons/components/selectbox";
import Searchbar from "@/commons/components/searchbar";
import Button from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import { EMOTION } from "@/commons/constants/enum";
import Image from "next/image";
import React from "react";
import { useDiaryWriteModal } from "./hooks/index.link.modal.hook";
import { useBindingDiaries } from "./hooks/index.binding.hook";
import { useLinkRoutingDiaries } from "./hooks/index.link.routing.hook";
import { useSearchDiaries } from "./hooks/index.search.hook";
import { useFilterDiaries } from "./hooks/index.filter.hook";
import { usePagination } from "./hooks/index.pagination.hook";
import { useDeleteDiary } from "./hooks/index.delete.hook";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import { Modal } from "@/commons/components/modal";

export default function Diaries() {
  const { openWriteModal } = useDiaryWriteModal();
  const { diaries } = useBindingDiaries();
  const { handleDiaryCardClick } = useLinkRoutingDiaries();
  const { isModalOpen, openDeleteModal, closeDeleteModal, handleDelete } =
    useDeleteDiary();
  const { isAuthenticated } = useAuth();
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

  // 페이지네이션 훅 사용
  const {
    currentPage,
    totalPages,
    currentPageData,
    handlePageChange,
    resetPagination,
  } = usePagination({
    data: dataToUse,
    itemsPerPage: 12, // 4x3 그리드
    initialPage: 1,
  });

  // 검색 핸들러
  const handleSearch = (value: string) => {
    searchDiaries(value);
    resetPagination(); // 검색 시 첫 페이지로 이동
  };

  // 필터 변경 핸들러
  const handleFilterChangeWrapper = (value: string | number) => {
    handleFilterChange(String(value));
    resetPagination(); // 필터 변경 시 첫 페이지로 이동
  };

  // 일기쓰기 버튼 핸들러 - 모달로 열기
  const handleWriteDiary = () => {
    openWriteModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <div className={styles.searchContent}>
          <div className={styles.filterWrapper}>
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
          </div>
          <div className={styles.searchWrapper}>
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
          <div className={styles.actionButtons}>
            <Selectbox
              variant="primary"
              size="medium"
              theme="light"
              placeholder="전체"
              options={filterOptions}
              onValueChange={handleFilterChangeWrapper}
              className={styles.filterSelectMobile}
              value={selectedFilter}
              data-testid="filter-select-mobile"
            />
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
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}>
        {searchQuery && searchFilteredDiaries.length === 0 ? (
          <div className={styles.noResults} data-testid="no-results">
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
            {currentPageData.map((diary: unknown) => {
              const diaryData = diary as {
                id: string;
                emotion: string;
                date: string;
                title: string;
              };
              return (
                <div
                  key={diaryData.id}
                  className={styles.diaryCard}
                  onClick={async () => await handleDiaryCardClick(diaryData.id)}
                  data-testid={`diary-card-${diaryData.id}`}
                >
                  <div className={styles.cardImage}>
                    <Image
                      src={`/images/${EMOTION[
                        diaryData.emotion as keyof typeof EMOTION
                      ].images.medium.replace(".svg", ".png")}`}
                      alt={
                        EMOTION[diaryData.emotion as keyof typeof EMOTION].label
                      }
                      width={274}
                      height={208}
                      sizes="(max-width: 767px) 152px, 274px"
                      className={styles.image}
                    />
                    {isAuthenticated && (
                      <div
                        className={styles.closeIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(Number(diaryData.id));
                        }}
                        data-testid={`delete-icon-${diaryData.id}`}
                      >
                        <Image
                          src="/icons/close_outline_light_m.svg"
                          alt="삭제"
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span
                        className={styles.emotionText}
                        style={{
                          color: `var(--${
                            EMOTION[diaryData.emotion as keyof typeof EMOTION]
                              .color
                          })`,
                        }}
                        data-testid="emotion-text"
                      >
                        {
                          EMOTION[diaryData.emotion as keyof typeof EMOTION]
                            .label
                        }
                      </span>
                      <span className={styles.dateText}>
                        {new Date(diaryData.date)
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
                    <div className={styles.cardTitle}>{diaryData.title}</div>
                  </div>
                </div>
              );
            })}
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
          data-testid="pagination"
        />
      </div>
      <div className={styles.gap40}></div>

      {/* 삭제 모달 */}
      {isModalOpen && (
        <Modal
          variant="danger"
          actions="dual"
          theme="light"
          title="일기 삭제"
          message="일기를 삭제 하시겠어요?"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
