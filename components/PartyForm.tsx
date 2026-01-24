"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Party } from "@/lib/densai/schema";

interface PartyFormProps {
  label: string;
  value: Party & { riyosya_no?: string };
  onChange: (value: Party & { riyosya_no?: string }) => void;
  showRiyosyaNo?: boolean;
}

export function PartyForm({
  label,
  value,
  onChange,
  showRiyosyaNo = false,
}: PartyFormProps) {
  const handleChange = (field: string, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">{label}</h3>

      {showRiyosyaNo && (
        <div className="space-y-2">
          <Label htmlFor={`${label}-riyosya-no`}>
            利用者番号 <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${label}-riyosya-no`}
            value={value.riyosya_no || ""}
            onChange={(e) => handleChange("riyosya_no", e.target.value)}
            placeholder="123456789"
            maxLength={9}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${label}-riyosya-name`}>
          利用者名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${label}-riyosya-name`}
          value={value.riyosya_name}
          onChange={(e) => handleChange("riyosya_name", e.target.value)}
          placeholder="TEST_PARTY"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${label}-bank-cd`}>
            銀行コード <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${label}-bank-cd`}
            value={value.bank_cd}
            onChange={(e) => handleChange("bank_cd", e.target.value)}
            placeholder="0001"
            maxLength={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label}-bank-name`}>銀行名</Label>
          <Input
            id={`${label}-bank-name`}
            value={value.bank_name || ""}
            onChange={(e) => handleChange("bank_name", e.target.value)}
            placeholder="みずほ銀行"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${label}-shiten-cd`}>
            支店コード <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${label}-shiten-cd`}
            value={value.shiten_cd}
            onChange={(e) => handleChange("shiten_cd", e.target.value)}
            placeholder="001"
            maxLength={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label}-shiten-name`}>支店名</Label>
          <Input
            id={`${label}-shiten-name`}
            value={value.shiten_name || ""}
            onChange={(e) => handleChange("shiten_name", e.target.value)}
            placeholder="東京営業部"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${label}-koza-sbt`}>
            口座種別 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={value.koza_sbt_cd}
            onValueChange={(v) => handleChange("koza_sbt_cd", v)}
          >
            <SelectTrigger id={`${label}-koza-sbt`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1:普通</SelectItem>
              <SelectItem value="2">2:当座</SelectItem>
              <SelectItem value="9">9:その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${label}-koza-no`}>
            口座番号 <span className="text-red-500">*</span>
          </Label>
          <Input
            id={`${label}-koza-no`}
            value={value.koza_no}
            onChange={(e) => handleChange("koza_no", e.target.value)}
            placeholder="1234567"
            maxLength={7}
          />
          <p className="text-xs text-muted-foreground">
            1〜7桁の数字（自動で7桁に左0埋めされます）
          </p>
        </div>
      </div>
    </div>
  );
}
