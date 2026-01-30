import { z } from "zod";

// ヘッダースキーマ
export const headerSchema = z.object({
  bukrs: z.string().min(1, "会社コードは必須です"),
  belnr: z.string().min(1, "伝票番号は必須です"),
  gjahr: z.string().min(1, "年度は必須です"),
  budat: z.string().regex(/^\d{8}$/, "日付は8桁（YYYYMMDD）で入力してください").optional(),
  irainin_ref_no: z.string().optional(),
});

export type Header = z.infer<typeof headerSchema>;

// 通知先スキーマ
export const notifySchema = z.object({
  ginko_cd: z.string().regex(/^\d{4}$/, "銀行コードは4桁の数字で入力してください").optional(),
  shiten_cd: z.string().regex(/^\d{3}$/, "支店コードは3桁の数字で入力してください").optional(),
  koza_no: z.string().optional(),
  koza_mei: z.string().optional(),
});

export type Notify = z.infer<typeof notifySchema>;

// 明細スキーマ
export const itemSchema = z.object({
  id: z.string(),
  kingaku: z.string().regex(/^\d+$/, "金額は数字で入力してください").optional(),
  tekiyo: z.string().optional(),
  date: z.string().regex(/^\d{8}$/, "日付は8桁（YYYYMMDD）で入力してください").optional(),
});

export type Item = z.infer<typeof itemSchema>;

// 全体スキーマ
export const noticeSchema = z.object({
  header: headerSchema,
  notify: notifySchema,
  items: z.array(itemSchema),
});

export type Notice = z.infer<typeof noticeSchema>;
