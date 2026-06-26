import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      template: {
        select: {
          id: true, title: true, slug: true, category: true,
          description: true, useCount: true, isPremium: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(favorites)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { templateId } = await req.json()
  if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

  const existing = await db.favorite.findUnique({
    where: { userId_templateId: { userId: session.user.id, templateId } },
  })
  if (existing) return NextResponse.json(existing)

  const favorite = await db.favorite.create({
    data: { userId: session.user.id, templateId },
  })
  return NextResponse.json(favorite, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { templateId } = await req.json()
  if (!templateId) return NextResponse.json({ error: 'templateId required' }, { status: 400 })

  await db.favorite.deleteMany({
    where: { userId: session.user.id, templateId },
  })
  return NextResponse.json({ ok: true })
}
