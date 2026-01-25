"use client";

import { Button } from "@/components/ui/button";

interface InputFormSectionProps {
  onNavigate: (sectionId: "form-header" | "form-notify" | "form-items") => void;
  onClear: () => void;
}

export function InputFormSection({ onNavigate, onClear }: InputFormSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <span className="text-lg">■</span>入力フォーム
      </h3>

      <div className="space-y-1">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onNavigate("form-header")}
        >
          ①ヘッダ情報
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onNavigate("form-notify")}
        >
          ②通知先情報
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onNavigate("form-items")}
        >
          ③明細情報
        </Button>
      </div>

      <div className="pt-2">
        <Button type="button" variant="outline" className="w-full" onClick={onClear}>
          データをクリア
        </Button>
      </div>
    </div>
  );
}

