import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { ServerHeader } from '@/components/ServerHeader'
import { FavoriteButton } from '@/components/FavoriteButton'
import {
  BookOpen, FileText, ArrowRight, Sparkles, Zap, ScanText,
  Users, TrendingUp, Bell, PlayCircle, ChevronRight,
  ClipboardList, Clock, Briefcase, Mail, Scale, BarChart2,
  FolderOpen, Shield, PlusCircle, Download, Star,
} from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/utils'

/* ─── Sabit duyurular (ileride DB'den gelecek) ─── */
const DUYURULAR = [
  {
    id: 1,
    tag: 'Duyuru',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Yeni şablonlar eklendi: İzin Formları güncellendi',
    excerpt: '2024-2025 eğitim yılı için güncellenmiş izin form şablonları sisteme yüklendi. Güncel formları kullanmaya başlayabilirsiniz.',
    date: '25 Haziran 2026',
    icon: Bell,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    tag: 'Güncelleme',
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: 'AI Belge Oluşturucu yeni özellikler kazandı',
    excerpt: 'Yapay zeka destekli belge oluşturma aracına özlük hakları ve mahkeme dilekçesi kategorileri eklendi.',
    date: '20 Haziran 2026',
    icon: Sparkles,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 3,
    tag: 'Sistem',
    tagColor: 'bg-amber-100 text-amber-700',
    title: 'Referans kütüphane genişletildi',
    excerpt: 'Yargıtay kararları ve Danıştay içtihatları kütüphanemize eklendi. Özlük hakları bölümünde 150+ yeni belge mevcut.',
    date: '15 Haziran 2026',
    icon: FolderOpen,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
]

/* ─── Kategori renkleri ─── */
const CATEGORY_STYLE: Record<string, { bg: string; icon: React.ElementType; color: string; accent: string }> = {
  DILEKCELER:   { bg: 'bg-blue-50',    icon: ClipboardList, color: 'text-blue-600',   accent: 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/80' },
  TUTANAKLAR:   { bg: 'bg-orange-50',  icon: FileText,      color: 'text-orange-600', accent: 'border-orange-100 hover:border-orange-300 hover:bg-orange-50/80' },
  IZIN_FORMLARI:{ bg: 'bg-teal-50',    icon: Clock,         color: 'text-teal-600',   accent: 'border-teal-100 hover:border-teal-300 hover:bg-teal-50/80' },
  ZIMMET:       { bg: 'bg-amber-50',   icon: Briefcase,     color: 'text-amber-600',  accent: 'border-amber-100 hover:border-amber-300 hover:bg-amber-50/80' },
  GOREVLENDIRME:{ bg: 'bg-violet-50',  icon: Users,         color: 'text-violet-600', accent: 'border-violet-100 hover:border-violet-300 hover:bg-violet-50/80' },
  YAZISMALAR:   { bg: 'bg-pink-50',    icon: Mail,          color: 'text-pink-600',   accent: 'border-pink-100 hover:border-pink-300 hover:bg-pink-50/80' },
  SOZLESMELER:  { bg: 'bg-indigo-50',  icon: Scale,         color: 'text-indigo-600', accent: 'border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/80' },
  RAPORLAR:     { bg: 'bg-emerald-50', icon: BarChart2,     color: 'text-emerald-600',accent: 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/80' },
  DIGER:        { bg: 'bg-gray-50',    icon: FolderOpen,    color: 'text-gray-500',   accent: 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/80' },
}

/* ─── Eğitim videoları placeholder ─── */
const VIDEOLAR = [
  { id: 1, title: 'Nasıl Şablon Kullanılır?', duration: '3:24', thumb: null },
  { id: 2, title: 'AI ile Belge Oluşturma', duration: '4:11', thumb: null },
  { id: 3, title: 'PDF İndirme ve Paylaşma', duration: '2:08', thumb: null },
  { id: 4, title: 'OCR ile Metin Çıkarma', duration: '3:55', thumb: null },
  { id: 5, title: 'Favorilere Ekleme', duration: '1:45', thumb: null },
  { id: 6, title: 'Şablon Kategorileri', duration: '2:30', thumb: null },
]

export default async function HomePage() {
  const session = await auth()

  const [templateCount, documentCount, userCount, categories, popular, favorites] = await Promise.all([
    db.template.count({ where: { isPublic: true } }),
    db.document.count(),
    db.user.count(),
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
      ? db.favorite.findMany({ where: { userId: session.user.id }, select: { templateId: true } })
      : Promise.resolve([]),
  ])

  const favoriteIds = new Set(favorites.map((f) => f.templateId))

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <ServerHeader />

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-900/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 mb-6 text-xs font-semibold text-blue-100">
              <Shield className="w-3.5 h-3.5" /> Öğretmenler & İdareciler İçin
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 tracking-tight">
              Resmi Evrakı<br />
              <span className="text-blue-200">Saniyeler İçinde</span> Hazırlayın
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              {templateCount}+ profesyonel şablon, yapay zeka desteği ve anında PDF çıktısı ile okul evraklarınızı kolaylıkla oluşturun.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/sablonlar"
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-sm">
                <BookOpen className="w-4 h-4" /> Şablonlara Bak
              </Link>
              <Link href="/belge-olustur"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white border border-purple-500 rounded-xl font-semibold hover:bg-purple-500 transition-colors">
                <Sparkles className="w-4 h-4" /> AI ile Oluştur
              </Link>
              {!session && (
                <Link href="/kayit"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500/60 text-white border border-blue-400/40 rounded-xl font-semibold hover:bg-blue-500/80 transition-colors">
                  Ücretsiz Başla <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Hero stats panel */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { label: 'Şablon', value: templateCount, icon: BookOpen, color: 'bg-white/10' },
              { label: 'Oluşturulan Belge', value: documentCount, icon: FileText, color: 'bg-white/10' },
              { label: 'Kayıtlı Kullanıcı', value: userCount, icon: Users, color: 'bg-white/10' },
              { label: 'AI Özelliği', value: '3+', icon: Sparkles, color: 'bg-white/10' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`${color} border border-white/10 rounded-2xl p-5 backdrop-blur-sm`}>
                <Icon className="w-5 h-5 text-blue-200 mb-3" />
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-sm text-blue-200 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DUYURULAR ══ */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Duyurular & Haberler</h2>
          </div>
          <Link href="/duyurular" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
            Tümü <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {DUYURULAR.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all group flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 ${d.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${d.iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${d.tagColor}`}>{d.tag}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-blue-700 transition-colors">{d.title}</h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-3">{d.excerpt}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{d.date}</span>
                  <span className="text-xs text-blue-600 font-medium group-hover:underline cursor-pointer">Devamını oku →</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══ KATEGORİLER ══ */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Evrak Kategorileri</h2>
              <p className="text-sm text-gray-500 mt-0.5">Kategoriye göre şablon ve belge arayın</p>
            </div>
            <Link href="/sablonlar" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              Tüm Şablonlar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categories.map(({ category, _count }) => {
              const style = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.DIGER
              const Icon = style.icon
              return (
                <Link
                  key={category}
                  href={`/sablonlar?kategori=${category}`}
                  className={`bg-white rounded-2xl border p-4 transition-all group flex flex-col gap-3 ${style.accent}`}
                >
                  <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors leading-tight">
                      {CATEGORY_LABELS[category] || category}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{_count.id} şablon</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ HIZLI ARAÇLAR ══ */}
      <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">Hızlı Araçlar</h2>
          <p className="text-sm text-gray-500 mt-0.5">Öğretmenler ve idareciler için özel araçlar</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/belge-olustur"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-6 text-white hover:shadow-xl transition-all">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <Sparkles className="w-7 h-7 mb-4 opacity-90" />
            <h3 className="font-bold text-base mb-1">AI Belge Oluştur</h3>
            <p className="text-purple-200 text-xs leading-relaxed">Yapay zeka ile sıfırdan resmi belge, dilekçe ve tutanak oluşturun.</p>
            <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-200 group-hover:gap-2 transition-all">
              Dene <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href="/ocr"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 p-6 text-white hover:shadow-xl transition-all">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <ScanText className="w-7 h-7 mb-4 opacity-90" />
            <h3 className="font-bold text-base mb-1">OCR Metin Tanıma</h3>
            <p className="text-blue-200 text-xs leading-relaxed">Fotoğraf veya taranmış belgelerden metni otomatik çıkarın.</p>
            <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-200 group-hover:gap-2 transition-all">
              Dene <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href="/sablonlar"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white hover:shadow-xl transition-all">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <BookOpen className="w-7 h-7 mb-4 opacity-90" />
            <h3 className="font-bold text-base mb-1">Şablon Kütüphanesi</h3>
            <p className="text-emerald-100 text-xs leading-relaxed">{templateCount}+ hazır şablon ile evraklarınızı dakikalar içinde doldurun.</p>
            <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-200 group-hover:gap-2 transition-all">
              Şablonlar <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link href={session ? '/belgelerim' : '/kayit'}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white hover:shadow-xl transition-all">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
            <Download className="w-7 h-7 mb-4 opacity-90" />
            <h3 className="font-bold text-base mb-1">PDF İndir</h3>
            <p className="text-amber-100 text-xs leading-relaxed">Tamamladığınız evrakları tek tıkla PDF olarak indirin ve yazdırın.</p>
            <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-200 group-hover:gap-2 transition-all">
              Belgelerim <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* ══ PLATFORM İSTATİSTİKLERİ ══ */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white">Platform İstatistikleri</h2>
            <p className="text-slate-400 text-sm mt-1">Öğretmenlerimizin güvenle kullandığı platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen,    value: templateCount, label: 'Aktif Şablon',          color: 'text-blue-400' },
              { icon: FileText,    value: documentCount, label: 'Oluşturulan Belge',     color: 'text-emerald-400' },
              { icon: Users,       value: userCount,     label: 'Kayıtlı Kullanıcı',     color: 'text-purple-400' },
              { icon: TrendingUp,  value: '99%',         label: 'Kullanıcı Memnuniyeti', color: 'text-amber-400' },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 mb-3 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className={`text-4xl font-extrabold ${color} tabular-nums`}>{value}</p>
                <p className="text-slate-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POPÜLER ŞABLONLAR ══ */}
      {popular.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Popüler Şablonlar</h2>
            </div>
            <Link href="/sablonlar" className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popular.map((t) => {
              const style = CATEGORY_STYLE[t.category] ?? CATEGORY_STYLE.DIGER
              const Icon = style.icon
              return (
                <div key={t.id} className="relative group">
                  <Link href={`/sablonlar/${t.slug}`}
                    className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-blue-100 transition-all">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${style.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {CATEGORY_LABELS[t.category] || t.category}
                          </span>
                          {t.isPremium && (
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">{t.title}</h3>
                    {t.description && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{t.description}</p>}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {t.useCount} kullanım
                      </p>
                      <span className="text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
                        Kullan <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 z-10">
                    <FavoriteButton templateId={t.id} initialFavorited={favoriteIds.has(t.id)} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ══ VİDEO GALERİ ══ */}
      <section className="bg-white border-y border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Video Eğitimler</h2>
              <p className="text-sm text-gray-500 mt-0.5">Sistemi hızlıca öğrenin</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {VIDEOLAR.map((v) => (
              <div key={v.id}
                className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 aspect-video flex items-center justify-center cursor-pointer hover:shadow-lg transition-all">
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/20 transition-colors" />
                <PlayCircle className="w-10 h-10 text-white/70 group-hover:text-white group-hover:scale-110 transition-all relative z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-[10px] font-medium line-clamp-2 leading-tight">{v.title}</p>
                  <p className="text-white/60 text-[9px] mt-0.5">{v.duration}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Video içerikler yakında eklenecektir.</p>
        </div>
      </section>

      {/* ══ CTA ══ */}
      {!session && (
        <section className="max-w-6xl mx-auto px-5 lg:px-8 py-14">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-10 text-center text-white">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <PlusCircle className="w-10 h-10 mx-auto mb-4 text-blue-200" />
              <h2 className="text-2xl font-bold mb-2">Hemen Başlayın — Ücretsiz</h2>
              <p className="text-blue-100 text-sm max-w-lg mx-auto mb-7">
                Kayıt olun ve tüm şablonlara, AI araçlarına ve kişisel belge arşivinize erişin.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/kayit"
                  className="px-7 py-3 bg-white text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors shadow-sm">
                  Ücretsiz Kayıt Ol
                </Link>
                <Link href="/giris"
                  className="px-7 py-3 border border-white/30 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ FOOTER ══ */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-sm">2e Evrak</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Öğretmenler ve idareciler için evrak yönetim platformu. Resmi belgeleri hızla, doğru şekilde hazırlayın.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                {[
                  { href: '/sablonlar', label: 'Şablonlar' },
                  { href: '/belge-olustur', label: 'AI Belge Oluştur' },
                  { href: '/ocr', label: 'OCR Araçı' },
                  { href: '/belgelerim', label: 'Belgelerim' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Evrak Türleri</h4>
              <ul className="space-y-2">
                {Object.entries(CATEGORY_LABELS).slice(0, 5).map(([key, label]) => (
                  <li key={key}>
                    <Link href={`/sablonlar?kategori=${key}`} className="text-xs hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Hesap</h4>
              <ul className="space-y-2">
                {[
                  { href: '/giris', label: 'Giriş Yap' },
                  { href: '/kayit', label: 'Kayıt Ol' },
                  { href: '/kullanim-kosullari', label: 'Kullanım Koşulları' },
                  { href: '/gizlilik', label: 'Gizlilik Politikası' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} 2e Evrak. Tüm hakları saklıdır.</p>
            <p className="text-xs text-slate-600">Türk Öğretmenleri için yapılmıştır 🇹🇷</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
