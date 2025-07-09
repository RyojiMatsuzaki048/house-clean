import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: すべてのタスクを取得（完了記録用）
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: null // 論理削除されていないタスクのみ
      },
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
        }
      },
      orderBy: [
        {
          place: {
            building: {
              name: 'asc'
            }
          }
        },
        {
          place: {
            name: 'asc'
          }
        },
        {
          name: 'asc'
        }
      ]
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    )
  }
} 