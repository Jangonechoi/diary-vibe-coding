import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "./index";
import { useState } from "react";

/**
 * Pagination 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: "Commons/Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      description: "페이지네이션의 시각적 스타일 변형",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "페이지네이션의 크기",
    },
    theme: {
      control: "select",
      options: ["light", "dark"],
      description: "테마 (라이트/다크 모드)",
    },
    currentPage: {
      control: "number",
      description: "현재 페이지 번호",
    },
    totalPages: {
      control: "number",
      description: "전체 페이지 수",
    },
    visiblePages: {
      control: "number",
      description: "한 번에 표시할 페이지 버튼 개수",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 페이지네이션 (기본)
 */
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * Secondary 페이지네이션
 */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "medium",
    theme: "light",
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * Tertiary 페이지네이션
 */
export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "medium",
    theme: "light",
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 중간 페이지 선택
 */
export const MiddlePage: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * 마지막 페이지 선택
 */
export const LastPage: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * 적은 페이지 수
 */
export const FewPages: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 1,
    totalPages: 3,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * 많은 페이지 수
 */
export const ManyPages: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 50,
    totalPages: 100,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * 커스텀 표시 페이지 수
 */
export const CustomVisiblePages: Story = {
  args: {
    variant: "primary",
    size: "medium",
    theme: "light",
    currentPage: 5,
    totalPages: 20,
    visiblePages: 7,
    onPageChange: (page) => console.log("Page changed to:", page),
  },
};

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Pagination
        variant="primary"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Primary:", page)}
      />
      <Pagination
        variant="secondary"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Secondary:", page)}
      />
      <Pagination
        variant="tertiary"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Tertiary:", page)}
      />
    </div>
  ),
};

/**
 * 모든 Size 조합
 */
export const AllSizes: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Pagination
        variant="primary"
        size="small"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Small:", page)}
      />
      <Pagination
        variant="primary"
        size="medium"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Medium:", page)}
      />
      <Pagination
        variant="primary"
        size="large"
        theme="light"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Large:", page)}
      />
    </div>
  ),
};

/**
 * 다크 테마 전체 조합
 */
export const DarkThemeVariants: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "center",
      }}
    >
      <Pagination
        variant="primary"
        theme="dark"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Primary:", page)}
      />
      <Pagination
        variant="secondary"
        theme="dark"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Secondary:", page)}
      />
      <Pagination
        variant="tertiary"
        theme="dark"
        currentPage={3}
        totalPages={10}
        onPageChange={(page) => console.log("Tertiary:", page)}
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * Interactive 예제 (상태 관리)
 */
export const Interactive: Story = {
  args: {
    currentPage: 1,
    totalPages: 15,
    onPageChange: () => {},
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ textAlign: "center", fontSize: "14px", color: "#666" }}>
          현재 페이지: {currentPage}
        </div>
        <Pagination
          variant="primary"
          size="medium"
          theme="light"
          currentPage={currentPage}
          totalPages={15}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

/**
 * 실제 사용 예제 (데이터 목록과 함께)
 */
export const WithDataList: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalItems = 50;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = Array.from(
      { length: totalItems },
      (_, i) => `Item ${i + 1}`
    ).slice(startIndex, endIndex);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          width: "400px",
        }}
      >
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>
            데이터 목록
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentItems.map((item) => (
              <div
                key={item}
                style={{
                  padding: "12px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <Pagination
          variant="primary"
          size="medium"
          theme="light"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          총 {totalItems}개 항목 중 {startIndex + 1}-
          {Math.min(endIndex, totalItems)} 표시
        </div>
      </div>
    );
  },
};
