"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Card>
      <CardHeader>
        <CardTitle>ヘッダ情報</CardTitle>
        <CardDescription>
          通知日と通知先の情報を入力してください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <PartyForm
          label="通知先情報"
          value={value.notify_inf}
          onChange={(v) => handleChange("notify_inf", v)}
          showRiyosyaNo
        />
      </CardContent>
    </Card>
  );
}
