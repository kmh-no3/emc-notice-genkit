"use client";

import { useNoticeStore } from "@/lib/state/useNoticeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ItemEditor() {
  const items = useNoticeStore((state) => state.items);
  const selectedItemId = useNoticeStore((state) => state.selectedItemId);
  const updateItem = useNoticeStore((state) => state.updateItem);

  const selectedItem = items.find((item) => item.id === selectedItemId);
  const selectedIndex = selectedItem ? items.findIndex((item) => item.id === selectedItemId) : -1;

  if (!selectedItem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>明細編集</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            明細を選択してください。
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id={selectedIndex >= 0 ? `item-${selectedIndex}` : undefined}>
      <CardHeader>
        <CardTitle>明細編集</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="details">詳細</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="item-kingaku">金額</Label>
              <Input
                id="item-kingaku"
                value={selectedItem.kingaku || ""}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    kingaku: e.target.value || undefined,
                  })
                }
                placeholder="例: 10000"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-tekiyo">摘要</Label>
              <Input
                id="item-tekiyo"
                value={selectedItem.tekiyo || ""}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    tekiyo: e.target.value || undefined,
                  })
                }
                placeholder="例: 商品代金"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-date">日付</Label>
              <Input
                id="item-date"
                value={selectedItem.date || ""}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    date: e.target.value || undefined,
                  })
                }
                placeholder="YYYYMMDD（例: 20240101）"
                maxLength={8}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
