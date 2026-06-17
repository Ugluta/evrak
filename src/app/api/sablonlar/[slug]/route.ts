import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = await db.template.findUnique({
    where: { slug, isPublic: true },
    include: { createdBy: { select: { name: true } } },
  })
  if (!template) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })
  return NextResponse.json(template)
}
