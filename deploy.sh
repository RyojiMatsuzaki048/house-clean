#!/bin/bash

# デプロイスクリプト
set -e

echo "🚀 デプロイを開始します..."

# 環境変数の確認
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URLが設定されていません"
    exit 1
fi

# 最新のコードを取得
echo "📥 最新のコードを取得中..."
git pull origin main

# 古いコンテナとイメージを削除
echo "🧹 古いコンテナとイメージを削除中..."
docker-compose down --rmi all --volumes --remove-orphans

# 新しいイメージをビルド
echo "🔨 Dockerイメージをビルド中..."
docker-compose build --no-cache

# データベースマイグレーション
echo "🗄️ データベースマイグレーションを実行中..."
docker-compose run --rm app npx prisma migrate deploy

# アプリケーションを起動
echo "🚀 アプリケーションを起動中..."
docker-compose up -d

# ヘルスチェック
echo "🏥 ヘルスチェック中..."
sleep 10
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ デプロイが完了しました！"
else
    echo "❌ デプロイに失敗しました"
    docker-compose logs app
    exit 1
fi 