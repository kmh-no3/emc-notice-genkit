"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PartyForm } from "./PartyForm";
import { EmptyState } from "./EmptyState";
import { FieldWithTooltip } from "./FieldWithTooltip";
import type { NoticeItem } from "@/lib/densai/schema";
import { generateIraininRefNo } from "@/lib/densai/format";

interface DataItemFormProps {
  items: NoticeItem[];
  onChange: (items: NoticeItem[]) => void;
  onLoadSample?: () => void;
}

export function DataItemForm({ items, onChange, onLoadSample }: DataItemFormProps) {
  const handleAddItem = () => {
    const newItem: NoticeItem = {
      notice_cd: "01",
      obligation_inf: {
        riyosya_name: "",
        bank_cd: "",
        shiten_cd: "",
        koza_sbt_cd: "1",
        koza_no: "",
      },
      entitled_inf: {
        riyosya_name: "",
        bank_cd: "",
        shiten_cd: "",
        koza_sbt_cd: "1",
        koza_no: "",
      },
      saiken_kingaku: "",
      shiharai_kijitsu: "",
      kiroku_no: "",
      kiroku_date: "",
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // BUKRS/BELNR/GJAHRが全て入力されている場合、irainin_ref_noを自動生成
    if (
      (field === "bukrs" || field === "belnr" || field === "gjahr") &&
      newItems[index].bukrs &&
      newItems[index].belnr &&
      newItems[index].gjahr
    ) {
      try {
        newItems[index].irainin_ref_no = generateIraininRefNo(
          newItems[index].bukrs!,
          newItems[index].belnr!,
          newItems[index].gjahr!
        );
      } catch (error) {
        console.warn("irainin_ref_no自動生成エラー:", error);
      }
    }

    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">明細データ</h2>
          {items.length > 0 && (
            <Badge variant="secondary">{items.length}件</Badge>
          )}
        </div>
        <Button onClick={handleAddItem}>明細を追加</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          onAddItem={handleAddItem}
          onLoadSample={onLoadSample || (() => {})}
        />
      ) : (
        <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              明細 #{index + 1}
              {item.kiroku_no && ` - ${item.kiroku_no}`}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-4">
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    この明細を削除
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>
                    通知種別 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={item.notice_cd}
                    onValueChange={(v) =>
                      handleItemChange(index, "notice_cd", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">01:発生記録</SelectItem>
                      <SelectItem value="02">02:譲渡記録</SelectItem>
                      <SelectItem value="03">03:分割記録</SelectItem>
                      <SelectItem value="04">04:保証記録</SelectItem>
                      <SelectItem value="05">05:変更記録</SelectItem>
                      <SelectItem value="06">06:支払等記録</SelectItem>
                      <SelectItem value="07">07:廃棄記録</SelectItem>
                      <SelectItem value="08">08:不渡情報記録</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <PartyForm
                  label="義務者情報"
                  value={item.obligation_inf}
                  onChange={(v) => handleItemChange(index, "obligation_inf", v)}
                />

                <PartyForm
                  label="権利者情報"
                  value={item.entitled_inf}
                  onChange={(v) => handleItemChange(index, "entitled_inf", v)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      債権金額 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={item.saiken_kingaku}
                      onChange={(e) =>
                        handleItemChange(index, "saiken_kingaku", e.target.value)
                      }
                      placeholder="10000"
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      1〜10桁の数字
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      支払期日 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={item.shiharai_kijitsu}
                      onChange={(e) =>
                        handleItemChange(index, "shiharai_kijitsu", e.target.value)
                      }
                      placeholder="20260228"
                      maxLength={8}
                    />
                    <p className="text-xs text-muted-foreground">YYYYMMDD形式</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      記録番号 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={item.kiroku_no}
                      onChange={(e) =>
                        handleItemChange(index, "kiroku_no", e.target.value)
                      }
                      placeholder="AAAAAAAAAAAAAAAAAAAA"
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground">最大20文字</p>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      電子記録年月日 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={item.kiroku_date}
                      onChange={(e) =>
                        handleItemChange(index, "kiroku_date", e.target.value)
                      }
                      placeholder="20260125"
                      maxLength={8}
                    />
                    <p className="text-xs text-muted-foreground">YYYYMMDD形式</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-semibold text-sm">
                    伝票特定補助フィールド（任意）
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>会社コード (BUKRS)</Label>
                      <Input
                        value={item.bukrs || ""}
                        onChange={(e) =>
                          handleItemChange(index, "bukrs", e.target.value)
                        }
                        placeholder="1000"
                        maxLength={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>伝票番号 (BELNR)</Label>
                      <Input
                        value={item.belnr || ""}
                        onChange={(e) =>
                          handleItemChange(index, "belnr", e.target.value)
                        }
                        placeholder="123456"
                        maxLength={10}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>会計年度 (GJAHR)</Label>
                      <Input
                        value={item.gjahr || ""}
                        onChange={(e) =>
                          handleItemChange(index, "gjahr", e.target.value)
                        }
                        placeholder="2026"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>依頼人Ref.No.</Label>
                    <Input
                      value={item.irainin_ref_no || ""}
                      onChange={(e) =>
                        handleItemChange(index, "irainin_ref_no", e.target.value)
                      }
                      placeholder="自動生成または手入力"
                      maxLength={40}
                    />
                    <p className="text-xs text-muted-foreground">
                      BUKRS/BELNR/GJAHRを入力すると自動生成されます（最大40文字）
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
      )}
    </div>
  );
}
