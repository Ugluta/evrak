import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { DocumentCategory } from '@prisma/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('kategori') as DocumentCategory | null
  const isAdmin = searchParams.get('admin') === '1'

  const templates = await db.template.findMany({
    where: {
      ...(!isAdmin && { isPublic: true }),
      ...(category && { category }),
    },
    orderBy: { useCount: 'desc' },
  })

  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role || '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const body = await req.json()
  const { title, slug, description, category, content, fields, tags, isPublic, isPremium } = body

  if (!title || !category || !content) {
    return NextResponse.json({ error: 'Başlık, kategori ve içerik zorunlu' }, { status: 400 })
  }

  const finalSlug = slug || title.toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const slugExists = await db.template.findUnique({ where: { slug: finalSlug } })
  const resolvedSlug = slugExists ? `${finalSlug}-${Date.now()}` : finalSlug

  const template = await db.template.create({
    data: {
      title,
      slug: resolvedSlug,
      description: description || null,
      category: category as DocumentCategory,
      content,
      fields: fields || [],
      tags: tags || [],
      isPublic: isPublic !== false,
      isPremium: isPremium || false,
      createdById: session.user.id,
    },
  })

  return NextResponse.json(template, { status: 201 })
}
