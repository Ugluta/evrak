import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, email, password } = await req.json()

  if (!token || !email || !password) {
    return NextResponse.json({ error: 'Eksik bilgi' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })
  }

  const record = await db.verificationToken.findUnique({
    where: { identifier_token: { identifier: `reset:${email}`, token } },
  })

  if (!record) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı' }, { status: 400 })
  }

  if (record.expires < new Date()) {
    await db.verificationToken.delete({
      where: { identifier_token: { identifier: `reset:${email}`, token } },
    })
    return NextResponse.json({ error: 'Bağlantının süresi dolmuş. Lütfen yeni bir sıfırlama isteği gönderin.' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 12)

  await db.user.update({ where: { email }, data: { password: hashed } })
  await db.verificationToken.delete({
    where: { identifier_token: { identifier: `reset:${email}`, token } },
  })

  return NextResponse.json({ ok: true })
}
