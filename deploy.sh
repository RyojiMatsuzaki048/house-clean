#!/bin/bash

# 開発環境と本番環境を自動切り替えするデプロイスクリプト

echo "🚀 デプロイを開始します..."

# 環境の自動判断
if [ "$1" = "production" ] || [ "$NODE_ENV" = "production" ]; then
    echo "📦 本番環境にデプロイします..."
    ENV="production"
    COMPOSE_FILE="docker-compose.production.yml"
    export NODE_ENV=production
elif [ "$1" = "development" ] || [ "$NODE_ENV" = "development" ] || [ -z "$NODE_ENV" ]; then
    echo "🔧 開発環境にデプロイします..."
    ENV="development"
    COMPOSE_FILE="docker-compose.yml"
    export NODE_ENV=development
else
    echo "❌ 使用方法: $0 [development|production]"
    echo "または環境変数 NODE_ENV=development|production を設定してください"
    echo "例: $0 development  # 開発環境"
    echo "例: $0 production   # 本番環境"
    echo "例: NODE_ENV=production $0  # 環境変数で指定"
    exit 1
fi

echo "🔍 現在の環境: $ENV (NODE_ENV=$NODE_ENV)"

# 本番環境の場合の環境変数チェック
if [ "$ENV" = "production" ]; then
    if [ -z "$POSTGRES_PASSWORD" ]; then
        echo "❌ POSTGRES_PASSWORD環境変数が設定されていません"
        echo "export POSTGRES_PASSWORD=your-secure-password を実行してください"
        exit 1
    fi

    if [ -z "$POSTGRES_DB" ]; then
        export POSTGRES_DB=house_clean
    fi

    if [ -z "$POSTGRES_USER" ]; then
        export POSTGRES_USER=postgres
    fi
fi

# 既存のコンテナを停止
echo "🛑 既存のコンテナを停止中..."
docker-compose down

# 本番環境の場合、PostgreSQLを先に起動
if [ "$ENV" = "production" ]; then
    echo "📦 PostgreSQLを起動中..."
    docker-compose -f $COMPOSE_FILE up -d postgres
    
    echo "⏳ PostgreSQLの起動を待機中..."
    sleep 10
fi

# アプリケーションを起動
echo "🚀 アプリケーションを起動中..."
docker-compose -f $COMPOSE_FILE up -d app

# マイグレーションを実行
echo "🗄️ データベースマイグレーションを実行中..."
if [ "$ENV" = "production" ]; then
    docker-compose -f $COMPOSE_FILE exec app npx prisma migrate deploy
else
    docker-compose -f $COMPOSE_FILE exec app npx prisma db push
fi

echo "✅ $ENV環境へのデプロイが完了しました！"
echo "🌐 アプリケーションは http://localhost:3000 でアクセス可能です" 