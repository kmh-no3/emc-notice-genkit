"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderForm } from "@/components/HeaderForm";
import { DataItemForm } from "@/components/DataItemForm";
import { XmlPreview } from "@/components/XmlPreview";
import { PresetSelector } from "@/components/PresetSelector";
import type { NoticeInput } from "@/lib/densai/schema";
import { generateNoticeXml } from "@/lib/densai/generate";
import { getCurrentDate } from "@/lib/densai/format";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "@/lib/storage";

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
    } else {
      setError(result.error || "XML生成に失敗しました");
      setXml("");
    }
  }, [input]);

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
  }, [xml]);

  // プリセット読み込み
  const handlePresetSelect = useCallback((preset: NoticeInput) => {
    setInput(preset);
    setXml("");
    setError("");
  }, []);

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
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* ヘッダ */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            でんさい通知XML テストデータ生成ツール
          </h1>
          <p className="text-muted-foreground">
            SAP S/4HANA 日本EMC関連のテストデータを作成します
          </p>
        </div>

        {/* プリセット選択とアクション */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PresetSelector onSelect={handlePresetSelect} />
            <div className="flex gap-2">
              <Button onClick={handleGenerate}>XML生成</Button>
              <Button variant="outline" onClick={handleClear}>
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

        {/* メインコンテンツ */}
        <Tabs defaultValue="form" className="w-full">
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
