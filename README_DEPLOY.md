# 🌐 FACT MATRIX - ご友人への公開・共有ガイド（無料・1分で完了）

本ダッシュボードは **PWA（Progressive Web App）** に対応しており、Web上に公開したURLをご友人に共有するだけで、**iPhone / Android / PC に審査不要でアプリとしてインストール**してもらえます。

以下の3つのいずれかの方法（すべて**完全無料**）で即座に公開できます。

---

## 🚀 方法1: Vercel による1クリック公開（最も簡単・推奨）

1. **[Vercel](https://vercel.com/)** に無料登録（GitHubまたはメールアドレスでログイン）。
2. ダッシュボードの **「Add New...」 ➔ 「Project」** を選択。
3. 本プロジェクトフォルダ（`fact-dashboard`）をドラッグ＆ドロップ（またはGitHub経由でインポート）。
4. **「Deploy」** をクリック。
5. **完了！** 発行されたURL（例: `https://fact-matrix-nakade.vercel.app`）をご友人にLINEやメールで共有してください。

---

## 🚀 方法2: GitHub Pages による無料公開

1. GitHubで新規リポジトリ（例: `fact-matrix`）を作成。
2. 本フォルダ（`/home/masakinakade/.gemini/antigravity-ide/scratch/fact-dashboard`）の全ファイルをリポジトリにPush。
   ```bash
   git init
   git add .
   git commit -m "Initial commit of FACT MATRIX PWA"
   git branch -M main
   git remote add origin https://github.com/<あなたのユーザー名>/fact-matrix.git
   git push -u origin main
   ```
3. GitHubリポジトリの **Settings ➔ Pages** を開き、Branchを `main` / `root` に設定して保存。
4. **完了！** `https://<あなたのユーザー名>.github.io/fact-matrix/` で世界中に公開されます。

---

## 🚀 方法3: Cloudflare Pages による高速公開

1. **[Cloudflare Dashboard](https://dash.cloudflare.com/)** にログイン。
2. **Workers & Pages ➔ Create application ➔ Pages ➔ Upload assets** を選択。
3. `fact-dashboard` フォルダをそのままドラッグ＆ドロップしてデプロイ。
4. **完了！** `https://fact-matrix.pages.dev` が即座に稼働します。

---

## 📱 ご友人がアプリとしてスマホに入れる手順（共有時の案内）

ご友人にURLを送る際、以下の3行を添えてあげるとスムーズにアプリ化できます：

### 🍎 iPhone / iPad の場合
1. Safariで送られてきたURLを開く。
2. 画面下の **「共有アイコン（四角から上矢印）」** をタップ。
3. **「ホーム画面に追加」** をタップ ➔ アプリとしてホーム画面に追加完了！

### 🤖 Android / PC の場合
1. ChromeでURLを開く。
2. 右上のメニュー（縦3点）から **「アプリをインストール」** または画面上の「アプリ追加」ボタンをタップ ➔ インストール完了！
