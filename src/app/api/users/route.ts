import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: ユーザー一覧を取得
export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
        taskLogs: {
          include: {
            task: true
          },
          orderBy: {
            dateDone: 'desc'
          }
        },
        pointUsages: {
          orderBy: {
            usedAt: 'desc'
          }
        }
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'ユーザーの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST: 新しいユーザーを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: 'ユーザー名は必須です' },
        { status: 400 }
      )
    }

    // 同名チェック
    const exists = await prisma.user.findFirst({ where: { name } })
    if (exists) {
      return NextResponse.json(
        { error: '同じ名前のユーザーが既に存在します' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: { name }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'ユーザーの作成に失敗しました' },
      { status: 500 }
    )
  }
} 