import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import {
  BookOpen, FileText, Users, Sparkles,
  TrendingUp, ArrowUpRight, Clock, Star,
  PlusCircle, Upload, ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

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
      take: 5,
      select: { title: true, useCount: true, slug: true },
    }),
  ])

  const aiCount = aiToday._sum.count ?? 0

  return (
    <div className="space-y-6">

      {/* Welcome + quick actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hoş geldin, {firstName} 👋</h2>
          <p className="text-sm text-gray-400 mt-0.5">Öğretmen Evrak yönetim paneli</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/sablonlar/yeni"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            <PlusCircle className="w-4 h-4" /> Yeni Şablon
          </Link>
          <Link href="/admin/kutuphane/yukle"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> Dosya Yükle
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Link href="/admin/sablonlar" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{templateCount}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Şablon</p>
          <p className="text-xs text-gray-400 mt-0.5">toplam aktif</p>
        </Link>

        <Link href="/admin/belgeler" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{documentCount}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Belge</p>
          <p className="text-xs text-gray-400 mt-0.5">{docsThisMonth} bu ay</p>
        </Link>

        <Link href="/admin/kullanicilar" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{userCount}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">Kullanıcı</p>
          <p className="text-xs text-gray-400 mt-0.5">kayıtlı üye</p>
        </Link>

        <Link href="/admin/ai-kullanim" className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{aiCount}</p>
          <p className="text-sm text-gray-500 mt-1 font-medium">AI İstek</p>
          <p className="text-xs text-gray-400 mt-0.5">bugün</p>
        </Link>
      </div>

      {/* Main grid: recent docs + right column */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent documents — 3/5 */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" /> Son Oluşturulan Belgeler
            </h3>
            <Link href="/admin/belgeler"
              className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-0.5">
              Tümü <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1">
            {recentDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                <FileText className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Henüz belge oluşturulmadı</p>
                <Link href="/admin/sablonlar" className="mt-2 text-xs text-blue-500 hover:underline">
                  Şablon ekle →
                </Link>
              </div>
            ) : (
              recentDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.author.name}
                      {doc.template ? ` · ${doc.template.title}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 tabular-nums">
                    {new Date(doc.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column — 2/5 */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Top templates */}
          <div className="bg-white rounded-2xl border border-gray-100 flex-1">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
              <Star className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-gray-900 text-sm">En Çok Kullanılan</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {topTemplates.length === 0 ? (
                <p className="text-sm text-gray-400 px-5 py-5">Henüz veri yok</p>
              ) : (
                topTemplates.map((t, i) => (
                  <div key={t.slug} className="flex items-center gap-3 px-5 py-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-700' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>{i + 1}</span>
                    <span className="flex-1 text-sm text-gray-700 truncate">{t.title}</span>
                    <span className="text-xs font-semibold text-blue-600 shrink-0">{t.useCount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monthly summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h3 className="font-semibold text-gray-900 text-sm">Bu Ay</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Yeni Belge', value: docsThisMonth },
                { label: 'AI Kullanımı (bugün)', value: aiCount },
                { label: 'Toplam Kullanıcı', value: userCount },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
