import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: ダッシュボード用の統計情報を取得
export async function GET() {
  try {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    // 今日やるべきタスク（サイクルに基づいてフィルタリング）
    const allTasks = await prisma.task.findMany({
      include: {
        place: {
          include: {
            building: true
          }
        },
        assignments: {
          include: {
            user: true
          }
        },
        taskLogs: {
          orderBy: {
            dateDone: 'desc'
          },
          take: 1
        }
      }
    })

    // サイクルに基づいて今日やるべきタスクをフィルタリング
    const todayTasks = allTasks.filter(task => {
      const lastTaskLog = task.taskLogs[0]
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (!lastTaskLog) {
        // 一度も実行されていないタスクは今日やるべき
        return true
      }

      const lastDoneDate = new Date(lastTaskLog.dateDone)
      lastDoneDate.setHours(0, 0, 0, 0)

      // 今日の日付 > 前回タスク実施日 + サイクルの日数 の場合、今日やるべき
      const nextDueDate = new Date(lastDoneDate)
      nextDueDate.setDate(lastDoneDate.getDate() + task.cycleDays)

      return today >= nextDueDate
    })

    // 今週の実施状況
    const weeklyTaskLogs = await prisma.taskLog.findMany({
      where: {
        dateDone: {
          gte: startOfWeek
        }
      },
      include: {
        task: {
          include: {
            place: {
              include: {
                building: true
              }
            }
          }
        },
        user: true
      }
    })

    // ユーザーごとのポイントランキング
    const usersWithPoints = await prisma.user.findMany({
      include: {
        taskLogs: {
          include: {
            task: true
          }
        },
        pointUsages: true
      }
    })

    const userRankings = usersWithPoints.map(user => {
      const earnedPoints = user.taskLogs.reduce((sum, log) => sum + log.task.point, 0)
      const usedPoints = user.pointUsages.reduce((sum, usage) => sum + usage.pointsUsed, 0)
      const remainingPoints = earnedPoints - usedPoints

      return {
        id: user.id,
        name: user.name,
        earnedPoints,
        usedPoints,
        remainingPoints,
        taskCount: user.taskLogs.length
      }
    }).sort((a, b) => b.remainingPoints - a.remainingPoints)

    // ポイント使用履歴（最新10件）
    const recentPointUsages = await prisma.pointUsage.findMany({
      include: {
        user: true
      },
      orderBy: {
        usedAt: 'desc'
      },
      take: 10
    })

    return NextResponse.json({
      todayTasks,
      weeklyTaskLogs,
      userRankings,
      recentPointUsages
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'ダッシュボード情報の取得に失敗しました' },
      { status: 500 }
    )
  }
} 