import { db } from '@/lib/db'
import Link from 'next/link'
import { BookOpen, Plus, Edit } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/utils'
import { KlonaButon } from '@/components/KlonaButon'
import { SilButon } from '@/components/SilButon'

const CATEGORIES = Object.entries(CATEGORY_LABELS)

export default async function AdminSablonlarPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const { kategori } = await searchParams

  const templates = await db.template.findMany({
    where: kategori ? { category: kategori as never } : undefined,
    orderBy: { useCount: 'desc' },
    include: { _count: { select: { documents: true } } },
  })

  const allCount = await db.template.count()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Şablonlar
          </h1>
          <p className="text-gray-500 text-sm">{allCount} şablon toplam</p>
        </div>
        <Link href="/admin/sablonlar/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" /> Yeni Şablon
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/admin/sablonlar"
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            !kategori
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
          }`}
        >
          Tümü ({allCount})
        </Link>
        {CATEGORIES.map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/sablonlar?kategori=${key}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              kategori === key
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Templates list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {templates.map((t, i) => (
          <div key={t.id} className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-blue-50/40 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{t.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-blue-600 font-medium">{CATEGORY_LABELS[t.category] || t.category}</span>
                  <span className="text-xs text-gray-400">{t.useCount} kullanım</span>
                  <span className="text-xs text-gray-400">{t._count.documents} belge</span>
                  {t.isPremium && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-md">Premium</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:inline ${
                t.isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>{t.isPublic ? 'Açık' : 'Gizli'}</span>
              <KlonaButon id={t.id} />
              <Link
                href={`/admin/sablonlar/${t.id}`}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" /> Düzenle
              </Link>
              <SilButon id={t.id} endpoint="/api/admin/sablonlar" />
            </div>
          </div>
        ))}
        {templates.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Bu kategoride şablon yok</p>
            <Link href="/admin/sablonlar/yeni" className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-medium">
              <Plus className="w-3.5 h-3.5" /> Yeni şablon ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
