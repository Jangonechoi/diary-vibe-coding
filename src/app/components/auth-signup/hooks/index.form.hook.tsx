"use client";

import { useCallback, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { URLS } from "@/commons/constants/url";

/**
 * 회원가입 폼 데이터 타입
 */
export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

/**
 * GraphQL API 응답 타입
 */
interface CreateUserResponse {
  data: {
    createUser: {
      _id: string;
    };
  };
}

/**
 * Zod 검증 스키마
 */
const signupFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .refine((email) => email.includes("@"), {
        message: "올바른 이메일 형식이 아닙니다. (@를 포함해야 합니다)",
      }),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .refine(
        (password) => /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
        {
          message: "비밀번호는 영문과 숫자를 모두 포함해야 합니다.",
        }
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormSchema = z.infer<typeof signupFormSchema>;

/**
 * 회원가입 폼 훅
 *
 * react-hook-form과 zod를 사용하여 폼 관리
 * - 검증: zod 스키마
 * - API: GraphQL createUser mutation
 * - 상태관리: useForm 훅
 *
 * @returns 폼 제어 객체 및 상태
 */
export const useFormSignup = () => {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasShownModalRef = useRef<{
    success: boolean;
    failure: boolean;
  }>({
    success: false,
    failure: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
  });

  /**
   * GraphQL createUser mutation 호출
   */
  const createUser = useCallback(
    async (email: string, password: string, name: string): Promise<string> => {
      const query = `
        mutation createUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `;

      const variables = {
        createUserInput: {
          email,
          password,
          name,
        },
      };

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error("네트워크 오류가 발생했습니다.");
      }

      const result: CreateUserResponse = await response.json();

      if (!result.data?.createUser?._id) {
        throw new Error("회원가입에 실패했습니다.");
      }

      return result.data.createUser._id;
    },
    []
  );

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = useCallback(
    async (data: SignupFormSchema) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        // GraphQL API 호출
        await createUser(data.email, data.password, data.name);

        // 성공 모달이 아직 표시되지 않았을 때만 표시
        if (!hasShownModalRef.current.success) {
          hasShownModalRef.current.success = true;

          openModal(
            <Modal
              variant="info"
              actions="single"
              theme="light"
              title="가입 완료"
              message="회원가입이 완료되었습니다."
              confirmText="확인"
              onConfirm={() => {
                // 모든 모달 닫기 및 로그인 페이지로 이동
                closeModal();
                router.push(URLS.LOGIN.path);
              }}
              onClose={() => {
                closeModal();
              }}
            />
          );
        }

        // 폼 초기화
        reset();
      } catch (error) {
        console.error("회원가입 실패:", error);

        // 실패 모달이 아직 표시되지 않았을 때만 표시
        if (!hasShownModalRef.current.failure) {
          hasShownModalRef.current.failure = true;

          openModal(
            <Modal
              variant="danger"
              actions="single"
              theme="light"
              title="가입 실패"
              message="회원가입에 실패했습니다. 다시 시도해주세요."
              confirmText="확인"
              onConfirm={() => {
                // 모든 모달 닫기
                closeModal();
                // 실패 모달 표시 플래그 초기화 (재시도 가능하도록)
                hasShownModalRef.current.failure = false;
              }}
              onClose={() => {
                closeModal();
              }}
            />
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [createUser, openModal, closeModal, router, reset, isSubmitting]
  );

  // 현재 폼 상태 감시
  const currentValues = watch();

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    formValues: currentValues,
    isSubmitting,
  };
};
