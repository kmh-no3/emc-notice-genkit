"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, FileText, Files } from "lucide-react";
import { PRESETS, PRESET_LABELS } from "@/lib/densai/presets";
import type { NoticeInput } from "@/lib/densai/schema";

interface PresetSelectorProps {
  onSelect: (preset: NoticeInput) => void;
  compact?: boolean;
}

export function PresetSelector({ onSelect, compact = false }: PresetSelectorProps) {
  // コンパクト版（サイドバー用）
  if (compact) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start text-left h-auto py-3"
          onClick={() => onSelect(PRESETS.single)}
        >
          <FileText className="mr-2 h-4 w-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">①{PRESET_LABELS.single}</div>
            <div className="text-xs text-muted-foreground truncate">
              最小限の入力項目で動作を確認
            </div>
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start text-left h-auto py-3"
          onClick={() => onSelect(PRESETS.multiple)}
        >
          <Files className="mr-2 h-4 w-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">②{PRESET_LABELS.multiple}</div>
            <div className="text-xs text-muted-foreground truncate">
              複数明細と合計値の計算を確認
            </div>
          </div>
        </Button>
      </div>
    );
  }

  // 通常版（メインページ用）
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">サンプルデータから始める</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <CardContent className="p-5" onClick={() => onSelect(PRESETS.single)}>
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
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            <CardContent className="p-5" onClick={() => onSelect(PRESETS.multiple)}>
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
        </motion.div>
      </div>
    </div>
  );
}
