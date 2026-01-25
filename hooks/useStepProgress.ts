import { useState, useCallback, useMemo } from "react";

export type Step = 1 | 2 | 3;

export interface StepConfig {
  id: Step;
  title: string;
  description: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    title: "データ入力",
    description: "ヘッダ情報と明細データを入力",
  },
  {
    id: 2,
    title: "XML生成",
    description: "入力データからXMLを生成",
  },
  {
    id: 3,
    title: "ダウンロード",
    description: "生成したXMLをダウンロード",
  },
];

export function useStepProgress(initialStep: Step = 1) {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 3) as Step;
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
  }, []);

  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  const completeStep = useCallback((step: Step) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const isStepCompleted = useCallback(
    (step: Step) => {
      return completedSteps.has(step);
    },
    [completedSteps]
  );

  const progress = useMemo(() => {
    return (completedSteps.size / STEPS.length) * 100;
  }, [completedSteps]);

  return {
    currentStep,
    completedSteps,
    steps: STEPS,
    nextStep,
    prevStep,
    goToStep,
    completeStep,
    isStepCompleted,
    progress,
  };
}
