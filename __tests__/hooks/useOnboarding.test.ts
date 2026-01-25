import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOnboarding } from "@/hooks/useOnboarding";

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useOnboarding", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("初回訪問時はisFirstVisitがtrueになる", () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.isFirstVisit).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("completeOnboardingを呼ぶとisFirstVisitがfalseになる", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeOnboarding();
    });

    expect(result.current.isFirstVisit).toBe(false);
    expect(localStorage.getItem("densai-onboarding-completed")).toBe("true");
  });

  it("オンボーディング完了後の再訪問ではisFirstVisitがfalseになる", () => {
    localStorage.setItem("densai-onboarding-completed", "true");

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.isFirstVisit).toBe(false);
  });

  it("resetOnboardingを呼ぶとisFirstVisitがtrueに戻る", () => {
    localStorage.setItem("densai-onboarding-completed", "true");

    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.resetOnboarding();
    });

    expect(result.current.isFirstVisit).toBe(true);
    expect(localStorage.getItem("densai-onboarding-completed")).toBeNull();
  });
});
