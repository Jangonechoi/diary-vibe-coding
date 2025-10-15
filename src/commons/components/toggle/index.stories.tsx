import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "./index";

/**
 * Toggle 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "토글의 시각적 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "토글의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    checked: {
      control: "boolean",
      description: "토글 상태 (on/off)",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    label: {
      control: "text",
      description: "라벨 텍스트",
    },
    labelPosition: {
      control: "select",
      options: ["left", "right"],
      description: "라벨 위치",
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 토글 (기본)
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

/**
 * Secondary 토글
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
  },
};

/**
 * Tertiary 토글
 */
export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "medium",
    theme: "light",
  },
};

/**
 * Small 크기
 */
export const Small: Story = {
  args: {
    variant: "primary",
    size: "small",
    theme: "light",
  },
};

/**
 * Medium 크기 (기본)
 */
export const Medium: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
  },
};

/**
 * Large 크기
 */
export const Large: Story = {
  args: {
    variant: "primary",
    size: "large",
    theme: "light",
  },
};

/**
 * Dark 테마
 */
export const DarkTheme: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 체크된 상태
 */
export const Checked: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    checked: true,
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    disabled: true,
  },
};

/**
 * 체크되고 비활성화된 상태
 */
export const CheckedDisabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    checked: true,
    disabled: true,
  },
};

/**
 * 라벨 포함 (오른쪽)
 */
export const WithLabel: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    label: "알림 설정",
    labelPosition: "right",
  },
};

/**
 * 라벨 포함 (왼쪽)
 */
export const WithLeftLabel: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    label: "알림 설정",
    labelPosition: "left",
  },
};

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <Toggle variant="primary" theme="light" label="Primary" />
      <Toggle variant="secondary" theme="light" label="Secondary" />
      <Toggle variant="tertiary" theme="light" label="Tertiary" />
    </div>
  ),
};

/**
 * 모든 Size 조합
 */
export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <Toggle variant="primary" size="small" theme="light" label="Small" />
      <Toggle variant="primary" size="medium" theme="light" label="Medium" />
      <Toggle variant="primary" size="large" theme="light" label="Large" />
    </div>
  ),
};

/**
 * 다크 테마 전체 조합
 */
export const DarkThemeVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <Toggle variant="primary" theme="dark" label="Primary" />
      <Toggle variant="secondary" theme="dark" label="Secondary" />
      <Toggle variant="tertiary" theme="dark" label="Tertiary" />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 설정 패널 예제
 */
export const SettingsPanel: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "400px",
      }}
    >
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="이메일 알림"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="푸시 알림"
        labelPosition="right"
        checked={false}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="SMS 알림"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="마케팅 수신 동의"
        labelPosition="right"
        checked={false}
        disabled={true}
      />
    </div>
  ),
};

/**
 * 폼 예제
 */
export const FormExample: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "500px",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
        계정 설정
      </h3>
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="2단계 인증 활성화"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="로그인 알림"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="비밀번호 만료 알림"
        labelPosition="right"
        checked={false}
      />
      <hr style={{ border: "none", borderTop: "1px solid #e0e0e0" }} />
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
        개인정보 설정
      </h3>
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="프로필 공개"
        labelPosition="right"
        checked={false}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="활동 기록 표시"
        labelPosition="right"
        checked={true}
      />
    </div>
  ),
};

/**
 * Interactive 예제 (상태 변경)
 */
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    label: "토글을 클릭해보세요",
    onChange: (checked) => console.log("Toggle state:", checked),
  },
};

/**
 * 상태별 조합
 */
export const StateVariations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <Toggle
        variant="primary"
        theme="light"
        label="기본 (Off)"
        checked={false}
      />
      <Toggle
        variant="primary"
        theme="light"
        label="활성화 (On)"
        checked={true}
      />
      <Toggle
        variant="primary"
        theme="light"
        label="비활성화 (Off)"
        checked={false}
        disabled={true}
      />
      <Toggle
        variant="primary"
        theme="light"
        label="비활성화 (On)"
        checked={true}
        disabled={true}
      />
    </div>
  ),
};

/**
 * 왼쪽 라벨 조합
 */
export const LeftLabelVariations: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <Toggle
        variant="primary"
        theme="light"
        label="이메일 알림"
        labelPosition="left"
        checked={true}
      />
      <Toggle
        variant="secondary"
        theme="light"
        label="푸시 알림"
        labelPosition="left"
        checked={false}
      />
      <Toggle
        variant="tertiary"
        theme="light"
        label="SMS 알림"
        labelPosition="left"
        checked={true}
      />
    </div>
  ),
};

/**
 * 크기별 라벨 조합
 */
export const SizeWithLabels: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "flex-start",
      }}
    >
      <Toggle
        variant="primary"
        size="small"
        theme="light"
        label="Small Toggle"
        labelPosition="right"
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="light"
        label="Medium Toggle"
        labelPosition="right"
      />
      <Toggle
        variant="primary"
        size="large"
        theme="light"
        label="Large Toggle"
        labelPosition="right"
      />
    </div>
  ),
};

/**
 * 다크 테마 설정 패널
 */
export const DarkThemeSettings: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "400px",
        padding: "20px",
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: "600",
          color: "#fff",
        }}
      >
        알림 설정
      </h3>
      <Toggle
        variant="primary"
        size="medium"
        theme="dark"
        label="이메일 알림"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="dark"
        label="푸시 알림"
        labelPosition="right"
        checked={true}
      />
      <Toggle
        variant="primary"
        size="medium"
        theme="dark"
        label="SMS 알림"
        labelPosition="right"
        checked={false}
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 전체 조합 매트릭스
 */
export const AllCombinations: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "40px",
        padding: "20px",
      }}
    >
      {/* Primary Variants */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Primary - Small
        </h4>
        <Toggle variant="primary" size="small" theme="light" label="Light" />
        <Toggle variant="primary" size="small" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Primary - Medium
        </h4>
        <Toggle variant="primary" size="medium" theme="light" label="Light" />
        <Toggle variant="primary" size="medium" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Primary - Large
        </h4>
        <Toggle variant="primary" size="large" theme="light" label="Light" />
        <Toggle variant="primary" size="large" theme="dark" label="Dark" />
      </div>

      {/* Secondary Variants */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Secondary - Small
        </h4>
        <Toggle variant="secondary" size="small" theme="light" label="Light" />
        <Toggle variant="secondary" size="small" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Secondary - Medium
        </h4>
        <Toggle variant="secondary" size="medium" theme="light" label="Light" />
        <Toggle variant="secondary" size="medium" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Secondary - Large
        </h4>
        <Toggle variant="secondary" size="large" theme="light" label="Light" />
        <Toggle variant="secondary" size="large" theme="dark" label="Dark" />
      </div>

      {/* Tertiary Variants */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Tertiary - Small
        </h4>
        <Toggle variant="tertiary" size="small" theme="light" label="Light" />
        <Toggle variant="tertiary" size="small" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Tertiary - Medium
        </h4>
        <Toggle variant="tertiary" size="medium" theme="light" label="Light" />
        <Toggle variant="tertiary" size="medium" theme="dark" label="Dark" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
          Tertiary - Large
        </h4>
        <Toggle variant="tertiary" size="large" theme="light" label="Light" />
        <Toggle variant="tertiary" size="large" theme="dark" label="Dark" />
      </div>
    </div>
  ),
};
