import { db } from './db'

const DAILY_AI_LIMIT = 20

export async function checkAiRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const today = new Date().toISOString().split('T')[0]

  const usage = await db.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, count: 0 },
    update: {},
  })

  const remaining = DAILY_AI_LIMIT - usage.count
  return { allowed: remaining > 0, remaining: Math.max(0, remaining), limit: DAILY_AI_LIMIT }
}

export async function incrementAiUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  await db.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, count: 1 },
    update: { count: { increment: 1 } },
  })
}
