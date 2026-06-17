import { db } from '@/lib/db'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/lib/utils'

export default async function HomePage() {
  const templates = await db.template.findMany({
    where: { isPublic: true },
    orderBy: { useCount: 'desc' },
    take: 12,
    select: { id: true, slug: true, title: true, category: true, description: true, useCount: true, tags: true },
  })

  const categories = await db.template.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Resmi Evrak Şablonları</h1>
          <p className="text-blue-100 text-lg mb-8">
            Öğretmen ve okul idarecileri için hazır evrak şablonları. Doldur, PDF olarak indir.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/sablonlar"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
              Şablonlara Göz At
            </Link>
            <Link href="/olustur"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 border border-blue-400">
              Yeni Evrak Oluştur
            </Link>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.category}
              href={`/sablonlar?kategori=${cat.category}`}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-gray-800">{CATEGORY_LABELS[cat.category] ?? cat.category}</p>
              <p className="text-sm text-gray-400 mt-1">{cat._count.id} şablonu</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Templates */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popüler Şablonlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tmpl) => (
            <Link
              key={tmpl.id}
              href={`/sablonlar/${tmpl.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {CATEGORY_LABELS[tmpl.category] ?? tmpl.category}
                </span>
                <span className="text-xs text-gray-400">{tmpl.useCount} kullanım</span>
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
      </section>
    </div>
  )
}
