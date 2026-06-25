'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, BookOpen, Users, Settings,
  ChevronDown, ChevronRight, Sparkles, Shield, Package, BarChart3,
  Library, UserCog, Crown, PlusCircle, Upload, Gauge, Bell,
  FolderOpen, Scale,
} from 'lucide-react'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'TEACHER' | 'ADMIN_STAFF' | 'MEMBER'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  roles?: Role[]
  badge?: string
}

interface NavGroup {
  key: string
  label: string
  icon: React.ElementType
  roles?: Role[]
  items: NavItem[]
  defaultOpen?: boolean
}

const navGroups: NavGroup[] = [
  {
    key: 'genel',
    label: 'Genel',
    icon: Gauge,
    defaultOpen: true,
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/admin/istatistikler', label: 'İstatistikler', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    key: 'sablon',
    label: 'Şablon & Belge',
    icon: BookOpen,
    defaultOpen: true,
    items: [
      { href: '/admin/sablonlar', label: 'Şablonlar', icon: BookOpen },
      { href: '/admin/sablonlar/yeni', label: 'Yeni Şablon', icon: PlusCircle, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
      { href: '/admin/belgeler', label: 'Tüm Belgeler', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    key: 'kutuphane',
    label: 'Referans Kütüphane',
    icon: Library,
    defaultOpen: true,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { href: '/admin/kutuphane', label: 'Tüm Dosyalar', icon: FolderOpen },
      { href: '/admin/kutuphane/ozluk', label: 'Özlük Hakları', icon: Scale },
      { href: '/admin/kutuphane/mahkeme', label: 'Mahkeme Kararları', icon: Scale },
      { href: '/admin/kutuphane/yukle', label: 'Dosya Yükle', icon: Upload },
    ],
  },
  {
    key: 'ai',
    label: 'AI Merkezi',
    icon: Sparkles,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { href: '/admin/ai-kullanim', label: 'Kullanım Raporu', icon: Sparkles },
      { href: '/admin/ai-limitler', label: 'Limit Yönetimi', icon: Gauge },
    ],
  },
  {
    key: 'kullanicilar',
    label: 'Kullanıcı Yönetimi',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
      { href: '/admin/uyelik-paketleri', label: 'Üyelik Paketleri', icon: Package, roles: ['SUPER_ADMIN'] },
      { href: '/admin/roller', label: 'Roller & Yetkiler', icon: UserCog, roles: ['SUPER_ADMIN'] },
    ],
  },
  {
    key: 'sistem',
    label: 'Sistem',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
    items: [
      { href: '/admin/duyurular', label: 'Duyurular', icon: Bell },
      { href: '/admin/ayarlar', label: 'Site Ayarları', icon: Settings },
    ],
  },
]

function hasAccess(itemRoles: Role[] | undefined, userRole: Role): boolean {
  if (!itemRoles) return true
  return itemRoles.includes(userRole)
}

export function AdminSidebar({ userRole, userName }: { userRole: Role; userName?: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    navGroups.forEach(g => { init[g.key] = g.defaultOpen ?? false })
    return init
  })

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  function groupHasActive(group: NavGroup) {
    return group.items.some(i => isActive(i.href, i.exact))
  }

  const visibleGroups = navGroups.filter(g => hasAccess(g.roles, userRole))

  return (
    <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none">

      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800 shrink-0 gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors">
            2
          </div>
          <span className="font-semibold text-white text-sm">2e Evrak</span>
        </Link>
        {userRole === 'SUPER_ADMIN' && (
          <span className="ml-auto flex items-center gap-1 text-xs text-amber-400 font-semibold">
            <Crown className="w-3 h-3" /> SA
          </span>
        )}
        {userRole === 'ADMIN' && (
          <span className="ml-auto text-xs text-slate-500 font-medium">Admin</span>
        )}
        {userRole === 'EDITOR' && (
          <span className="ml-auto text-xs text-slate-500 font-medium">Editör</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon
          const isOpen = open[group.key]
          const hasActive = groupHasActive(group)
          const visibleItems = group.items.filter(i => hasAccess(i.roles, userRole))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.key} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => setOpen(prev => ({ ...prev, [group.key]: !isOpen }))}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  hasActive && !isOpen
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <GroupIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                {isOpen
                  ? <ChevronDown className="w-3 h-3 shrink-0" />
                  : <ChevronRight className="w-3 h-3 shrink-0" />}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="mt-0.5 mb-1 space-y-0.5">
                  {visibleItems.map((item) => {
                    const active = isActive(item.href, item.exact)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ml-1 ${
                          active
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">{item.badge}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom: user info only (signout is in header dropdown) */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/40">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {(userName ?? 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-100 font-medium truncate">{userName ?? 'Admin'}</p>
            <p className="text-xs text-slate-500">{userRole.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
