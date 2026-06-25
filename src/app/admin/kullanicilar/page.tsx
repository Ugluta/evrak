import { db } from '@/lib/db'
import { Users, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

const ROLE_DISPLAY: Record<string, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: 'Süper Admin',   cls: 'bg-red-50 text-red-700' },
  ADMIN:       { label: 'Admin',          cls: 'bg-orange-50 text-orange-700' },
  EDITOR:      { label: 'Editör',         cls: 'bg-purple-50 text-purple-700' },
  TEACHER:     { label: 'Öğretmen',       cls: 'bg-blue-50 text-blue-700' },
  ADMIN_STAFF: { label: 'İdari Personel', cls: 'bg-teal-50 text-teal-700' },
  MEMBER:      { label: 'Üye',            cls: 'bg-gray-100 text-gray-600' },
}

export default async function AdminKullanicilarPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { documents: true, templates: true } },
    },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5" /> Kullanıcılar
        </h1>
        <p className="text-gray-500 text-sm">{users.length} kullanıcı</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {users.map((u, i) => {
          const role = ROLE_DISPLAY[u.role] ?? { label: u.role, cls: 'bg-gray-100 text-gray-500' }
          const initials = (u.name ?? u.email).slice(0, 2).toUpperCase()
          return (
            <Link key={u.id} href={`/admin/kullanicilar/${u.id}`}
              className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-blue-50/40 group ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-blue-700">{initials}</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{u.name ?? '—'}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-gray-400 hidden sm:block">
                  <p>{u._count.documents} belge</p>
                  <p>{u._count.templates} şablon</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${role.cls}`}>{role.label}</span>
                <span className="text-xs text-gray-400 hidden md:block">{formatDate(u.createdAt)}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            </Link>
          )
        })}
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Henüz kullanıcı yok</p>
          </div>
        )}
      </div>
    </div>
  )
}
