import type { NoticeInput } from "./schema";
import { getCurrentDate } from "./format";

/**
 * 最小必須1件のサンプルデータ
 */
export const PRESET_SINGLE: NoticeInput = {
  header: {
    notice_date: getCurrentDate(),
    notify_inf: {
      riyosya_no: "123456789",
      riyosya_name: "TEST_NOTIFY",
      bank_cd: "0001",
      bank_name: "みずほ銀行",
      shiten_cd: "001",
      shiten_name: "東京営業部",
      koza_sbt_cd: "1",
      koza_no: "1234",
    },
  },
  data: [
    {
      notice_cd: "05",
      obligation_inf: {
        riyosya_name: "TEST_OBLIGATION",
        bank_cd: "0001",
        bank_name: "みずほ銀行",
        shiten_cd: "001",
        shiten_name: "東京営業部",
        koza_sbt_cd: "1",
        koza_no: "1",
      },
      entitled_inf: {
        riyosya_name: "TEST_ENTITLED",
        bank_cd: "0002",
        bank_name: "三菱UFJ銀行",
        shiten_cd: "002",
        shiten_name: "本店",
        koza_sbt_cd: "1",
        koza_no: "2",
      },
      saiken_kingaku: "10000",
      shiharai_kijitsu: "20260228",
      kiroku_no: "AAAAAAAAAAAAAAAAAAAA",
      kiroku_date: getCurrentDate(),
      bukrs: "1000",
      belnr: "123456",
      gjahr: "2026",
    },
  ],
  encoding: "UTF-8",
};

/**
 * 複数明細（3件）のサンプルデータ
 */
export const PRESET_MULTIPLE: NoticeInput = {
  header: {
    notice_date: getCurrentDate(),
    notify_inf: {
      riyosya_no: "987654321",
      riyosya_name: "TEST_NOTIFY_MULTI",
      bank_cd: "0005",
      bank_name: "三井住友銀行",
      shiten_cd: "100",
      shiten_name: "大阪営業部",
      koza_sbt_cd: "1",
      koza_no: "9999999",
    },
  },
  data: [
    {
      notice_cd: "01",
      obligation_inf: {
        riyosya_name: "OBLIGATION_01",
        bank_cd: "0001",
        bank_name: "みずほ銀行",
        shiten_cd: "001",
        shiten_name: "東京営業部",
        koza_sbt_cd: "1",
        koza_no: "1000001",
      },
      entitled_inf: {
        riyosya_name: "ENTITLED_01",
        bank_cd: "0002",
        bank_name: "三菱UFJ銀行",
        shiten_cd: "002",
        shiten_name: "本店",
        koza_sbt_cd: "1",
        koza_no: "2000001",
      },
      saiken_kingaku: "50000",
      shiharai_kijitsu: "20260331",
      kiroku_no: "RECORD001XXXXXXXXXXX",
      kiroku_date: getCurrentDate(),
      bukrs: "1000",
      belnr: "100001",
      gjahr: "2026",
    },
    {
      notice_cd: "02",
      obligation_inf: {
        riyosya_name: "OBLIGATION_02",
        bank_cd: "0003",
        bank_name: "りそな銀行",
        shiten_cd: "003",
        shiten_name: "梅田支店",
        koza_sbt_cd: "2",
        koza_no: "3000001",
      },
      entitled_inf: {
        riyosya_name: "ENTITLED_02",
        bank_cd: "0004",
        bank_name: "埼玉りそな銀行",
        shiten_cd: "004",
        shiten_name: "さいたま支店",
        koza_sbt_cd: "1",
        koza_no: "4000001",
      },
      saiken_kingaku: "120000",
      shiharai_kijitsu: "20260430",
      kiroku_no: "RECORD002XXXXXXXXXXX",
      kiroku_date: getCurrentDate(),
      bukrs: "1000",
      belnr: "100002",
      gjahr: "2026",
    },
    {
      notice_cd: "05",
      obligation_inf: {
        riyosya_name: "OBLIGATION_03",
        bank_cd: "0005",
        bank_name: "三井住友銀行",
        shiten_cd: "005",
        shiten_name: "名古屋支店",
        koza_sbt_cd: "1",
        koza_no: "5000001",
      },
      entitled_inf: {
        riyosya_name: "ENTITLED_03",
        bank_cd: "0006",
        bank_name: "ゆうちょ銀行",
        shiten_cd: "006",
        shiten_name: "〇一八店",
        koza_sbt_cd: "1",
        koza_no: "6000001",
      },
      saiken_kingaku: "830000",
      shiharai_kijitsu: "20260531",
      kiroku_no: "RECORD003XXXXXXXXXXX",
      kiroku_date: getCurrentDate(),
      bukrs: "1000",
      belnr: "100003",
      gjahr: "2026",
    },
  ],
  encoding: "UTF-8",
};

/**
 * プリセットの一覧
 */
export const PRESETS = {
  single: PRESET_SINGLE,
  multiple: PRESET_MULTIPLE,
} as const;

/**
 * プリセット名の表示用ラベル
 */
export const PRESET_LABELS = {
  single: "最小必須1件サンプル",
  multiple: "複数明細サンプル（3件）",
} as const;
