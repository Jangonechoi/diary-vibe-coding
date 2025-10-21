# Vercel 환경 변수 설정 가이드

## CORS 에러 해결을 위한 환경 변수 설정

배포된 사이트에서 CORS 에러가 발생하는 문제를 해결하기 위해 Vercel에서 환경 변수를 설정해야 합니다.

### 1. Vercel 대시보드에서 환경 변수 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. 해당 프로젝트 선택
3. Settings 탭 클릭
4. Environment Variables 섹션으로 이동
5. 다음 환경 변수 추가:

```
NEXT_PUBLIC_GRAPHQL_ENDPOINT = https://main-practice.codebootcamp.co.kr/graphql
```

### 2. 환경별 설정

- **Production**: 프로덕션 환경용
- **Preview**: 프리뷰/스테이징 환경용
- **Development**: 로컬 개발 환경용

모든 환경에 동일한 값을 설정하거나, 필요에 따라 다른 값을 설정할 수 있습니다.

### 3. 재배포

환경 변수 설정 후:

1. 프로젝트를 다시 배포하거나
2. Vercel에서 "Redeploy" 버튼 클릭

### 4. 로컬 개발 환경 설정 (선택사항)

로컬에서 개발할 때는 `.env.local` 파일을 생성하여 설정할 수 있습니다:

```bash
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://main-practice.codebootcamp.co.kr/graphql
```

### 5. 확인 방법

배포 후 브라우저 개발자 도구의 Network 탭에서 GraphQL 요청이 올바른 엔드포인트로 전송되는지 확인하세요.

## 주의사항

- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수는 클라이언트 사이드에서 접근 가능합니다.
- 환경 변수 변경 후에는 반드시 재배포가 필요합니다.
- CORS 에러는 서버 측 설정도 필요할 수 있습니다. 서버 관리자에게 문의하세요.
