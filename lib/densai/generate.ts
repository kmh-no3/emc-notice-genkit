import { create } from "xmlbuilder2";
import type { NoticeInput, Party, NoticeItem } from "./schema";
import {
  formatKozaNo,
  formatSumNum,
  formatSumAmnt,
  generateIraininRefNo,
} from "./format";
import { validateNoticeInput, parseAmount } from "./validate";

/**
 * XML生成結果
 */
export interface GenerateResult {
  success: boolean;
  xml?: string;
  error?: string;
}

/**
 * でんさい通知XMLを生成
 * @param input - 入力データ
 * @returns 生成されたXML文字列またはエラー
 */
export function generateNoticeXml(input: NoticeInput): GenerateResult {
  try {
    // バリデーション
    const validation = validateNoticeInput(input);
    if (!validation.success) {
      return {
        success: false,
        error: validation.errors?.map((e) => e.message).join(", "),
      };
    }

    const validatedInput = validation.data!;

    // 合計値の計算
    const sumNum = validatedInput.data.length;
    const sumAmnt = validatedInput.data.reduce((total, item) => {
      return total + parseAmount(item.saiken_kingaku);
    }, 0);

    // XMLドキュメント作成
    const doc = create({ version: "1.0", encoding: validatedInput.encoding })
      .ele("notice_ACR.ASG.DIV");

    // ヘッダ情報
    const headerInf = doc.ele("header_inf");
    headerInf.ele("notice_date").txt(validatedInput.header.notice_date);

    const notifyInf = headerInf.ele("notify_inf");
    buildPartyElement(notifyInf, validatedInput.header.notify_inf, true);

    // データ部（明細）
    validatedInput.data.forEach((item) => {
      const dataInf = doc.ele("data_inf");
      buildDataInfElement(dataInf, item);
    });

    // トレーラ情報
    const trailerInf = doc.ele("trailer_inf");
    trailerInf.ele("sum_num").txt(formatSumNum(sumNum));
    trailerInf.ele("sum_amnt").txt(formatSumAmnt(sumAmnt));

    // XML文字列として出力
    const xml = doc.end({ prettyPrint: true });

    return {
      success: true,
      xml,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "XML生成中に予期しないエラーが発生しました",
    };
  }
}

/**
 * 当事者情報要素を構築
 * @param parent - 親要素
 * @param party - 当事者情報
 * @param isNotify - 通知先情報かどうか
 */
function buildPartyElement(
  parent: any,
  party: Party & { riyosya_no?: string },
  isNotify: boolean = false
): void {
  // 通知先の場合のみ利用者番号を出力
  if (isNotify && party.riyosya_no) {
    parent.ele("riyosya_no").txt(party.riyosya_no);
  }

  parent.ele("riyosya_name").txt(party.riyosya_name);
  parent.ele("bank_cd").txt(party.bank_cd);

  // 任意項目：銀行名
  if (party.bank_name) {
    parent.ele("bank_name").txt(party.bank_name);
  }

  parent.ele("shiten_cd").txt(party.shiten_cd);

  // 任意項目：支店名
  if (party.shiten_name) {
    parent.ele("shiten_name").txt(party.shiten_name);
  }

  parent.ele("koza_sbt_cd").txt(party.koza_sbt_cd);
  parent.ele("koza_no").txt(formatKozaNo(party.koza_no));
}

/**
 * データ部要素を構築
 * @param dataInf - data_inf要素
 * @param item - 明細データ
 */
function buildDataInfElement(dataInf: any, item: NoticeItem): void {
  dataInf.ele("notice_cd").txt(item.notice_cd);

  // 義務者情報
  const obligationInf = dataInf.ele("obligation_inf");
  buildPartyElement(obligationInf, item.obligation_inf);

  // 権利者情報
  const entitledInf = dataInf.ele("entitled_inf");
  buildPartyElement(entitledInf, item.entitled_inf);

  // 金額・期日等
  dataInf.ele("saiken_kingaku").txt(item.saiken_kingaku);
  dataInf.ele("shiharai_kijitsu").txt(item.shiharai_kijitsu);
  dataInf.ele("kiroku_no").txt(item.kiroku_no);

  // 依頼人Ref.No.の生成または直接使用
  let iraininRefNo = item.irainin_ref_no;
  if (!iraininRefNo && item.bukrs && item.belnr && item.gjahr) {
    try {
      iraininRefNo = generateIraininRefNo(item.bukrs, item.belnr, item.gjahr);
    } catch (error) {
      // エラーの場合はスキップ（iraininRefNoは任意項目）
      console.warn("irainin_ref_no生成エラー:", error);
    }
  }

  if (iraininRefNo) {
    dataInf.ele("irainin_ref_no").txt(iraininRefNo);
  }

  dataInf.ele("kiroku_date").txt(item.kiroku_date);

  // 任意項目：取消区分
  if (item.cancel_inf) {
    dataInf.ele("cancel_inf").txt(item.cancel_inf);
  }
}
