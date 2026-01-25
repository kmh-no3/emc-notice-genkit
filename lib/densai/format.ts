/**
 * フォーマット関数
 */

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
 * 伝票番号を10桁にフォーマット（左詰め、右側0埋め）
 */
export function formatBelnr(belnr: string | undefined): string {
  if (!belnr) return "";
  return belnr.padEnd(10, "0").substring(0, 10);
}
