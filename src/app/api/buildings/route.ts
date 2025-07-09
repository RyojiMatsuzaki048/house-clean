import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 建物一覧を取得
export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        places: {
          include: {
            tasks: true
          }
        }
      }
    })
    return NextResponse.json(buildings)
  } catch (error) {
    return NextResponse.json(
      { error: '建物の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい建物を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: '建物名は必須です' },
        { status: 400 }
      )
    }

    // 同名チェック
    const exists = await prisma.building.findFirst({ where: { name } })
    if (exists) {
      return NextResponse.json(
        { error: '同じ名前の建物が既に存在します' },
        { status: 400 }
      )
    }

    const building = await prisma.building.create({
      data: { name }
    })

    return NextResponse.json(building, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '建物の作成に失敗しました' },
      { status: 500 }
    )
  }
} 