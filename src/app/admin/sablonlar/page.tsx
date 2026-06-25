import { db } from '@/lib/db'
import Link from 'next/link'
import { BookOpen, Plus, Edit } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/utils'
import { KlonaButon } from '@/components/KlonaButon'

export default async function AdminSablonlarPage() {
  const templates = await db.template.findMany({
    orderBy: { useCount: 'desc' },
    include: { _count: { select: { documents: true } } },
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Şablonlar
          </h1>
          <p className="text-gray-500 text-sm">{templates.length} şablon</p>
        </div>
        <Link href="/admin/sablonlar/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Yeni Şablon
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {templates.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{t.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-blue-600">{CATEGORY_LABELS[t.category] || t.category}</span>
                  <span className="text-xs text-gray-400">{t.useCount} kullanım</span>
                  <span className="text-xs text-gray-400">{t._count.documents} belge</span>
                  {t.isPremium && <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Premium</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                t.isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>{t.isPublic ? 'Herkese Açık' : 'Gizli'}</span>
              <KlonaButon id={t.id} />
              <Link href={`/admin/sablonlar/${t.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Edit className="w-3.5 h-3.5" /> Düzenle
              </Link>
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Henüz şablon yok</p>
          </div>
        )}
      </div>
    </div>
  )
}
