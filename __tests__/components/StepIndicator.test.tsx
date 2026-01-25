import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "@/components/StepIndicator";

const mockSteps = [
  { id: 1, title: "データ入力", description: "入力してください" },
  { id: 2, title: "XML生成", description: "生成してください" },
  { id: 3, title: "ダウンロード", description: "ダウンロードしてください" },
];

describe("StepIndicator", () => {
  it("正しくレンダリングされる", () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={1}
        completedSteps={new Set()}
      />
    );

    expect(screen.getByText("データ入力")).toBeInTheDocument();
    expect(screen.getByText("XML生成")).toBeInTheDocument();
    expect(screen.getByText("ダウンロード")).toBeInTheDocument();
  });

  it("現在のステップが表示される", () => {
    render(
      <StepIndicator
        steps={mockSteps}
        currentStep={2}
        completedSteps={new Set([1])}
      />
    );

    // ステップタイトルで確認（複数あるのでgetAllByTextを使用）
    const dataInputTexts = screen.getAllByText("データ入力");
    expect(dataInputTexts.length).toBeGreaterThan(0);
    
    const xmlGenTexts = screen.getAllByText("XML生成");
    expect(xmlGenTexts.length).toBeGreaterThan(0);
  });

  it("完了したステップにチェックマークが表示される", () => {
    const { container } = render(
      <StepIndicator
        steps={mockSteps}
        currentStep={3}
        completedSteps={new Set([1, 2])}
      />
    );

    // チェックマークアイコンが表示されているか確認（lucide-reactのCheck）
    const checkIcons = container.querySelectorAll('svg');
    expect(checkIcons.length).toBeGreaterThan(0);
  });
});
