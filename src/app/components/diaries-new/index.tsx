"use client";

import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { EMOTION, EMOTION_KEYS } from "@/commons/constants/enum";
import { useLinkModalClose } from "./hooks/index.link.modal.close.hook";
import { useFormDiary } from "./hooks/index.form.hook";

export default function DiariesNew() {
  const { openCloseConfirmModal } = useLinkModalClose();
  const { register, handleSubmit, isValid, formValues } = useFormDiary();

  const handleClose = () => {
    // 등록취소 확인 모달 열기
    openCloseConfirmModal();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기 쓰기</h1>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Emotion Box */}
      <div className={styles.emotionBox}>
        <div className={styles.emotionContainer}>
          <h2 className={styles.emotionTitle}>오늘 기분은 어땠나요?</h2>
          <div className={styles.emotionOptions}>
            {EMOTION_KEYS.map((emotionKey) => (
              <label key={emotionKey} className={styles.emotionOption}>
                <input
                  type="radio"
                  {...register("emotion")}
                  value={emotionKey}
                  checked={formValues.emotion === emotionKey}
                  onChange={() => {}}
                  className={styles.emotionRadio}
                />
                <span className={styles.emotionLabel}>
                  {EMOTION[emotionKey].label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Input Title */}
      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          theme="light"
          size="medium"
          label="제목"
          placeholder="제목을 입력합니다."
          {...register("title")}
          className={styles.titleInput}
        />
      </div>

      {/* Gap */}
      <div className={styles.gapSmall}></div>

      {/* Input Content */}
      <div className={styles.inputContent}>
        <div className={styles.inputContentContainer}>
          <label className={styles.contentLabel}>내용</label>
          <textarea
            className={styles.contentTextarea}
            placeholder="내용을 입력합니다."
            {...register("content")}
            rows={5}
          />
        </div>
      </div>

      {/* Gap */}
      <div className={styles.gap}></div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerButtons}>
          <Button
            variant="secondary"
            theme="light"
            size="medium"
            onClick={handleClose}
            className={styles.closeButton}
            type="button"
          >
            닫기
          </Button>
          <Button
            variant="primary"
            theme="light"
            size="medium"
            className={styles.submitButton}
            disabled={!isValid}
            type="submit"
          >
            등록하기
          </Button>
        </div>
      </div>
    </form>
  );
}
