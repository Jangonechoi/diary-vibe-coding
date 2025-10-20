"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { EMOTION } from "@/commons/constants/enum";
import { useBindingDiary } from "./hooks/index.binding.hook";

interface DiariesDetailProps {
  diaryId?: string;
}

const DiariesDetail: React.FC<DiariesDetailProps> = ({ diaryId }) => {
  const { diary } = useBindingDiary(diaryId);
  const [retrospectText, setRetrospectText] = useState("");
  const [retrospects, setRetrospects] = useState<
    Array<{
      id: string;
      text: string;
      createdAt: string;
    }>
  >([]);

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
    // 수정 기능 구현
    console.log("수정 버튼 클릭");
  };

  const handleDelete = () => {
    // 삭제 기능 구현
    console.log("삭제 버튼 클릭");
  };

  const handleRetrospectSubmit = () => {
    if (retrospectText.trim()) {
      const newRetrospect = {
        id: Date.now().toString(),
        text: retrospectText.trim(),
        createdAt: new Date()
          .toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\./g, ". ")
          .replace(/\s+/g, " ")
          .trim()
          .replace(/\.$/, ""),
      };
      setRetrospects([newRetrospect, ...retrospects]);
      setRetrospectText("");
    }
  };

  const handleRetrospectKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRetrospectSubmit();
    }
  };

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
        >
          수정
        </Button>
        <Button
          variant="secondary"
          size="medium"
          theme="light"
          onClick={handleDelete}
          className={styles.deleteButton}
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
            value={retrospectText}
            onChange={(e) => setRetrospectText(e.target.value)}
            onKeyPress={handleRetrospectKeyPress}
            className={styles.retrospectInputField}
          />
          <Button
            variant="primary"
            theme="light"
            size="medium"
            onClick={handleRetrospectSubmit}
            className={styles.retrospectSubmitButton}
          >
            입력
          </Button>
        </div>
      </div>

      {/* Retrospect List 영역 */}
      <div className={styles.retrospectList}>
        {retrospects.map((retrospect) => (
          <div key={retrospect.id} className={styles.retrospectItem}>
            <p className={styles.retrospectText}>{retrospect.text}</p>
            <p className={styles.retrospectDate}>[{retrospect.createdAt}]</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiariesDetail;
