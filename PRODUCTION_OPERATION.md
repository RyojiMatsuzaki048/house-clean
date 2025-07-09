# 本番環境運用手順書

## 環境情報

### サーバー情報
- **サーバー**: Ubuntu (AWS EC2)
- **IPアドレス**: [本番サーバーのIPアドレス]
- **アプリケーションポート**: 3000
- **データベース**: PostgreSQL 15

### 環境変数
```bash
export POSTGRES_PASSWORD=pass  # 本番用はセキュアなパスワードに変更
export POSTGRES_DB=house_clean
export POSTGRES_USER=postgres
export NODE_ENV=production
```

## デプロイ手順

### 1. コード更新時
```bash
# 最新コードを取得
git pull

# 環境変数を設定
export POSTGRES_PASSWORD=pass
export POSTGRES_DB=house_clean
export POSTGRES_USER=postgres
export NODE_ENV=production

# デプロイ実行
./deploy.sh production
```

### 2. 強制再ビルドが必要な場合
```bash
# コンテナとボリュームを削除
docker-compose -f docker-compose.production.yml down -v

# 環境変数を設定
export POSTGRES_PASSWORD=pass
export POSTGRES_DB=house_clean
export POSTGRES_USER=postgres
export NODE_ENV=production

# 強制再ビルド
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

### 3. マイグレーション実行
```bash
docker-compose -f docker-compose.production.yml exec -e DATABASE_URL="postgresql://postgres:pass@postgres:5432/house_clean" app npx prisma migrate deploy
```

## 運用コマンド

### コンテナ管理
```bash
# 状態確認
docker-compose -f docker-compose.production.yml ps

# ログ確認
docker-compose -f docker-compose.production.yml logs -f app

# 停止
docker-compose -f docker-compose.production.yml down

# 再起動
docker-compose -f docker-compose.production.yml restart
```

### データベース管理
```bash
# PostgreSQLに直接接続
docker-compose -f docker-compose.production.yml exec postgres psql -U postgres -d house_clean

# テーブル一覧確認
docker-compose -f docker-compose.production.yml exec postgres psql -U postgres -d house_clean -c "\dt"

# バックアップ
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U postgres house_clean > backup_$(date +%Y%m%d_%H%M%S).sql
```

## トラブルシューティング

### 1. アプリケーションが起動しない
```bash
# ログを確認
docker-compose -f docker-compose.production.yml logs app

# コンテナを再起動
docker-compose -f docker-compose.production.yml restart app
```

### 2. データベース接続エラー
```bash
# PostgreSQLの状態確認
docker-compose -f docker-compose.production.yml logs postgres

# 環境変数を再設定して再起動
export POSTGRES_PASSWORD=pass
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

### 3. マイグレーションエラー
```bash
# マイグレーション状態確認
docker-compose -f docker-compose.production.yml exec app npx prisma migrate status

# 強制リセット（データが消えるので注意）
docker-compose -f docker-compose.production.yml down -v
docker-compose -f docker-compose.production.yml up -d
```

## セキュリティ注意事項

1. **パスワード管理**
   - 本番用パスワードはセキュアなものに変更
   - パスワードは安全に管理し、gitにはコミットしない

2. **ファイアウォール設定**
   - 必要最小限のポートのみ開放
   - セキュリティグループの設定を定期的に確認

3. **バックアップ**
   - 定期的なデータベースバックアップ
   - 設定ファイルのバックアップ

## 監視項目

- アプリケーションの応答性
- データベースの接続状態
- ディスク使用量
- メモリ使用量
- ログエラー 