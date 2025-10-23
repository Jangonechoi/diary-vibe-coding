import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteDiary } from "../hooks/index.delete.hook";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { useModal } from "@/commons/providers/modal/modal.provider";

// Mock dependencies
vi.mock("@/commons/providers/auth/auth.guard.hook");
vi.mock("@/commons/providers/modal/modal.provider");

const mockUseAuthGuard = vi.mocked(useAuthGuard);
const mockUseModal = vi.mocked(useModal);

describe("useDeleteDiary", () => {
  const mockGuard = vi.fn();
  const mockOpenModal = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUseAuthGuard.mockReturnValue({
      guard: mockGuard,
    });

    mockUseModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    });

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      value: {
        reload: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("초기 상태가 올바르게 설정되어야 함", () => {
    const { result } = renderHook(() => useDeleteDiary());

    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(result.current.deleteTargetId).toBe(null);
    expect(typeof result.current.handleDeleteDiary).toBe("function");
    expect(typeof result.current.closeDeleteModal).toBe("function");
    expect(typeof result.current.confirmDelete).toBe("function");
  });

  it("handleDeleteDiary가 호출되면 guard 함수가 실행되어야 함", async () => {
    const { result } = renderHook(() => useDeleteDiary());
    const diaryId = 1;

    await act(async () => {
      await result.current.handleDeleteDiary(diaryId);
    });

    expect(mockGuard).toHaveBeenCalledWith(expect.any(Function));
  });

  it("삭제 모달이 올바르게 표시되어야 함", async () => {
    const { result } = renderHook(() => useDeleteDiary());
    const diaryId = 1;

    // guard 함수가 성공적으로 실행되도록 설정
    mockGuard.mockImplementation(async (action) => {
      await action();
      return true;
    });

    await act(async () => {
      await result.current.handleDeleteDiary(diaryId);
    });

    expect(mockOpenModal).toHaveBeenCalledWith(expect.any(Object));
  });

  it("로컬스토리지에서 일기가 올바르게 삭제되어야 함", () => {
    const mockDiaries = [
      {
        id: 1,
        title: "일기1",
        content: "내용1",
        emotion: "Happy",
        createdAt: "2024-01-01",
      },
      {
        id: 2,
        title: "일기2",
        content: "내용2",
        emotion: "Sad",
        createdAt: "2024-01-02",
      },
    ];

    // localStorage.getItem mock 설정
    vi.mocked(window.localStorage.getItem).mockReturnValue(
      JSON.stringify(mockDiaries)
    );

    const { result } = renderHook(() => useDeleteDiary());

    act(() => {
      result.current.confirmDelete();
    });

    // localStorage.setItem이 호출되었는지 확인
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "diaries",
      JSON.stringify([
        {
          id: 2,
          title: "일기2",
          content: "내용2",
          emotion: "Sad",
          createdAt: "2024-01-02",
        },
      ])
    );
  });

  it("삭제 확인 후 페이지가 새로고침되어야 함", () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: mockReload },
      writable: true,
    });

    const { result } = renderHook(() => useDeleteDiary());

    act(() => {
      result.current.confirmDelete();
    });

    expect(mockReload).toHaveBeenCalled();
  });

  it("삭제 모달이 올바르게 닫혀야 함", () => {
    const { result } = renderHook(() => useDeleteDiary());

    act(() => {
      result.current.closeDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(result.current.deleteTargetId).toBe(null);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("로컬스토리지에 데이터가 없을 때 경고 로그가 출력되어야 함", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // localStorage.getItem이 null을 반환하도록 설정
    vi.mocked(window.localStorage.getItem).mockReturnValue(null);

    const { result } = renderHook(() => useDeleteDiary());

    act(() => {
      result.current.confirmDelete();
    });

    expect(consoleSpy).toHaveBeenCalledWith("삭제할 일기 데이터가 없습니다.");

    consoleSpy.mockRestore();
  });

  it("로컬스토리지 파싱 오류 시 에러 로그가 출력되어야 함", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // 잘못된 JSON을 반환하도록 설정
    vi.mocked(window.localStorage.getItem).mockReturnValue("invalid json");

    const { result } = renderHook(() => useDeleteDiary());

    act(() => {
      result.current.confirmDelete();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "일기 삭제 중 오류 발생:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
