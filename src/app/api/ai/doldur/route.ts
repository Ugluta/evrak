import { NextRequest, NextResponse } from 'next/server'
import { generateDocumentContent } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateContent, fieldValues, title } = body

    if (!templateContent || !title) {
      return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
    }

    const content = await generateDocumentContent({ templateContent, fieldValues: fieldValues ?? {}, title })
    return NextResponse.json({ content })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ error: 'AI hatası' }, { status: 500 })
  }
}
