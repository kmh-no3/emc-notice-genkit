"use client";

import { Button } from "@/components/ui/button";
import { PRESETS, PRESET_LABELS } from "@/lib/densai/presets";
import type { NoticeInput } from "@/lib/densai/schema";

interface PresetSelectorProps {
  onSelect: (preset: NoticeInput) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium">サンプルデータ:</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelect(PRESETS.single)}
      >
        {PRESET_LABELS.single}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSelect(PRESETS.multiple)}
      >
        {PRESET_LABELS.multiple}
      </Button>
    </div>
  );
}
