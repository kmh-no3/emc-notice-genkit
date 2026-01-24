/**
 * 左側を指定文字で埋める
 * @param value - 元の値
 * @param length - 目標の長さ
 * @param char - 埋める文字（デフォルト: "0"）
 * @returns 左埋めされた文字列
 */
export function padLeft(value: string, length: number, char: string = "0"): string {
  return value.padStart(length, char);
}

/**
 * 口座番号を7桁に左0埋め
 * @param value - 口座番号（1〜7桁）
 * @returns 7桁に左0埋めされた口座番号
 */
export function formatKozaNo(value: string): string {
  return padLeft(value, 7, "0");
}

/**
 * 伝票番号を10桁に左0埋め
 * @param value - 伝票番号（1〜10桁）
 * @returns 10桁に左0埋めされた伝票番号
 */
export function formatBelnr(value: string): string {
  return padLeft(value, 10, "0");
}

/**
 * 日付をYYYYMMDD形式に変換
 * @param date - 日付オブジェクト
 * @returns YYYYMMDD形式の文字列
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 現在日付をYYYYMMDD形式で取得
 * @returns 現在日付のYYYYMMDD形式文字列
 */
export function getCurrentDate(): string {
  return formatDate(new Date());
}

/**
 * 依頼人Ref.No.を生成（BUKRS + BELNR + GJAHR）
 * @param bukrs - 会社コード（4桁）
 * @param belnr - 伝票番号（1〜10桁、10桁に左0埋め）
 * @param gjahr - 会計年度（4桁）
 * @returns 18桁の依頼人Ref.No.
 */
export function generateIraininRefNo(
  bukrs: string,
  belnr: string,
  gjahr: string
): string {
  if (bukrs.length !== 4) {
    throw new Error("BUKRSは4桁である必要があります");
  }
  if (gjahr.length !== 4) {
    throw new Error("GJAHRは4桁である必要があります");
  }
  if (!/^\d{1,10}$/.test(belnr)) {
    throw new Error("BELNRは1〜10桁の数字である必要があります");
  }

  const belnr10 = formatBelnr(belnr);
  return `${bukrs}${belnr10}${gjahr}`;
}

/**
 * 明細件数を6桁に左0埋め
 * @param count - 明細件数
 * @returns 6桁に左0埋めされた明細件数
 */
export function formatSumNum(count: number): string {
  return padLeft(String(count), 6, "0");
}

/**
 * 合計金額を12桁に左0埋め
 * @param amount - 合計金額
 * @returns 12桁に左0埋めされた合計金額
 */
export function formatSumAmnt(amount: number): string {
  return padLeft(String(amount), 12, "0");
}
