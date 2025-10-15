'use client';

import styles from './styles.module.css';
import Selectbox from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { EMOTION, EMOTION_KEYS, EmotionType } from '@/commons/constants/enum';
import { URLS } from '@/commons/constants/url';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDiaryWriteModal } from './hooks/index.link.modal.hook';

// Mock 데이터 타입 정의
interface DiaryCard {
  id: string;
  emotion: EmotionType;
  date: string;
  title: string;
}

// Mock 데이터 생성 - enum의 이미지 경로를 직접 활용
const mockDiaries: DiaryCard[] = [
  {
    id: '1',
    emotion: 'Sad',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '2',
    emotion: 'Surprise',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '3',
    emotion: 'Angry',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '4',
    emotion: 'Happy',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '5',
    emotion: 'Etc',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '6',
    emotion: 'Surprise',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '7',
    emotion: 'Angry',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '8',
    emotion: 'Happy',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '9',
    emotion: 'Sad',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다. 한줄까지만 노출 됩니다.',
  },
  {
    id: '10',
    emotion: 'Surprise',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '11',
    emotion: 'Angry',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '12',
    emotion: 'Happy',
    date: '2024. 03. 12',
    title: '타이틀 영역 입니다.',
  },
  {
    id: '13',
    emotion: 'Sad',
    date: '2024. 03. 13',
    title: '추가 일기 데이터입니다.',
  },
  {
    id: '14',
    emotion: 'Surprise',
    date: '2024. 03. 13',
    title: '페이지네이션 테스트용 데이터입니다.',
  },
  {
    id: '15',
    emotion: 'Angry',
    date: '2024. 03. 13',
    title: '더 많은 일기 데이터가 필요합니다.',
  },
  {
    id: '16',
    emotion: 'Happy',
    date: '2024. 03. 13',
    title: '마지막 일기 데이터입니다.',
  },
  // 추가 데이터 - 5페이지 테스트용
  {
    id: '17',
    emotion: 'Sad',
    date: '2024. 03. 14',
    title: '3페이지 첫 번째 일기입니다.',
  },
  {
    id: '18',
    emotion: 'Surprise',
    date: '2024. 03. 14',
    title: '3페이지 두 번째 일기입니다.',
  },
  {
    id: '19',
    emotion: 'Angry',
    date: '2024. 03. 14',
    title: '3페이지 세 번째 일기입니다.',
  },
  {
    id: '20',
    emotion: 'Happy',
    date: '2024. 03. 14',
    title: '3페이지 네 번째 일기입니다.',
  },
  {
    id: '21',
    emotion: 'Etc',
    date: '2024. 03. 14',
    title: '3페이지 다섯 번째 일기입니다.',
  },
  {
    id: '22',
    emotion: 'Sad',
    date: '2024. 03. 14',
    title: '3페이지 여섯 번째 일기입니다.',
  },
  {
    id: '23',
    emotion: 'Surprise',
    date: '2024. 03. 14',
    title: '3페이지 일곱 번째 일기입니다.',
  },
  {
    id: '24',
    emotion: 'Angry',
    date: '2024. 03. 14',
    title: '3페이지 여덟 번째 일기입니다.',
  },
  {
    id: '25',
    emotion: 'Happy',
    date: '2024. 03. 14',
    title: '3페이지 아홉 번째 일기입니다.',
  },
  {
    id: '26',
    emotion: 'Etc',
    date: '2024. 03. 14',
    title: '3페이지 열 번째 일기입니다.',
  },
  {
    id: '27',
    emotion: 'Sad',
    date: '2024. 03. 14',
    title: '3페이지 열한 번째 일기입니다.',
  },
  {
    id: '28',
    emotion: 'Surprise',
    date: '2024. 03. 14',
    title: '3페이지 열두 번째 일기입니다.',
  },
  // 4페이지 데이터
  {
    id: '29',
    emotion: 'Angry',
    date: '2024. 03. 15',
    title: '4페이지 첫 번째 일기입니다.',
  },
  {
    id: '30',
    emotion: 'Happy',
    date: '2024. 03. 15',
    title: '4페이지 두 번째 일기입니다.',
  },
  {
    id: '31',
    emotion: 'Etc',
    date: '2024. 03. 15',
    title: '4페이지 세 번째 일기입니다.',
  },
  {
    id: '32',
    emotion: 'Sad',
    date: '2024. 03. 15',
    title: '4페이지 네 번째 일기입니다.',
  },
  {
    id: '33',
    emotion: 'Surprise',
    date: '2024. 03. 15',
    title: '4페이지 다섯 번째 일기입니다.',
  },
  {
    id: '34',
    emotion: 'Angry',
    date: '2024. 03. 15',
    title: '4페이지 여섯 번째 일기입니다.',
  },
  {
    id: '35',
    emotion: 'Happy',
    date: '2024. 03. 15',
    title: '4페이지 일곱 번째 일기입니다.',
  },
  {
    id: '36',
    emotion: 'Etc',
    date: '2024. 03. 15',
    title: '4페이지 여덟 번째 일기입니다.',
  },
  {
    id: '37',
    emotion: 'Sad',
    date: '2024. 03. 15',
    title: '4페이지 아홉 번째 일기입니다.',
  },
  {
    id: '38',
    emotion: 'Surprise',
    date: '2024. 03. 15',
    title: '4페이지 열 번째 일기입니다.',
  },
  {
    id: '39',
    emotion: 'Angry',
    date: '2024. 03. 15',
    title: '4페이지 열한 번째 일기입니다.',
  },
  {
    id: '40',
    emotion: 'Happy',
    date: '2024. 03. 15',
    title: '4페이지 열두 번째 일기입니다.',
  },
  // 5페이지 데이터
  {
    id: '41',
    emotion: 'Etc',
    date: '2024. 03. 16',
    title: '5페이지 첫 번째 일기입니다.',
  },
  {
    id: '42',
    emotion: 'Sad',
    date: '2024. 03. 16',
    title: '5페이지 두 번째 일기입니다.',
  },
  {
    id: '43',
    emotion: 'Surprise',
    date: '2024. 03. 16',
    title: '5페이지 세 번째 일기입니다.',
  },
  {
    id: '44',
    emotion: 'Angry',
    date: '2024. 03. 16',
    title: '5페이지 네 번째 일기입니다.',
  },
  {
    id: '45',
    emotion: 'Happy',
    date: '2024. 03. 16',
    title: '5페이지 다섯 번째 일기입니다.',
  },
  {
    id: '46',
    emotion: 'Etc',
    date: '2024. 03. 16',
    title: '5페이지 여섯 번째 일기입니다.',
  },
  {
    id: '47',
    emotion: 'Sad',
    date: '2024. 03. 16',
    title: '5페이지 일곱 번째 일기입니다.',
  },
  {
    id: '48',
    emotion: 'Surprise',
    date: '2024. 03. 16',
    title: '5페이지 여덟 번째 일기입니다.',
  },
  {
    id: '49',
    emotion: 'Angry',
    date: '2024. 03. 16',
    title: '5페이지 아홉 번째 일기입니다.',
  },
  {
    id: '50',
    emotion: 'Happy',
    date: '2024. 03. 16',
    title: '5페이지 열 번째 일기입니다.',
  },
  {
    id: '51',
    emotion: 'Etc',
    date: '2024. 03. 16',
    title: '5페이지 열한 번째 일기입니다.',
  },
  {
    id: '52',
    emotion: 'Sad',
    date: '2024. 03. 16',
    title: '5페이지 열두 번째 일기입니다.',
  },
];

