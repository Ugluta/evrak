import { db } from '@/lib/db'
import { BookOpen, FileText, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const [templateCount, documentCount, userCount, recentDocs] = await Promise.all([
    db.template.count(),
    db.document.count(),
    db.user.count(),
    db.document.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { author: { select: { name: true } }, template: { select: { title: true } } },
    }),
  ])

  const stats = [
    { label: 'Şablonlar', value: templateCount, icon: BookOpen, href: '/admin/sablonlar', color: 'bg-blue-50 text-blue-600' },
    { label: 'Oluşturulan Belgeler', value: documentCount, icon: FileText, href: '/admin/belgeler', color: 'bg-green-50 text-green-600' },
    { label: 'Kullanıcılar', value: userCount, icon: Users, href: '/admin/kullanicilar', color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="text-gray-500 text-sm mt-1">Öğretmen Evrak platformu yönetim paneli</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Son Oluşturulan Belgeler</h2>
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {recentDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-sm text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.author.name} — {doc.template?.title || 'Sıfırdan'}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(doc.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
