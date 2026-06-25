import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!['SUPER_ADMIN', 'ADMIN'].includes(role ?? '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params

  // Unlink documents first (set templateId to null)
  await db.document.updateMany({
    where: { templateId: id },
    data: { templateId: null },
  })
  await db.favorite.deleteMany({ where: { templateId: id } })
  await db.template.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
