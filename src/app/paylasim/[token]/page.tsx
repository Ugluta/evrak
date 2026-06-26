import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatDate, CATEGORY_LABELS } from '@/lib/utils'
import { FileText, Calendar, Download } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const doc = await db.document.findUnique({ where: { shareToken: token } })
  if (!doc) return { title: 'Belge Bulunamadı' }
  return { title: doc.title, description: `${CATEGORY_LABELS[doc.category] || doc.category} belgesi` }
}

export default async function PaylasimPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const doc = await db.document.findUnique({
    where: { shareToken: token },
    include: { author: { select: { name: true } }, template: { select: { title: true } } },
  })

  if (!doc) notFound()

  if (doc.expiresAt && doc.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Bu paylaşım linki süresi dolmuş.</p>
          <Link href="/" className="mt-3 text-blue-600 hover:underline inline-block">Ana Sayfaya Dön</Link>
        </div>
      </div>
    )
  }

  await db.document.update({ where: { id: doc.id }, data: { viewCount: { increment: 1 } } })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{doc.title}</h1>
              <p className="text-xs text-gray-400">
                {CATEGORY_LABELS[doc.category] || doc.category}
                {doc.author.name && ` — ${doc.author.name}`}
              </p>
            </div>
          </div>
          <a
            href={`/api/belgelerim/${doc.id}/pdf`}
            download
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700"
          >
            <Download className="w-4 h-4" /> PDF İndir
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
          <div className="border-b border-gray-100 pb-6 mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{doc.title}</h2>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{formatDate(doc.createdAt)}
              </span>
              {doc.template && <span>Şablon: {doc.template.title}</span>}
            </div>
          </div>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
            {doc.content}
          </pre>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            Öğretmen Evrak — Kendi belgenizi oluşturun
          </Link>
        </div>
      </div>
    </div>
  )
}
