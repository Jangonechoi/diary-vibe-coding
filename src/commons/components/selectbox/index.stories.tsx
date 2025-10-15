import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Selectbox } from './index';

/**
 * Selectbox 컴포넌트는 다양한 variant, size, theme 조합을 제공합니다.
 * - variant: primary, secondary, tertiary
 * - size: small, medium, large
 * - theme: light, dark
 */
const meta = {
  title: 'Commons/Components/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '셀렉트박스의 시각적 스타일 변형',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '셀렉트박스의 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '테마 (라이트/다크 모드)',
    },
    fullWidth: {
      control: 'boolean',
      description: '셀렉트박스의 전체 너비 사용 여부',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    label: {
      control: 'text',
      description: '라벨',
    },
    labelPosition: {
      control: 'select',
      options: ['top', 'left'],
      description: '라벨 위치',
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
  },
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션 데이터
const defaultOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
];

const fruitOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'strawberry', label: '딸기' },
];

const categoryOptions = [
  { value: 'all', label: '전체' },
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: '이벤트' },
  { value: 'update', label: '업데이트' },
];

const disabledOptions = [
  { value: 'option1', label: '활성 옵션 1' },
  { value: 'option2', label: '비활성 옵션', disabled: true },
  { value: 'option3', label: '활성 옵션 2' },
  { value: 'option4', label: '비활성 옵션 2', disabled: true },
];

/**
 * Primary 셀렉트박스 (기본)
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '선택하세요',
    options: defaultOptions,
  },
};

/**
 * Secondary 셀렉트박스
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    placeholder: '선택하세요',
    options: defaultOptions,
  },
};

/**
 * Tertiary 셀렉트박스
 */
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
    placeholder: '선택하세요',
    options: fruitOptions,
  },
};

/**
 * Small 크기
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    theme: 'light',
    placeholder: 'Small Selectbox',
    options: defaultOptions,
  },
};

/**
 * Medium 크기 (기본)
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Medium Selectbox',
    options: defaultOptions,
  },
};

/**
 * Large 크기
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    placeholder: 'Large Selectbox',
    options: defaultOptions,
  },
};

/**
 * Dark 테마
 */
export const DarkTheme: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    placeholder: 'Dark Theme Selectbox',
    options: defaultOptions,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Full Width Selectbox',
    options: defaultOptions,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
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
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Disabled Selectbox',
    options: defaultOptions,
    disabled: true,
  },
};

/**
 * 에러 상태
 */
export const Error: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '에러 상태 셀렉트박스',
    options: defaultOptions,
    error: true,
    errorMessage: '필수 선택 항목입니다',
  },
};

/**
 * 라벨 포함 (상단)
 */
export const WithLabel: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '카테고리를 선택하세요',
    options: categoryOptions,
    label: '카테고리',
    labelPosition: 'top',
  },
};

/**
 * 라벨 포함 (왼쪽)
 */
export const WithLeftLabel: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '카테고리를 선택하세요',
    options: categoryOptions,
    label: '카테고리',
    labelPosition: 'left',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 비활성 옵션 포함
 */
export const WithDisabledOptions: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '옵션을 선택하세요',
    options: disabledOptions,
    label: '옵션 선택',
  },
};

/**
 * 과일 선택 예제
 */
export const FruitSelector: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '과일을 선택하세요',
    options: fruitOptions,
    label: '좋아하는 과일',
  },
};

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Selectbox variant="primary" theme="light" placeholder="Primary" options={defaultOptions} />
      <Selectbox
        variant="secondary"
        theme="light"
        placeholder="Secondary"
        options={defaultOptions}
      />
      <Selectbox variant="tertiary" theme="light" placeholder="Tertiary" options={defaultOptions} />
    </div>
  ),
};

/**
 * 모든 Size 조합
 */
export const AllSizes: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Selectbox
        variant="primary"
        size="small"
        theme="light"
        placeholder="Small"
        options={defaultOptions}
      />
      <Selectbox
        variant="primary"
        size="medium"
        theme="light"
        placeholder="Medium"
        options={defaultOptions}
      />
      <Selectbox
        variant="primary"
        size="large"
        theme="light"
        placeholder="Large"
        options={defaultOptions}
      />
    </div>
  ),
};

/**
 * 다크 테마 전체 조합
 */
export const DarkThemeVariants: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '300px',
      }}
    >
      <Selectbox variant="primary" theme="dark" placeholder="Primary" options={defaultOptions} />
      <Selectbox
        variant="secondary"
        theme="dark"
        placeholder="Secondary"
        options={defaultOptions}
      />
      <Selectbox variant="tertiary" theme="dark" placeholder="Tertiary" options={defaultOptions} />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * 폼 예제
 */
export const FormExample: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '400px',
      }}
    >
      <Selectbox
        variant="primary"
        size="medium"
        theme="light"
        label="카테고리"
        placeholder="카테고리를 선택하세요"
        options={categoryOptions}
      />
      <Selectbox
        variant="primary"
        size="medium"
        theme="light"
        label="좋아하는 과일"
        placeholder="과일을 선택하세요"
        options={fruitOptions}
      />
      <Selectbox
        variant="primary"
        size="medium"
        theme="light"
        label="필수 선택"
        placeholder="선택하세요"
        options={defaultOptions}
        error={true}
        errorMessage="필수 선택 항목입니다"
      />
    </div>
  ),
};

/**
 * Interactive 예제 (선택 이벤트)
 */
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: 'Select an option...',
    options: defaultOptions,
    onValueChange: (value) => console.log('Selected value:', value),
  },
};

/**
 * 숫자 값 옵션
 */
export const NumericValues: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '수량을 선택하세요',
    label: '수량',
    options: [
      { value: 1, label: '1개' },
      { value: 5, label: '5개' },
      { value: 10, label: '10개' },
      { value: 20, label: '20개' },
      { value: 50, label: '50개' },
    ],
  },
};

/**
 * 많은 옵션
 */
export const ManyOptions: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    placeholder: '국가를 선택하세요',
    label: '국가',
    options: [
      { value: 'kr', label: '대한민국' },
      { value: 'us', label: '미국' },
      { value: 'jp', label: '일본' },
      { value: 'cn', label: '중국' },
      { value: 'uk', label: '영국' },
      { value: 'fr', label: '프랑스' },
      { value: 'de', label: '독일' },
      { value: 'ca', label: '캐나다' },
      { value: 'au', label: '호주' },
      { value: 'es', label: '스페인' },
    ],
  },
};

/**
 * 상태별 조합
 */
export const StateVariations: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '400px',
      }}
    >
      <Selectbox
        variant="primary"
        theme="light"
        placeholder="기본 상태"
        options={defaultOptions}
        label="기본"
      />
      <Selectbox
        variant="primary"
        theme="light"
        placeholder="비활성화 상태"
        options={defaultOptions}
        label="비활성화"
        disabled={true}
      />
      <Selectbox
        variant="primary"
        theme="light"
        placeholder="에러 상태"
        options={defaultOptions}
        label="에러"
        error={true}
        errorMessage="필수 선택 항목입니다"
      />
    </div>
  ),
};
