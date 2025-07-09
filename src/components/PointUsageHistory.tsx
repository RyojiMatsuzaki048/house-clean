'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PointUsage {
  id: number
  pointsUsed: number
  description: string
  usedAt: string
  user: {
    id: number
    name: string
  }
}

interface PointUsageHistoryProps {
  pointUsages: PointUsage[]
}

export function PointUsageHistory({ pointUsages }: PointUsageHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ポイント使用履歴</CardTitle>
        <CardDescription>
          最新のポイント使用履歴（最新10件）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pointUsages.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              ポイント使用履歴がありません
            </p>
          ) : (
            pointUsages.map((usage) => (
              <div key={usage.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{usage.description}</h4>
                  <p className="text-sm text-muted-foreground">
                    {usage.user.name} • {formatDate(usage.usedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">
                    -{usage.pointsUsed}ポイント
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 