"use client";

import { Button } from "@/components/ui/button";

interface ActionSectionProps {
  onGenerate: () => void;
  onDownload: () => void;
  hasXml: boolean;
  xml: string;
  onOpenPreview: () => void;
  onNavigate?: (sectionId: string) => void;
}

export function ActionSection({ 
  onGenerate, 
  onDownload, 
  hasXml,
  xml,
  onOpenPreview,
  onNavigate,
}: ActionSectionProps) {
  const previewText = hasXml ? xml.slice(0, 600) : "";

  const handleClick = () => {
    if (onNavigate) {
      onNavigate("section-xml-actions");
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-start p-0 h-auto font-semibold text-base hover:bg-transparent"
        onClick={handleClick}
      >
        <span className="text-lg">■</span>XML生成・ダウンロード
      </Button>
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
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">XMLプレビュー</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenPreview}
            disabled={!hasXml}
          >
            フル表示
          </Button>
        </div>
        <button
          type="button"
          onClick={onOpenPreview}
          disabled={!hasXml}
          className="w-full rounded-lg border bg-background/50 p-3 text-left transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {hasXml ? (
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
              {previewText}
              {xml.length > previewText.length ? "\n…（省略）" : ""}
            </pre>
          ) : (
            <div className="text-xs text-muted-foreground">
              未生成です。上の「XML生成」をクリックしてください。
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
