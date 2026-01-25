"use client";

import { Button } from "@/components/ui/button";

interface FlowSectionProps {
  currentStep: number;
  completedSteps: Set<number>;
  onNavigate?: (sectionId: string) => void;
}

export function FlowSection({ currentStep, completedSteps, onNavigate }: FlowSectionProps) {
  const steps = [
    { id: 1, label: "データ入力" },
    { id: 2, label: "XML生成" },
    { id: 3, label: "ダウンロード" },
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate("section-flow");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start p-0 h-auto font-semibold text-base hover:bg-transparent"
        onClick={handleClick}
      >
        <span className="text-lg">■</span>フロー
      </Button>
      <ol className="space-y-2 text-sm">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <li 
              key={step.id} 
              className={`
                ${isCompleted ? "text-primary font-medium" : ""}
                ${isCurrent ? "text-foreground font-medium" : ""}
                ${!isCompleted && !isCurrent ? "text-muted-foreground" : ""}
              `}
            >
              {step.id}. {step.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
