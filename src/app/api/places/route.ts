import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 掃除場所一覧を取得
export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: {
        building: true,
        tasks: {
          include: {
            assignments: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
    return NextResponse.json(places)
  } catch (error) {
    return NextResponse.json(
      { error: '掃除場所の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しい掃除場所を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { buildingId, name, description } = body

    if (!buildingId || !name) {
      return NextResponse.json(
        { error: '建物IDと掃除場所名は必須です' },
        { status: 400 }
      )
    }

    // 同じ建物内で同名チェック
    const exists = await prisma.place.findFirst({ where: { buildingId, name } })
    if (exists) {
      return NextResponse.json(
        { error: '同じ建物内に同じ名前の掃除場所が既に存在します' },
        { status: 400 }
      )
    }

    const place = await prisma.place.create({
      data: { buildingId, name, description },
      include: {
        building: true
      }
    })

    return NextResponse.json(place, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '掃除場所の作成に失敗しました' },
      { status: 500 }
    )
  }
} 