/**
 * フォーマット関数
 */

/**
 * 現在日付をYYYYMMDD形式で返す
 */
export function getCurrentDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * 依頼人Ref.No.を生成（BUKRS 4桁 + BELNR 10桁0埋め + GJAHR 4桁 = 18桁）
 */
export function generateIraininRefNo(
  bukrs: string,
  belnr: string,
  gjahr: string
): string {
  if (!/^\d{4}$/.test(bukrs)) {
    throw new Error("BUKRSは4桁である必要があります");
  }
  if (!/^\d{4}$/.test(gjahr)) {
    throw new Error("GJAHRは4桁である必要があります");
  }
  if (!/^\d{1,10}$/.test(belnr)) {
    throw new Error("BELNRは1〜10桁の数字である必要があります");
  }
  const belnrPadded = belnr.padStart(10, "0");
  return `${bukrs}${belnrPadded}${gjahr}`;
}

/**
 * 日付を8桁形式（YYYYMMDD）にフォーマット
 */
export function formatDate(date: string | undefined): string | undefined {
  if (!date) return undefined;
  // 既に8桁の場合はそのまま返す
  if (/^\d{8}$/.test(date)) return date;
  // ハイフンやスラッシュを除去
  const cleaned = date.replace(/[-\/]/g, "");
  if (cleaned.length === 8) return cleaned;
  return undefined;
}

/**
 * 金額を12桁0埋めにフォーマット
 */
export function formatAmount(amount: string | number | undefined): string {
  if (!amount) return "000000000000";
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;
  if (isNaN(num)) return "000000000000";
  return num.toString().padStart(12, "0");
}

/**
 * 口座番号を7桁0埋めにフォーマット
 */
export function formatAccountNumber(account: string | undefined): string | undefined {
  if (!account) return undefined;
  const cleaned = account.replace(/\D/g, "");
  if (!cleaned) return undefined;
  return cleaned.padStart(7, "0");
}

/**
 * 明細数を6桁0埋めにフォーマット
 */
export function formatItemCount(count: number): string {
  return count.toString().padStart(6, "0");
}

/**
 * 伝票番号を10桁にフォーマット（左0埋め）
 */
export function formatBelnr(belnr: string | undefined): string {
  if (!belnr) return "";
  return belnr.padStart(10, "0").substring(0, 10);
}
