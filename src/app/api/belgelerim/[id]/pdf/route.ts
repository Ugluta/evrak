import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { renderToStream } from '@react-pdf/renderer'
import { BelgePdf } from '@/lib/pdf'
import { createElement } from 'react'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const doc = await db.document.findUnique({ where: { id } })
  if (!doc) return NextResponse.json({ error: 'Bulunamadı' }, { status: 404 })

  const date = new Date(doc.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const element = createElement(BelgePdf, { title: doc.title, content: doc.content, date })
  const stream = await renderToStream(element)

  const filename = encodeURIComponent(doc.slug) + '.pdf'

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
      'Cache-Control': 'no-store',
    },
  })
}
