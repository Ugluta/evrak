import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as { id: string; role: string }
  if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
    return NextResponse.json({ error: 'Yetersiz yetki' }, { status: 403 })
  }

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Şablon ID gerekli' }, { status: 400 })

  const original = await db.template.findUnique({ where: { id } })
  if (!original) return NextResponse.json({ error: 'Şablon bulunamadı' }, { status: 404 })

  const baseSlug = `kopya-${original.slug}`
  let slug = baseSlug
  let counter = 1
  while (await db.template.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  const copy = await db.template.create({
    data: {
      title: `Kopya — ${original.title}`,
      slug,
      description: original.description,
      category: original.category,
      content: original.content,
      fields: original.fields as object,
      tags: original.tags,
      isPublic: false,
      isPremium: original.isPremium,
      useCount: 0,
      createdById: user.id,
    },
  })

  return NextResponse.json({ id: copy.id })
}
