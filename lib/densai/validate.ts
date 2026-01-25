import { z } from "zod";
import { NoticeInputSchema, type NoticeInput } from "./schema";

/**
 * バリデーションエラーの詳細情報
 */
export interface ValidationError {
  path: string[];
  message: string;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  success: boolean;
  data?: NoticeInput;
  errors?: ValidationError[];
}

/**
 * 入力データのバリデーション
 * @param input - バリデーション対象の入力データ
 * @returns バリデーション結果
 */
export function validateNoticeInput(input: unknown): ValidationResult {
  try {
    const result = NoticeInputSchema.safeParse(input);

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      const errors: ValidationError[] = result.error.issues.map((err) => ({
        path: err.path.map(String),
        message: err.message,
      }));

      return {
        success: false,
        errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          path: [],
          message:
            error instanceof Error
              ? error.message
              : "予期しないエラーが発生しました",
        },
      ],
    };
  }
}

/**
 * エラーメッセージを整形して返す
 * @param errors - バリデーションエラーの配列
 * @returns 整形されたエラーメッセージ
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((err) => {
    const pathStr = err.path.length > 0 ? `[${err.path.join(".")}] ` : "";
    return `${pathStr}${err.message}`;
  }).join("\n");
}

/**
 * 日付文字列の妥当性チェック（YYYYMMDD形式）
 * @param dateStr - 日付文字列
 * @returns 妥当な日付かどうか
 */
export function isValidDate(dateStr: string): boolean {
  if (!/^\d{8}$/.test(dateStr)) {
    return false;
  }

  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);

  // 月の範囲チェック
  if (month < 1 || month > 12) {
    return false;
  }

  // 日の範囲チェック
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  return true;
}

/**
 * 金額文字列を数値に変換
 * @param amountStr - 金額文字列
 * @returns 数値
 */
export function parseAmount(amountStr: string): number {
  return parseInt(amountStr, 10);
}
