import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: タスク一覧を取得
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
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
          include: {
            user: true
          },
          orderBy: {
            dateDone: 'desc'
          }
        }
      }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しいタスクを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { placeId, name, point, cycleDays } = body

    if (!placeId || !name || point === undefined || cycleDays === undefined) {
      return NextResponse.json(
        { error: '掃除場所ID、タスク名、ポイント、サイクル日数は必須です' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: { placeId, name, point, cycleDays },
      include: {
        place: {
          include: {
            building: true
          }
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'タスクの作成に失敗しました' },
      { status: 500 }
    )
  }
} 