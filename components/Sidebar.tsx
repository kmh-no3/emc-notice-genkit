"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowSection } from "@/components/sidebar/FlowSection";
import { QuickActionSection } from "@/components/sidebar/QuickActionSection";
import { ActionSection } from "@/components/sidebar/ActionSection";
import { cn } from "@/lib/utils";
import type { NoticeInput } from "@/lib/densai/schema";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentStep: number;
  completedSteps: Set<number>;
  onPresetSelect: (preset: NoticeInput) => void;
  onGenerate: () => void;
  onDownload: () => void;
  onClear: () => void;
  hasXml: boolean;
}

export function Sidebar({
  isOpen,
  onToggle,
  currentStep,
  completedSteps,
  onPresetSelect,
  onGenerate,
  onDownload,
  onClear,
  hasXml,
}: SidebarProps) {
  return (
    <>
      {/* モバイル用オーバーレイ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* サイドバー */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40",
          "w-80 bg-card border-r",
          "flex flex-col h-screen",
          "lg:translate-x-0"
        )}
      >
        {/* サイドバーヘッダー（モバイルのみ） */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="font-semibold">メニュー</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">閉じる</span>
          </Button>
        </div>

        {/* サイドバーコンテンツ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <FlowSection 
            currentStep={currentStep} 
            completedSteps={completedSteps} 
          />
          
          <div className="border-t pt-6">
            <QuickActionSection onPresetSelect={onPresetSelect} />
          </div>
          
          <div className="border-t pt-6">
            <ActionSection
              onGenerate={onGenerate}
              onDownload={onDownload}
              onClear={onClear}
              hasXml={hasXml}
            />
          </div>
        </div>
      </motion.aside>
    </>
  );
}
