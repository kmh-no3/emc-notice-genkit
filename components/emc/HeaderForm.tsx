"use client";

import { useNoticeStore } from "@/lib/state/useNoticeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HeaderForm() {
  const header = useNoticeStore((state) => state.header);
  const setHeader = useNoticeStore((state) => state.setHeader);

  return (
    <Card id="header">
      <CardHeader>
        <CardTitle>ヘッダー情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bukrs">会社コード *</Label>
          <Input
            id="bukrs"
            value={header.bukrs}
            onChange={(e) => setHeader({ bukrs: e.target.value })}
            placeholder="例: 1000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="belnr">伝票番号 *</Label>
          <Input
            id="belnr"
            value={header.belnr}
            onChange={(e) => setHeader({ belnr: e.target.value })}
            placeholder="例: 1234567890"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gjahr">年度 *</Label>
          <Input
            id="gjahr"
            value={header.gjahr}
            onChange={(e) => setHeader({ gjahr: e.target.value })}
            placeholder="例: 2024"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budat">伝票日付</Label>
          <Input
            id="budat"
            value={header.budat || ""}
            onChange={(e) => setHeader({ budat: e.target.value || undefined })}
            placeholder="YYYYMMDD（例: 20240101）"
            maxLength={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="irainin_ref_no">依頼人参照番号</Label>
          <Input
            id="irainin_ref_no"
            value={header.irainin_ref_no || ""}
            onChange={(e) =>
              setHeader({ irainin_ref_no: e.target.value || undefined })
            }
            placeholder="未入力時は自動生成されます"
          />
        </div>
      </CardContent>
    </Card>
  );
}
