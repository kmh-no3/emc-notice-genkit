import { describe, it, expect } from "vitest";
import {
  padLeft,
  formatKozaNo,
  formatBelnr,
  formatDate,
  generateIraininRefNo,
  formatSumNum,
  formatSumAmnt,
} from "@/lib/densai/format";

describe("format.ts", () => {
  describe("padLeft", () => {
    it("左側を0で埋める", () => {
      expect(padLeft("123", 5)).toBe("00123");
      expect(padLeft("1", 7)).toBe("0000001");
    });

    it("指定文字で埋める", () => {
      expect(padLeft("abc", 5, "x")).toBe("xxabc");
    });

    it("既に長さが足りている場合はそのまま", () => {
      expect(padLeft("12345", 5)).toBe("12345");
      expect(padLeft("123456", 5)).toBe("123456");
    });
  });

  describe("formatKozaNo", () => {
    it("口座番号を7桁に左0埋め", () => {
      expect(formatKozaNo("1")).toBe("0000001");
      expect(formatKozaNo("123")).toBe("0000123");
      expect(formatKozaNo("1234567")).toBe("1234567");
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
    it("日付をYYYYMMDD形式に変換", () => {
      const date = new Date("2026-01-25");
      expect(formatDate(date)).toBe("20260125");
    });

    it("月と日が1桁の場合は0埋めされる", () => {
      const date = new Date("2026-03-05");
      expect(formatDate(date)).toBe("20260305");
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

  describe("formatSumNum", () => {
    it("明細件数を6桁に左0埋め", () => {
      expect(formatSumNum(1)).toBe("000001");
      expect(formatSumNum(123)).toBe("000123");
      expect(formatSumNum(999999)).toBe("999999");
    });
  });

  describe("formatSumAmnt", () => {
    it("合計金額を12桁に左0埋め", () => {
      expect(formatSumAmnt(10000)).toBe("000000010000");
      expect(formatSumAmnt(1234567890)).toBe("001234567890");
      expect(formatSumAmnt(999999999999)).toBe("999999999999");
    });
  });
});
