import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// タスクの担当者割り当て一覧を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id)

    const assignments = await prisma.assignment.findMany({
      where: { taskId: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('担当者割り当て取得エラー:', error)
    return NextResponse.json(
      { error: '担当者割り当ての取得に失敗しました' },
      { status: 500 }
    )
  }
}

// タスクに担当者を追加
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id)
    const { userId } = await request.json()

    // タスクの存在確認
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      )
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 既に割り当てられているかチェック
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        taskId: taskId,
        userId: userId
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'このユーザーは既に担当者として割り当てられています' },
        { status: 400 }
      )
    }

    // 担当者を追加
    const assignment = await prisma.assignment.create({
      data: {
        taskId: taskId,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('担当者追加エラー:', error)
    return NextResponse.json(
      { error: '担当者の追加に失敗しました' },
      { status: 500 }
    )
  }
} 