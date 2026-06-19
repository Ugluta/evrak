import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { documents: true, favorites: true } },
    },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, currentPassword, newPassword } = await req.json()

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updateData: Record<string, unknown> = {}

  if (name !== undefined) {
    if (!name?.trim()) return NextResponse.json({ error: 'İsim boş olamaz' }, { status: 400 })
    updateData.name = name.trim()
  }

  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: 'Mevcut şifre gerekli' }, { status: 400 })
    if (!user.password) return NextResponse.json({ error: 'Şifre ayarlanmamış' }, { status: 400 })
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: 'Mevcut şifre yanlış' }, { status: 400 })
    if (newPassword.length < 8) return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })
    updateData.password = await bcrypt.hash(newPassword, 12)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Hiçbir değişiklik yok' }, { status: 400 })
  }

  await db.user.update({ where: { id: session.user.id }, data: updateData })
  return NextResponse.json({ ok: true })
}
