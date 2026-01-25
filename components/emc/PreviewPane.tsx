"use client";

import { useNoticeStore } from "@/lib/state/useNoticeStore";
import { generateNoticeXml } from "@/lib/densai/generate";
import { validateNotice } from "@/lib/densai/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Copy, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

export function PreviewPane() {
  const header = useNoticeStore((state) => state.header);
  const notify = useNoticeStore((state) => state.notify);
  const items = useNoticeStore((state) => state.items);
  const reset = useNoticeStore((state) => state.reset);

  const errors = useMemo(() => {
    return validateNotice(header, notify, items);
  }, [header, notify, items]);

  const xml = useMemo(() => {
    try {
      return generateNoticeXml(header, notify, items);
    } catch (error) {
      return `エラー: ${error instanceof Error ? error.message : "XML生成に失敗しました"}`;
    }
  }, [header, notify, items]);

  const handleCopy = () => {
    navigator.clipboard.writeText(xml);
    toast.success("XMLをクリップボードにコピーしました");
  };

  const handleDownload = () => {
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notice.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("XMLをダウンロードしました");
  };

  const handleReset = () => {
    if (confirm("すべてのデータをリセットしますか？")) {
      reset();
      toast.success("データをリセットしました");
    }
  };

  const scrollToAnchor = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="sticky top-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>プレビュー</CardTitle>
            <div className="flex items-center gap-2">
              {errors.length > 0 && (
                <Badge variant="destructive">{errors.length}件のエラー</Badge>
              )}
              {errors.length === 0 && (
                <Badge variant="default">正常</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* バリデーションエラー */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">エラー一覧</h3>
              <ScrollArea className="h-32 rounded-md border p-4">
                <div className="space-y-2">
                  {errors.map((error, index) => (
                    <div
                      key={index}
                      className="text-sm text-destructive cursor-pointer hover:underline"
                      onClick={() => error.anchor && scrollToAnchor(error.anchor)}
                    >
                      {error.path}: {error.message}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <Separator />

          {/* XMLプレビュー */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">XMLプレビュー</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={errors.length > 0}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  コピー
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={errors.length > 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  ダウンロード
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  リセット
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                {xml}
              </pre>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
