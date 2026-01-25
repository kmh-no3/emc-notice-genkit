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
    <Card className="w-full max-w-full">
      <CardContent className="space-y-4 w-full max-w-full overflow-hidden pt-6">
        <Textarea
          value={xml}
          readOnly
          className="font-mono text-xs w-full max-w-full overflow-x-auto"
          rows={20}
        />
        <div className="flex flex-wrap gap-2 w-full max-w-full">
          <Button onClick={onDownload} className="flex-1 sm:flex-initial min-w-0">XMLをダウンロード</Button>
          <Button variant="outline" onClick={handleCopy} className="flex-1 sm:flex-initial min-w-0">
            {copied ? "コピーしました" : "クリップボードにコピー"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
