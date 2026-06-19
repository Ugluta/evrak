'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FileText, Plus, Download, Trash2, Eye, Clock } from 'lucide-react'
import { CATEGORY_LABELS, formatDate } from '@/lib/utils'

interface Document {
  id: string
  title: string
  slug: string
  category: string
  status: string
  createdAt: string
  isAiAssisted: boolean
  template?: { title: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Taslak',
  REVIEW: 'İncelemede',
  APPROVED: 'Onaylı',
  PUBLISHED: 'Yayında',
  ARCHIVED: 'Arşivlendi',
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  REVIEW: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  PUBLISHED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-gray-100 text-gray-400',
}

export default function BelgelerimPage() {
  const { data: session, status } = useSession()
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/belgelerim')
      .then((r) => r.json())
      .then((d) => { setDocs(d.docs || []); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/belgelerim/${id}`, { method: 'DELETE' })
    setDocs(docs.filter((d) => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Belgelerim</h1>
              <p className="text-xs text-gray-500">
                {session?.user?.name || 'Misafir'} — {docs.length} belge
              </p>
            </div>
          </div>
          <Link
            href="/sablonlar"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Yeni Belge
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Henüz belge oluşturmadınız</p>
            <Link
              href="/sablonlar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" /> Şablonlardan Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[doc.status] || doc.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {CATEGORY_LABELS[doc.category] || doc.category}
                      </span>
                      {doc.isAiAssisted && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">AI</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(doc.createdAt)}
                      {doc.template && (
                        <span className="ml-1">— {doc.template.title}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/belgelerim/${doc.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      title="Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <a
                      href={`/api/belgelerim/${doc.id}/pdf`}
                      className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-green-600 transition-colors"
                      title="PDF İndir"
                      download
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
