import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateDocumentContent({
  templateContent,
  fieldValues,
  title,
}: {
  templateContent: string
  fieldValues: Record<string, string>
  title: string
}): Promise<string> {
  let filled = templateContent
  for (const [key, value] of Object.entries(fieldValues)) {
    filled = filled.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Aşağıdaki resmi evrak taslakını Türkçe resmi yazı diliyle düzelt ve eksiksiz hale getir. Sadece belgeyi döndür, açıklama ekleme.\n\nBaşlık: ${title}\n\nMevcut içerik:\n${filled}`,
      },
    ],
  })

  const content = msg.content[0]
  return content.type === 'text' ? content.text : filled
}

export async function aiDraftDocument({
  category,
  title,
  context,
}: {
  category: string
  title: string
  context?: string
}): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: `Türk eğitim sistemi için aşağıdaki resmi evrakı oluştur:\n\nKategori: ${category}\nBaşlık: ${title}\n${context ? `Bağlam: ${context}` : ''}\n\nResmi Türkçe yazışma diliyle, eksiksiz ve profesyonel bir evrak yaz. Sadece evrak metnini döndür.`,
      },
    ],
  })

  const content = msg.content[0]
  return content.type === 'text' ? content.text : ''
}
