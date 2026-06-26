import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const actorRole = (session?.user as { role?: string })?.role
  if (!['SUPER_ADMIN', 'ADMIN'].includes(actorRole ?? '')) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { role } = body

  const allowed = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'TEACHER', 'ADMIN_STAFF', 'MEMBER']
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: 'Geçersiz rol' }, { status: 400 })
  }

  // ADMIN can't promote to SUPER_ADMIN
  if (actorRole === 'ADMIN' && role === 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Bu rol için yetkiniz yok' }, { status: 403 })
  }

  const updated = await db.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(updated)
}
