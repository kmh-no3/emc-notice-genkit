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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
      <div
        className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background"
        style={{ color: "hsl(222 47% 11%)" }}
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
        <p className="text-sm font-medium">読み込み中...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      {/* 固定ヘッダー */}
      <header
        className="sticky top-0 z-50 w-full border-b shadow-sm backdrop-blur-sm"
        style={{
          backgroundColor: "hsl(var(--background) / 0.95)",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8 responsive-container">
          <FadeIn>
            <div className="flex items-start justify-between gap-4 w-full max-w-full">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="space-y-1 min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
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
      <main
        className="overflow-y-auto overflow-x-hidden w-full max-w-full"
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        <div className="container mx-auto px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
          <div className="zenn-content">

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
            <div className="space-y-14 w-full max-w-full overflow-hidden">
              {/* ツール説明 */}
              <section className="w-full max-w-full pb-2">
                <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
                  <p>
                    このツールは、SAP S/4HANA 日本EMC関連のテストデータとして使用する「でんさい通知XML」を簡単に生成できます。
                  </p>
                  <p>
                    下記の手順に従って、必要な情報を入力し、XMLファイルを生成・ダウンロードしてください。
                  </p>
                </div>
              </section>

              {/* フローセクション：常に参照できる本ページの手順 */}
              <section id="section-flow" className="scroll-mt-24 w-full max-w-full pb-10">
                <div className="rounded-lg border border-border bg-muted/40 dark:bg-muted/20 px-4 py-4 sm:px-5 sm:py-5">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground mb-0.5">
                    利用手順
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    このページの操作の流れ
                  </p>
                  <ol className="space-y-3 list-none text-black dark:text-white">
                    {/* ① サンプル */}
                    <li className="flex gap-3 items-baseline">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/25 text-primary text-sm font-semibold">
                        1
                      </span>
                      <span className="text-base font-medium">サンプル</span>
                    </li>
                    {/* ② データ入力 ＋ 子項目 */}
                    <li className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/25 text-primary text-sm font-semibold mt-0.5">
                        2
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <span
                          className={`block text-base ${
                            completedSteps.has(1) || currentStep === 1 ? "font-semibold" : "font-medium"
                          }`}
                        >
                          データ入力
                        </span>
                        <ol className="ml-0 space-y-0.5 list-none text-sm text-muted-foreground dark:text-muted-foreground">
                          <li>1. ヘッダ情報</li>
                          <li>2. 通知先情報</li>
                          <li>3. 明細情報</li>
                        </ol>
                      </div>
                    </li>
                    {/* ③ XML生成 */}
                    <li className="flex gap-3 items-baseline">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/25 text-primary text-sm font-semibold">
                        3
                      </span>
                      <span
                        className={`text-base ${
                          completedSteps.has(2) || currentStep === 2 ? "font-semibold" : "font-medium"
                        }`}
                      >
                        XML生成
                      </span>
                    </li>
                    {/* ④ ダウンロード */}
                    <li className="flex gap-3 items-baseline">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-primary/25 text-primary text-sm font-semibold">
                        4
                      </span>
                      <span
                        className={`text-base ${
                          completedSteps.has(3) || currentStep === 3 ? "font-semibold" : "font-medium"
                        }`}
                      >
                        ダウンロード
                      </span>
                    </li>
                  </ol>
                </div>
              </section>

              {/* サンプル・データ入力・XML生成をアコーディオンで開閉 */}
              <Accordion
                type="multiple"
                defaultValue={[]}
                className="w-full border-t border-border"
              >
                <AccordionItem value="sample" className="border-b border-border">
                  <AccordionTrigger className="py-4 text-2xl font-semibold tracking-tight hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    ① サンプル
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <section id="section-quick-action" className="scroll-mt-24 w-full max-w-full">
                      <PresetSelector onSelect={handlePresetSelect} />
                    </section>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="data-input" className="border-b border-border">
                  <AccordionTrigger className="py-4 text-2xl font-semibold tracking-tight hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    ② データ入力
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <HeaderForm
                      value={input.header}
                      onChange={(header) => setInput({ ...input, header })}
                    />
                    <section id="form-items" className="w-full max-w-full pt-4">
                      <DataItemForm
                        items={input.data}
                        onChange={(data) => setInput({ ...input, data })}
                        onLoadSample={handleLoadSampleFromWelcome}
                      />
                    </section>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="xml-actions" className="border-b border-border">
                  <AccordionTrigger className="py-4 text-2xl font-semibold tracking-tight hover:no-underline [&[data-state=open]>svg]:rotate-180">
                    ③④ XML生成・ダウンロード
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-4">
                    <section id="section-xml-actions" className="scroll-mt-24 w-full max-w-full">
                      <div className="space-y-3">
                        <Button onClick={handleGenerate} className="w-full h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-8">
                          XML生成
                        </Button>
                      </div>
                    </section>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* XMLプレビューセクション */}
              {xml && (
                <section id="section-xml-preview" className="scroll-mt-24 w-full max-w-full pb-6">
                  <XmlPreview xml={xml} onDownload={handleDownload} />
                </section>
              )}
            </div>
          </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
