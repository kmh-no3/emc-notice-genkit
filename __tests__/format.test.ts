import { describe, it, expect } from "vitest";
import {
  formatAccountNumber,
  formatBelnr,
  formatDate,
  generateIraininRefNo,
  formatItemCount,
  formatAmount,
} from "@/lib/densai/format";

describe("format.ts", () => {
  describe("formatAccountNumber", () => {
    it("口座番号を7桁に左0埋め", () => {
      expect(formatAccountNumber("1")).toBe("0000001");
      expect(formatAccountNumber("123")).toBe("0000123");
      expect(formatAccountNumber("1234567")).toBe("1234567");
    });

    it("数字以外を除去して7桁に", () => {
      expect(formatAccountNumber("1-2-3")).toBe("0000123");
    });
  });

  describe("formatBelnr", () => {
    it("伝票番号を10桁に左0埋め", () => {
      expect(formatBelnr("1")).toBe("0000000001");
      expect(formatBelnr("123456")).toBe("0000123456");
      expect(formatBelnr("1234567890")).toBe("1234567890");
    });
  });

  describe("formatDate", () => {
    it("日付をYYYYMMDD形式に変換（8桁はそのまま）", () => {
      expect(formatDate("20260125")).toBe("20260125");
    });

    it("ハイフン・スラッシュを除去して8桁に", () => {
      expect(formatDate("2026-01-25")).toBe("20260125");
      expect(formatDate("2026/03/05")).toBe("20260305");
    });

    it("不正な場合はundefined", () => {
      expect(formatDate("2026125")).toBeUndefined();
      expect(formatDate("")).toBeUndefined();
    });
  });

  describe("generateIraininRefNo", () => {
    it("BUKRS + BELNR(10桁) + GJAHRで18桁の文字列を生成", () => {
      const result = generateIraininRefNo("1000", "123456", "2026");
      expect(result).toBe("100000001234562026");
      expect(result.length).toBe(18);
    });

    it("BELNRが10桁未満の場合は左0埋めされる", () => {
      const result = generateIraininRefNo("1000", "1", "2026");
      expect(result).toBe("100000000000012026");
    });

    it("BUKRSが4桁でない場合はエラー", () => {
      expect(() => generateIraininRefNo("100", "123456", "2026")).toThrow(
        "BUKRSは4桁である必要があります"
      );
    });

    it("GJAHRが4桁でない場合はエラー", () => {
      expect(() => generateIraininRefNo("1000", "123456", "26")).toThrow(
        "GJAHRは4桁である必要があります"
      );
    });

    it("BELNRが数字でない場合はエラー", () => {
      expect(() => generateIraininRefNo("1000", "abc", "2026")).toThrow(
        "BELNRは1〜10桁の数字である必要があります"
      );
    });
  });

  describe("formatItemCount", () => {
    it("明細件数を6桁に左0埋め", () => {
      expect(formatItemCount(1)).toBe("000001");
      expect(formatItemCount(123)).toBe("000123");
      expect(formatItemCount(999999)).toBe("999999");
    });
  });

  describe("formatAmount", () => {
    it("合計金額を12桁に左0埋め", () => {
      expect(formatAmount(10000)).toBe("000000010000");
      expect(formatAmount(1234567890)).toBe("001234567890");
      expect(formatAmount(999999999999)).toBe("999999999999");
    });

    it("文字列も受け付ける", () => {
      expect(formatAmount("10000")).toBe("000000010000");
    });
  });
});
