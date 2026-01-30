# GitHub Pages で表示するためのタスク

このリポジトリを **GitHub Pages** で公開する手順です。GitHub Actions は使わず、**Deploy from a branch** と **gh-pages** でデプロイします。

---

## 前提

- リポジトリ: `kmh-no3/emc-notice-genkit`
- 公開URL: **https://kmh-no3.github.io/emc-notice-genkit/**

---

## タスク一覧

### 1. GitHub の設定（初回のみ）

| # | タスク | 詳細 |
|---|--------|------|
| 1.1 | リポジトリの **Settings** を開く | GitHub のリポジトリページ → **Settings** |
| 1.2 | **Pages** を開く | 左メニュー **Code and automation** → **Pages** |
| 1.3 | **Build and deployment** を設定 | **Source**: **Deploy from a branch** を選択 |
| 1.4 | ブランチとフォルダを指定 | **Branch**: `gh-pages`、**Folder**: `/ (root)` → **Save** |

※ 初回は `gh-pages` ブランチがまだないため、次の「初回デプロイ」のあとで表示されます。

---

### 2. 初回デプロイ（ローカルで実行）

| # | タスク | コマンド・補足 |
|---|--------|----------------|
| 2.1 | リポジトリをクローン（未クローンの場合） | `git clone https://github.com/kmh-no3/emc-notice-genkit.git && cd emc-notice-genkit` |
| 2.2 | 依存関係をインストール | `npm install` |
| 2.3 | ビルド＆デプロイ | `npm run deploy` |
| 2.4 | 公開を確認 | 数分後に https://kmh-no3.github.io/emc-notice-genkit/ を開く |

`npm run deploy` は以下を実行します。

- `npm run build` … Next.js の静的エクスポート（`out/` に出力）
- `gh-pages -d out` … `out` の中身を `gh-pages` ブランチのルートにプッシュ

---

### 3. 以降の更新デプロイ

| # | タスク | コマンド・補足 |
|---|--------|----------------|
| 3.1 | コードを変更・コミット | 通常どおり `git add` → `git commit` |
| 3.2 | デプロイ | `npm run deploy` |
| 3.3 | 公開を確認 | 数分後に上記URLで反映を確認 |

※ `main` への `git push` とは別に、**サイトの更新のたびに** `npm run deploy` を実行する必要があります。

---

## トラブルシューティング

| 現象 | 対処 |
|------|------|
| `gh-pages` ブランチがない | 先に **タスク 2** を実行する。`npm run deploy` で自動作成される。 |
| Settings で Branch に `gh-pages` が出ない | 一度 `npm run deploy` を実行してから、Settings で `gh-pages` を選び直す。 |
| 404 や真っ白なページ | **Folder** が `/ (root)` か確認。**Branch** が `gh-pages` か確認。 |
| ビルドエラー | `npm install` をやり直し、`npm run build` が通るか確認。 |

---

## まとめ（チェックリスト）

- [ ] Settings → Pages で **Source**: Deploy from a branch
- [ ] **Branch**: `gh-pages`、**Folder**: `/ (root)` で保存
- [ ] ローカルで `npm install`
- [ ] `npm run deploy` を実行
- [ ] 数分後に https://kmh-no3.github.io/emc-notice-genkit/ で表示確認
