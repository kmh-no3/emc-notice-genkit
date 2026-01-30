import { describe, it, expect } from "vitest";
import { generateNoticeXml } from "@/lib/densai/generate";
import type { Header, Notify, Item } from "@/lib/densai/schema";

describe("generate.ts", () => {
  const validHeader: Header = {
    bukrs: "1000",
    belnr: "123456",
    gjahr: "2026",
    budat: "20260125",
    irainin_ref_no: undefined,
  };

  const validNotify: Notify = {
    ginko_cd: "0001",
    shiten_cd: "001",
    koza_no: "1234567",
    koza_mei: "TEST_NOTIFY",
  };

  const validItem: Item = {
    id: "item-1",
    kingaku: "10000",
    tekiyo: "TEST",
    date: "20260125",
  };

  describe("generateNoticeXml", () => {
    it("有効な入力データからXMLを生成する", () => {
      const xml = generateNoticeXml(validHeader, validNotify, [validItem]);
      expect(typeof xml).toBe("string");
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain("<notice_ACR>");
      expect(xml).toContain("<ASG>");
      expect(xml).toContain("<DIV>");
      expect(xml).toContain("</notice_ACR>");
    });

    it("ヘッダ情報が正しく出力される", () => {
      const xml = generateNoticeXml(validHeader, validNotify, [validItem]);
      expect(xml).toContain("<header>");
      expect(xml).toContain("<bukrs>1000</bukrs>");
      expect(xml).toContain("<belnr>123456</belnr>");
      expect(xml).toContain("<gjahr>2026</gjahr>");
      expect(xml).toContain("<budat>20260125</budat>");
    });

    it("通知先情報が正しく出力される", () => {
      const xml = generateNoticeXml(validHeader, validNotify, [validItem]);
      expect(xml).toContain("<notify>");
      expect(xml).toContain("<ginko_cd>0001</ginko_cd>");
      expect(xml).toContain("<shiten_cd>001</shiten_cd>");
      expect(xml).toContain("<koza_no>1234567</koza_no>");
      expect(xml).toContain("<koza_mei>TEST_NOTIFY</koza_mei>");
    });

    it("サマリーと明細が正しく出力される", () => {
      const xml = generateNoticeXml(validHeader, validNotify, [validItem]);
      expect(xml).toContain("<summary>");
      expect(xml).toContain("<sum_num>000001</sum_num>");
      expect(xml).toContain("<sum_amnt>000000010000</sum_amnt>");
      expect(xml).toContain("<data>");
      expect(xml).toContain("<item>");
      expect(xml).toContain("<kingaku>000000010000</kingaku>");
      expect(xml).toContain("<tekiyo>TEST</tekiyo>");
      expect(xml).toContain("<date>20260125</date>");
    });

    it("口座番号が7桁に左0埋めされる", () => {
      const notifyShortKoza: Notify = {
        ...validNotify,
        koza_no: "1",
      };
      const xml = generateNoticeXml(validHeader, notifyShortKoza, [validItem]);
      expect(xml).toContain("<koza_no>0000001</koza_no>");
    });

    it("複数明細の場合、sum_numとsum_amntが正しく計算される", () => {
      const items: Item[] = [
        { ...validItem, id: "1", kingaku: "10000" },
        { ...validItem, id: "2", kingaku: "20000" },
        { ...validItem, id: "3", kingaku: "30000" },
      ];
      const xml = generateNoticeXml(validHeader, validNotify, items);
      expect(xml).toContain("<sum_num>000003</sum_num>");
      expect(xml).toContain("<sum_amnt>000000060000</sum_amnt>");
    });

    it("irainin_ref_noがBUKRS/BELNR/GJAHRから自動生成される", () => {
      const headerNoRef: Header = {
        ...validHeader,
        irainin_ref_no: undefined,
      };
      const xml = generateNoticeXml(headerNoRef, validNotify, [validItem]);
      expect(xml).toContain("<irainin_ref_no>100000001234562026</irainin_ref_no>");
    });

    it("irainin_ref_noが指定されている場合はそのまま出力される", () => {
      const headerWithRef: Header = {
        ...validHeader,
        irainin_ref_no: "100012345600001999",
      };
      const xml = generateNoticeXml(headerWithRef, validNotify, [validItem]);
      expect(xml).toContain("<irainin_ref_no>100012345600001999</irainin_ref_no>");
    });

    it("任意項目が未入力の場合、該当タグは出力されない", () => {
      const minimalNotify: Notify = {};
      const xml = generateNoticeXml(validHeader, minimalNotify, [validItem]);
      // 空の場合は <notify/> または <notify></notify> のいずれか
      expect(xml).toMatch(/<notify[\s/>]/);
    });
  });
});
