"use client";

import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PartyForm } from "./PartyForm";
import { FieldWithTooltip } from "./FieldWithTooltip";
import type { Header } from "@/lib/densai/schema";

interface HeaderFormProps {
  value: Header;
  onChange: (value: Header) => void;
}

export function HeaderForm({ value, onChange }: HeaderFormProps) {
  const handleChange = (field: string, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* ①ヘッダ情報 */}
      <Card id="form-header" className="scroll-mt-24 w-full max-w-full">
        <CardHeader>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight">
            ①ヘッダ情報
          </h3>
          <CardDescription>
            通知日を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
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
        </CardContent>
      </Card>

      {/* ②通知先情報 */}
      <div id="form-notify" className="scroll-mt-24 w-full max-w-full overflow-hidden">
        <PartyForm
          label="②通知先情報"
          value={value.notify_inf}
          onChange={(v) => handleChange("notify_inf", v)}
          showRiyosyaNo
        />
      </div>
    </div>
  );
}
