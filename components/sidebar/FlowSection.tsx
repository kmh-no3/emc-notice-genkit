"use client";

import { Button } from "@/components/ui/button";

interface FlowSectionProps {
  currentStep: number;
  completedSteps: Set<number>;
  onNavigate?: (sectionId: string) => void;
}

export function FlowSection({ currentStep, completedSteps, onNavigate }: FlowSectionProps) {
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
      <ol className="space-y-1 list-none text-black dark:text-white">
        {/* 1. サンプル */}
        <li className="block text-base font-medium">
          ① サンプル
        </li>
        {/* 2. データ入力 ＋ 1.〜3. 子項目 */}
        <li className="space-y-1">
          <span
            className={`block text-base ${
              completedSteps.has(1) || currentStep === 1 ? "font-semibold" : "font-medium"
            }`}
          >
            ② データ入力
          </span>
          <ol className="ml-4 space-y-0.5 list-none text-sm text-muted-foreground dark:text-muted-foreground">
            <li>1. ヘッダ情報</li>
            <li>2. 通知先情報</li>
            <li>3. 明細情報</li>
          </ol>
        </li>
        {/* 3. XML生成 */}
        <li
          className={`block text-base ${
            completedSteps.has(2) || currentStep === 2 ? "font-semibold" : "font-medium"
          }`}
        >
          ③ XML生成
        </li>
        {/* 4. ダウンロード */}
        <li
          className={`block text-base ${
            completedSteps.has(3) || currentStep === 3 ? "font-semibold" : "font-medium"
          }`}
        >
          ④ ダウンロード
        </li>
      </ol>
    </div>
  );
}
