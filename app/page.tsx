"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderForm } from "@/components/HeaderForm";
import { DataItemForm } from "@/components/DataItemForm";
import { XmlPreview } from "@/components/XmlPreview";
import { PresetSelector } from "@/components/PresetSelector";
import { WelcomeCard } from "@/components/WelcomeCard";
import { StepIndicator } from "@/components/StepIndicator";
import { ThemeToggle } from "@/components/ThemeToggle";
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
import { useStepProgress, type Step } from "@/hooks/useStepProgress";
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
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // Hooks
  const { isFirstVisit, isLoading, completeOnboarding } = useOnboarding();
  const {
    currentStep,
    steps,
    completedSteps,
    nextStep,
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
      setActiveTab("preview");
      toast.success("XMLの生成に成功しました", {
        description: "プレビュータブでXMLを確認できます",
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
    setActiveTab("form");
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
      setActiveTab("form");
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl">
      <div className="space-y-12">
        {/* ヘッダ */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              でんさい通知XML テストデータ生成ツール
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              SAP S/4HANA 日本EMC関連のテストデータを作成します
            </p>
          </div>
          <div className="self-start sm:self-auto">
            <ThemeToggle />
          </div>
          </div>
        </FadeIn>

        {/* ウェルカムカード（初回訪問時のみ） */}
        {isFirstVisit && (
          <WelcomeCard
            onLoadSample={handleLoadSampleFromWelcome}
            onDismiss={completeOnboarding}
          />
        )}

        {/* ステップインジケーター */}
        <FadeIn delay={0.1}>
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </FadeIn>

        {/* プリセット選択とアクション */}
        <FadeIn delay={0.2}>
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle>クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PresetSelector onSelect={handlePresetSelect} />
              <div className="flex gap-3">
                <Button size="lg" onClick={handleGenerate}>XML生成</Button>
                <Button size="lg" variant="outline" onClick={handleClear}>
                  データをクリア
                </Button>
              </div>
              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                  <strong>エラー:</strong> {error}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* メインコンテンツ */}
        <FadeIn delay={0.3}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">入力フォーム</TabsTrigger>
            <TabsTrigger value="preview">XMLプレビュー</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <HeaderForm
              value={input.header}
              onChange={(header) => setInput({ ...input, header })}
            />

            <Card>
              <CardContent className="pt-6">
                <DataItemForm
                  items={input.data}
                  onChange={(data) => setInput({ ...input, data })}
                  onLoadSample={handleLoadSampleFromWelcome}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            {xml ? (
              <XmlPreview xml={xml} onDownload={handleDownload} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <p>「XML生成」ボタンをクリックしてXMLを生成してください。</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </FadeIn>

        {/* フッター */}
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground">
            <p>
              <strong>注意事項:</strong>
              このツールで生成したXMLは、SAP EMC_JP (RFFOJP_EMC)
              でテスト投入するためのものです。
              <br />
              実際のでんさいネット標準フォーマット XML ver1.3
              に準拠しています。
              <br />
              入力データは自動的にブラウザのローカルストレージに保存されます。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
