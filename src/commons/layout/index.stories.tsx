import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Layout from "./index";
import { AuthProvider } from "@/commons/providers/auth/auth.provider";

/**
 * Layout 컴포넌트는 전체 애플리케이션의 레이아웃을 담당합니다.
 * - Header, Navigation, Footer 영역을 포함
 * - 인증 상태에 따른 UI 표시
 * - 반응형 디자인 지원
 */
const meta = {
  title: "Commons/Layout",
  component: Layout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 레이아웃 (비로그인 상태)
 */
export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>메인 콘텐츠</h1>
        <p>레이아웃의 기본 상태입니다.</p>
      </div>
    ),
  },
};

/**
 * 로그인 상태 레이아웃
 */
export const Authenticated: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>메인 콘텐츠</h1>
        <p>로그인된 사용자용 레이아웃입니다.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // 테스트용 로그인 상태 설정
                localStorage.setItem('accessToken', 'test-token');
                localStorage.setItem('user', JSON.stringify({
                  id: '1',
                  email: 'test@example.com',
                  name: '테스트 사용자'
                }));
              `,
            }}
          />
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
};

/**
 * 모든 영역이 표시되는 레이아웃
 */
export const FullLayout: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>전체 레이아웃</h1>
        <p>Header, Banner, Navigation, Footer가 모두 표시됩니다.</p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "모든 레이아웃 영역이 표시되는 상태입니다.",
      },
    },
  },
};

/**
 * 인증 상태 UI만 표시
 */
export const AuthStatusOnly: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>인증 상태 UI</h1>
        <p>Header 영역의 인증 상태 UI만 표시됩니다.</p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // 테스트용 로그인 상태 설정
                localStorage.setItem('accessToken', 'test-token');
                localStorage.setItem('user', JSON.stringify({
                  id: '1',
                  email: 'test@example.com',
                  name: '홍길동'
                }));
              `,
            }}
          />
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "로그인된 사용자의 인증 상태 UI가 Header 우측에 표시됩니다.",
      },
    },
  },
};

/**
 * 다크 테마 레이아웃
 */
export const DarkTheme: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>다크 테마</h1>
        <p>다크 테마에서의 레이아웃입니다.</p>
      </div>
    ),
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

/**
 * 모바일 반응형 레이아웃
 */
export const Mobile: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>모바일 레이아웃</h1>
        <p>모바일 환경에서의 레이아웃입니다.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * 태블릿 반응형 레이아웃
 */
export const Tablet: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>태블릿 레이아웃</h1>
        <p>태블릿 환경에서의 레이아웃입니다.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

/**
 * 데스크톱 반응형 레이아웃
 */
export const Desktop: Story = {
  args: {
    children: (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>데스크톱 레이아웃</h1>
        <p>데스크톱 환경에서의 레이아웃입니다.</p>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
