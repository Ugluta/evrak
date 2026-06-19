import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS: Record<string, string> = {
  extract: 'Bu görseldeki tüm metni Türkçe olarak çıkar. Sadece metni döndür, açıklama ekleme.',
  clean: 'Bu görseldeki metni oku ve temiz, düzgün Türkçe yazıya çevir. Yazım hatalarını düzelt, okunabilir hale getir. Sadece düzenlenmiş metni döndür.',
  summary: 'Bu görseldeki içeriği 3-5 cümle ile özetle. Türkçe özet yaz.',
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { imageData, mode = 'extract' } = await req.json()
    if (!imageData) {
      return NextResponse.json({ error: 'Görsel verisi eksik' }, { status: 400 })
    }

    const [header, base64Data] = imageData.split(',')
    const mediaType = (header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg') as
      | 'image/jpeg'
      | 'image/png'
      | 'image/gif'
      | 'image/webp'

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64Data },
            },
            {
              type: 'text',
              text: PROMPTS[mode] ?? PROMPTS.extract,
            },
          ],
        },
      ],
    })

    const content = msg.content[0]
    const text = content.type === 'text' ? content.text : ''
    return NextResponse.json({ text })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'OCR işlemi başarısız' }, { status: 500 })
  }
}
