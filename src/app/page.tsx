import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { FavoriteButton } from '@/components/FavoriteButton'
import { BookOpen, FileText, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, string> = {
  DILEKCELER: '📝', TUTANAKLAR: '📋', IZIN_FORMLARI: '🕑',
  ZIMMET: '📦', GOREVLENDIRME: '💼', YAZISMALAR: '✉️',
  SOZLESMELER: '🤝', RAPORLAR: '📊', DIGER: '📁',
}

export default async function HomePage() {
  const session = await auth()

  const [templateCount, categories, popular, favorites] = await Promise.all([
    db.template.count({ where: { isPublic: true } }),
    db.template.groupBy({
      by: ['category'],
      where: { isPublic: true },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    db.template.findMany({
      where: { isPublic: true },
      orderBy: { useCount: 'desc' },
      take: 6,
    }),
    session?.user?.id
      ? db.favorite.findMany({
          where: { userId: session.user.id },
          select: { templateId: true },
        })
      : Promise.resolve([]),
  ])

  const favoriteIds = new Set(favorites.map((f) => f.templateId))

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            Resmi Evrakı <span className="text-blue-200">Saniyeler</span> İçinde Hazırlayın
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            {templateCount}+ profesyonel şablon, yapay zeka desteği ve anında PDF çıktısı ile okul evraklarınızı kolaylıkla oluşturun.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sablonlar"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
              <BookOpen className="w-5 h-5" /> Şablonlara Bak
            </Link>
            <Link href="/kayit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white border border-blue-400 rounded-xl font-semibold hover:bg-blue-400 transition-colors">
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Yapay Zeka Desteği', desc: 'AI ile belgelerinizi otomatik doldurun ve iyileştirin.', color: 'text-purple-600 bg-purple-50' },
              { icon: Zap, title: 'Anında PDF', desc: 'Tek tıkla profesyonel PDF olarak indirin.', color: 'text-green-600 bg-green-50' },
              { icon: Shield, title: 'Güvenli Saklama', desc: 'Belgeleriniz güvenle saklanır, istediğinizde erişin.', color: 'text-blue-600 bg-blue-50' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-6">
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Evrak Kategorileri</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(({ category, _count }) => (
              <Link key={category} href={`/sablonlar?kategori=${category}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all group">
                <div className="text-3xl mb-3">{CATEGORY_ICONS[category] || '📄'}</div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-700">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{_count.id} şablon</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      {popular.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Popüler Şablonlar</h2>
              <Link href="/sablonlar" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                Tümünü Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((t) => (
                <div key={t.id} className="relative group">
                  <Link href={`/sablonlar/${t.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-3 pr-8">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                        {CATEGORY_LABELS[t.category] || t.category}
                      </span>
                      {t.isPremium && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t.title}</h3>
                    {t.description && <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>}
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {t.useCount} kullanım
                    </p>
                  </Link>
                  <div className="absolute top-3 right-3 z-10">
                    <FavoriteButton templateId={t.id} initialFavorited={favoriteIds.has(t.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 mt-0">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Öğretmen Evrak</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Öğretmen Evrak. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/sablonlar" className="hover:text-white">Şablonlar</Link>
            <Link href="/giris" className="hover:text-white">Giriş</Link>
            <Link href="/kayit" className="hover:text-white">Kayıt</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
