'use client'

import { useState, useEffect } from 'react'
import { DashboardStats } from '@/components/DashboardStats'
import { TodayTasks } from '@/components/TodayTasks'
import { UserRanking } from '@/components/UserRanking'
import { PointUsageHistory } from '@/components/PointUsageHistory'
import { PointUsageForm } from '@/components/PointUsageForm'
import { TaskCompletionForm } from '@/components/TaskCompletionForm'
import { TaskCompletionHistory } from '@/components/TaskCompletionHistory'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface DashboardData {
  todayTasks: any[]
  weeklyTaskLogs: any[]
  userRankings: any[]
  recentPointUsages: any[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    todayTasks: [],
    weeklyTaskLogs: [],
    userRankings: [],
    recentPointUsages: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [showPointForm, setShowPointForm] = useState(false)
  const [showTaskCompletionForm, setShowTaskCompletionForm] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      } else {
        console.error('ダッシュボードデータの取得に失敗しました')
      }
    } catch (error) {
      console.error('ダッシュボードデータの取得に失敗しました:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskComplete = () => {
    fetchDashboardData()
  }

  const handlePointUsageSuccess = () => {
    fetchDashboardData()
    setShowPointForm(false)
  }

  const handleTaskCompletionSuccess = () => {
    fetchDashboardData()
    setShowTaskCompletionForm(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p>データを読み込み中...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <CardTitle className="text-xl lg:text-2xl">📊 ダッシュボード</CardTitle>
                  <CardDescription>
                    今日の掃除状況とポイントランキング
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href="/admin">
                    <Button variant="outline" className="w-full sm:w-auto">
                      登録画面
                    </Button>
                  </Link>
                  <Link href="/tasks">
                    <Button variant="outline" className="w-full sm:w-auto">
                      タスク一覧
                    </Button>
                  </Link>
                  <Link href="/buildings">
                    <Button variant="outline" className="w-full sm:w-auto">
                      建物管理
                    </Button>
                  </Link>
                  <Link href="/users">
                    <Button variant="outline" className="w-full sm:w-auto">
                      ユーザー管理
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => setShowTaskCompletionForm(!showTaskCompletionForm)}
                    variant={showTaskCompletionForm ? "destructive" : "default"}
                    className="w-full sm:w-auto"
                  >
                    {showTaskCompletionForm ? '閉じる' : 'タスク完了'}
                  </Button>
                  <Button 
                    onClick={() => setShowPointForm(!showPointForm)}
                    variant={showPointForm ? "destructive" : "default"}
                    className="w-full sm:w-auto"
                  >
                    {showPointForm ? '閉じる' : 'ポイント使用'}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* タスク完了記録フォーム */}
          {showTaskCompletionForm && (
            <div className="mb-8 flex justify-center">
              <TaskCompletionForm onSuccess={handleTaskCompletionSuccess} />
            </div>
          )}

          {/* ポイント使用フォーム */}
          {showPointForm && (
            <div className="mb-8 flex justify-center">
              <PointUsageForm onSuccess={handlePointUsageSuccess} />
            </div>
          )}

          {/* 統計情報 */}
          <div className="mb-8">
            <DashboardStats 
              todayTasks={data.todayTasks}
              weeklyTaskLogs={data.weeklyTaskLogs}
              userRankings={data.userRankings}
              recentPointUsages={data.recentPointUsages}
            />
          </div>

          {/* メインコンテンツ */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* 今日のタスク */}
            <div>
              <TodayTasks 
                tasks={data.todayTasks} 
                onTaskComplete={handleTaskComplete}
              />
            </div>

            {/* ユーザーランキング */}
            <div>
              <UserRanking rankings={data.userRankings} />
            </div>
          </div>

          {/* 履歴セクション */}
          <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* タスク完了履歴 */}
            <div>
              <TaskCompletionHistory taskLogs={data.weeklyTaskLogs} />
            </div>
            {/* ポイント使用履歴 */}
            <div>
              <PointUsageHistory pointUsages={data.recentPointUsages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 