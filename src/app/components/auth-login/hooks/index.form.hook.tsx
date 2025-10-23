"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import { Modal } from "@/commons/components/modal";
import { URLS } from "@/commons/constants/url";

/**
 * 로그인 폼 스키마
 */
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 로그인 API 응답 타입
 */
interface LoginResponse {
  accessToken: string;
}

/**
 * 사용자 정보 API 응답 타입
 */
interface UserResponse {
  _id: string;
  name: string;
}

/**
 * 로그인 API 함수
 */
const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            accessToken
          }
        }
      `,
      variables: {
        email: data.email,
        password: data.password,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message || "로그인에 실패했습니다");
  }

  return result.data.loginUser;
};

/**
 * 사용자 정보 조회 API 함수
 */
const fetchUserLoggedIn = async (
  accessToken: string
): Promise<UserResponse> => {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query FetchUserLoggedIn {
          fetchUserLoggedIn {
            _id
            name
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("사용자 정보 조회에 실패했습니다");
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(
      result.errors[0].message || "사용자 정보 조회에 실패했습니다"
    );
  }

  return result.data.fetchUserLoggedIn;
};

/**
 * Auth Login Form Hook
 *
 * 로그인 폼의 상태 관리와 API 연동을 담당하는 커스텀 훅
 * - react-hook-form을 사용한 폼 상태 관리
 * - zod를 사용한 폼 검증
 * - @tanstack/react-query를 사용한 API 호출
 * - 모달 처리를 통한 사용자 피드백
 */
export const useAuthLoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { login } = useAuth();

  // 폼 설정
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  // 로그인 API 뮤테이션
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      try {
        // 사용자 정보 조회
        const userInfo = await fetchUserLoggedIn(data.accessToken);

        // AuthProvider의 login 함수를 사용하여 상태 업데이트
        login(
          {
            id: userInfo._id,
            email: "", // 이메일은 API에서 제공하지 않으므로 빈 문자열
            name: userInfo.name,
          },
          data.accessToken
        );

        // 로그인 완료 모달 표시
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            message="로그인에 성공했습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              router.push(URLS.DIARIES.path);
              // 모달 확인 후 isSubmitting을 false로 설정
              setIsSubmitting(false);
            }}
          />
        );
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        // 사용자 정보 조회 실패 시에도 로그인은 성공으로 처리
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            message="로그인에 성공했습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              router.push(URLS.DIARIES.path);
              // 모달 확인 후 isSubmitting을 false로 설정
              setIsSubmitting(false);
            }}
          />
        );
      }
    },
    onError: (error) => {
      console.error("로그인 실패:", error);
      // 로그인 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="로그인 실패"
          message="이메일 또는 비밀번호가 올바르지 않습니다."
          confirmText="확인"
          onConfirm={() => {
            closeModal();
            // 모달 확인 후 isSubmitting을 false로 설정
            setIsSubmitting(false);
          }}
        />
      );
    },
    onSettled: () => {
      // onSettled에서는 isSubmitting을 설정하지 않음
      // 각 콜백에서 직접 관리
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    loginMutation.mutate(data);
  };

  // 폼 유효성 검사 - 값이 입력되었는지 확인
  const hasEmail = form.watch("email").length > 0;
  const hasPassword = form.watch("password").length > 0;
  const isFormValid = hasEmail && hasPassword;
  const isButtonDisabled = !isFormValid || isSubmitting;

  return {
    form,
    onSubmit,
    isButtonDisabled,
    isSubmitting,
  };
};
