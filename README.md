# MOSS AND CREAM

メニューからドリンクを選び、スクロール量に合わせて一杯が完成していく過程を体験できる、架空のスペシャルティコーヒースタンド向けWebサイトです。

**公開Web:** https://suzu-0501.github.io/moss-and-cream-web-test/

## 主な機能

- 店舗外観とおすすめドリンクを中心にしたメニュートップ
- 「ピスタチオ・ティラミス・アイスラテ」詳細画面への導線
- スクロール位置と動画の再生位置を同期するスクラブアニメーション
- 完成後に横から現れるサイズ・ミルクのカスタマイズUI
- 動画読込中の完成ドリンク画像表示
- スマートフォン縦画面を優先したレスポンシブ設計
- `prefers-reduced-motion` に配慮したアクセシビリティ対応

## ページ構成

- `/` — 店舗トップ・おすすめ・全メニュー・店舗案内
- `/menu/pistachio-tiramisu-latte` — ドリンク制作過程とカスタマイズ体験

## ディレクトリ構成

```text
.
├── .github/workflows/
│   ├── ci.yml                        # lint・buildの自動確認
│   └── pages.yml                     # GitHub Pagesへの自動公開
├── .openai/hosting.json              # Sites公開設定
├── app/
│   ├── globals.css                   # 全体デザイン・レスポンシブ・演出
│   ├── layout.tsx                    # 共通レイアウト・メタデータ
│   ├── page.tsx                      # 店舗トップ／メニュー
│   └── menu/pistachio-tiramisu-latte/
│       └── page.tsx                  # スクロール連動ドリンク体験
├── docs/requirements.md              # 実装要件・受入条件
├── github-pages/                     # GitHub Pages用エントリー
├── public/
│   ├── assets/                       # 動画・完成画像・店舗／素材画像
│   ├── favicon.svg
│   └── og.png
├── package.json
└── tsconfig.json
```

## ローカル起動

Node.js 22.13以上が必要です。

```bash
npm ci
npm run dev
```

表示されたローカルURLをブラウザで開いてください。

## 品質確認

```bash
npm run lint
npm run build
npm run build:pages
```

## 技術構成

- React 19
- TypeScript
- vinext / Vite
- Cloudflare Workers
- Lucide React

## 注意事項

このサイトは営業提案用のサンプルです。店舗名、所在地、価格、営業時間などはデモ用の内容です。画像・動画素材を別案件へ転用する場合は、各素材の利用条件を確認してください。
