import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import type { Role } from '@prisma/client'

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json()

  if (!name || !email || !password)
    return NextResponse.json({ error: 'Ad, e-posta ve şifre zorunlu' }, { status: 400 })
  if (password.length < 8)
    return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })

  const exists = await db.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 409 })

  const hashed = await bcrypt.hash(password, 12)
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: (role as Role) || 'MEMBER',
    },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(user, { status: 201 })
}
