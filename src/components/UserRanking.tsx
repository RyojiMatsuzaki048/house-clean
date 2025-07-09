'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UserRanking {
  id: number
  name: string
  earnedPoints: number
  usedPoints: number
  remainingPoints: number
  taskCount: number
}

interface UserRankingProps {
  rankings: UserRanking[]
}

export function UserRanking({ rankings }: UserRankingProps) {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return '🥇'
      case 1:
        return '🥈'
      case 2:
        return '🥉'
      default:
        return `${index + 1}.`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ユーザーランキング</CardTitle>
        <CardDescription>
          獲得ポイント順のランキング
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              ユーザーが登録されていません
            </p>
          ) : (
            rankings.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{getRankIcon(index)}</span>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      実施タスク: {user.taskCount}回
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    💰 {user.remainingPoints}ポイント
                  </div>
                  <div className="text-xs text-muted-foreground">
                    獲得: {user.earnedPoints} / 使用: {user.usedPoints}
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