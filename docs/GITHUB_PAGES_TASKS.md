# GitHub Pages で表示するためのタスク

このリポジトリを **GitHub Pages** で公開する手順です。**方法A（推奨）** はプッシュで自動ビルド・デプロイ、**方法B** は手動で `npm run deploy` を実行します。

---

## 前提

- リポジトリ: `kmh-no3/emc-notice-genkit`
- 公開URL: **https://kmh-no3.github.io/emc-notice-genkit/**

---

## 方法A: プッシュで自動ビルド・デプロイ（推奨）

| # | タスク | 詳細 |
|---|--------|------|
| A.1 | リポジトリの **Settings** → **Pages** を開く | **Code and automation** → **Pages** |
| A.2 | **Build and deployment** を設定 | **Source**: **GitHub Actions** を選択 |
| A.3 | `main` へプッシュ | ワークフローがテスト・ビルド・デプロイし、数分後にサイトに反映される |

※ `.github/workflows/deploy.yml` が存在する必要があります（プッシュ時に自動で実行されます）。

---

## 方法B: 手動デプロイ（Deploy from a branch）

### 1. GitHub の設定（初回のみ）

| # | タスク | 詳細 |
|---|--------|------|
| B.1 | リポジトリの **Settings** を開く | GitHub のリポジトリページ → **Settings** |
| B.2 | **Pages** を開く | 左メニュー **Code and automation** → **Pages** |
| B.3 | **Build and deployment** を設定 | **Source**: **Deploy from a branch** を選択 |
| B.4 | ブランチとフォルダを指定 | **Branch**: `gh-pages`、**Folder**: `/ (root)` → **Save** |

※ 初回は `gh-pages` ブランチがまだないため、次の「初回デプロイ」のあとで表示されます。

---

### 2. 初回デプロイ（ローカルで実行・方法B のみ）

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

### 3. 以降の更新デプロイ（方法B のみ）

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
| **プッシュしてもビルドが動かない** | **Settings** → **Pages** で **Source** を **GitHub Actions** に設定する。Source が「Deploy from a branch」のままだとワークフローは動くがデプロイ先が別になる。GitHub Actions にするとプッシュ時にワークフローが実行され、ビルド・デプロイされる。 |
| `gh-pages` ブランチがない（方法B） | 先に **タスク 2** を実行する。`npm run deploy` で自動作成される。 |
| Settings で Branch に `gh-pages` が出ない | 一度 `npm run deploy` を実行してから、Settings で `gh-pages` を選び直す。 |
| 404 や真っ白なページ | **Folder** が `/ (root)` か確認。**Branch** が `gh-pages` か確認。方法A の場合は Source が **GitHub Actions** か確認。 |
| ビルドエラー | `npm install` をやり直し、`npm run build` が通るか確認。 |

---

## まとめ（チェックリスト）

**方法A（プッシュで自動）**
- [ ] Settings → Pages で **Source**: **GitHub Actions**
- [ ] `main` へプッシュ
- [ ] 数分後に https://kmh-no3.github.io/emc-notice-genkit/ で表示確認

**方法B（手動）**
- [ ] Settings → Pages で **Source**: Deploy from a branch、**Branch**: `gh-pages`、**Folder**: `/ (root)` で保存
- [ ] ローカルで `npm install` → `npm run deploy`
- [ ] 数分後に https://kmh-no3.github.io/emc-notice-genkit/ で表示確認
