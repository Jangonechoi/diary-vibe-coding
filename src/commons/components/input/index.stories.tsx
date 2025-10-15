import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./index";

/**
 * Input 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "인풋의 시각적 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "인풋의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    fullWidth: {
      control: "boolean",
      description: "인풋의 전체 너비 사용 여부",
    },
    error: {
      control: "boolean",
      description: "에러 상태",
    },
    errorMessage: {
      control: "text",
      description: "에러 메시지",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    label: {
      control: "text",
      description: "라벨",
    },
    labelPosition: {
      control: "select",
      options: ["top", "left"],
      description: "라벨 위치",
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 텍스트",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "tel", "url"],
      description: "인풋 타입",
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 인풋 (기본)
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "텍스트를 입력하세요",
  },
};

/**
 * Secondary 인풋
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
    placeholder: "텍스트를 입력하세요",
  },
};

/**
 * Tertiary 인풋
 */
export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "medium",
    theme: "light",
    placeholder: "텍스트를 입력하세요",
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
    placeholder: "Small Input",
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
    placeholder: "Medium Input",
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
    placeholder: "Large Input",
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
    placeholder: "Dark Theme Input",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "Full Width Input",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "Disabled Input",
    disabled: true,
  },
};

/**
 * 에러 상태
 */
export const Error: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "에러 상태 인풋",
    error: true,
    errorMessage: "올바른 형식이 아닙니다",
  },
};

/**
 * 라벨 포함 (상단)
 */
export const WithLabel: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "이름을 입력하세요",
    label: "이름",
    labelPosition: "top",
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
    placeholder: "이름을 입력하세요",
    label: "이름",
    labelPosition: "left",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 왼쪽 아이콘
 */
export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력하세요",
    leftIcon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 10.5L14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * 오른쪽 아이콘
 */
export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "비밀번호를 입력하세요",
    type: "password",
    rightIcon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3C4.5 3 1.73 5.11 1 8C1.73 10.89 4.5 13 8 13C11.5 13 14.27 10.89 15 8C14.27 5.11 11.5 3 8 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 10.5C9.38071 10.5 10.5 9.38071 10.5 8C10.5 6.61929 9.38071 5.5 8 5.5C6.61929 5.5 5.5 6.61929 5.5 8C5.5 9.38071 6.61929 10.5 8 10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * 이메일 타입
 */
export const EmailType: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    type: "email",
    placeholder: "email@example.com",
    label: "이메일",
  },
};

/**
 * 비밀번호 타입
 */
export const PasswordType: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    type: "password",
    placeholder: "비밀번호를 입력하세요",
    label: "비밀번호",
  },
};

/**
 * 숫자 타입
 */
export const NumberType: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    type: "number",
    placeholder: "숫자를 입력하세요",
    label: "나이",
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
        width: "300px",
      }}
    >
      <Input variant="primary" theme="light" placeholder="Primary" />
      <Input variant="secondary" theme="light" placeholder="Secondary" />
      <Input variant="tertiary" theme="light" placeholder="Tertiary" />
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
        width: "300px",
      }}
    >
      <Input variant="primary" size="small" theme="light" placeholder="Small" />
      <Input
        variant="primary"
        size="medium"
        theme="light"
        placeholder="Medium"
      />
      <Input variant="primary" size="large" theme="light" placeholder="Large" />
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
        width: "300px",
      }}
    >
      <Input variant="primary" theme="dark" placeholder="Primary" />
      <Input variant="secondary" theme="dark" placeholder="Secondary" />
      <Input variant="tertiary" theme="dark" placeholder="Tertiary" />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
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
        width: "400px",
      }}
    >
      <Input
        variant="primary"
        size="medium"
        theme="light"
        label="이름"
        placeholder="홍길동"
      />
      <Input
        variant="primary"
        size="medium"
        theme="light"
        label="이메일"
        type="email"
        placeholder="example@email.com"
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4L8 9L14 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 4H14V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <Input
        variant="primary"
        size="medium"
        theme="light"
        label="비밀번호"
        type="password"
        placeholder="8자 이상 입력하세요"
        error={true}
        errorMessage="비밀번호는 8자 이상이어야 합니다"
      />
      <Input
        variant="primary"
        size="medium"
        theme="light"
        label="전화번호"
        type="tel"
        placeholder="010-0000-0000"
      />
    </div>
  ),
};

/**
 * Interactive 예제 (입력 이벤트)
 */
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "Type something...",
    onChange: (e) => console.log("Input value:", e.target.value),
  },
};
