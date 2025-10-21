"use client";

import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";

/**
 * AuthLogin Component
 *
 * 로그인 페이지 컴포넌트 - 모던한 디자인 스타일
 * - 이메일, 비밀번호 입력 필드
 * - 로그인 버튼
 * - 회원가입 페이지 이동 링크
 */
const AuthLogin: React.FC = () => {
  return (
    <div className={styles.container} data-testid="auth-login-page">
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            서비스를 이용하려면 로그인이 필요합니다
          </p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="large"
              theme="light"
              type="email"
              placeholder="이메일을 입력하세요"
              label="이메일"
              className={styles.inputWidth}
              data-testid="login-email-input"
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="large"
              theme="light"
              type="password"
              placeholder="비밀번호를 입력하세요"
              label="비밀번호"
              className={styles.inputWidth}
              data-testid="login-password-input"
            />
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="large"
              theme="light"
              type="submit"
              className={styles.buttonWidth}
              data-testid="login-submit-button"
            >
              로그인
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.signupText}>
            아직 계정이 없으신가요?{" "}
            <Link href="/auth/signup" className={styles.signupLink}>
              회원가입하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
