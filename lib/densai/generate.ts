import { create } from "xmlbuilder2";
import type { Header, Notify, Item } from "./schema";
import { formatAmount, formatAccountNumber, formatItemCount, formatBelnr } from "./format";

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
