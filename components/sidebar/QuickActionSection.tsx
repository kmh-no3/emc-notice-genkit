"use client";

import { Button } from "@/components/ui/button";
import { PresetSelector } from "@/components/PresetSelector";
import type { NoticeInput } from "@/lib/densai/schema";

interface QuickActionSectionProps {
  onPresetSelect: (preset: NoticeInput) => void;
  onNavigate?: (sectionId: string) => void;
}

export function QuickActionSection({ onPresetSelect, onNavigate }: QuickActionSectionProps) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate("section-quick-action");
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
        <span className="text-lg">■</span>クイックアクション
      </Button>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          サンプルデータから始める
        </p>
        <PresetSelector onSelect={onPresetSelect} compact />
      </div>
    </div>
  );
}
