#!/bin/bash

# 本番環境用マイグレーションスクリプト
# PostgreSQL環境でマイグレーションを実行

set -e

echo "🚀 本番環境用マイグレーションを開始します..."

# 環境変数を設定
export DATABASE_URL="postgresql://postgres:pass@localhost:5433/house_clean"
export PRISMA_SCHEMA_FILE="schema.production.prisma"

# Prismaクライアントを生成
echo "📦 Prismaクライアントを生成中..."
npx prisma generate --schema=./prisma/schema.production.prisma

# マイグレーションを実行
echo "🔄 マイグレーションを実行中..."
npx prisma migrate dev --name init --schema=./prisma/schema.production.prisma --create-only
npx prisma migrate deploy --schema=./prisma/schema.production.prisma

echo "✅ マイグレーションが完了しました！"

# データベースの状態を確認
echo "📊 データベースの状態を確認中..."
npx prisma db seed --schema=./prisma/schema.production.prisma || echo "シードデータはありません"

echo "🎉 本番環境のセットアップが完了しました！" 