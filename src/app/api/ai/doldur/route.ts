import { auth } from '@/lib/auth'
import { checkAiRateLimit, incrementAiUsage } from '@/lib/rate-limit'
import { generateDocumentContent } from '@/lib/ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { allowed, remaining, limit } = await checkAiRateLimit(session.user.id)
    if (!allowed) {
      return NextResponse.json(
        { error: `Günlük AI kullanım limitine ulaştınız (${limit} istek/gün). Yarın tekrar deneyin.` },
        { status: 429 }
      )
    }

    const { templateContent, fieldValues, title } = await req.json()
    if (!templateContent || !title) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
    }

    await incrementAiUsage(session.user.id)
    const content = await generateDocumentContent({ templateContent, fieldValues: fieldValues ?? {}, title })
    return NextResponse.json({ content, remaining: remaining - 1, limit })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ error: 'AI hatası' }, { status: 500 })
  }
}
