"use client";

import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useFormSignup } from "./hooks/index.form.hook";

/**
 * AuthSignup Component
 *
 * 회원가입 페이지 컴포넌트 - 모던한 디자인 스타일
 * - 이메일, 비밀번호, 비밀번호 재입력, 이름 입력 필드
 * - 회원가입 버튼
 * - 로그인 페이지 이동 링크
 */
const AuthSignup: React.FC = () => {
  const { register, handleSubmit, errors, isValid, isSubmitting } =
    useFormSignup();

  return (
    <div className={styles.container} data-testid="auth-signup-page">
      <div className={styles.signupCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>
            새로운 계정을 만들어 서비스를 시작하세요
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="large"
              theme="light"
              type="email"
              placeholder="이메일을 입력하세요"
              label="이메일"
              fullWidth
              error={!!errors.email}
              errorMessage={errors.email?.message}
              {...register("email")}
              data-testid="signup-email-input"
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
              fullWidth
              error={!!errors.password}
              errorMessage={errors.password?.message}
              {...register("password")}
              data-testid="signup-password-input"
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="large"
              theme="light"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              label="비밀번호 재입력"
              fullWidth
              error={!!errors.passwordConfirm}
              errorMessage={errors.passwordConfirm?.message}
              {...register("passwordConfirm")}
              data-testid="signup-password-confirm-input"
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="large"
              theme="light"
              type="text"
              placeholder="이름을 입력하세요"
              label="이름"
              fullWidth
              error={!!errors.name}
              errorMessage={errors.name?.message}
              {...register("name")}
              data-testid="signup-name-input"
            />
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="large"
              theme="light"
              fullWidth
              type="submit"
              disabled={!isValid || isSubmitting}
              data-testid="signup-submit-button"
            >
              {isSubmitting ? "회원가입 중..." : "회원가입"}
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.loginText}>
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className={styles.loginLink}>
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;
