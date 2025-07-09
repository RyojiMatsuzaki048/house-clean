'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStatsProps {
  todayTasks: any[]
  weeklyTaskLogs: any[]
  userRankings: any[]
  recentPointUsages: any[]
}

export function DashboardStats({ 
  todayTasks, 
  weeklyTaskLogs, 
  userRankings, 
  recentPointUsages 
}: DashboardStatsProps) {
  const todayCompletedTasks = todayTasks.filter(task => task.taskLogs.length > 0)
  const todayPendingTasks = todayTasks.filter(task => task.taskLogs.length === 0)
  
  const totalEarnedPoints = userRankings.reduce((sum, user) => sum + user.earnedPoints, 0)
  const totalUsedPoints = userRankings.reduce((sum, user) => sum + user.usedPoints, 0)

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">今日のタスク</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{todayTasks.length}</div>
          <p className="text-xs text-muted-foreground">
            完了: {todayCompletedTasks.length} / 未完了: {todayPendingTasks.length}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">今週の実施</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{weeklyTaskLogs.length}</div>
          <p className="text-xs text-muted-foreground">
            タスク実施回数
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総獲得ポイント</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{totalEarnedPoints}</div>
          <p className="text-xs text-muted-foreground">
            使用済み: {totalUsedPoints}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">参加ユーザー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold">{userRankings.length}</div>
          <p className="text-xs text-muted-foreground">
            アクティブユーザー数
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 