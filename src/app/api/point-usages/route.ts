import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: ポイント使用履歴一覧を取得
export async function GET() {
  try {
    const pointUsages = await prisma.pointUsage.findMany({
      include: {
        user: true
      },
      orderBy: {
        usedAt: 'desc'
      }
    })
    return NextResponse.json(pointUsages)
  } catch (error) {
    return NextResponse.json(
      { error: 'ポイント使用履歴の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しいポイント使用履歴を作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, pointsUsed, description } = body

    if (!userId || pointsUsed === undefined || !description) {
      return NextResponse.json(
        { error: 'ユーザーID、使用ポイント数、使用用途は必須です' },
        { status: 400 }
      )
    }

    const pointUsage = await prisma.pointUsage.create({
      data: {
        userId,
        pointsUsed,
        description,
        usedAt: new Date()
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(pointUsage, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'ポイント使用履歴の作成に失敗しました' },
      { status: 500 }
    )
  }
} 