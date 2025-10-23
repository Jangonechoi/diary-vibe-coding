"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { EMOTION, EMOTION_KEYS } from "@/commons/constants/enum";
import { useBindingDiary } from "./hooks/index.binding.hook";
import {
  useRetrospectForm,
  RetrospectData,
} from "./hooks/index.retrospect.form.hook";
import { useDiaryUpdate, DiaryUpdateData } from "./hooks/index.update.hook";
import { useDiaryDelete } from "./hooks/index.delete.hook";
import { Modal } from "@/commons/components/modal";

interface DiariesDetailProps {
  diaryId?: string;
}

const DiariesDetail: React.FC<DiariesDetailProps> = ({ diaryId }) => {
  const { diary } = useBindingDiary(diaryId);
  const [retrospects, setRetrospects] = useState<RetrospectData[]>([]);

  // 회고쓰기 폼 훅 사용
  const { form, onSubmit, isSubmitEnabled } = useRetrospectForm(
    diaryId ? parseInt(diaryId) : 0
  );

  // 일기 수정 훅 사용
  const initialUpdateData: DiaryUpdateData | undefined = diary
    ? {
        emotion: diary.emotion,
        title: diary.title,
        content: diary.content,
      }
    : undefined;

  const {
    isEditing,
    isSubmitting,
    canSubmit,
    form: updateForm,
    startEditing,
    cancelEditing,
    handleSubmit: handleUpdateSubmit,
  } = useDiaryUpdate(diaryId ? parseInt(diaryId) : 0, initialUpdateData);

  // 일기 삭제 훅 사용
  const { isModalOpen, openDeleteModal, closeDeleteModal, handleDelete } =
    useDiaryDelete(diaryId ? parseInt(diaryId) : 0);

  // 로컬스토리지에서 회고 데이터 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("retrospects");
        if (stored) {
          const allRetrospects: RetrospectData[] = JSON.parse(stored);
          const diaryRetrospects = allRetrospects.filter(
            (r) => r.diaryId === parseInt(diaryId || "0")
          );
          setRetrospects(diaryRetrospects);
        }
      } catch (error) {
        console.error(
          "로컬스토리지에서 회고 데이터를 로드하는 중 오류:",
          error
        );
      }
    }
  }, [diaryId]);

  // diary가 없을 때 처리
  if (!diary) {
    return (
      <div className={styles.container} data-testid="diary-detail-container">
        <div className={styles.detailTitle}>
          <p>일기를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const emotionData = EMOTION[diary.emotion];

  const handleCopyContent = () => {
    navigator.clipboard.writeText(diary.content);
    // 복사 완료 알림 (실제 구현에서는 토스트 등 사용)
    alert("내용이 복사되었습니다.");
  };

  const handleEdit = () => {
    startEditing();
  };

  const handleDeleteClick = () => {
    openDeleteModal();
  };

  // 폼 제출 핸들러
  const handleRetrospectSubmit = form.handleSubmit(onSubmit);

  // Enter 키 핸들러
  const handleRetrospectKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRetrospectSubmit();
    }
  };

  // 수정 모드 렌더링
  if (isEditing) {
    return (
      <div className={styles.container} data-testid="diary-detail-container">
        {/* 수정 모드 - 감정 선택 */}
        <div className={styles.editEmotionSection}>
          <h2 className={styles.editEmotionLabel}>오늘 기분은 어땟나요?</h2>
          <div className={styles.emotionOptions}>
            {EMOTION_KEYS.map((emotion) => (
              <label key={emotion} className={styles.emotionOption}>
                <input
                  type="radio"
                  value={emotion}
                  {...updateForm.register("emotion")}
                  className={styles.emotionRadio}
                />
                <span className={styles.emotionLabel}>
                  {EMOTION[emotion].label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 수정 모드 - 제목 입력 */}
        <div className={styles.editTitleSection}>
          <label className={styles.editFieldLabel}>제목</label>
          <Input
            variant="primary"
            theme="light"
            size="medium"
            {...updateForm.register("title")}
            className={styles.editTitleInput}
          />
        </div>

        {/* 수정 모드 - 내용 입력 */}
        <div className={styles.editContentSection}>
          <label className={styles.editFieldLabel}>내용</label>
          <textarea
            {...updateForm.register("content")}
            className={styles.editContentTextarea}
            rows={6}
          />
        </div>

        {/* 수정 모드 - 버튼 영역 */}
        <div className={styles.editButtonSection}>
          <Button
            variant="secondary"
            size="medium"
            theme="light"
            onClick={cancelEditing}
            className={styles.editCancelButton}
            data-testid="update-cancel-button"
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleUpdateSubmit}
            disabled={!canSubmit}
            className={styles.editSubmitButton}
            data-testid="update-submit-button"
          >
            {isSubmitting ? "수정 중..." : "수정 하기"}
          </Button>
        </div>

        {/* 수정 중일 때 회고 입력 비활성화 */}
        <div className={styles.retrospectInput}>
          <h3 className={styles.retrospectLabel}>회고</h3>
          <div className={styles.retrospectInputContainer}>
            <Input
              variant="primary"
              theme="light"
              size="medium"
              placeholder="수정중일땐 회고를 작성할 수 없어요."
              disabled
              className={styles.retrospectInputField}
            />
            <Button
              variant="primary"
              theme="light"
              size="medium"
              disabled
              className={styles.retrospectSubmitButton}
              data-testid="retrospect-submit-button"
            >
              입력
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 일반 모드 렌더링
  return (
    <div className={styles.container} data-testid="diary-detail-container">
      {/* Detail Title 영역 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <h1 className={`${styles.title} typo-headline-headline02`}>
            {diary.title}
          </h1>
        </div>
        <div className={styles.emotionDateSection}>
          <div className={styles.emotionSection}>
            <Image
              src={`/images/emotion-${diary.emotion.toLowerCase()}-s.png`}
              alt={emotionData.label}
              width={32}
              height={32}
              className={styles.emotionIcon}
            />
            <span
              className={`${styles.emotionText} typo-headline-headline03`}
              style={{ color: `var(--${emotionData.color})` }}
            >
              {emotionData.label}
            </span>
          </div>
          <div className={styles.dateSection}>
            <span className={`${styles.dateText} typo-body-body02-regular`}>
              {new Date(diary.createdAt)
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
            <span className={`${styles.dateLabel} typo-body-body02-regular`}>
              작성
            </span>
          </div>
        </div>
      </div>

      {/* Detail Content 영역 */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <h2 className={`${styles.contentLabel} typo-title-title02`}>내용</h2>
          <p className={`${styles.contentText} typo-body-body01-medium`}>
            {diary.content}
          </p>
        </div>
        <div className={styles.copySection}>
          <button className={styles.copyButton} onClick={handleCopyContent}>
            <Image
              src="/icons/copy_outline_light_m.svg"
              alt="복사"
              width={24}
              height={24}
            />
            <span className={`${styles.copyText} typo-body-body01-regular`}>
              내용 복사
            </span>
          </button>
        </div>
      </div>

      {/* Detail Footer 영역 */}
      <div className={styles.detailFooter}>
        <Button
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleEdit}
          className={styles.editButton}
          data-testid="edit-button"
        >
          수정
        </Button>
        <Button
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleDeleteClick}
          className={styles.deleteButton}
          data-testid="delete-button"
        >
          삭제
        </Button>
      </div>

      {/* Retrospect Input 영역 */}
      <div className={styles.retrospectInput}>
        <h3 className={styles.retrospectLabel}>회고</h3>
        <div className={styles.retrospectInputContainer}>
          <Input
            variant="primary"
            theme="light"
            size="medium"
            placeholder="회고를 남겨보세요."
            {...form.register("content")}
            onKeyPress={handleRetrospectKeyPress}
            className={styles.retrospectInputField}
          />
          <Button
            variant="primary"
            theme="light"
            size="medium"
            onClick={handleRetrospectSubmit}
            disabled={!isSubmitEnabled}
            className={styles.retrospectSubmitButton}
            data-testid="retrospect-submit-button"
          >
            입력
          </Button>
        </div>
      </div>

      {/* Retrospect List 영역 */}
      <div className={styles.retrospectList}>
        {retrospects.length > 0 ? (
          retrospects.map((retrospect) => (
            <div key={retrospect.id} className={styles.retrospectItem}>
              <p className={styles.retrospectText}>{retrospect.content}</p>
              <p className={styles.retrospectDate}>
                [
                {new Date(retrospect.createdAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\./g, ". ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .replace(/\.$/, "")}
                ]
              </p>
            </div>
          ))
        ) : (
          <div className={styles.noRetrospectMessage}>
            등록된 회고가 없습니다.
          </div>
        )}
      </div>

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
};

export default DiariesDetail;
