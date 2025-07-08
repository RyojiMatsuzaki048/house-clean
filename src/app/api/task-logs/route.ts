import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: タスク実施ログ一覧を取得
export async function GET() {
  try {
    const taskLogs = await prisma.taskLog.findMany({
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
      },
      orderBy: {
        dateDone: 'desc'
      }
    })
    return NextResponse.json(taskLogs)
  } catch (error) {
    return NextResponse.json(
      { error: 'タスク実施ログの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しいタスク実施ログを作成（掃除実施記録）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, userId, dateDone } = body

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: 'タスクIDとユーザーIDは必須です' },
        { status: 400 }
      )
    }

    const taskLog = await prisma.taskLog.create({
      data: {
        taskId,
        userId,
        dateDone: dateDone ? new Date(dateDone) : new Date()
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

    return NextResponse.json(taskLog, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'タスク実施ログの作成に失敗しました' },
      { status: 500 }
    )
  }
} 