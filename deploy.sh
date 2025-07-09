#!/bin/bash

# デプロイスクリプト
set -e

echo "�� デプロイを開始します..."

# 環境変数ファイルを明示的に読み込み
if [ -f .env ]; then
    echo "📄 環境変数ファイルを読み込み中..."
    # .envファイルから環境変数を読み込み
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
    echo "✅ 環境変数を読み込みました"
else
    echo "❌ .envファイルが見つかりません"
    exit 1
fi

# 環境変数の確認
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URLが設定されていません"
    echo "現在の環境変数:"
    echo "DATABASE_URL: $DATABASE_URL"
    echo "POSTGRES_DB: $POSTGRES_DB"
    echo "POSTGRES_USER: $POSTGRES_USER"
    exit 1
fi

echo "✅ DATABASE_URLが設定されています: ${DATABASE_URL:0:30}..."

# 最新のコードを取得
echo "�� 最新のコードを取得中..."
git pull origin main

# 古いコンテナとイメージを削除
echo "🧹 古いコンテナとイメージを削除中..."
docker-compose down --rmi all --volumes --remove-orphans

# 新しいイメージをビルド
echo "🔨 Dockerイメージをビルド中..."
docker-compose build --no-cache

# データベースマイグレーション
echo "��️ データベースマイグレーションを実行中..."
docker-compose run --rm app npx prisma migrate deploy

# アプリケーションを起動
echo "🚀 アプリケーションを起動中..."
docker-compose up -d

# ヘルスチェック
echo "�� ヘルスチェック中..."
sleep 10
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ デプロイが完了しました！"
else
    echo "❌ デプロイに失敗しました"
    docker-compose logs app
    exit 1
fi