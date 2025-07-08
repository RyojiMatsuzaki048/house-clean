import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ユーザーの個別取得
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const id = parseInt(params.id)

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        assignments: {
          include: {
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
        },
        taskLogs: true,
        pointUsages: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('ユーザー取得エラー:', error)
    return NextResponse.json(
      { error: 'ユーザーの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// ユーザーの削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const id = parseInt(params.id)

    // ユーザーの存在確認と関連データの取得
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        assignments: true,
        taskLogs: true,
        pointUsages: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 関連データがあるかチェック
    if (user.assignments.length > 0) {
      return NextResponse.json(
        { error: 'このユーザーはタスクの担当者として割り当てられているため削除できません。先に担当者割り当てを解除してください。' },
        { status: 400 }
      )
    }

    if (user.taskLogs.length > 0) {
      return NextResponse.json(
        { error: 'このユーザーにはタスク実施履歴があるため削除できません。' },
        { status: 400 }
      )
    }

    if (user.pointUsages.length > 0) {
      return NextResponse.json(
        { error: 'このユーザーにはポイント使用履歴があるため削除できません。' },
        { status: 400 }
      )
    }

    // ユーザーを削除
    await prisma.user.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'ユーザーを削除しました' })
  } catch (error) {
    console.error('ユーザー削除エラー:', error)
    return NextResponse.json(
      { error: 'ユーザーの削除に失敗しました' },
      { status: 500 }
    )
  }
} 