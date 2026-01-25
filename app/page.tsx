"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { HeaderForm } from "@/components/HeaderForm";
import { DataItemForm } from "@/components/DataItemForm";
import { XmlPreview } from "@/components/XmlPreview";
import { WelcomeCard } from "@/components/WelcomeCard";
import { Sidebar } from "@/components/Sidebar";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"form" | "preview">("form");

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
      setViewMode("preview");
      toast.success("XMLの生成に成功しました", {
        description: "XMLプレビューに切り替えました",
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
    setViewMode("form");
    setSidebarOpen(false);
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
      setViewMode("form");
      setSidebarOpen(false);
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
    <div className="flex h-screen overflow-hidden">
      {/* サイドバー */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onPresetSelect={handlePresetSelect}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        onClear={handleClear}
        hasXml={!!xml}
      />

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
          {/* ヘッダー */}
          <FadeIn>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-1">
                {/* モバイルメニューボタン */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">メニュー</span>
                </Button>
                
                <div className="space-y-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                    でんさい通知XML テストデータ生成ツール
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    SAP S/4HANA 日本EMC関連のテストデータを作成します
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant={viewMode === "form" ? "default" : "outline"}
                  onClick={() => setViewMode("form")}
                  size="sm"
                  className="hidden sm:flex"
                >
                  入力フォーム
                </Button>
                <Button
                  variant={viewMode === "preview" ? "default" : "outline"}
                  onClick={() => setViewMode("preview")}
                  size="sm"
                  className="hidden sm:flex"
                >
                  XMLプレビュー
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </FadeIn>

          {/* モバイル用表示切り替えボタン */}
          <div className="flex gap-2 mb-6 sm:hidden">
            <Button
              variant={viewMode === "form" ? "default" : "outline"}
              onClick={() => setViewMode("form")}
              className="flex-1"
            >
              入力フォーム
            </Button>
            <Button
              variant={viewMode === "preview" ? "default" : "outline"}
              onClick={() => setViewMode("preview")}
              className="flex-1"
            >
              XMLプレビュー
            </Button>
          </div>

          {/* ウェルカムカード（初回訪問時のみ） */}
          {isFirstVisit && (
            <div className="mb-6">
              <WelcomeCard
                onLoadSample={handleLoadSampleFromWelcome}
                onDismiss={completeOnboarding}
              />
            </div>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              <strong>エラー:</strong> {error}
            </div>
          )}

          {/* コンテンツ切り替え */}
          <FadeIn>
            {viewMode === "form" ? (
              <div className="space-y-6">
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
              </div>
            ) : (
              <div>
                {xml ? (
                  <XmlPreview xml={xml} onDownload={handleDownload} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <p>「XML生成」ボタンをクリックしてXMLを生成してください。</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
