import { db } from '@/lib/db'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/utils'
import type { Metadata } from 'next'
import type { DocumentCategory } from '@prisma/client'

export const metadata: Metadata = { title: 'Evrak Şablonları' }

export default async function SablonlarPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; ara?: string }>
}) {
  const { kategori, ara } = await searchParams
  const category = kategori as DocumentCategory | undefined

  const where = {
    isPublic: true,
    ...(category && { category }),
    ...(ara && { title: { contains: ara, mode: 'insensitive' as const } }),
  }

  const templates = await db.template.findMany({
    where,
    orderBy: { useCount: 'desc' },
    select: {
      id: true, slug: true, title: true, category: true,
      description: true, useCount: true, tags: true, isPremium: true,
    },
  })

  const allCategories = Object.entries(CATEGORY_LABELS)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-blue-600 hover:underline text-sm">← Ana Sayfa</Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Evrak Şablonları</h1>
          <p className="text-gray-500 mt-1">{templates.length} şablon bulundu</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategoriler</p>
          <nav className="space-y-1">
            <Link href="/sablonlar"
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                !category ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              Tümü
            </Link>
            {allCategories.map(([val, label]) => (
              <Link
                key={val}
                href={`/sablonlar?kategori=${val}`}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  category === val ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <Link key={tmpl.id} href={`/sablonlar/${tmpl.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {CATEGORY_LABELS[tmpl.category] ?? tmpl.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {tmpl.isPremium && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>
                    )}
                    <span className="text-xs text-gray-400">{tmpl.useCount} kullanım</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{tmpl.title}</h3>
                {tmpl.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{tmpl.description}</p>
                )}
                {tmpl.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tmpl.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
          {templates.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>Bu kategoride şablon bulunamadı.</p>
              <Link href="/sablonlar" className="text-blue-600 hover:underline mt-2 inline-block">Tümünü Göster</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
