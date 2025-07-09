# 本番環境セットアップガイド

## 概要
このアプリケーションは開発環境ではSQLite、本番環境ではPostgreSQLを使用する構成になっています。

## 環境構成

### 開発環境
- **データベース**: SQLite (`dev.db`)
- **スキーマ**: `prisma/schema.development.prisma`
- **起動方法**: `npm run dev`

### 本番環境
- **データベース**: PostgreSQL
- **スキーマ**: `prisma/schema.production.prisma`
- **起動方法**: `./deploy.sh production`

## セットアップ手順

### 1. 環境変数の設定

```bash
# 本番環境用環境変数
export POSTGRES_PASSWORD=your-secure-password
export POSTGRES_DB=house_clean
export POSTGRES_USER=postgres
export NODE_ENV=production
```

### 2. 本番環境へのデプロイ

```bash
# 本番環境にデプロイ
./deploy.sh production

# または環境変数で指定
NODE_ENV=production ./deploy.sh
```

### 3. 開発環境へのデプロイ

```bash
# 開発環境にデプロイ
./deploy.sh development

# または環境変数で指定
NODE_ENV=development ./deploy.sh
```

## マイグレーション管理

### 開発環境
- `npx prisma db push` を使用
- マイグレーションファイルは作成しない

### 本番環境
- `npx prisma migrate deploy` を使用
- マイグレーションファイルはPostgreSQL環境で作成

### マイグレーション作成手順

1. PostgreSQLコンテナを起動
```bash
docker run --name temp-pg -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=house_clean -p 5433:5432 -d postgres:15-alpine
```

2. 本番環境用スキーマでマイグレーション作成
```bash
export DATABASE_URL="postgresql://postgres:pass@localhost:5433/house_clean"
npx prisma migrate dev --name migration_name --schema=./prisma/schema.production.prisma
```

3. マイグレーションファイルを本番環境に適用
```bash
./deploy.sh production
```

## トラブルシューティング

### PostgreSQL接続エラー
- Dockerコンテナが起動しているか確認
- ポート番号が正しいか確認
- パスワードが正しいか確認

### マイグレーションエラー
- マイグレーションロックファイルの確認
- スキーマファイルの整合性確認
- データベースの状態確認

### SSL証明書エラー
- 自己署名証明書の作成
- nginx設定の確認

## 運用上の注意点

1. **データベースバックアップ**
   - 定期的なPostgreSQLデータベースのバックアップ
   - マイグレーションファイルのバージョン管理

2. **環境切り替え**
   - 開発環境と本番環境のスキーマを明確に分離
   - 環境変数による自動切り替え

3. **セキュリティ**
   - 本番環境のパスワード管理
   - SSL証明書の適切な設定

## ファイル構成

```
prisma/
├── schema.prisma              # 現在使用中のスキーマ（自動切り替え）
├── schema.development.prisma  # 開発環境用（SQLite）
├── schema.production.prisma   # 本番環境用（PostgreSQL）
└── migrations/                # マイグレーションファイル

docker-compose.yml             # 開発環境用
docker-compose.production.yml  # 本番環境用
deploy.sh                      # デプロイスクリプト
``` 