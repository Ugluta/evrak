'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, FileText, BookOpen, Users, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/admin',              label: 'Genel Bakış',  icon: LayoutDashboard, exact: true },
  { href: '/admin/sablonlar',   label: 'Şablonlar',     icon: BookOpen },
  { href: '/admin/belgeler',    label: 'Belgeler',      icon: FileText },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar',  icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact = false) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="w-56 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-500 transition-colors">
            Ö
          </div>
          <span className="font-semibold text-white text-sm">ÖğretmenEvrak</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
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
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-slate-800 shrink-0">
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
