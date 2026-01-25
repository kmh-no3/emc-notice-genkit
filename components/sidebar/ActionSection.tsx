"use client";

import { Button } from "@/components/ui/button";

interface ActionSectionProps {
  onGenerate: () => void;
  onDownload: () => void;
  onClear: () => void;
  hasXml: boolean;
}

export function ActionSection({ 
  onGenerate, 
  onDownload, 
  onClear,
  hasXml 
}: ActionSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-base">
        <span className="text-lg">■</span>XML生成・ダウンロード
      </h3>
      <div className="space-y-2">
        <Button onClick={onGenerate} className="w-full" size="lg">
          XML生成
        </Button>
        <Button 
          onClick={onDownload} 
          variant="outline" 
          className="w-full"
          disabled={!hasXml}
          size="lg"
        >
          XMLダウンロード
        </Button>
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">データをクリア</p>
          <Button 
            onClick={onClear} 
            variant="ghost" 
            className="w-full"
          >
            データをクリア
          </Button>
        </div>
      </div>
    </div>
  );
}
