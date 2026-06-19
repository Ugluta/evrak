import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params

  const shareToken = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const doc = await db.document.update({
    where: { id },
    data: { shareToken, expiresAt },
    select: { shareToken: true },
  })

  return NextResponse.json({ shareToken: doc.shareToken, expiresAt })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.document.update({
    where: { id },
    data: { shareToken: null, expiresAt: null },
  })
  return NextResponse.json({ success: true })
}
