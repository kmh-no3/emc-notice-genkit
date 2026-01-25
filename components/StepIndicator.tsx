"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
}

export function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = currentStep === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* ステップアイコン */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent && !isCompleted && "border-primary bg-background",
                    !isCurrent &&
                      !isCompleted &&
                      "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-base font-semibold">{step.id}</span>
                  )}
                </motion.div>

                {/* ステップ情報 */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-primary",
                      !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* 接続線 */}
              {!isLast && (
                <div
                  className={cn(
                    "h-[2px] flex-1 transition-all -mt-12",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
