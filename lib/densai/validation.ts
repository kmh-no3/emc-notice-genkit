import { z } from "zod";
import { headerSchema, notifySchema, itemSchema, type Header, type Notify, type Item } from "./schema";

/**
 * バリデーション結果
 */
export interface ValidationError {
  path: string;
  message: string;
  anchor?: string;
}

/**
 * ヘッダーのバリデーション
 */
export function validateHeader(header: Header): ValidationError[] {
  const errors: ValidationError[] = [];
  const result = headerSchema.safeParse(header);
  
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.push({
        path: `header.${err.path.join(".")}`,
        message: err.message,
        anchor: "header",
      });
    });
  }
  
  return errors;
}

/**
 * 通知先のバリデーション
 */
export function validateNotify(notify: Notify): ValidationError[] {
  const errors: ValidationError[] = [];
  const result = notifySchema.safeParse(notify);
  
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.push({
        path: `notify.${err.path.join(".")}`,
        message: err.message,
        anchor: "notify",
      });
    });
  }
  
  return errors;
}

/**
 * 明細のバリデーション
 */
export function validateItem(item: Item, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const result = itemSchema.safeParse(item);
  
  if (!result.success) {
    result.error.errors.forEach((err) => {
      errors.push({
        path: `items[${index}].${err.path.join(".")}`,
        message: err.message,
        anchor: `item-${index}`,
      });
    });
  }
  
  return errors;
}

/**
 * 全体のバリデーション
 */
export function validateNotice(header: Header, notify: Notify, items: Item[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  errors.push(...validateHeader(header));
  errors.push(...validateNotify(notify));
  
  items.forEach((item, index) => {
    errors.push(...validateItem(item, index));
  });
  
  return errors;
}
