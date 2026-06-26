import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, FileText, BookOpen, Calendar } from 'lucide-react'
import { RoleEditor } from './RoleEditor'

const ROLE_DISPLAY: Record<string, { label: string; cls: string }> = {
  SUPER_ADMIN: { label: 'Süper Admin',   cls: 'bg-red-50 text-red-700 border-red-100' },
  ADMIN:       { label: 'Admin',          cls: 'bg-orange-50 text-orange-700 border-orange-100' },
  EDITOR:      { label: 'Editör',         cls: 'bg-purple-50 text-purple-700 border-purple-100' },
  TEACHER:     { label: 'Öğretmen',       cls: 'bg-blue-50 text-blue-700 border-blue-100' },
  ADMIN_STAFF: { label: 'İdari Personel', cls: 'bg-teal-50 text-teal-700 border-teal-100' },
  MEMBER:      { label: 'Üye',            cls: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export default async function KullaniciDetayPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const actorRole = (session?.user as { role?: string })?.role ?? ''
  const { id } = await params

  const user = await db.user.findUnique({
    where: { id },
    include: {
      documents: {
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: { template: { select: { title: true } } },
      },
      _count: { select: { documents: true, templates: true, favorites: true } },
    },
  })

  if (!user) notFound()

  const role = ROLE_DISPLAY[user.role] ?? { label: user.role, cls: 'bg-gray-100 text-gray-500 border-gray-200' }
  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link href="/admin/kullanicilar" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kullanıcılar
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name ?? '—'}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${role.cls}`}>{role.label}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-gray-900">{user._count.documents}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-center"><FileText className="w-3 h-3" /> Belge</p>
          </div>
          <div className="text-center px-4 border-l border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{user._count.templates}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-center"><BookOpen className="w-3 h-3" /> Şablon</p>
          </div>
          <div className="text-center px-4 border-l border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{user._count.favorites}</p>
            <p className="text-xs text-gray-400 mt-0.5">Favori</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Rol değiştirme */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Rol Yönetimi</h3>
          <RoleEditor
            userId={user.id}
            currentRole={user.role}
            actorRole={actorRole}
          />
        </div>

        {/* Son belgeler */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="font-semibold text-gray-900 text-sm">Son Belgeler</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {user.documents.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">Henüz belge oluşturmamış</div>
            ) : (
              user.documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{doc.title}</p>
                    {doc.template && <p className="text-xs text-gray-400">{doc.template.title}</p>}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(doc.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
