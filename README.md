# RikuTube for Gas — Backend API

Invidious CORS Proxy API。Vercel Serverless Functions で動作します。

## エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/health` | ヘルスチェック |
| GET | `/api/trending?region=JP&type=default` | トレンド動画一覧 |
| GET | `/api/search?q=検索語&page=1` | 動画検索 |
| GET | `/api/video?id=VIDEO_ID` | 動画メタデータ・関連動画 |

## Vercelへのデプロイ手順

### 1. Vercel CLI をインストール
```bash
npm i -g vercel
```

### 2. このフォルダに移動
```bash
cd rikutube-backend
npm install
```

### 3. デプロイ
```bash
vercel --prod
```
デプロイ後に表示される URL（例: `https://rikutube-api.vercel.app`）をメモしておく。

### 4. フロントエンドの設定
`index.html` の `API_BASE` をデプロイ先 URL に変更する:
```js
const API_BASE = 'https://your-project.vercel.app';
```

## ローカル開発
```bash
vercel dev
# → http://localhost:3000 でAPIが起動
```

## 仕組み
- フロントエンドから直接 Invidious を叩くと CORS エラーになる
- このバックエンドが複数の Invidious インスタンスへ順番にフォールバックしながらリクエストし、結果を返す
- `Access-Control-Allow-Origin: *` ヘッダーを付与することでブラウザからのアクセスを許可
