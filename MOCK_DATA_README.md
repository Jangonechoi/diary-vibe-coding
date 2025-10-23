# 📝 일기 Mock 데이터 설정 가이드

이 문서는 일기 애플리케이션의 페이지네이션 테스트를 위한 mock 데이터 생성 및 설정 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 웹 인터페이스 사용 (권장)

브라우저에서 다음 URL로 접속하여 GUI로 mock 데이터를 설정할 수 있습니다:

```
http://localhost:3000/setup-mock-data.html
```

**주요 기능:**

- 📊 원하는 개수의 mock 데이터 생성
- 📈 대용량 데이터 생성 (200개)
- 📋 현재 데이터 상태 확인
- 💾 데이터 내보내기/가져오기
- 🗑️ 데이터 삭제

### 2. 브라우저 콘솔 사용

개발자 도구 콘솔에서 다음 스크립트를 실행하세요:

```javascript
// 기본 mock 데이터 생성 (50개)
registerMockData(50);

// 대용량 데이터 생성 (200개)
registerMockData(200);

// 현재 데이터 확인
checkMockData();

// 데이터 삭제
clearMockData();
```

### 3. 페이지네이션 테스트용 데이터

```javascript
// 페이지네이션 테스트용 데이터 생성 (100개)
registerPaginationTestData(100);

// 대용량 페이지네이션 테스트 (500개)
registerLargePaginationTestData();

// 극대용량 페이지네이션 테스트 (1000개)
registerXLargePaginationTestData();

// 페이지네이션 성능 테스트
testPaginationPerformance();
```

## 📊 Mock 데이터 구조

생성되는 mock 데이터는 다음 구조를 따릅니다:

```typescript
interface StoredDiary {
  id: number; // 고유 식별자
  title: string; // 일기 제목
  content: string; // 일기 내용
  emotion: EmotionType; // 감정 타입 (Happy, Sad, Angry, Surprise, Etc)
  createdAt: string; // 생성일시 (ISO 8601 형식)
}
```

## 🎯 페이지네이션 테스트 시나리오

### 기본 테스트 (50개 데이터)

- 페이지당 12개 아이템
- 총 5페이지 (4페이지는 12개, 마지막 페이지는 2개)
- 필터링, 검색, 정렬 기능 테스트

### 중간 테스트 (200개 데이터)

- 페이지당 12개 아이템
- 총 17페이지
- 성능 테스트 및 메모리 사용량 확인

### 대용량 테스트 (500개 데이터)

- 페이지당 12개 아이템
- 총 42페이지
- 대용량 데이터 처리 성능 테스트

### 극대용량 테스트 (1000개 데이터)

- 페이지당 12개 아이템
- 총 84페이지
- 메모리 최적화 및 가상화 테스트

## 🔧 개발자 도구

### TypeScript 유틸리티 함수

```typescript
import {
  generateMockDiaries,
  registerMockDataToLocalStorage,
  clearMockDataFromLocalStorage,
  checkMockDataInLocalStorage,
} from "@/utils/mockData";

// 100개의 mock 데이터 생성
const mockData = generateMockDiaries(100);

// 로컬스토리지에 등록
registerMockDataToLocalStorage(100);

// 데이터 확인
const currentData = checkMockDataInLocalStorage();

// 데이터 삭제
clearMockDataFromLocalStorage();
```

### 성능 모니터링

```javascript
// 페이지네이션 성능 테스트
testPaginationPerformance();

// 메모리 사용량 확인
console.log("메모리 사용량:", performance.memory);

// 렌더링 성능 측정
const startTime = performance.now();
// 페이지네이션 동작
const endTime = performance.now();
console.log(`렌더링 시간: ${endTime - startTime}ms`);
```

## 📁 파일 구조

```
src/
├── utils/
│   └── mockData.ts              # TypeScript 유틸리티 함수
├── scripts/
│   ├── setup-mock-data.js      # 브라우저용 mock 데이터 스크립트
│   └── test-pagination.js      # 페이지네이션 테스트 스크립트
└── public/
    └── setup-mock-data.html     # 웹 인터페이스
```

## 🎨 Mock 데이터 특징

### 감정 분포

- Happy: 20%
- Sad: 20%
- Angry: 20%
- Surprise: 20%
- Etc: 20%

### 날짜 분포

- 최근 6개월 내 랜덤 생성
- 최신순으로 정렬
- 다양한 시점의 데이터 포함

### 내용 다양성

- 50가지 제목 템플릿
- 50가지 내용 템플릿
- 실제 사용자 경험과 유사한 데이터

## 🧪 테스트 시나리오

### 1. 기본 페이지네이션

```javascript
// 50개 데이터로 기본 페이지네이션 테스트
registerMockData(50);
// 1페이지: 12개, 2페이지: 12개, 3페이지: 12개, 4페이지: 12개, 5페이지: 2개
```

### 2. 필터링 + 페이지네이션

```javascript
// 특정 감정으로 필터링 후 페이지네이션 테스트
// Happy 감정만 필터링하여 페이지네이션 동작 확인
```

### 3. 검색 + 페이지네이션

```javascript
// 검색어 입력 후 페이지네이션 테스트
// 검색 결과에 대한 페이지네이션 동작 확인
```

### 4. 성능 테스트

```javascript
// 대용량 데이터로 성능 테스트
registerLargePaginationTestData(); // 500개
testPaginationPerformance();
```

## 🐛 문제 해결

### 데이터가 표시되지 않는 경우

1. 로컬스토리지 확인: `localStorage.getItem("diaries")`
2. 데이터 형식 확인: JSON.parse() 오류 확인
3. 컴포넌트 리렌더링 확인

### 성능 이슈가 있는 경우

1. 데이터 개수 줄이기: 50개 → 20개
2. 메모리 사용량 확인: 개발자 도구 → Performance
3. 가상화 적용 고려

### 필터링/검색이 작동하지 않는 경우

1. 데이터 구조 확인
2. 필터 조건 확인
3. 검색어 형식 확인

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우, 다음을 확인해주세요:

1. 브라우저 콘솔 오류 메시지
2. 네트워크 탭의 요청/응답
3. 로컬스토리지 데이터 상태
4. 컴포넌트 상태 및 props

---

**Happy Testing! 🎉**
