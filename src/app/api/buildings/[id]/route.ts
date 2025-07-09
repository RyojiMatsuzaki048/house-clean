import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 建物の個別取得
export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const id = parseInt(params.id)

    const building = await prisma.building.findUnique({
      where: { id: id },
      include: {
        places: {
          include: {
            tasks: true
          }
        }
      }
    })

    if (!building) {
      return NextResponse.json(
        { error: '建物が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(building)
  } catch (error) {
    console.error('建物取得エラー:', error)
    return NextResponse.json(
      { error: '建物の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 建物の削除（論理削除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const id = parseInt(params.id)

    // 建物の存在確認
    const existingBuilding = await prisma.building.findUnique({
      where: { id: id },
      include: {
        places: {
          include: {
            tasks: true
          }
        }
      }
    })

    if (!existingBuilding) {
      return NextResponse.json(
        { error: '建物が見つかりません' },
        { status: 404 }
      )
    }

    // 建物に関連するタスクがあるかチェック
    const hasTasks = existingBuilding.places.some(place => place.tasks.length > 0)
    if (hasTasks) {
      return NextResponse.json(
        { error: 'この建物にはタスクが登録されているため削除できません。先にタスクを削除してください。' },
        { status: 400 }
      )
    }

    // 建物と関連する掃除場所を削除
    await prisma.place.deleteMany({
      where: { buildingId: id }
    })

    await prisma.building.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: '建物を削除しました' })
  } catch (error) {
    console.error('建物削除エラー:', error)
    return NextResponse.json(
      { error: '建物の削除に失敗しました' },
      { status: 500 }
    )
  }
} 