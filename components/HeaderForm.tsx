"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PartyForm } from "./PartyForm";
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
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notice-date">
            通知日 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="notice-date"
            value={value.notice_date}
            onChange={(e) => handleChange("notice_date", e.target.value)}
            placeholder="20260125"
            maxLength={8}
          />
          <p className="text-xs text-muted-foreground">YYYYMMDD形式</p>
        </div>

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
