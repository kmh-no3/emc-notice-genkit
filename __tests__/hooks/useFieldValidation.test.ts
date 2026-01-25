import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { z } from "zod";

describe("useFieldValidation", () => {
  const schema = z.string().regex(/^\d{4}$/, "4桁の数字である必要があります");

  it("初期状態はidleである", () => {
    const { result } = renderHook(() => useFieldValidation(schema));

    expect(result.current.validationState).toBe("idle");
    expect(result.current.error).toBeUndefined();
  });

  it("有効な値をバリデーションするとvalidになる", async () => {
    const { result } = renderHook(() => useFieldValidation(schema));

    await act(async () => {
      await result.current.validate("1234");
    });

    await waitFor(() => {
      expect(result.current.validationState).toBe("valid");
      expect(result.current.error).toBeUndefined();
    });
  });

  it("無効な値をバリデーションするとinvalidになる", async () => {
    const { result } = renderHook(() => useFieldValidation(schema));

    await act(async () => {
      await result.current.validate("abc");
    });

    await waitFor(() => {
      expect(result.current.validationState).toBe("invalid");
      expect(result.current.error).toBeDefined();
    });
  });

  it("空の値はidleのままになる", async () => {
    const { result } = renderHook(() => useFieldValidation(schema));

    await act(async () => {
      await result.current.validate("");
    });

    expect(result.current.validationState).toBe("idle");
    expect(result.current.error).toBeUndefined();
  });

  it("resetを呼ぶと状態がリセットされる", async () => {
    const { result } = renderHook(() => useFieldValidation(schema));

    await act(async () => {
      await result.current.validate("abc");
    });

    await waitFor(() => {
      expect(result.current.validationState).toBe("invalid");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.validationState).toBe("idle");
    expect(result.current.error).toBeUndefined();
  });
});
