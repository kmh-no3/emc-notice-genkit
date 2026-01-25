"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onAddItem: () => void;
  onLoadSample: () => void;
}

export function EmptyState({ onAddItem, onLoadSample }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">明細がありません</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          まずは明細データを追加してください。<br />
          初めての方はサンプルデータから始めるのがおすすめです。
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onLoadSample} size="lg" variant="default" type="button">
            <Sparkles className="mr-2 h-4 w-4" />
            サンプルデータを読み込む
          </Button>
          <Button onClick={onAddItem} size="lg" variant="outline" type="button">
            <Plus className="mr-2 h-4 w-4" />
            明細を追加
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
