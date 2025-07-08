import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl mb-4">🏠 家の掃除管理アプリ</CardTitle>
              <CardDescription className="text-lg">
                掃除箇所ごとの担当者を割り当て、実施状況・ポイントを可視化
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg">
                    ダッシュボード
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="outline" size="lg">
                    タスク一覧
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline" size="lg">
                    登録画面
                  </Button>
                </Link>
                <Link href="/buildings">
                  <Button variant="outline" size="lg">
                    建物管理
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="outline" size="lg">
                    ユーザー管理
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 主な機能</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 掃除箇所ごとの担当者割り当て</li>
                  <li>• 実施サイクルの設定（1週間に1回など）</li>
                  <li>• 掃除実施によるポイント獲得</li>
                  <li>• ポイントの使用・履歴管理</li>
                  <li>• 実施率の可視化</li>
                  <li>• ユーザー別ポイントランキング</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 使い方</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li><strong>登録画面</strong>で建物・ユーザー・掃除場所・タスクを登録</li>
                  <li><strong>ダッシュボード</strong>で今日やるべきタスクを確認</li>
                  <li>掃除実施時に<strong>実施記録</strong>を登録</li>
                  <li>獲得したポイントを<strong>使用履歴</strong>で管理</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
