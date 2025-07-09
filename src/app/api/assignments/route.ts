import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 担当割り当て一覧を取得
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        user: true,
        task: {
          include: {
            place: {
              include: {
                building: true
              }
            }
          }
        }
      }
    })
    return NextResponse.json(assignments)
  } catch (error) {
    return NextResponse.json(
      { error: '担当割り当ての取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい担当割り当てを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, userId } = body

    if (!taskId || !userId) {
      return NextResponse.json(
        { error: 'タスクIDとユーザーIDは必須です' },
        { status: 400 }
      )
    }

    // 既存の割り当てがあるかチェック
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        taskId,
        userId
      }
    })

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'このタスクは既にこのユーザーに割り当てられています' },
        { status: 400 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: { taskId, userId },
      include: {
        user: true,
        task: {
          include: {
            place: {
              include: {
                building: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '担当割り当ての作成に失敗しました' },
      { status: 500 }
    )
  }
} 