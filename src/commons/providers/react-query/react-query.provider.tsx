"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

/**
 * React Query Provider Props
 */
interface ReactQueryProviderProps {
  children: ReactNode;
}

/**
 * React Query Provider 컴포넌트
 *
 * 애플리케이션 전역에서 사용할 수 있는 client-cache 관리 기능을 제공합니다.
 * @tanstack/react-query를 사용하여 서버 상태를 관리합니다.
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  // useState를 사용하여 클라이언트 컴포넌트마다 새로운 QueryClient 인스턴스 생성
  // 이렇게 하면 서버 사이드 렌더링 시 클라이언트 간 데이터 누수를 방지할 수 있습니다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 데이터가 stale 상태로 간주되기까지의 시간 (ms)
            staleTime: 60 * 1000, // 1분
            // 캐시된 데이터가 메모리에 유지되는 시간 (ms)
            gcTime: 5 * 60 * 1000, // 5분 (v5에서는 cacheTime -> gcTime)
            // 윈도우 포커스 시 자동 refetch 비활성화
            refetchOnWindowFocus: false,
            // 컴포넌트 마운트 시 자동 refetch 설정
            refetchOnMount: true,
            // 네트워크 재연결 시 자동 refetch 설정
            refetchOnReconnect: true,
            // 에러 발생 시 재시도 횟수
            retry: 1,
          },
          mutations: {
            // mutation 에러 발생 시 재시도 횟수
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
