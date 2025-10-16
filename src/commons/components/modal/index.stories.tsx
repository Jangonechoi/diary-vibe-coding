import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Modal } from "./index";

/**
 * Modal 컴포넌트는 다양한 variant, actions, theme 조합을 제공합니다.
 * - variant: info, danger
 * - actions: single, dual
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "danger"],
      description: "모달의 시각적 스타일 변형",
    },
    actions: {
      control: "select",
      options: ["single", "dual"],
      description: "모달의 액션 타입 (버튼 개수)",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    title: {
      control: "text",
      description: "모달 타이틀",
    },
    message: {
      control: "text",
      description: "모달 설명 메시지",
    },
    confirmText: {
      control: "text",
      description: "확인 버튼 텍스트",
    },
    cancelText: {
      control: "text",
      description: "취소 버튼 텍스트 (actions: 'dual'일 때만 사용)",
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Info 모달 (기본)
 */
export const Info: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "일기 등록 완료",
    message: "등록이 완료 되었습니다.",
    confirmText: "확인",
  },
};

/**
 * Danger 모달
 */
export const Danger: Story = {
  args: {
    variant: "danger",
    actions: "single",
    theme: "light",
    title: "삭제 확인",
    message: "정말로 삭제하시겠습니까?",
    confirmText: "삭제",
  },
};

/**
 * Single Action (확인 버튼만)
 */
export const SingleAction: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "알림",
    message: "작업이 완료되었습니다.",
    confirmText: "확인",
  },
};

/**
 * Dual Actions (확인 + 취소 버튼)
 */
export const DualActions: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "저장 확인",
    message: "변경사항을 저장하시겠습니까?",
    confirmText: "저장",
    cancelText: "취소",
  },
};

/**
 * Dark 테마
 */
export const DarkTheme: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "dark",
    title: "다크 모드 모달",
    message: "다크 테마가 적용된 모달입니다.",
    confirmText: "확인",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Info + Single Action
 */
export const InfoSingle: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "일기 등록 완료",
    message: "등록이 완료 되었습니다.",
    confirmText: "확인",
  },
};

/**
 * Info + Dual Actions
 */
export const InfoDual: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "저장하시겠습니까?",
    message: "변경된 내용을 저장하시겠습니까?",
    confirmText: "저장",
    cancelText: "취소",
  },
};

/**
 * Danger + Single Action
 */
export const DangerSingle: Story = {
  args: {
    variant: "danger",
    actions: "single",
    theme: "light",
    title: "경고",
    message: "이 작업은 되돌릴 수 없습니다.",
    confirmText: "확인",
  },
};

/**
 * Danger + Dual Actions
 */
export const DangerDual: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "삭제 확인",
    message: "정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
  },
};

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  args: {
    title: "모달",
    message: "모달 메시지",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Info 모달"
        message="정보 알림 모달입니다."
        confirmText="확인"
      />
      <Modal
        variant="danger"
        actions="single"
        theme="light"
        title="Danger 모달"
        message="위험 경고 모달입니다."
        confirmText="확인"
      />
    </div>
  ),
};

/**
 * 모든 Actions 조합
 */
export const AllActions: Story = {
  args: {
    title: "모달",
    message: "모달 메시지",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Single Action"
        message="확인 버튼만 있는 모달입니다."
        confirmText="확인"
      />
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="Dual Actions"
        message="확인과 취소 버튼이 있는 모달입니다."
        confirmText="확인"
        cancelText="취소"
      />
    </div>
  ),
};

/**
 * 다크 테마 전체 조합
 */
export const DarkThemeVariants: Story = {
  args: {
    title: "모달",
    message: "모달 메시지",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Modal
        variant="info"
        actions="single"
        theme="dark"
        title="Info 다크 모달"
        message="다크 테마가 적용된 Info 모달입니다."
        confirmText="확인"
      />
      <Modal
        variant="danger"
        actions="dual"
        theme="dark"
        title="Danger 다크 모달"
        message="다크 테마가 적용된 Danger 모달입니다."
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 실제 사용 예제 - 일기 등록
 */
export const DiaryRegistration: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "일기 등록 완료",
    message: "등록이 완료 되었습니다.",
    confirmText: "확인",
    onConfirm: () => console.log("일기 등록 확인"),
  },
};

/**
 * 실제 사용 예제 - 일기 삭제
 */
export const DiaryDeletion: Story = {
  args: {
    variant: "danger",
    actions: "dual",
    theme: "light",
    title: "일기 삭제",
    message: "정말로 삭제하시겠습니까? 삭제된 일기는 복구할 수 없습니다.",
    confirmText: "삭제",
    cancelText: "취소",
    onConfirm: () => console.log("일기 삭제 확인"),
    onCancel: () => console.log("일기 삭제 취소"),
  },
};

/**
 * 실제 사용 예제 - 저장 확인
 */
export const SaveConfirmation: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "저장 확인",
    message: "변경사항을 저장하시겠습니까?",
    confirmText: "저장",
    cancelText: "취소",
    onConfirm: () => console.log("저장 확인"),
    onCancel: () => console.log("저장 취소"),
  },
};

/**
 * Interactive 예제 (클릭 이벤트)
 */
export const Interactive: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "인터랙티브 모달",
    message: "버튼을 클릭하면 콘솔에 로그가 출력됩니다.",
    confirmText: "확인",
    cancelText: "취소",
    onConfirm: () => alert("확인 버튼 클릭!"),
    onCancel: () => alert("취소 버튼 클릭!"),
    onClose: () => console.log("모달 닫힘"),
  },
};

/**
 * 긴 메시지
 */
export const LongMessage: Story = {
  args: {
    variant: "info",
    actions: "dual",
    theme: "light",
    title: "약관 동의",
    message:
      "서비스 이용약관 및 개인정보 처리방침에 동의하시겠습니까? 서비스를 이용하시려면 반드시 약관에 동의하셔야 합니다. 약관 내용을 자세히 읽어보신 후 동의해 주세요.",
    confirmText: "동의",
    cancelText: "거부",
  },
};

/**
 * 짧은 메시지
 */
export const ShortMessage: Story = {
  args: {
    variant: "info",
    actions: "single",
    theme: "light",
    title: "완료",
    message: "성공!",
    confirmText: "확인",
  },
};

/**
 * 모든 조합 (variant × actions)
 */
export const AllCombinations: Story = {
  args: {
    title: "모달",
    message: "모달 메시지",
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "24px",
        padding: "20px",
      }}
    >
      <Modal
        variant="info"
        actions="single"
        theme="light"
        title="Info + Single"
        message="Info variant에 Single action입니다."
        confirmText="확인"
      />
      <Modal
        variant="info"
        actions="dual"
        theme="light"
        title="Info + Dual"
        message="Info variant에 Dual actions입니다."
        confirmText="확인"
        cancelText="취소"
      />
      <Modal
        variant="danger"
        actions="single"
        theme="light"
        title="Danger + Single"
        message="Danger variant에 Single action입니다."
        confirmText="확인"
      />
      <Modal
        variant="danger"
        actions="dual"
        theme="light"
        title="Danger + Dual"
        message="Danger variant에 Dual actions입니다."
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  ),
};
