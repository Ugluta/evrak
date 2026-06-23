import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { ServerHeader } from '@/components/ServerHeader'
import { FavoriteButton } from '@/components/FavoriteButton'
import { BookOpen, FileText, ArrowRight, Sparkles, Shield, Zap, ScanText } from 'lucide-react'
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
      <ServerHeader />

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
            <Link href="/belge-olustur"
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white border border-purple-500 rounded-xl font-semibold hover:bg-purple-500 transition-colors">
              <Sparkles className="w-4 h-4" /> AI ile Oluştur
            </Link>
            <Link href="/kayit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white border border-blue-400 rounded-xl font-semibold hover:bg-blue-400 transition-colors">
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/belge-olustur"
              className="block bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-purple-100 transition-all group">
              <div className="w-11 h-11 rounded-xl text-purple-600 bg-purple-50 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-purple-700">Yapay Zeka Desteği</h3>
              <p className="text-sm text-gray-500">AI ile belgelerinizi otomatik doldurun ve sıfırdan oluşturun.</p>
            </Link>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl text-green-600 bg-green-50 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">Anında PDF</h3>
              <p className="text-sm text-gray-500">Tek tıkla profesyonel PDF olarak indirin.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="w-11 h-11 rounded-xl text-blue-600 bg-blue-50 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5">Güvenli Saklama</h3>
              <p className="text-sm text-gray-500">Belgeleriniz güvenle saklanır, istediğinizde erişin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Yapay Zeka Araçları</h2>
            <p className="text-gray-500 text-sm">Evraklarınızı saniyeler içinde oluşturun ve metne çevirin</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Link href="/belge-olustur"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-7 text-white hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <Sparkles className="w-9 h-9 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">AI Belge Oluştur</h3>
              <p className="text-purple-200 text-sm mb-4">Yapay zeka ile sıfırdan resmi belge, dilekçe ve tutanak oluşturun.</p>
              <span className="flex items-center gap-1 text-sm font-medium text-purple-100 group-hover:gap-2 transition-all">
                Hemen Dene <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/ocr"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-700 p-7 text-white hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
              <ScanText className="w-9 h-9 mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-2">Görüntüden Metin (OCR)</h3>
              <p className="text-blue-200 text-sm mb-4">Fotoğraf veya taranmış belgelerden metni otomatik olarak çıkarın.</p>
              <span className="flex items-center gap-1 text-sm font-medium text-blue-100 group-hover:gap-2 transition-all">
                Hemen Dene <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
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
        <section className="py-16 px-4">
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
            <span className="font-bold text-white text-sm">2e Evrak</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} 2e Evrak. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/sablonlar" className="hover:text-white">Şablonlar</Link>
            <Link href="/belge-olustur" className="hover:text-white">AI Belge</Link>
            <Link href="/ocr" className="hover:text-white">OCR</Link>
            <Link href="/giris" className="hover:text-white">Giriş</Link>
            <Link href="/kayit" className="hover:text-white">Kayıt</Link>
            <Link href="/kullanim-kosullari" className="hover:text-white">Kullanım Koşulları</Link>
            <Link href="/gizlilik" className="hover:text-white">Gizlilik</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
