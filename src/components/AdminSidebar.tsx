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
    defaultOpen: false,
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
    defaultOpen: false,
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
    defaultOpen: false,
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
    defaultOpen: false,
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
    navGroups.forEach(g => {
      // auto-open the group that contains the active item
      const hasActive = g.items.some(i =>
        i.exact ? pathname === i.href : pathname.startsWith(i.href)
      )
      init[g.key] = hasActive || (g.defaultOpen ?? false)
    })
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
    <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none overflow-hidden">

      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800/80 shrink-0 gap-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors duration-150">
            2
          </div>
          <span className="font-bold text-white text-sm tracking-tight">2e Evrak</span>
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
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon
          const isOpen = open[group.key]
          const hasActive = groupHasActive(group)
          const visibleItems = group.items.filter(i => hasAccess(i.roles, userRole))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.key} className="mb-0.5">

              {/* Group header button */}
              <button
                onClick={() => setOpen(prev => ({ ...prev, [group.key]: !isOpen }))}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-widest transition-all duration-150 ${
                  hasActive
                    ? 'text-slate-200'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <GroupIcon className="w-3 h-3 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                {isOpen
                  ? <ChevronDown className="w-3 h-3 shrink-0 transition-transform duration-200" />
                  : <ChevronRight className="w-3 h-3 shrink-0 transition-transform duration-200" />}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="mt-0.5 mb-2 pl-1 space-y-0.5">
                  {visibleItems.map((item) => {
                    const active = isActive(item.href, item.exact)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                          active
                            ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/50'
                            : 'text-slate-400 hover:bg-slate-700/70 hover:text-white'
                        }`}
                      >
                        {/* Active left bar */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-300 rounded-full" />
                        )}
                        <Icon className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                          active ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'
                        }`} />
                        <span className="flex-1 truncate">{item.label}</span>
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

      {/* User info */}
      <div className="p-3 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors duration-150 cursor-default">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
            {(userName ?? 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-100 font-semibold truncate leading-tight">{userName ?? 'Admin'}</p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">{userRole.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
