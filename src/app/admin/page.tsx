import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import {
  BookOpen, FileText, Users, Sparkles,
  TrendingUp, ArrowUpRight, Clock, Star,
  AlertCircle, PlusCircle, Upload,
} from 'lucide-react'
import Link from 'next/link'

function StatCard({
  label, value, sub, icon: Icon, color, href,
}: {
  label: string
  value: number | string
  sub?: string
  icon: React.ElementType
  color: string
  href?: string
}) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group relative overflow-hidden`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-sm text-gray-500 mt-1.5 font-medium">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      {href && (
        <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors absolute top-4 right-4" />
      )}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

export default async function AdminPage() {
  const session = await auth()
  const user = session?.user as { name?: string | null } | undefined
  const firstName = user?.name?.split(' ')[0] ?? 'Admin'

  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [
    templateCount,
    documentCount,
    userCount,
    docsThisMonth,
    aiToday,
    recentDocs,
    topTemplates,
  ] = await Promise.all([
    db.template.count(),
    db.document.count(),
    db.user.count(),
    db.document.count({ where: { createdAt: { gte: thisMonth } } }),
    db.aiUsage.aggregate({ where: { date: today }, _sum: { count: true } }),
    db.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        author: { select: { name: true } },
        template: { select: { title: true } },
      },
    }),
    db.template.findMany({
      orderBy: { useCount: 'desc' },
      take: 4,
      select: { title: true, useCount: true, slug: true },
    }),
  ])

  const aiCount = aiToday._sum.count ?? 0

  const stats = [
    {
      label: 'Toplam Şablon',
      value: templateCount,
      sub: 'aktif şablon',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/sablonlar',
    },
    {
      label: 'Toplam Belge',
      value: documentCount,
      sub: `${docsThisMonth} bu ay`,
      icon: FileText,
      color: 'bg-violet-50 text-violet-600',
      href: '/admin/belgeler',
    },
    {
      label: 'Kullanıcılar',
      value: userCount,
      sub: 'kayıtlı üye',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/kullanicilar',
    },
    {
      label: 'AI İstek (Bugün)',
      value: aiCount,
      sub: 'Claude API isteği',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/ai-kullanim',
    },
  ]

  const quickActions = [
    { label: 'Yeni Şablon', icon: PlusCircle, href: '/admin/sablonlar/yeni', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { label: 'Dosya Yükle', icon: Upload, href: '/admin/kutuphane/yukle', color: 'bg-violet-600 hover:bg-violet-700 text-white' },
    { label: 'İstatistikler', icon: TrendingUp, href: '/admin/istatistikler', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  ]

  return (
    <div className="space-y-7 max-w-7xl">

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">Hoş geldin 👋</p>
          <h2 className="text-2xl font-bold">{firstName}</h2>
          <p className="text-blue-200 text-sm mt-1">Öğretmen Evrak yönetim paneline hoş geldiniz.</p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-2">
          {quickActions.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors bg-white/20 hover:bg-white/30 text-white`}
            >
              <a.icon className="w-4 h-4" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main content: recent docs + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent documents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Son Belgeler
            </h3>
            <Link href="/admin/belgeler" className="text-xs text-blue-600 hover:underline font-medium">
              Tümü →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDocs.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Henüz belge yok</p>
              </div>
            ) : (
              recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.author.name} {doc.template ? `· ${doc.template.title}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(doc.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Duyuru kartı */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <p className="font-semibold text-amber-800 text-sm">Duyurular</p>
            </div>
            <p className="text-sm text-amber-700">Yeni duyuru sistemi geliştiriliyor. Kullanıcılara bildirim gönderme özelliği yakında aktif olacak.</p>
            <Link href="/admin/duyurular" className="inline-flex items-center gap-1 mt-3 text-xs text-amber-700 font-semibold hover:underline">
              Duyurular <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Top templates */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-gray-900 text-sm">En Popüler Şablonlar</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {topTemplates.length === 0 ? (
                <p className="text-sm text-gray-400 px-5 py-4">Henüz veri yok</p>
              ) : (
                topTemplates.map((t, i) => (
                  <div key={t.slug} className="flex items-center gap-3 px-5 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>{i + 1}</span>
                    <span className="flex-1 text-sm text-gray-800 truncate">{t.title}</span>
                    <span className="text-xs font-semibold text-blue-600 shrink-0">{t.useCount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bu ay özet */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Bu Ay Özet
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Yeni Belgeler</span>
                <span className="font-semibold text-gray-900">{docsThisMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">AI Kullanımı (bugün)</span>
                <span className="font-semibold text-gray-900">{aiCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Toplam Kullanıcı</span>
                <span className="font-semibold text-gray-900">{userCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
