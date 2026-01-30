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

// UI/フォーム用入力スキーマ（notice_date, notify_inf, data, encoding 形式）
export const notifyInfSchema = z.object({
  riyosya_no: z.string().optional(),
  riyosya_name: z.string().min(1, "利用者名は必須です"),
  bank_cd: z.string().optional().refine((v) => v === undefined || v === "" || /^\d{4}$/.test(v), "銀行コードは4桁の数字で入力してください"),
  bank_name: z.string().optional(),
  shiten_cd: z.string().optional(),
  shiten_name: z.string().optional(),
  koza_sbt_cd: z.string().optional(),
  koza_no: z.string().optional(),
});

/** 通知先・義務者・権利者などフォーム用（notify_inf と同じ形状） */
export type Party = z.infer<typeof notifyInfSchema>;

const dataItemSchema = z.object({
  notice_cd: z.string().optional(),
  obligation_inf: notifyInfSchema.optional(),
  entitled_inf: notifyInfSchema.optional(),
  saiken_kingaku: z.string().optional(),
  shiharai_kijitsu: z.string().optional(),
  kiroku_no: z.string().optional(),
  kiroku_date: z.string().optional(),
  bukrs: z.string().optional(),
  belnr: z.string().optional(),
  gjahr: z.string().optional(),
  tekiyo: z.string().optional(),
  irainin_ref_no: z.string().optional(),
});

/** UI/フォーム用の明細1件（data 配列の要素） */
export type NoticeItem = z.infer<typeof dataItemSchema>;

export const NoticeInputSchema = z.object({
  header: z.object({
    notice_date: z.string().regex(/^\d{8}$/, "日付は8桁（YYYYMMDD）で入力してください"),
    notify_inf: notifyInfSchema,
  }),
  data: z.array(dataItemSchema),
  encoding: z.string().optional(),
});

export type NoticeInput = z.infer<typeof NoticeInputSchema>;
