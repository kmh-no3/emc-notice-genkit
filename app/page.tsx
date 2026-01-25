"use client";

import { HeaderForm } from "@/components/emc/HeaderForm";
import { NotifyForm } from "@/components/emc/NotifyForm";
import { ItemsTable } from "@/components/emc/ItemsTable";
import { ItemEditor } from "@/components/emc/ItemEditor";
import { PreviewPane } from "@/components/emc/PreviewPane";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">EMC通知XML生成</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左カラム: 入力フォーム */}
          <div className="space-y-6">
            <HeaderForm />
            <NotifyForm />
            <ItemsTable />
            <ItemEditor />
          </div>

          {/* 右カラム: プレビューペイン */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <PreviewPane />
          </div>
        </div>
      </div>
    </div>
  );
}
