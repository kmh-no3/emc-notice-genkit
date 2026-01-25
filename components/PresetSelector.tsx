"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, FileText, Files } from "lucide-react";
import { PRESETS, PRESET_LABELS } from "@/lib/densai/presets";
import type { NoticeInput } from "@/lib/densai/schema";

interface PresetSelectorProps {
  onSelect: (preset: NoticeInput) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">サンプルデータから始める</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
          <CardContent className="p-4" onClick={() => onSelect(PRESETS.single)}>
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{PRESET_LABELS.single}</p>
                <p className="text-xs text-muted-foreground">
                  最小限の入力項目で動作を確認
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
          <CardContent className="p-4" onClick={() => onSelect(PRESETS.multiple)}>
            <div className="flex items-start gap-3">
              <Files className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{PRESET_LABELS.multiple}</p>
                <p className="text-xs text-muted-foreground">
                  複数明細と合計値の計算を確認
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
