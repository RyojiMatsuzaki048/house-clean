import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 特定の担当者割り当てを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const taskId = parseInt(params.id)
    const assignmentId = parseInt(params.assignmentId)

    // 担当者割り当ての存在確認
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        taskId: taskId
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: '担当者割り当てが見つかりません' },
        { status: 404 }
      )
    }

    // 担当者割り当てを削除
    await prisma.assignment.delete({
      where: { id: assignmentId }
    })

    return NextResponse.json({ message: '担当者を削除しました' })
  } catch (error) {
    console.error('担当者削除エラー:', error)
    return NextResponse.json(
      { error: '担当者の削除に失敗しました' },
      { status: 500 }
    )
  }
} 