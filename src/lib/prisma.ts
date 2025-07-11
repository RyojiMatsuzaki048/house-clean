import { PrismaClient } from '@prisma/client'
import { logEnvironment } from './env'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 環境情報をログ出力（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  logEnvironment()
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 