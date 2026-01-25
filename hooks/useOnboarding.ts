import { useState, useEffect } from "react";

const ONBOARDING_KEY = "densai-onboarding-completed";

export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ローカルストレージをチェック
    const hasCompletedOnboarding =
      typeof window !== "undefined" &&
      localStorage.getItem(ONBOARDING_KEY) === "true";

    setIsFirstVisit(!hasCompletedOnboarding);
    setIsLoading(false);
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
