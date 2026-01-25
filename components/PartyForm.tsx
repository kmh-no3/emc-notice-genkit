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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FieldWithTooltip } from "./FieldWithTooltip";
import { ProgressBadge } from "./ProgressBadge";
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

  // 必須項目の入力チェック
  const requiredFields = showRiyosyaNo ? 6 : 5;
  const filledRequired = [
    showRiyosyaNo ? value.riyosya_no : null,
    value.riyosya_name,
    value.bank_cd,
    value.shiten_cd,
    value.koza_sbt_cd,
    value.koza_no,
  ].filter((v) => v && v.length > 0).length;

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <ProgressBadge current={filledRequired} total={requiredFields} />
      </div>

      {showRiyosyaNo && (
        <FieldWithTooltip
          label="利用者番号"
          tooltip="でんさいネットの利用者番号（最大9桁の数字）"
          required
        >
          <Input
            id={`${label}-riyosya-no`}
            value={value.riyosya_no || ""}
            onChange={(e) => handleChange("riyosya_no", e.target.value)}
            placeholder="123456789"
            maxLength={9}
          />
        </FieldWithTooltip>
      )}

      <FieldWithTooltip
        label="利用者名"
        tooltip="義務者または権利者の利用者名（半角英数推奨）"
        required
      >
        <Input
          id={`${label}-riyosya-name`}
          value={value.riyosya_name}
          onChange={(e) => handleChange("riyosya_name", e.target.value)}
          placeholder="TEST_PARTY"
        />
      </FieldWithTooltip>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip
          label="銀行コード"
          tooltip="4桁の銀行コード（例: 0001=みずほ銀行）"
          required
        >
          <Input
            id={`${label}-bank-cd`}
            value={value.bank_cd}
            onChange={(e) => handleChange("bank_cd", e.target.value)}
            placeholder="0001"
            maxLength={4}
          />
        </FieldWithTooltip>
        <FieldWithTooltip
          label="銀行名"
          tooltip="銀行名（任意、記録用）"
        >
          <Input
            id={`${label}-bank-name`}
            value={value.bank_name || ""}
            onChange={(e) => handleChange("bank_name", e.target.value)}
            placeholder="みずほ銀行"
          />
        </FieldWithTooltip>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip
          label="支店コード"
          tooltip="3桁の支店コード"
          required
        >
          <Input
            id={`${label}-shiten-cd`}
            value={value.shiten_cd}
            onChange={(e) => handleChange("shiten_cd", e.target.value)}
            placeholder="001"
            maxLength={3}
          />
        </FieldWithTooltip>
        <FieldWithTooltip
          label="支店名"
          tooltip="支店名（任意、記録用）"
        >
          <Input
            id={`${label}-shiten-name`}
            value={value.shiten_name || ""}
            onChange={(e) => handleChange("shiten_name", e.target.value)}
            placeholder="東京営業部"
          />
        </FieldWithTooltip>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip
          label="口座種別"
          tooltip="1:普通預金、2:当座預金、9:その他"
          required
        >
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
        </FieldWithTooltip>
        <FieldWithTooltip
          label="口座番号"
          tooltip="1〜7桁の数字を入力。自動で7桁に左0埋めされます"
          required
        >
          <Input
            id={`${label}-koza-no`}
            value={value.koza_no}
            onChange={(e) => handleChange("koza_no", e.target.value)}
            placeholder="1234567"
            maxLength={7}
          />
        </FieldWithTooltip>
      </div>
    </div>
  );
}
