import { useState, useEffect } from "react";

const ONBOARDING_KEY = "densai-onboarding-completed";

export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  // 静的エクスポート（GitHub Pages等）では初期HTMLがそのまま表示されるため、
  // 初期値は false にし、本編を表示。useEffect で localStorage を読んで isFirstVisit を更新する
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // ローカルストレージをチェック
    const hasCompletedOnboarding =
      typeof window !== "undefined" &&
      localStorage.getItem(ONBOARDING_KEY) === "true";

    setIsFirstVisit(!hasCompletedOnboarding);
  }, []);

  const completeOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
      setIsFirstVisit(false);
    }
  };

  const resetOnboarding = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(ONBOARDING_KEY);
      setIsFirstVisit(true);
    }
  };

  return {
    isFirstVisit,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
}
