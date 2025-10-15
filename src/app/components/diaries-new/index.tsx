'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { EMOTION, EMOTION_KEYS, EmotionType } from '@/commons/constants/enum';
import { useModal } from '@/commons/providers/modal/modal.provider';

export default function DiariesNew() {
  const { closeModal } = useModal();
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType>('Happy');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleEmotionChange = (emotion: EmotionType) => {
    setSelectedEmotion(emotion);
  };

  const handleClose = () => {
    // 모달 닫기
    closeModal();
  };

  const handleSubmit = () => {
    // 등록하기 로직
    console.log('등록하기', { selectedEmotion, title, content });
  };

  return (
    <div className={styles.wrapper}>
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
                  name="emotion"
                  value={emotionKey}
                  checked={selectedEmotion === emotionKey}
                  onChange={() => handleEmotionChange(emotionKey)}
                  className={styles.emotionRadio}
                />
                <span className={styles.emotionLabel}>{EMOTION[emotionKey].label}</span>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
          >
            닫기
          </Button>
          <Button
            variant="primary"
            theme="light"
            size="medium"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            등록하기
          </Button>
        </div>
      </div>
    </div>
  );
}
