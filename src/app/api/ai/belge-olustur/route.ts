import { auth } from '@/lib/auth'
import { checkAiRateLimit, incrementAiUsage } from '@/lib/rate-limit'
import { aiDraftDocument } from '@/lib/ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { allowed, remaining, limit } = await checkAiRateLimit(session.user.id)
  if (!allowed) {
    return NextResponse.json(
      { error: `Günlük AI kullanım limitine ulaştınız (${limit} istek/gün). Yarın tekrar deneyin.` },
      { status: 429 }
    )
  }

  const { category, title, context } = await req.json()
  if (!category || !title) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })

  await incrementAiUsage(session.user.id)
  const text = await aiDraftDocument({ category, title, context })
  return NextResponse.json({ text, remaining: remaining - 1, limit })
}
