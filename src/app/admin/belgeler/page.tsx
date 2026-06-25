import { db } from '@/lib/db'
import Link from 'next/link'
import { FileText, Eye, Download } from 'lucide-react'
import { CATEGORY_LABELS, formatDate } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  DRAFT:     { label: 'Taslak',     cls: 'bg-gray-100 text-gray-600' },
  REVIEW:    { label: 'İncelemede', cls: 'bg-yellow-50 text-yellow-700' },
  APPROVED:  { label: 'Onaylı',     cls: 'bg-green-50 text-green-700' },
  PUBLISHED: { label: 'Yayında',    cls: 'bg-blue-50 text-blue-700' },
  ARCHIVED:  { label: 'Arşivlendi', cls: 'bg-gray-100 text-gray-500' },
}

export default async function AdminBelgelerPage() {
  const belgeler = await db.document.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      author: { select: { name: true, email: true } },
      template: { select: { title: true } },
    },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Belgeler
        </h1>
        <p className="text-gray-500 text-sm">{belgeler.length} belge</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {belgeler.map((b, i) => {
          const s = STATUS_MAP[b.status] ?? { label: b.status, cls: 'bg-gray-100 text-gray-500' }
          return (
            <div key={b.id} className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-blue-50/40 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{b.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-500">{b.author?.name || b.author?.email}</span>
                    <span className="text-xs text-blue-600">{CATEGORY_LABELS[b.category] ?? b.category}</span>
                    {b.template && <span className="text-xs text-gray-400">📄 {b.template.title}</span>}
                    <span className="text-xs text-gray-400">{formatDate(b.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                <a
                  href={`/api/belgelerim/${b.id}/pdf`}
                  download
                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="PDF İndir"
                >
                  <Download className="w-4 h-4" />
                </a>
                <Link
                  href={`/belgelerim/${b.id}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Görüntüle
                </Link>
              </div>
            </div>
          )
        })}
        {belgeler.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Henüz belge yok</p>
          </div>
        )}
      </div>
    </div>
  )
}
