# 開発環境用ローカル実行スクリプト（Windows PowerShell）

Write-Host "🔧 開発環境を起動します..." -ForegroundColor Green

# 環境変数ファイルの読み込み
if (Test-Path "env.development") {
    Write-Host "📄 開発環境変数を読み込み中..." -ForegroundColor Yellow
    Get-Content "env.development" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1]
            $value = $matches[2] -replace '^"|"$', ''
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "✅ 環境変数が読み込まれました" -ForegroundColor Green
} else {
    Write-Host "❌ env.developmentファイルが見つかりません" -ForegroundColor Red
    exit 1
}

# 開発用スキーマの適用
Write-Host "🗄️ 開発用スキーマを適用中..." -ForegroundColor Yellow
Copy-Item "prisma/schema.development.prisma" "prisma/schema.prisma" -Force

# Prismaクライアントの再生成
Write-Host "🔧 Prismaクライアントを再生成中..." -ForegroundColor Yellow
npx prisma generate

# データベースの同期（SQLite）
Write-Host "🗄️ データベースを同期中..." -ForegroundColor Yellow
npx prisma db push

# 開発サーバーの起動
Write-Host "🚀 開発サーバーを起動中..." -ForegroundColor Green
npm run dev 