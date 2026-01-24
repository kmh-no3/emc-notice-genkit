import { z } from "zod";

// 口座種別コード
export const KozaSbtCdSchema = z.enum(["1", "2", "9"]);
export type KozaSbtCd = z.infer<typeof KozaSbtCdSchema>;

// 通知種別コード
export const NoticeCdSchema = z.enum(["01", "02", "03", "04", "05", "06", "07", "08"]);
export type NoticeCd = z.infer<typeof NoticeCdSchema>;

// 取消区分
export const CancelInfSchema = z.enum(["1"]);
export type CancelInf = z.infer<typeof CancelInfSchema>;

// エンコーディング
export const EncodingSchema = z.enum(["UTF-8", "Shift_JIS"]);
export type Encoding = z.infer<typeof EncodingSchema>;

// 当事者情報（義務者/権利者/通知先）
export const PartySchema = z.object({
  riyosya_name: z.string().min(1, "利用者名は必須です"),
  riyosya_no: z.string().optional(), // 通知先のみ
  bank_cd: z
    .string()
    .regex(/^\d{4}$/, "銀行コードは4桁の数字である必要があります"),
  bank_name: z.string().optional(),
  shiten_cd: z
    .string()
    .regex(/^\d{3}$/, "支店コードは3桁の数字である必要があります"),
  shiten_name: z.string().optional(),
  koza_sbt_cd: KozaSbtCdSchema,
  koza_no: z
    .string()
    .regex(/^\d{1,7}$/, "口座番号は1〜7桁の数字である必要があります"),
});
export type Party = z.infer<typeof PartySchema>;

// 明細データ
export const NoticeItemSchema = z.object({
  notice_cd: NoticeCdSchema,
  obligation_inf: PartySchema,
  entitled_inf: PartySchema,
  saiken_kingaku: z
    .string()
    .regex(/^\d{1,10}$/, "債権金額は1〜10桁の数字である必要があります"),
  shiharai_kijitsu: z
    .string()
    .regex(/^\d{8}$/, "支払期日はYYYYMMDD形式である必要があります"),
  kiroku_no: z
    .string()
    .min(1, "記録番号は必須です")
    .max(20, "記録番号は20文字以内である必要があります"),
  kiroku_date: z
    .string()
    .regex(/^\d{8}$/, "電子記録年月日はYYYYMMDD形式である必要があります"),
  cancel_inf: CancelInfSchema.optional(),
  // 伝票特定補助フィールド
  bukrs: z.string().optional(),
  belnr: z.string().optional(),
  gjahr: z.string().optional(),
  irainin_ref_no: z
    .string()
    .max(40, "依頼人Ref.No.は40文字以内である必要があります")
    .optional(),
});
export type NoticeItem = z.infer<typeof NoticeItemSchema>;

// ヘッダ情報
export const HeaderSchema = z.object({
  notice_date: z
    .string()
    .regex(/^\d{8}$/, "通知日はYYYYMMDD形式である必要があります"),
  notify_inf: PartySchema.extend({
    riyosya_no: z
      .string()
      .regex(/^\d{1,9}$/, "利用者番号は1〜9桁の数字である必要があります"),
  }),
});
export type Header = z.infer<typeof HeaderSchema>;

// 全体の入力データ
export const NoticeInputSchema = z.object({
  header: HeaderSchema,
  data: z.array(NoticeItemSchema).min(1, "最低1件の明細が必要です"),
  encoding: EncodingSchema.default("UTF-8"),
});
export type NoticeInput = z.infer<typeof NoticeInputSchema>;
