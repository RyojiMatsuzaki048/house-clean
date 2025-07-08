import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 掃除場所の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const id = parseInt(params.id)

    // 掃除場所の存在確認
    const existingPlace = await prisma.place.findUnique({
      where: { id: id },
      include: {
        tasks: true
      }
    })

    if (!existingPlace) {
      return NextResponse.json(
        { error: '掃除場所が見つかりません' },
        { status: 404 }
      )
    }

    // 掃除場所に関連するタスクがあるかチェック
    if (existingPlace.tasks.length > 0) {
      return NextResponse.json(
        { error: 'この掃除場所にはタスクが登録されているため削除できません。先にタスクを削除してください。' },
        { status: 400 }
      )
    }

    // 掃除場所を削除
    await prisma.place.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: '掃除場所を削除しました' })
  } catch (error) {
    console.error('掃除場所削除エラー:', error)
    return NextResponse.json(
      { error: '掃除場所の削除に失敗しました' },
      { status: 500 }
    )
  }
} 