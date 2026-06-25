import { db } from '@/lib/db'
import { BarChart3, FileText, BookOpen, Users, Sparkles, TrendingUp } from 'lucide-react'

export default async function IstatistiklerPage() {
  const today = new Date().toISOString().split('T')[0]
  const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

  const [
    totalTemplates, totalDocuments, totalUsers,
    docsThisMonth, aiUsageToday, topTemplates,
  ] = await Promise.all([
    db.template.count(),
    db.document.count(),
    db.user.count(),
    db.document.count({ where: { createdAt: { gte: thisMonth } } }),
    db.aiUsage.aggregate({ where: { date: today }, _sum: { count: true } }),
    db.template.findMany({
      orderBy: { useCount: 'desc' },
      take: 5,
      select: { title: true, useCount: true, category: true },
    }),
  ])

  const stats = [
    { label: 'Toplam Şablon', value: totalTemplates, icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
    { label: 'Toplam Belge', value: totalDocuments, icon: FileText, color: 'text-green-600 bg-green-50' },
    { label: 'Toplam Kullanıcı', value: totalUsers, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Bu Ay Belge', value: docsThisMonth, icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
    { label: 'Bugün AI İstek', value: aiUsageToday._sum.count ?? 0, icon: Sparkles, color: 'text-pink-600 bg-pink-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" /> İstatistikler
        </h1>
        <p className="text-gray-500 text-sm mt-1">Platform kullanım verileri</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">En Çok Kullanılan Şablonlar</h2>
        <div className="space-y-3">
          {topTemplates.map((t, i) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-gray-800">{t.title}</span>
              <span className="text-sm font-medium text-blue-600">{t.useCount} kullanım</span>
            </div>
          ))}
          {topTemplates.length === 0 && <p className="text-sm text-gray-400">Henüz veri yok</p>}
        </div>
      </div>
    </div>
  )
}
