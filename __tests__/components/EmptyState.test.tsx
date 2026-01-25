import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/EmptyState";

describe("EmptyState", () => {
  it("正しくレンダリングされる", () => {
    const onAddItem = vi.fn();
    const onLoadSample = vi.fn();

    render(<EmptyState onAddItem={onAddItem} onLoadSample={onLoadSample} />);

    expect(screen.getByText("明細がありません")).toBeInTheDocument();
    expect(screen.getByText(/まずは明細データを追加してください/)).toBeInTheDocument();
  });

  it("両方のボタンが表示される", () => {
    const onAddItem = vi.fn();
    const onLoadSample = vi.fn();

    render(<EmptyState onAddItem={onAddItem} onLoadSample={onLoadSample} />);

    const sampleButtons = screen.getAllByRole("button", { name: /サンプルデータを読み込む/ });
    const addButtons = screen.getAllByRole("button", { name: /明細を追加/ });
    
    expect(sampleButtons.length).toBeGreaterThan(0);
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("アイコンとヘッダが表示される", () => {
    const onAddItem = vi.fn();
    const onLoadSample = vi.fn();

    const { container } = render(<EmptyState onAddItem={onAddItem} onLoadSample={onLoadSample} />);

    const headers = screen.getAllByText("明細がありません");
    expect(headers.length).toBeGreaterThan(0);
    // アイコンが存在することを確認
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
