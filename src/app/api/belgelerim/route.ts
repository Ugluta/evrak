import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { auth } from '@/lib/auth'
import type { DocumentCategory } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, templateId, category, content, fieldValues, isAiAssisted } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
    }

    const session = await auth()
    let authorId = 'system'
    if (session?.user?.id) {
      const user = await db.user.findUnique({ where: { id: session.user.id } })
      if (user) authorId = user.id
    } else {
      const systemUser = await db.user.findFirst({ where: { email: 'system@ogretmenevrak.com' } })
      if (!systemUser) {
        const created = await db.user.create({
          data: {
            name: 'Sistem',
            email: 'system@ogretmenevrak.com',
            role: 'MEMBER',
          },
        })
        authorId = created.id
      } else {
        authorId = systemUser.id
      }
    }

    const baseSlug = slugify(title)
    const existing = await db.document.count({ where: { slug: { startsWith: baseSlug } } })
    const slug = existing ? `${baseSlug}-${existing + 1}` : baseSlug

    const doc = await db.document.create({
      data: {
        title,
        slug,
        category: category as DocumentCategory,
        content,
        fieldValues: fieldValues ?? {},
        templateId: templateId ?? null,
        authorId,
        isAiAssisted: isAiAssisted || false,
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

  const session = await auth()
  const where = session?.user?.id
    ? { authorId: session.user.id }
    : {}

  const [docs, total] = await Promise.all([
    db.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { template: { select: { title: true } } },
    }),
    db.document.count({ where }),
  ])

  return NextResponse.json({ docs, total, page, perPage })
}
