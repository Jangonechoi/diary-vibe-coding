import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Searchbar } from "./index";

/**
 * Searchbar 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Searchbar",
  component: Searchbar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "검색바의 시각적 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "검색바의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    fullWidth: {
      control: "boolean",
      description: "검색바의 전체 너비 사용 여부",
    },
    showSearchIcon: {
      control: "boolean",
      description: "검색 아이콘 표시 여부",
    },
    showClearButton: {
      control: "boolean",
      description: "클리어 버튼 표시 여부",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    placeholder: {
      control: "text",
      description: "플레이스홀더 텍스트",
    },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 검색바 (기본)
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
  },
};

/**
 * Secondary 검색바
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
  },
};

/**
 * Tertiary 검색바
 */
export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "검색어를 입력해 주세요.",
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
    placeholder: "검색어를 입력해 주세요.",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "600px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 검색 아이콘 없음
 */
export const WithoutSearchIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
    showSearchIcon: false,
  },
};

/**
 * 클리어 버튼 없음
 */
export const WithoutClearButton: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
    showClearButton: false,
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
    placeholder: "검색어를 입력해 주세요.",
    disabled: true,
  },
};

/**
 * 커스텀 오른쪽 아이콘
 */
export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력해 주세요.",
    showClearButton: false,
    rightIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 5v10M5 10h10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
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
        width: "400px",
      }}
    >
      <Searchbar variant="primary" theme="light" placeholder="Primary" />
      <Searchbar variant="secondary" theme="light" placeholder="Secondary" />
      <Searchbar variant="tertiary" theme="light" placeholder="Tertiary" />
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
        width: "400px",
      }}
    >
      <Searchbar
        variant="primary"
        size="small"
        theme="light"
        placeholder="Small"
      />
      <Searchbar
        variant="primary"
        size="medium"
        theme="light"
        placeholder="Medium"
      />
      <Searchbar
        variant="primary"
        size="large"
        theme="light"
        placeholder="Large"
      />
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
        width: "400px",
      }}
    >
      <Searchbar variant="primary" theme="dark" placeholder="Primary" />
      <Searchbar variant="secondary" theme="dark" placeholder="Secondary" />
      <Searchbar variant="tertiary" theme="dark" placeholder="Tertiary" />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Interactive 예제 (검색 이벤트)
 */
export const Interactive: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    placeholder: "검색어를 입력하고 Enter를 누르세요.",
    onSearch: (value) => alert(`검색어: ${value}`),
  },
};

/**
 * Controlled 컴포넌트 예제
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "400px",
        }}
      >
        <Searchbar
          variant="primary"
          size="medium"
          theme="light"
          placeholder="Controlled 검색바"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSearch={(val) => alert(`검색어: ${val}`)}
        />
        <p style={{ fontSize: "14px", color: "#666" }}>
          현재 값: {value || "(없음)"}
        </p>
      </div>
    );
  },
};
