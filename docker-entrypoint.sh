#!/bin/sh

# 環境に応じてスキーマファイルを切り替え
if [ "$NODE_ENV" = "production" ]; then
    echo "本番環境用スキーマを適用: prisma/schema.production.prisma → prisma/schema.prisma"
    cp prisma/schema.production.prisma prisma/schema.prisma
else
    echo "開発環境用スキーマを適用: prisma/schema.development.prisma → prisma/schema.prisma"
    cp prisma/schema.development.prisma prisma/schema.prisma
fi

# Prismaクライアントを再生成
echo "Prismaクライアントを生成中..."
npx prisma generate

# 元のコマンドを実行
exec "$@" 