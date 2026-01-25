"use client";

import { useNoticeStore } from "@/lib/state/useNoticeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NotifyForm() {
  const notify = useNoticeStore((state) => state.notify);
  const setNotify = useNoticeStore((state) => state.setNotify);

  return (
    <Card id="notify">
      <CardHeader>
        <CardTitle>通知先情報</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ginko_cd">銀行コード</Label>
          <Input
            id="ginko_cd"
            value={notify.ginko_cd || ""}
            onChange={(e) =>
              setNotify({ ginko_cd: e.target.value || undefined })
            }
            placeholder="4桁（例: 0001）"
            maxLength={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shiten_cd">支店コード</Label>
          <Input
            id="shiten_cd"
            value={notify.shiten_cd || ""}
            onChange={(e) =>
              setNotify({ shiten_cd: e.target.value || undefined })
            }
            placeholder="3桁（例: 001）"
            maxLength={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="koza_no">口座番号</Label>
          <Input
            id="koza_no"
            value={notify.koza_no || ""}
            onChange={(e) =>
              setNotify({ koza_no: e.target.value || undefined })
            }
            placeholder="例: 1234567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="koza_mei">口座名義</Label>
          <Input
            id="koza_mei"
            value={notify.koza_mei || ""}
            onChange={(e) =>
              setNotify({ koza_mei: e.target.value || undefined })
            }
            placeholder="例: ヤマダタロウ"
          />
        </div>
      </CardContent>
    </Card>
  );
}
