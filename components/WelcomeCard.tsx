"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Sparkles, X } from "lucide-react";

interface WelcomeCardProps {
  onLoadSample: () => void;
  onDismiss: () => void;
}

export function WelcomeCard({ onLoadSample, onDismiss }: WelcomeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10 animate-fade-in backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>はじめての方へ</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0"
            type="button"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">閉じる</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            このツールでは、でんさい通知XMLのテストデータを簡単に生成できます。
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            初めての方は、まずサンプルデータを読み込んでお試しください：
          </p>
          <Button
            onClick={onLoadSample}
            size="lg"
            className="w-full"
            type="button"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            サンプルデータを読み込む
          </Button>
        </div>

        <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
          <p className="font-semibold">3つの簡単なステップ：</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>ヘッダ情報と明細データを入力</li>
            <li>「XML生成」ボタンをクリック</li>
            <li>生成されたXMLをダウンロード</li>
          </ol>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
