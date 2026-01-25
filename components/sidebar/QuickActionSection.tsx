"use client";

import { PresetSelector } from "@/components/PresetSelector";
import type { NoticeInput } from "@/lib/densai/schema";

interface QuickActionSectionProps {
  onPresetSelect: (preset: NoticeInput) => void;
}

export function QuickActionSection({ onPresetSelect }: QuickActionSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <span className="text-lg">■</span>クイックアクション
      </h3>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          サンプルデータから始める
        </p>
        <PresetSelector onSelect={onPresetSelect} compact />
      </div>
    </div>
  );
}
