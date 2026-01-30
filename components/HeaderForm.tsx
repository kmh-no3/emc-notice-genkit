"use client";

import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PartyForm } from "./PartyForm";
import { FieldWithTooltip } from "./FieldWithTooltip";
import type { NoticeInput } from "@/lib/densai/schema";

interface HeaderFormProps {
  value: NoticeInput["header"];
  onChange: (value: NoticeInput["header"]) => void;
}

export function HeaderForm({ value, onChange }: HeaderFormProps) {
  const handleChange = (field: string, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-10 w-full max-w-full overflow-hidden">
      {/* ①ヘッダ情報 */}
      <section id="form-header" className="scroll-mt-24 w-full max-w-full pb-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight mb-2">
              ①ヘッダ情報
            </h3>
            <p className="text-sm text-muted-foreground">
              通知日を入力してください
            </p>
          </div>
          <FieldWithTooltip
            label="通知日"
            tooltip="XMLの通知日を8桁のYYYYMMDD形式で入力（例: 20260125）"
            required
          >
            <Input
              id="notice-date"
              value={value.notice_date}
              onChange={(e) => handleChange("notice_date", e.target.value)}
              placeholder="20260125"
              maxLength={8}
            />
          </FieldWithTooltip>
        </div>
      </section>

      {/* ②通知先情報 */}
      <section id="form-notify" className="scroll-mt-24 w-full max-w-full overflow-hidden pb-4">
        <PartyForm
          label="②通知先情報"
          value={value.notify_inf}
          onChange={(v) => handleChange("notify_inf", v)}
          showRiyosyaNo
        />
      </section>
    </div>
  );
}
