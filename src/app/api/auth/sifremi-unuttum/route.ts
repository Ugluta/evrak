import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PASSWORD RESET URL]', resetUrl)
    }
    return
  }

  const from = process.env.EMAIL_FROM ?? '2e Evrak <noreply@ikie.net>'

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: #2563eb; border-radius: 12px; margin-bottom: 16px;">
            <span style="color: #fff; font-size: 20px; font-weight: 700;">2</span>
          </div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">Şifre Sıfırlama</h1>
        </div>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Şifrenizi sıfırlamak için bir istek aldık. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;">
            Şifremi Sıfırla
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
          Bu bağlantı <strong>1 saat</strong> geçerlidir. Eğer bu isteği siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
        </p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          2e Evrak — <a href="${process.env.NEXTAUTH_URL}" style="color: #9ca3af;">ikie.net</a>
        </p>
      </div>
    </body>
    </html>
  `

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: 'Şifre Sıfırlama — 2e Evrak', html }),
  })
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    return NextResponse.json({ ok: true })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60)

  await db.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } })
  await db.verificationToken.create({ data: { identifier: `reset:${email}`, token, expires } })

  const resetUrl = `${process.env.NEXTAUTH_URL}/sifresi-sifirla?token=${token}&email=${encodeURIComponent(email)}`
  await sendPasswordResetEmail(email, resetUrl)

  return NextResponse.json({ ok: true })
}
