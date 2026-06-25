import { db } from '@/lib/db'
import { Sparkles } from 'lucide-react'

export default async function AiKullanimPage() {
  const today = new Date().toISOString().split('T')[0]
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const usageData = await db.aiUsage.findMany({
    where: { date: { in: last7 } },
    orderBy: { date: 'asc' },
  })

  const topUsers = await db.aiUsage.groupBy({
    by: ['userId'],
    where: { date: today },
    _sum: { count: true },
    orderBy: { _sum: { count: 'desc' } },
    take: 10,
  })

  const userIds = topUsers.map(u => u.userId)
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  })
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))

  const totalToday = usageData.find(u => u.date === today)?.count ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6" /> AI Kullanım Raporu
        </h1>
        <p className="text-gray-500 text-sm mt-1">Günlük Claude API kullanım istatistikleri</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-500 mb-1">Bugün Toplam İstek</p>
        <p className="text-4xl font-bold text-blue-600">{totalToday}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Son 7 Gün</h2>
        <div className="space-y-2">
          {last7.map(date => {
            const count = usageData.find(u => u.date === date)?.count ?? 0
            const max = Math.max(...last7.map(d => usageData.find(u => u.date === d)?.count ?? 0), 1)
            return (
              <div key={date} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-24 shrink-0">{date}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-700 w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Bugün En Çok Kullananlar</h2>
        <div className="space-y-3">
          {topUsers.map((u) => {
            const user = userMap[u.userId]
            return (
              <div key={u.userId} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{user?.name ?? 'Bilinmeyen'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <span className="text-sm font-bold text-blue-600">{u._sum.count} istek</span>
              </div>
            )
          })}
          {topUsers.length === 0 && <p className="text-sm text-gray-400">Bugün henüz AI kullanımı yok</p>}
        </div>
      </div>
    </div>
  )
}
