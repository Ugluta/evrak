import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { DocumentStatus } from '@prisma/client'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const doc = await db.document.findUnique({
    where: { id },
    include: { template: { select: { title: true, slug: true } } },
  })
  if (!doc) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { title, content, status } = body

  const doc = await db.document.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(status !== undefined && { status: status as DocumentStatus }),
    },
  })
  return NextResponse.json(doc)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await params
  await db.document.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
