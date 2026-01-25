import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WelcomeCard } from "@/components/WelcomeCard";

describe("WelcomeCard", () => {
  it("正しくレンダリングされる", () => {
    const onLoadSample = vi.fn();
    const onDismiss = vi.fn();

    render(<WelcomeCard onLoadSample={onLoadSample} onDismiss={onDismiss} />);

    expect(screen.getByText("はじめての方へ")).toBeInTheDocument();
    expect(screen.getByText(/このツールでは/)).toBeInTheDocument();
  });

  it("サンプルデータボタンが表示される", () => {
    const onLoadSample = vi.fn();
    const onDismiss = vi.fn();

    render(<WelcomeCard onLoadSample={onLoadSample} onDismiss={onDismiss} />);

    const buttons = screen.getAllByRole("button", { name: /サンプルデータを読み込む/ });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("閉じるボタンが表示される", () => {
    const onLoadSample = vi.fn();
    const onDismiss = vi.fn();

    render(<WelcomeCard onLoadSample={onLoadSample} onDismiss={onDismiss} />);

    const closeButtons = screen.getAllByRole("button", { name: /閉じる/ });
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it("3つのステップが表示される", () => {
    const onLoadSample = vi.fn();
    const onDismiss = vi.fn();

    render(<WelcomeCard onLoadSample={onLoadSample} onDismiss={onDismiss} />);

    const texts = screen.getAllByText(/ヘッダ情報と明細データを入力/);
    expect(texts.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/「XML生成」ボタンをクリック/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/生成されたXMLをダウンロード/).length).toBeGreaterThan(0);
  });
});
