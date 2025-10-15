# 🎨 Vibe Coding

Next.js 기반의 디자인 시스템 및 UI 컴포넌트 개발 프로젝트입니다.

## 📋 프로젝트 설명

Vibe Coding은 모던한 웹 애플리케이션 개발을 위한 디자인 시스템과 재사용 가능한 UI 컴포넌트를 제공합니다. TypeScript와 Tailwind CSS를 활용하여 타입 안정성과 빠른 스타일링을 지원합니다.

## 🚀 기술 스택

- **프레임워크**: [Next.js 14](https://nextjs.org) (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **폰트**: Geist Sans & Geist Mono
- **패키지 매니저**: npm

## 📁 프로젝트 구조

```
vibe-coding/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   │   ├── page.tsx      # 메인 페이지
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   └── globals.css   # 전역 스타일
│   └── commons/          # 공통 리소스
│       └── constants/    # 상수 정의
│           ├── color.ts        # 컬러 시스템
│           ├── typography.ts   # 타이포그래피 시스템
│           └── propmpts/       # 프롬프트 템플릿
├── public/               # 정적 파일
├── tailwind.config.ts    # Tailwind 설정
└── tsconfig.json         # TypeScript 설정
```

## 🛠️ 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
```

## 🧪 테스트 방법

### Linting 실행

```bash
npm run lint
```

## 📝 개발 가이드

### 페이지 수정

- `src/app/page.tsx` 파일을 수정하면 페이지가 자동으로 업데이트됩니다.
- Hot Module Replacement(HMR)가 활성화되어 있어 변경사항이 즉시 반영됩니다.

### 컬러 시스템

컬러 상수는 `src/commons/constants/color.ts`에서 관리됩니다.

### 타이포그래피 시스템

타이포그래피 설정은 `src/commons/constants/typography.ts`에서 관리됩니다.

## 🔧 사용 가능한 스크립트

| 명령어          | 설명                       |
| --------------- | -------------------------- |
| `npm run dev`   | 개발 서버 실행 (포트 3000) |
| `npm run build` | 프로덕션 빌드 생성         |
| `npm start`     | 프로덕션 서버 실행         |
| `npm run lint`  | ESLint 검사 실행           |

## 📚 참고 자료

- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 문서](https://www.typescriptlang.org/docs)

## 📦 배포

### Vercel 배포

가장 쉬운 배포 방법은 Next.js를 만든 [Vercel 플랫폼](https://vercel.com/new)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 👥 기여

버그 리포트, 기능 제안, PR은 언제나 환영합니다!
