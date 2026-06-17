import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, templateId, category, content, fieldValues } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
    }

    const baseSlug = slugify(title)
    const existing = await db.document.count({ where: { slug: { startsWith: baseSlug } } })
    const slug = existing ? `${baseSlug}-${existing + 1}` : baseSlug

    const authorId = 'system'

    const doc = await db.document.create({
      data: {
        title,
        slug,
        category,
        content,
        fieldValues: fieldValues ?? {},
        templateId: templateId ?? null,
        authorId,
      },
    })

    if (templateId) {
      await db.template.update({
        where: { id: templateId },
        data: { useCount: { increment: 1 } },
      })
    }

    return NextResponse.json(doc, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('sayfa')) || 1
  const perPage = 20

  const [docs, total] = await Promise.all([
    db.document.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { template: { select: { title: true } } },
    }),
    db.document.count(),
  ])

  return NextResponse.json({ docs, total, page, perPage })
}
