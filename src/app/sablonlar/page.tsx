import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { CATEGORY_LABELS } from '@/lib/utils'
import { FavoriteButton } from '@/components/FavoriteButton'
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

  const session = await auth()

  const [templates, favorites] = await Promise.all([
    db.template.findMany({
      where,
      orderBy: { useCount: 'desc' },
      select: {
        id: true, slug: true, title: true, category: true,
        description: true, useCount: true, tags: true, isPremium: true,
      },
    }),
    session?.user?.id
      ? db.favorite.findMany({
          where: { userId: session.user.id },
          select: { templateId: true },
        })
      : Promise.resolve([]),
  ])

  const favoriteIds = new Set(favorites.map((f) => f.templateId))
  const allCategories = Object.entries(CATEGORY_LABELS)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b border-gray-200 px-4 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Evrak Şablonları</h1>
          <form method="GET" action="/sablonlar" className="flex gap-2 max-w-md">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="ara"
                defaultValue={ara || ''}
                placeholder="Şablon ara..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ara
            </button>
            {ara && (
              <Link
                href={kategori ? `/sablonlar?kategori=${kategori}` : '/sablonlar'}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
              >
                Temizle
              </Link>
            )}
          </form>
          {ara && (
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-medium text-gray-700">&ldquo;{ara}&rdquo;</span> için{' '}
              <span className="font-medium">{templates.length}</span> sonuç
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategoriler</p>
          <nav className="space-y-1">
            <Link
              href={ara ? `/sablonlar?ara=${encodeURIComponent(ara)}` : '/sablonlar'}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                !category ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tümü
            </Link>
            {allCategories.map(([val, label]) => (
              <Link
                key={val}
                href={`/sablonlar?kategori=${val}${ara ? `&ara=${encodeURIComponent(ara)}` : ''}`}
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
              <div key={tmpl.id} className="relative group">
                <Link
                  href={`/sablonlar/${tmpl.slug}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-2 pr-8">
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
                <div className="absolute top-3 right-3 z-10">
                  <FavoriteButton templateId={tmpl.id} initialFavorited={favoriteIds.has(tmpl.id)} />
                </div>
              </div>
            ))}
          </div>
          {templates.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="mb-2">
                {ara ? `"${ara}" için şablon bulunamadı.` : 'Bu kategoride şablon bulunamadı.'}
              </p>
              <Link href="/sablonlar" className="text-blue-600 hover:underline">Tümünü Göster</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
