import { create } from "xmlbuilder2";
import { nanoid } from "nanoid";
import type { Header, Notify, Item, NoticeInput } from "./schema";
import { formatAmount, formatAccountNumber, formatItemCount, formatBelnr } from "./format";
import { validateNoticeInput, formatValidationErrors } from "./validate";

/**
 * irainin_ref_noを自動生成
 */
function generateIraininRefNo(header: Header): string {
  if (header.irainin_ref_no) {
    return header.irainin_ref_no;
  }
  const belnr = formatBelnr(header.belnr);
  return `${header.bukrs}${belnr}${header.gjahr}`;
}

/**
 * XMLを生成
 */
export function generateNoticeXml(header: Header, notify: Notify, items: Item[]): string {
  const root = create({ version: "1.0", encoding: "UTF-8" })
    .ele("notice_ACR")
    .ele("ASG")
    .ele("DIV");

  // ヘッダー情報
  const headerEl = root.ele("header");
  headerEl.ele("bukrs").txt(header.bukrs);
  headerEl.ele("belnr").txt(header.belnr);
  headerEl.ele("gjahr").txt(header.gjahr);
  
  if (header.budat) {
    headerEl.ele("budat").txt(header.budat);
  }
  
  const iraininRefNo = generateIraininRefNo(header);
  headerEl.ele("irainin_ref_no").txt(iraininRefNo);

  // 通知先情報
  const notifyEl = root.ele("notify");
  if (notify.ginko_cd) {
    notifyEl.ele("ginko_cd").txt(notify.ginko_cd);
  }
  if (notify.shiten_cd) {
    notifyEl.ele("shiten_cd").txt(notify.shiten_cd);
  }
  if (notify.koza_no) {
    const formattedKoza = formatAccountNumber(notify.koza_no);
    if (formattedKoza) {
      notifyEl.ele("koza_no").txt(formattedKoza);
    }
  }
  if (notify.koza_mei) {
    notifyEl.ele("koza_mei").txt(notify.koza_mei);
  }

  // サマリー情報
  const sumEl = root.ele("summary");
  const sumNum = formatItemCount(items.length);
  sumEl.ele("sum_num").txt(sumNum);
  
  const totalAmount = items.reduce((sum, item) => {
    const amount = item.kingaku ? parseInt(item.kingaku, 10) : 0;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const sumAmnt = formatAmount(totalAmount);
  sumEl.ele("sum_amnt").txt(sumAmnt);

  // 明細情報
  const dataEl = root.ele("data");
  items.forEach((item) => {
    const itemEl = dataEl.ele("item");
    
    if (item.kingaku) {
      itemEl.ele("kingaku").txt(formatAmount(item.kingaku));
    }
    if (item.tekiyo) {
      itemEl.ele("tekiyo").txt(item.tekiyo);
    }
    if (item.date) {
      itemEl.ele("date").txt(item.date);
    }
  });

  const xml = root.end({ prettyPrint: true });
  return xml;
}

/**
 * NoticeInput（UI形式）からXMLを生成する。
 * バリデーション後、Header/Notify/Itemに変換してgenerateNoticeXmlを呼ぶ。
 */
export function generateNoticeXmlFromInput(
  input: NoticeInput
): { success: true; xml: string } | { success: false; error: string } {
  const validated = validateNoticeInput(input);
  if (!validated.success || !validated.data) {
    const message =
      validated.errors && validated.errors.length > 0
        ? formatValidationErrors(validated.errors)
        : "入力データが不正です";
    return { success: false, error: message };
  }

  const { header: headerInput, data } = validated.data;
  const first = data[0];
  const currentYear = new Date().getFullYear().toString();

  const header: Header = {
    bukrs: first?.bukrs ?? "1000",
    belnr: first?.belnr ?? "0000000001",
    gjahr: first?.gjahr ?? currentYear,
    budat: headerInput.notice_date,
    irainin_ref_no: undefined,
  };

  const notify: Notify = {
    ginko_cd: headerInput.notify_inf.bank_cd || undefined,
    shiten_cd: headerInput.notify_inf.shiten_cd || undefined,
    koza_no: headerInput.notify_inf.koza_no || undefined,
    koza_mei: headerInput.notify_inf.riyosya_name || undefined,
  };

  const items: Item[] = data.map((d, i) => ({
    id: d.kiroku_no ?? nanoid(),
    kingaku: d.saiken_kingaku,
    tekiyo: (d as { tekiyo?: string }).tekiyo,
    date: d.kiroku_date,
  }));

  try {
    const xml = generateNoticeXml(header, notify, items);
    return { success: true, xml };
  } catch (e) {
    const message = e instanceof Error ? e.message : "XML生成に失敗しました";
    return { success: false, error: message };
  }
}
