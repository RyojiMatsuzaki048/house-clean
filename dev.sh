#!/bin/bash

# 開発環境用ローカル実行スクリプト

echo "🔧 開発環境を起動します..."

# 環境変数ファイルの読み込み
if [ -f "env.development" ]; then
    echo "📄 開発環境変数を読み込み中..."
    export $(cat env.development | grep -v '^#' | xargs)
    echo "✅ 環境変数が読み込まれました"
else
    echo "❌ env.developmentファイルが見つかりません"
    exit 1
fi

# 開発用スキーマの適用
echo "🗄️ 開発用スキーマを適用中..."
cp prisma/schema.development.prisma prisma/schema.prisma

# Prismaクライアントの再生成
echo "🔧 Prismaクライアントを再生成中..."
npx prisma generate

# データベースの同期（SQLite）
echo "🗄️ データベースを同期中..."
npx prisma db push

# 開発サーバーの起動
echo "🚀 開発サーバーを起動中..."
npm run dev 