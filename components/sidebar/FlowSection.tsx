"use client";

interface FlowSectionProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function FlowSection({ currentStep, completedSteps }: FlowSectionProps) {
  const steps = [
    { id: 1, label: "データ入力" },
    { id: 2, label: "XML生成" },
    { id: 3, label: "ダウンロード" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <span className="text-lg">■</span>フロー
      </h3>
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
