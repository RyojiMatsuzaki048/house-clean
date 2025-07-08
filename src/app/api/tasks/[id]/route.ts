import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// タスクの取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const task = await prisma.task.findFirst({
      where: {
        id: id,
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
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('タスク取得エラー:', error)
    return NextResponse.json(
      { error: 'タスクの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// タスクの更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    
    const { name, point, cycleDays, placeId } = body

    // バリデーション
    if (!name || !point || !cycleDays || !placeId) {
      return NextResponse.json(
        { error: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // タスクの存在確認
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        deletedAt: null
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      )
    }

    // タスクを更新
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: {
        name,
        point: parseInt(point),
        cycleDays: parseInt(cycleDays),
        placeId: parseInt(placeId)
      },
      include: {
        place: {
          include: {
            building: true
          }
        }
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('タスク更新エラー:', error)
    return NextResponse.json(
      { error: 'タスクの更新に失敗しました' },
      { status: 500 }
    )
  }
}

// タスクの論理削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // タスクの存在確認
    const existingTask = await prisma.task.findFirst({
      where: {
        id: id,
        deletedAt: null
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      )
    }

    // 論理削除（deletedAtを現在時刻に設定）
    await prisma.task.update({
      where: { id: id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({ message: 'タスクを削除しました' })
  } catch (error) {
    console.error('タスク削除エラー:', error)
    return NextResponse.json(
      { error: 'タスクの削除に失敗しました' },
      { status: 500 }
    )
  }
} 