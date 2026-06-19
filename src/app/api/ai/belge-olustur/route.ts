import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { aiDraftDocument } from '@/lib/ai'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { category, title, context } = await req.json()
  if (!category || !title) return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })

  const text = await aiDraftDocument({ category, title, context })
  return NextResponse.json({ text })
}
