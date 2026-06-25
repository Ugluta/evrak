'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import {
  LayoutDashboard, FileText, BookOpen, Users, LogOut, Settings,
  ChevronDown, ChevronRight, Sparkles, Shield, Package, BarChart3,
  Library, UserCog, Crown,
} from 'lucide-react'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'TEACHER' | 'ADMIN_STAFF' | 'MEMBER'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  roles?: Role[]
}

interface NavGroup {
  label: string
  icon: React.ElementType
  roles?: Role[]
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: 'Genel',
    icon: LayoutDashboard,
    items: [
      { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard, exact: true },
      { href: '/admin/istatistikler', label: 'İstatistikler', icon: BarChart3, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'İçerik Yönetimi',
    icon: BookOpen,
    items: [
      { href: '/admin/sablonlar', label: 'Şablonlar', icon: BookOpen },
      { href: '/admin/belgeler', label: 'Belgeler', icon: FileText, roles: ['SUPER_ADMIN', 'ADMIN'] },
      { href: '/admin/kutuphane', label: 'Referans Kütüphane', icon: Library, roles: ['SUPER_ADMIN', 'ADMIN'] },
    ],
  },
  {
    label: 'Kullanıcı Yönetimi',
    icon: Users,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
      { href: '/admin/roller', label: 'Roller & Yetkiler', icon: UserCog, roles: ['SUPER_ADMIN'] },
      { href: '/admin/uyelik-paketleri', label: 'Üyelik Paketleri', icon: Package, roles: ['SUPER_ADMIN'] },
    ],
  },
  {
    label: 'AI Yönetimi',
    icon: Sparkles,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      { href: '/admin/ai-kullanim', label: 'AI Kullanım', icon: Sparkles },
    ],
  },
  {
    label: 'Sistem',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
    items: [
      { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
    ],
  },
]

function hasAccess(itemRoles: Role[] | undefined, userRole: Role): boolean {
  if (!itemRoles) return true
  return itemRoles.includes(userRole)
}

export function AdminSidebar({ userRole }: { userRole: Role }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    navGroups.forEach(g => { init[g.label] = true })
    return init
  })

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  const visibleGroups = navGroups.filter(g => hasAccess(g.roles, userRole))

  return (
    <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors">
            2
          </div>
          <span className="font-semibold text-white text-sm">2e Evrak</span>
        </Link>
        {userRole === 'SUPER_ADMIN' && (
          <span className="ml-auto flex items-center gap-1 text-xs text-amber-400 font-medium">
            <Crown className="w-3 h-3" /> SA
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleGroups.map((group) => {
          const GroupIcon = group.icon
          const isOpen = open[group.label] !== false
          const visibleItems = group.items.filter(i => hasAccess(i.roles, userRole))
          if (visibleItems.length === 0) return null

          return (
            <div key={group.label}>
              {/* Group header */}
              <button
                onClick={() => setOpen(prev => ({ ...prev, [group.label]: !isOpen }))}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
              >
                <GroupIcon className="w-3.5 h-3.5" />
                <span className="flex-1 text-left">{group.label}</span>
                {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>

              {/* Items */}
              {isOpen && (
                <div className="mb-2">
                  {visibleItems.map((item) => {
                    const active = isActive(item.href, item.exact)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 ml-1 transition-colors ${
                          active
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User info + Sign out */}
      <div className="p-3 border-t border-slate-800 shrink-0 space-y-1">
        <div className="px-3 py-2 rounded-lg bg-slate-800">
          <p className="text-xs text-slate-400 font-medium">{userRole.replace('_', ' ')}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/giris' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
