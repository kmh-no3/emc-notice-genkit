# emc-notice-genkit UI更新 指南書（Cursor向け）
目的：現在の `emc-notice-genkit` プロジェクトを **No.1レイアウト（左：入力 / 右：stickyライブXML）** に更新し、直感的に使えるUIへリファクタする。

---

## 0. 前提
- Next.js（App Router想定）
- **shadcn/ui** 導入済み
- 既存のXML生成ロジックがある場合は **置き換え or 差し替え** でOK
- import エイリアス：`@/` が使える前提  
  - 使えない場合は `tsconfig.json` の `paths` または相対パスへ調整する

---

## 1. ゴール（完了条件）
- 画面が **2カラム**になっている  
  - 左：ヘッダ/通知先/明細（一覧→編集）
  - 右：**バリデーションサマリ + XMLプレビュー + Copy/Download/Reset**
- 明細は「縦に全部並べる」のではなく  
  **明細一覧（Table）→ 選択した明細のみ編集（Tabs）**
- 右ペインがPC表示で **sticky** になっている

---

## 2. 依存関係の追加
以下をプロジェクトルートで実行：

```bash
npm i zod zustand xmlbuilder2 nanoid
```

### toast/通知（任意）
`PreviewPane` で `sonner` の toast を使う場合：

```bash
npm i sonner
```

> `sonner` を使わない場合は、`PreviewPane.tsx` の `toast` 呼び出しを `alert()` に置換してOK。

---

## 3. ファイル追加/置換（推奨の最短ルート）
Cursorに **「下記ファイルを作成/上書き」** と依頼して、まとめて反映する。

### 3.1 追加（新規作成）
- `src/lib/densai/schema.ts`
- `src/lib/densai/format.ts`
- `src/lib/densai/validation.ts`
- `src/lib/densai/generate.ts`
- `src/lib/state/useNoticeStore.ts`
- `src/components/emc/HeaderForm.tsx`
- `src/components/emc/NotifyForm.tsx`
- `src/components/emc/ItemsTable.tsx`
- `src/components/emc/ItemEditor.tsx`
- `src/components/emc/PreviewPane.tsx`

### 3.2 置換（上書き）
- `src/app/page.tsx`（または実際のトップページに該当するファイル）

> **ポイント**：既存の画面が `page.tsx` 以外（例：`src/app/(tools)/page.tsx`）なら、同じ構造で差し込む。

---

## 4. shadcn/ui コンポーネント要件
このリファクタで使用するshadcnコンポーネント：

- `card`
- `button`
- `input`
- `select`
- `accordion`
- `tabs`
- `table`
- `scroll-area`
- `badge`
- `separator`

もし未生成なら（例）：

```bash
npx shadcn@latest add card button input select accordion tabs table scroll-area badge separator
```

---

## 5. Cursorへの依頼テンプレ（そのまま貼れる）
以下のように依頼すると安全：

> 目的：UIを2カラムへリファクタしたい。  
> 次のファイルを新規作成/上書きして、ビルドが通るように調整してください。  
> 既存の import alias（@/）が使えない場合は相対パスへ置換。  
> shadcn/ui の不足コンポーネントがあれば追加案内もしてください。

そして、前回提示した **CURSOR_PACKET.md** を貼り付ける。

---

## 6. 既存実装との衝突ポイント（必ず確認）
### 6.1 既存の状態管理
- 既存で React Hook Form / useState が中心の場合：
  - **まずは store（zustand）へ寄せる**のが最短
  - 既存フォームを残したい場合は、入力値を store に同期する方式でもOK

### 6.2 既存のXML生成ロジック
- 既に `generateXml()` があるなら：
  - `src/lib/densai/generate.ts` の `generateNoticeXml()` を **既存ロジックに差し替え**てもOK
- 重要要件：
  - `irainin_ref_no` が空なら `BUKRS + BELNR(10) + GJAHR` を自動生成
  - 任意項目は **未入力ならタグ自体を出さない**（空タグ禁止）

### 6.3 `@/components/ui/*` の実体
- shadcn/ui は `src/components/ui/` 配下が一般的
- もし別配置なら import を合わせる

### 6.4 `sonner` 未導入の場合
- `PreviewPane.tsx` の `toast` を `alert()` に置換
- もしくは `sonner` を導入して `<Toaster />` をレイアウトに設置

---

## 7. UI調整の必須チェック（動作確認）
### 7.1 レイアウト
- PC幅（lg以上）で 2カラムになっている
- 右ペインがスクロールしても固定（sticky）で追従する
- スマホ幅では1カラムに落ちる（`grid-cols-1`）

### 7.2 明細UX
- 「明細追加」で行が増える
- 行クリックで編集対象が切り替わる
- 複製/削除が動作する
- 編集した内容が右のXMLに即反映される

### 7.3 バリデーション
- 日付8桁以外、銀行コード4桁以外などでエラーになる
- 右ペインに「エラー一覧」が出る
- エラークリックで該当セクションへスクロールする（anchor）

### 7.4 XML
- `notice_ACR.ASG.DIV` ルートで出力される
- `sum_num` が明細数に一致し、6桁0埋め
- `sum_amnt` が合計金額に一致し、12桁0埋め
- `koza_no` が出力時に7桁0埋め
- `irainin_ref_no` が未入力なら自動生成される

---

## 8. よくあるエラーと対処
### 8.1 「Module not found: @/components/ui/...」
- shadcn/ui の生成場所が違う可能性  
  - `src/components/ui` にあるか確認
  - ないなら `npx shadcn@latest add ...` を実行

### 8.2 「nanoid not found」
- `npm i nanoid` を実行  
  - もしくは `crypto.randomUUID()` に置換

### 8.3 「xmlbuilder2 の create が型で怒られる」
- `xmlbuilder2` は基本TSで問題ないが、プロジェクトのTS設定によっては型が厳しい場合あり  
  - `skipLibCheck: true` を検討（既存方針に従う）

---

## 9. 次の改善（余力があれば）
- エラーの anchor を `data[i]` まで細かく割り当て（明細#にジャンプ）
- 明細編集をモーダル化（一覧の視認性UP）
- Shift_JIS ダウンロード（仕様要求があれば）

---

## 10. 完了後のコミット推奨
- `feat(ui): adopt 2-column layout with live XML preview`
- `refactor(ui): items table + editor tabs`
- `feat(validation): zod-based validation and error anchors`

---

以上。  
この指南書をベースに、Cursorへ **CURSOR_PACKET.md** を投入して更新してください。
