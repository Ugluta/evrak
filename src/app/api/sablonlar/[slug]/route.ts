import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

const EDITOR_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN']

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  const isEditor = session?.user?.role && EDITOR_ROLES.includes(session.user.role as string)

  const template = await db.template.findFirst({
    where: {
      OR: [{ id: slug }, { slug }],
      ...(isEditor ? {} : { isPublic: true }),
    },
    include: { createdBy: { select: { name: true } } },
  })
  if (!template) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(template)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session?.user || !EDITOR_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { slug } = await params
  const body = await req.json()
  try {
    const template = await db.template.update({
      where: { id: slug },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description ?? null,
        category: body.category,
        content: body.content,
        fields: body.fields ?? [],
        tags: body.tags ?? [],
        isPublic: body.isPublic,
        isPremium: body.isPremium,
      },
    })
    return NextResponse.json(template)
  } catch {
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session?.user || !ADMIN_ROLES.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { slug } = await params
  try {
    await db.template.delete({ where: { id: slug } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 })
  }
}
