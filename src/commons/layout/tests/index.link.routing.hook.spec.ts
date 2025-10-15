/**
 * Layout 링크 라우팅 훅 테스트
 *
 * 이 파일은 Playwright 테스트를 통해 검증됩니다.
 * 테스트 파일 위치: /test/layout.link.routing.spec.ts
 *
 * 실행 방법:
 * - 모든 브라우저: npx playwright test test/layout.link.routing.spec.ts
 * - 데스크톱만: npx playwright test test/layout.link.routing.spec.ts --project=chromium --project=firefox --project=webkit
 *
 * 테스트 내용:
 * 1. 헤더 로고 클릭 시 일기목록 페이지로 이동
 * 2. 일기보관함 네비게이션 클릭 시 일기목록 페이지로 이동 및 액티브 상태 변경
 * 3. 사진보관함 네비게이션 클릭 시 사진목록 페이지로 이동 및 액티브 상태 변경
 * 4. 일기보관함 ↔ 사진보관함 상호 이동 시 액티브 상태 정상 동작
 */

export {};
