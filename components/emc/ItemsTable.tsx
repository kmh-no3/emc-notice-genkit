"use client";

import { useNoticeStore } from "@/lib/state/useNoticeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Trash2 } from "lucide-react";

export function ItemsTable() {
  const items = useNoticeStore((state) => state.items);
  const selectedItemId = useNoticeStore((state) => state.selectedItemId);
  const addItem = useNoticeStore((state) => state.addItem);
  const selectItem = useNoticeStore((state) => state.selectItem);
  const deleteItem = useNoticeStore((state) => state.deleteItem);
  const duplicateItem = useNoticeStore((state) => state.duplicateItem);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>明細一覧</CardTitle>
          <Button onClick={addItem} size="sm">
            明細追加
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            明細がありません。明細を追加してください。
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>摘要</TableHead>
                <TableHead>日付</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow
                  key={item.id}
                  id={`item-row-${index}`}
                  className={
                    selectedItemId === item.id
                      ? "bg-muted/50 cursor-pointer"
                      : "cursor-pointer"
                  }
                  onClick={() => selectItem(item.id)}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.kingaku
                      ? parseInt(item.kingaku, 10).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>{item.tekiyo || "-"}</TableCell>
                  <TableCell>{item.date || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateItem(item.id);
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteItem(item.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
