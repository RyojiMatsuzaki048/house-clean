# 🏠 家の掃除管理アプリ

Next.js（App Router）＋Prisma＋SQLiteで構築された家の掃除管理アプリケーションです。掃除箇所ごとの担当者を割り当て、実施状況・ポイントを可視化できます。

## ✨ 主な機能

- **建物・掃除場所管理**: 複数の建物と掃除場所を登録・管理
- **タスク管理**: 掃除タスクの作成・編集・削除
- **担当者割り当て**: タスクに複数の担当者を割り当て可能
- **実施記録**: 掃除完了の記録とポイント獲得
- **ポイントシステム**: 掃除実施によるポイント獲得・使用履歴管理
- **ダッシュボード**: 今日のタスク、実施率、ユーザーランキングの表示
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 🚀 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **スタイリング**: Tailwind CSS, shadcn/ui
- **データベース**: SQLite (Prisma ORM)
- **開発環境**: Node.js

## 📋 前提条件

- Node.js 18.0.0以上
- npm または yarn

## 🛠️ セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/house-clean.git
cd house-clean
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

`.env`ファイルを作成し、以下の内容を追加：

```env
DATABASE_URL="file:./dev.db"
```

### 4. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースマイグレーション
npx prisma db push
```

### 5. 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   │   ├── buildings/     # 建物管理API
│   │   ├── places/        # 掃除場所管理API
│   │   ├── tasks/         # タスク管理API
│   │   ├── users/         # ユーザー管理API
│   │   └── dashboard/     # ダッシュボードAPI
│   ├── buildings/         # 建物管理画面
│   ├── users/             # ユーザー管理画面
│   ├── tasks/             # タスク一覧画面
│   ├── dashboard/         # ダッシュボード
│   └── admin/             # 登録画面
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   └── *.tsx             # カスタムコンポーネント
├── lib/                  # ユーティリティ
│   └── prisma.ts         # Prismaクライアント
└── styles/               # スタイルファイル

prisma/
└── schema.prisma         # データベーススキーマ
```

## 🗄️ データベーススキーマ

### 主要エンティティ

- **Building**: 建物（自宅、会社など）
- **Place**: 掃除場所（リビング、キッチンなど）
- **Task**: 掃除タスク（床掃除、食器洗いなど）
- **User**: ユーザー（家族メンバーなど）
- **Assignment**: タスクとユーザーの関連
- **TaskLog**: タスク実施履歴
- **PointUsage**: ポイント使用履歴

## 🎯 使用方法

### 1. 初期設定

1. ホーム画面から「登録画面」をクリック
2. 建物、ユーザー、掃除場所、タスクを順番に登録
3. タスクに担当者を割り当て

### 2. 日常的な使用

1. **ダッシュボード**で今日やるべきタスクを確認
2. 掃除完了時に「タスク完了」ボタンで記録
3. 獲得したポイントは「ポイント使用」で管理

### 3. 管理機能

- **建物管理**: 建物の追加・削除
- **ユーザー管理**: ユーザーの追加・削除
- **タスク一覧**: タスクの編集・削除・担当者変更

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Prisma関連
npx prisma studio          # データベースGUI
npx prisma generate        # クライアント生成
npx prisma db push         # スキーマ適用
npx prisma migrate dev     # マイグレーション作成・適用
```

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Prisma](https://www.prisma.io/) - データベースORM
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネントライブラリ

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/house-clean/issues)でお知らせください。
