"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface XmlPreviewProps {
  xml: string;
  onDownload: () => void;
}

export function XmlPreview({ xml, onDownload }: XmlPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(xml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("コピーに失敗しました:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>XMLプレビュー</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={xml}
          readOnly
          className="font-mono text-xs"
          rows={20}
        />
        <div className="flex gap-2">
          <Button onClick={onDownload}>XMLをダウンロード</Button>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? "コピーしました" : "クリップボードにコピー"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
