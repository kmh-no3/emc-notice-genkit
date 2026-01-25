import type { NoticeInput } from "./densai/schema";

const STORAGE_KEY = "densai-notice-input";

/**
 * ローカルストレージにデータを保存
 * @param data - 保存するデータ
 */
export function saveToLocalStorage(data: NoticeInput): void {
  try {
    if (typeof window !== "undefined") {
      const json = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, json);
    }
  } catch (error) {
    console.error("ローカルストレージへの保存に失敗しました:", error);
  }
}

/**
 * ローカルストレージからデータを読み込み
 * @returns 保存されたデータ、または null
 */
export function loadFromLocalStorage(): NoticeInput | null {
  try {
    if (typeof window !== "undefined") {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) {
        return JSON.parse(json) as NoticeInput;
      }
    }
  } catch (error) {
    console.error("ローカルストレージからの読み込みに失敗しました:", error);
  }
  return null;
}

/**
 * ローカルストレージのデータをクリア
 */
export function clearLocalStorage(): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("ローカルストレージのクリアに失敗しました:", error);
  }
}

/**
 * ローカルストレージにデータが存在するかチェック
 * @returns データが存在する場合 true
 */
export function hasStoredData(): boolean {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) !== null;
    }
  } catch (error) {
    console.error("ローカルストレージのチェックに失敗しました:", error);
  }
  return false;
}