export default function Diaries() {
  const router = useRouter();
  const { openWriteModal } = useDiaryWriteModal();

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4x3 그리드
  const totalPages = Math.ceil(mockDiaries.length / itemsPerPage);

  // 필터 옵션 - ENUM 활용
  const filterOptions = [
    { value: 'all', label: '전체' },
    ...EMOTION_KEYS.map((emotion) => ({
      value: emotion.toLowerCase(),
      label: EMOTION[emotion].label,
    })),
  ];

  // 검색 핸들러
  const handleSearch = (value: string) => {
    console.log('검색어:', value);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (value: string | number) => {
    console.log('필터 변경:', value);
  };

  // 일기쓰기 버튼 핸들러 - 모달로 열기
  const handleWriteDiary = () => {
    openWriteModal();
  };

  // 일기 카드 클릭 핸들러
  const handleDiaryClick = (id: string) => {
    router.push(URLS.DIARY_DETAIL.path.replace('[id]', id));
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 현재 페이지에 표시할 일기 데이터 계산
  const getCurrentPageDiaries = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockDiaries.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap32}></div>
      <div className={styles.search}>
        <div className={styles.searchContent}>
          <div className={styles.searchWrapper}>
            <Selectbox
              variant="primary"
              size="medium"
              theme="light"
              placeholder="전체"
              options={filterOptions}
              onValueChange={handleFilterChange}
              className={styles.filterSelect}
              value="all"
            />
            <Searchbar
              variant="primary"
              size="medium"
              theme="light"
              placeholder="검색어를 입력해 주세요."
              onSearch={handleSearch}
              className={styles.searchInput}
            />
          </div>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteDiary}
            className={styles.writeButton}
            leftIcon={
              <Image src="/icons/plus_outline_light_m.svg" alt="일기쓰기" width={16} height={16} />
            }
            data-testid="diary-write-button"
          >
            일기쓰기
          </Button>
        </div>
      </div>
      <div className={styles.gap42}></div>
      <div className={styles.main}>
        <div className={styles.diaryGrid}>
          {getCurrentPageDiaries().map((diary) => (
            <div
              key={diary.id}
              className={styles.diaryCard}
              onClick={() => handleDiaryClick(diary.id)}
            >
              <div className={styles.cardImage}>
                <Image
                  src={`/images/${EMOTION[diary.emotion].images.medium.replace('.svg', '.png')}`}
                  alt={EMOTION[diary.emotion].label}
                  width={274}
                  height={208}
                  className={styles.image}
                />
                <div className={styles.closeIcon}>
                  <Image src="/icons/close_outline_light_m.svg" alt="닫기" width={24} height={24} />
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.emotionText}
                    style={{ color: `var(--${EMOTION[diary.emotion].color})` }}
                  >
                    {EMOTION[diary.emotion].label}
                  </span>
                  <span className={styles.dateText}>{diary.date}</span>
                </div>
                <div className={styles.cardTitle}>{diary.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gap40}></div>
      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="primary"
          size="medium"
          theme="light"
          className={styles.paginationComponent}
        />
      </div>
      <div className={styles.gap40}></div>
    </div>
  );
}
