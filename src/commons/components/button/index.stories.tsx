import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./index";

/**
 * Button 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "버튼의 시각적 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "버튼의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    fullWidth: {
      control: "boolean",
      description: "버튼의 전체 너비 사용 여부",
    },
    loading: {
      control: "boolean",
      description: "로딩 상태",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    children: {
      control: "text",
      description: "버튼의 내용 (텍스트)",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 버튼 (기본)
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    children: "Primary Button",
  },
};

/**
 * Secondary 버튼
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
    children: "Secondary Button",
  },
};

/**
 * Tertiary 버튼
 */
export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "medium",
    theme: "light",
    children: "Tertiary Button",
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
    children: "Small Button",
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
    children: "Medium Button",
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
    children: "Large Button",
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
    children: "Dark Theme Button",
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
    children: "Full Width Button",
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
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    children: "Loading Button",
    loading: true,
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
    children: "Disabled Button",
    disabled: true,
  },
};

/**
 * 왼쪽 아이콘
 */
export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    children: "With Left Icon",
    leftIcon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M8 2v12M2 8h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
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
    children: "With Right Icon",
    rightIcon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <Button variant="primary" theme="light">
        Primary
      </Button>
      <Button variant="secondary" theme="light">
        Secondary
      </Button>
      <Button variant="tertiary" theme="light">
        Tertiary
      </Button>
    </div>
  ),
};

/**
 * 모든 Size 조합
 */
export const AllSizes: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary" size="small" theme="light">
        Small
      </Button>
      <Button variant="primary" size="medium" theme="light">
        Medium
      </Button>
      <Button variant="primary" size="large" theme="light">
        Large
      </Button>
    </div>
  ),
};

/**
 * 다크 테마 전체 조합
 */
export const DarkThemeVariants: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <Button variant="primary" theme="dark">
        Primary
      </Button>
      <Button variant="secondary" theme="dark">
        Secondary
      </Button>
      <Button variant="tertiary" theme="dark">
        Tertiary
      </Button>
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Interactive 예제 (클릭 이벤트)
 */
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    children: "Click Me!",
    onClick: () => alert("Button clicked!"),
  },
};
