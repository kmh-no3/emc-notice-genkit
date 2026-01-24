import { describe, it, expect } from "vitest";
import {
  validateNoticeInput,
  isValidDate,
  parseAmount,
  formatValidationErrors,
} from "@/lib/densai/validate";

describe("validate.ts", () => {
  describe("isValidDate", () => {
    it("有効な日付を認識する", () => {
      expect(isValidDate("20260125")).toBe(true);
      expect(isValidDate("20260228")).toBe(true);
      expect(isValidDate("20261231")).toBe(true);
    });

    it("無効な日付を拒否する", () => {
      expect(isValidDate("20260229")).toBe(false); // 2026年は閏年ではない
      expect(isValidDate("20260431")).toBe(false); // 4月は30日まで
      expect(isValidDate("20261301")).toBe(false); // 13月は存在しない
      expect(isValidDate("20260100")).toBe(false); // 0日は存在しない
    });

    it("8桁でない文字列を拒否する", () => {
      expect(isValidDate("2026125")).toBe(false);
      expect(isValidDate("202601255")).toBe(false);
      expect(isValidDate("abcdefgh")).toBe(false);
    });
  });

  describe("parseAmount", () => {
    it("金額文字列を数値に変換", () => {
      expect(parseAmount("10000")).toBe(10000);
      expect(parseAmount("123456")).toBe(123456);
      expect(parseAmount("0")).toBe(0);
    });
  });

  describe("formatValidationErrors", () => {
    it("エラーメッセージを整形する", () => {
      const errors = [
        { path: ["data", "0", "saiken_kingaku"], message: "金額が不正です" },
        { path: [], message: "全体のエラー" },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain("[data.0.saiken_kingaku]");
      expect(formatted).toContain("金額が不正です");
      expect(formatted).toContain("全体のエラー");
    });
  });

  describe("validateNoticeInput", () => {
    it("有効な入力データを受け入れる", () => {
      const input = {
        header: {
          notice_date: "20260125",
          notify_inf: {
            riyosya_no: "123456789",
            riyosya_name: "TEST_NOTIFY",
            bank_cd: "0001",
            shiten_cd: "001",
            koza_sbt_cd: "1",
            koza_no: "1234567",
          },
        },
        data: [
          {
            notice_cd: "05",
            obligation_inf: {
              riyosya_name: "TEST_OBLIGATION",
              bank_cd: "0001",
              shiten_cd: "001",
              koza_sbt_cd: "1",
              koza_no: "1",
            },
            entitled_inf: {
              riyosya_name: "TEST_ENTITLED",
              bank_cd: "0002",
              shiten_cd: "002",
              koza_sbt_cd: "1",
              koza_no: "2",
            },
            saiken_kingaku: "10000",
            shiharai_kijitsu: "20260228",
            kiroku_no: "AAAA",
            kiroku_date: "20260125",
          },
        ],
        encoding: "UTF-8",
      };

      const result = validateNoticeInput(input);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("必須フィールドの欠如を検出", () => {
      const input = {
        header: {
          notice_date: "20260125",
          notify_inf: {
            riyosya_no: "123456789",
            riyosya_name: "",
            bank_cd: "0001",
            shiten_cd: "001",
            koza_sbt_cd: "1",
            koza_no: "1234567",
          },
        },
        data: [],
        encoding: "UTF-8",
      };

      const result = validateNoticeInput(input);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it("不正な日付形式を検出", () => {
      const input = {
        header: {
          notice_date: "2026-01-25", // ハイフン区切りは不正
          notify_inf: {
            riyosya_no: "123456789",
            riyosya_name: "TEST",
            bank_cd: "0001",
            shiten_cd: "001",
            koza_sbt_cd: "1",
            koza_no: "1234567",
          },
        },
        data: [
          {
            notice_cd: "05",
            obligation_inf: {
              riyosya_name: "TEST",
              bank_cd: "0001",
              shiten_cd: "001",
              koza_sbt_cd: "1",
              koza_no: "1",
            },
            entitled_inf: {
              riyosya_name: "TEST",
              bank_cd: "0002",
              shiten_cd: "002",
              koza_sbt_cd: "1",
              koza_no: "2",
            },
            saiken_kingaku: "10000",
            shiharai_kijitsu: "20260228",
            kiroku_no: "AAAA",
            kiroku_date: "20260125",
          },
        ],
        encoding: "UTF-8",
      };

      const result = validateNoticeInput(input);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("不正な銀行コードを検出", () => {
      const input = {
        header: {
          notice_date: "20260125",
          notify_inf: {
            riyosya_no: "123456789",
            riyosya_name: "TEST",
            bank_cd: "001", // 3桁は不正（4桁必要）
            shiten_cd: "001",
            koza_sbt_cd: "1",
            koza_no: "1234567",
          },
        },
        data: [],
        encoding: "UTF-8",
      };

      const result = validateNoticeInput(input);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });
});
