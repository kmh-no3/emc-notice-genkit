import { describe, it, expect } from "vitest";
import { generateNoticeXml } from "@/lib/densai/generate";
import type { NoticeInput } from "@/lib/densai/schema";

describe("generate.ts", () => {
  const validInput: NoticeInput = {
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

  describe("generateNoticeXml", () => {
    it("有効な入力データからXMLを生成する", () => {
      const result = generateNoticeXml(validInput);
      expect(result.success).toBe(true);
      expect(result.xml).toBeDefined();
      expect(result.xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result.xml).toContain("<notice_ACR.ASG.DIV>");
      expect(result.xml).toContain("</notice_ACR.ASG.DIV>");
    });

    it("ヘッダ情報が正しく出力される", () => {
      const result = generateNoticeXml(validInput);
      expect(result.xml).toContain("<header_inf>");
      expect(result.xml).toContain("<notice_date>20260125</notice_date>");
      expect(result.xml).toContain("<riyosya_no>123456789</riyosya_no>");
      expect(result.xml).toContain("<riyosya_name>TEST_NOTIFY</riyosya_name>");
    });

    it("データ部が正しく出力される", () => {
      const result = generateNoticeXml(validInput);
      expect(result.xml).toContain("<data_inf>");
      expect(result.xml).toContain("<notice_cd>05</notice_cd>");
      expect(result.xml).toContain("<saiken_kingaku>10000</saiken_kingaku>");
    });

    it("トレーラ情報が正しく出力される", () => {
      const result = generateNoticeXml(validInput);
      expect(result.xml).toContain("<trailer_inf>");
      expect(result.xml).toContain("<sum_num>000001</sum_num>");
      expect(result.xml).toContain("<sum_amnt>000000010000</sum_amnt>");
    });

    it("口座番号が7桁に左0埋めされる", () => {
      const result = generateNoticeXml(validInput);
      expect(result.xml).toContain("<koza_no>1234567</koza_no>");
      expect(result.xml).toContain("<koza_no>0000001</koza_no>");
      expect(result.xml).toContain("<koza_no>0000002</koza_no>");
    });

    it("複数明細の場合、sum_numとsum_amntが正しく計算される", () => {
      const multiInput: NoticeInput = {
        ...validInput,
        data: [
          validInput.data[0],
          {
            ...validInput.data[0],
            saiken_kingaku: "20000",
            kiroku_no: "BBBB",
          },
          {
            ...validInput.data[0],
            saiken_kingaku: "30000",
            kiroku_no: "CCCC",
          },
        ],
      };

      const result = generateNoticeXml(multiInput);
      expect(result.xml).toContain("<sum_num>000003</sum_num>");
      expect(result.xml).toContain("<sum_amnt>000000060000</sum_amnt>");
    });

    it("irainin_ref_noがBUKRS/BELNR/GJAHRから自動生成される", () => {
      const inputWithBukrs: NoticeInput = {
        ...validInput,
        data: [
          {
            ...validInput.data[0],
            bukrs: "1000",
            belnr: "123456",
            gjahr: "2026",
          },
        ],
      };

      const result = generateNoticeXml(inputWithBukrs);
      expect(result.xml).toContain(
        "<irainin_ref_no>100000001234562026</irainin_ref_no>"
      );
    });

    it("任意項目が未入力の場合、タグが出力されない", () => {
      const result = generateNoticeXml(validInput);
      expect(result.xml).not.toContain("<bank_name>");
      expect(result.xml).not.toContain("<cancel_inf>");
    });

    it("不正な入力データの場合、エラーを返す", () => {
      const invalidInput = {
        ...validInput,
        header: {
          ...validInput.header,
          notice_date: "invalid",
        },
      };

      const result = generateNoticeXml(invalidInput);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
