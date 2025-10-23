import { describe, it, expect } from "vitest";
import { useFilter } from "../hooks/index.filter.hook";
import { FILTER } from "../../../../commons/constants/enum";

/**
 * 간단한 renderHook 구현
 * @param hook - 테스트할 훅 함수
 * @returns 훅 결과 및 제어 함수들
 */
function renderHook<T>(hook: () => T) {
  let result: T;
  let rerenderCount = 0;

  const rerender = () => {
    rerenderCount++;
    result = hook();
  };

  // 초기 렌더링
  result = hook();

  return {
    result: {
      get current() {
        return result;
      },
    },
    rerender,
    rerenderCount: () => rerenderCount,
  };
}

/**
 * 간단한 act 구현
 * @param callback - 실행할 콜백 함수
 */
function act(callback: () => void) {
  callback();
}

describe("useFilter Hook", () => {
  it("초기 상태가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    expect(result.current.selectedFilter).toBe("default");
    expect(result.current.imageSize).toEqual(FILTER.default.imageSize);
    expect(result.current.filterOptions).toHaveLength(3);
    expect(result.current.filterOptions[0]).toEqual({
      value: "default",
      label: FILTER.default.label,
    });
  });

  it("필터 옵션이 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    const expectedOptions = [
      { value: "default", label: FILTER.default.label },
      { value: "horizontal", label: FILTER.horizontal.label },
      { value: "vertical", label: FILTER.vertical.label },
    ];

    expect(result.current.filterOptions).toEqual(expectedOptions);
  });

  it("기본 필터의 이미지 크기가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    expect(result.current.imageSize).toEqual(FILTER.default.imageSize);
  });

  it("가로형 필터로 변경시 이미지 크기가 올바르게 변경되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setFilter("horizontal");
    });

    expect(result.current.selectedFilter).toBe("horizontal");
    expect(result.current.imageSize).toEqual(FILTER.horizontal.imageSize);
  });

  it("세로형 필터로 변경시 이미지 크기가 올바르게 변경되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    act(() => {
      result.current.setFilter("vertical");
    });

    expect(result.current.selectedFilter).toBe("vertical");
    expect(result.current.imageSize).toEqual(FILTER.vertical.imageSize);
  });

  it("기본 필터로 다시 변경시 이미지 크기가 올바르게 복원되어야 한다", () => {
    const { result } = renderHook(() => useFilter());

    // 먼저 가로형으로 변경
    act(() => {
      result.current.setFilter("horizontal");
    });

    expect(result.current.selectedFilter).toBe("horizontal");
    expect(result.current.imageSize).toEqual(FILTER.horizontal.imageSize);

    // 다시 기본으로 변경
    act(() => {
      result.current.setFilter("default");
    });

    expect(result.current.selectedFilter).toBe("default");
    expect(result.current.imageSize).toEqual(FILTER.default.imageSize);
  });

  it("연속으로 필터를 변경해도 올바르게 동작해야 한다", () => {
    const { result } = renderHook(() => useFilter());

    // 기본 -> 가로형
    act(() => {
      result.current.setFilter("horizontal");
    });
    expect(result.current.imageSize).toEqual(FILTER.horizontal.imageSize);

    // 가로형 -> 세로형
    act(() => {
      result.current.setFilter("vertical");
    });
    expect(result.current.imageSize).toEqual(FILTER.vertical.imageSize);

    // 세로형 -> 기본
    act(() => {
      result.current.setFilter("default");
    });
    expect(result.current.imageSize).toEqual(FILTER.default.imageSize);
  });

  it("setFilter 함수가 동일한 참조를 유지해야 한다", () => {
    const { result, rerender } = renderHook(() => useFilter());

    const firstSetFilter = result.current.setFilter;

    rerender();

    expect(result.current.setFilter).toBe(firstSetFilter);
  });

  it("filterOptions 배열이 동일한 참조를 유지해야 한다", () => {
    const { result, rerender } = renderHook(() => useFilter());

    const firstFilterOptions = result.current.filterOptions;

    rerender();

    expect(result.current.filterOptions).toBe(firstFilterOptions);
  });
});
