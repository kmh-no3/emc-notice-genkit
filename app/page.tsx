"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeaderForm } from "@/components/HeaderForm";
import { DataItemForm } from "@/components/DataItemForm";
import { XmlPreview } from "@/components/XmlPreview";
import { WelcomeCard } from "@/components/WelcomeCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PresetSelector } from "@/components/PresetSelector";
import { FadeIn } from "@/components/animations/FadeIn";
import type { NoticeInput } from "@/lib/densai/schema";
import { generateNoticeXml } from "@/lib/densai/generate";
import { getCurrentDate } from "@/lib/densai/format";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "@/lib/storage";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useStepProgress } from "@/hooks/useStepProgress";
import { toast } from "sonner";
import { PRESETS } from "@/lib/densai/presets";

export default function Home() {
  const [input, setInput] = useState<NoticeInput>({
    header: {
      notice_date: getCurrentDate(),
      notify_inf: {
        riyosya_no: "",
        riyosya_name: "",
        bank_cd: "",
        shiten_cd: "",
        koza_sbt_cd: "1",
        koza_no: "",
      },
    },
    data: [],
    encoding: "UTF-8",
  });

  const [xml, setXml] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Hooks
  const { isFirstVisit, isLoading, completeOnboarding } = useOnboarding();
  const {
    currentStep,
    completedSteps,
    completeStep,
    goToStep,
  } = useStepProgress();

  // ローカルストレージから復元
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      setInput(saved);
    }
  }, []);

  // 自動保存（debounce）
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const timer = setTimeout(() => {
      saveToLocalStorage(input);
    }, 1000);

    return () => clearTimeout(timer);
  }, [input, autoSaveEnabled]);

  // XML生成
  const handleGenerate = useCallback(() => {
    const result = generateNoticeXml(input);
    if (result.success && result.xml) {
      setXml(result.xml);
      setError("");
      completeStep(1);
      completeStep(2);
      goToStep(3);
      toast.success("XMLの生成に成功しました", {
        description: "XMLプレビューを確認できます",
      });
    } else {
      setError(result.error || "XML生成に失敗しました");
      setXml("");
      toast.error("XML生成に失敗しました", {
        description: result.error,
      });
    }
  }, [input, completeStep, goToStep]);

  // XMLダウンロード
  const handleDownload = useCallback(() => {
    if (!xml) return;

    const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notice_ACR.ASG.DIV.xml";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    completeStep(3);
    toast.success("XMLファイルのダウンロードが完了しました", {
      description: "notice_ACR.ASG.DIV.xml",
    });
  }, [xml, completeStep]);

  // プリセット読み込み
  const handlePresetSelect = useCallback((preset: NoticeInput) => {
    setInput(preset);
    setXml("");
    setError("");
    goToStep(1);
    toast.success("サンプルデータを読み込みました", {
      description: "フォームを確認して、必要に応じて編集してください",
    });
  }, [goToStep]);

  // データクリア
  const handleClear = useCallback(() => {
    if (confirm("すべてのデータをクリアしますか？")) {
      clearLocalStorage();
      setInput({
        header: {
          notice_date: getCurrentDate(),
          notify_inf: {
            riyosya_no: "",
            riyosya_name: "",
            bank_cd: "",
            shiten_cd: "",
            koza_sbt_cd: "1",
            koza_no: "",
          },
        },
        data: [],
        encoding: "UTF-8",
      });
      setXml("");
      setError("");
      goToStep(1);
      toast.info("データをクリアしました");
    }
  }, [goToStep]);

  // ウェルカムカードのサンプルデータ読み込み
  const handleLoadSampleFromWelcome = useCallback(() => {
    setInput(PRESETS.single);
    setXml("");
    setError("");
    completeOnboarding();
    goToStep(1);
    toast.success("サンプルデータを読み込みました");
  }, [completeOnboarding, goToStep]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* 固定ヘッダー */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 responsive-container">
          <FadeIn>
            <div className="flex items-start justify-between gap-4 w-full max-w-full">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="space-y-1 min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                    でんさい通知XML テストデータ生成ツール
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block truncate">
                    SAP S/4HANA 日本EMC関連のテストデータを作成します
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="overflow-y-auto overflow-x-hidden bg-background w-full max-w-full">
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 responsive-container">

          {/* ウェルカムカード（初回訪問時のみ） */}
          {isFirstVisit && (
            <div className="mb-6">
              <WelcomeCard
                onLoadSample={handleLoadSampleFromWelcome}
                onDismiss={completeOnboarding}
              />
            </div>
          )}

          {/* コンテンツ */}
          <FadeIn>
            <div className="space-y-6 w-full max-w-full overflow-hidden">
              {/* フローセクション */}
              <Card id="section-flow" className="scroll-mt-24 w-full max-w-full">
                <CardContent className="pt-4 sm:pt-6 w-full max-w-full overflow-hidden">
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
                      <span className="text-lg sm:text-xl lg:text-2xl">■</span>フロー
                    </h2>
                    <ol className="space-y-2 text-sm">
                      {[
                        { id: 1, label: "データ入力" },
                        { id: 2, label: "XML生成" },
                        { id: 3, label: "ダウンロード" },
                      ].map((step) => {
                        const isCompleted = completedSteps.has(step.id);
                        const isCurrent = currentStep === step.id;

                        return (
                          <li
                            key={step.id}
                            className={`
                              ${isCompleted ? "text-primary font-medium" : ""}
                              ${isCurrent ? "text-foreground font-medium" : ""}
                              ${!isCompleted && !isCurrent ? "text-muted-foreground" : ""}
                            `}
                          >
                            {step.id}. {step.label}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* クイックアクションセクション */}
              <Card id="section-quick-action" className="scroll-mt-24 w-full max-w-full">
                <CardContent className="pt-4 sm:pt-6 w-full max-w-full overflow-hidden">
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
                      <span className="text-lg sm:text-xl lg:text-2xl">■</span>クイックアクション
                    </h2>
                    <div className="space-y-2">
                      <PresetSelector onSelect={handlePresetSelect} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 入力フォームセクション */}
              <HeaderForm
                value={input.header}
                onChange={(header) => setInput({ ...input, header })}
              />

                <Card id="form-items" className="w-full max-w-full">
                  <CardContent className="pt-4 sm:pt-6 w-full max-w-full overflow-hidden">
                    <DataItemForm
                      items={input.data}
                      onChange={(data) => setInput({ ...input, data })}
                      onLoadSample={handleLoadSampleFromWelcome}
                    />
                  </CardContent>
                </Card>

              {/* XML生成・ダウンロードセクション */}
              <Card id="section-xml-actions" className="scroll-mt-24 w-full max-w-full">
                <CardContent className="pt-4 sm:pt-6 w-full max-w-full overflow-hidden">
                  <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
                      <span className="text-lg sm:text-xl lg:text-2xl">■</span>XML生成・ダウンロード
                    </h2>
                    <div className="space-y-2">
                      <Button onClick={handleGenerate} className="w-full h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-8">
                        XML生成
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-8"
                        disabled={!xml}
                      >
                        XMLダウンロード
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">XMLプレビュー</p>
                      </div>
                      <div className="w-full max-w-full rounded-lg border bg-background/50 p-3 overflow-hidden">
                        {xml ? (
                          <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-muted-foreground w-full max-w-full">
                            {xml.slice(0, 600)}
                            {xml.length > 600 ? "\n…（省略）" : ""}
                          </pre>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            未生成です。上の「XML生成」をクリックしてください。
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* XMLプレビューセクション */}
              {xml && (
                <Card id="section-xml-preview" className="scroll-mt-24 w-full max-w-full">
                  <CardContent className="pt-4 sm:pt-6 w-full max-w-full overflow-hidden">
                    <div className="space-y-3">
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
                        <span className="text-lg sm:text-xl lg:text-2xl">■</span>XMLプレビュー
                      </h2>
                      <XmlPreview xml={xml} onDownload={handleDownload} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
