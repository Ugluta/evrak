'use client'

import { Bell, Search, ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/istatistikler': 'İstatistikler',
  '/admin/sablonlar': 'Şablonlar',
  '/admin/sablonlar/yeni': 'Yeni Şablon',
  '/admin/belgeler': 'Tüm Belgeler',
  '/admin/kullanicilar': 'Kullanıcılar',
  '/admin/kutuphane': 'Referans Kütüphane',
  '/admin/kutuphane/ozluk': 'Özlük Hakları',
  '/admin/kutuphane/mahkeme': 'Mahkeme Kararları',
  '/admin/kutuphane/yukle': 'Dosya Yükle',
  '/admin/ai-kullanim': 'AI Kullanım Raporu',
  '/admin/ai-limitler': 'AI Limit Yönetimi',
  '/admin/uyelik-paketleri': 'Üyelik Paketleri',
  '/admin/roller': 'Roller & Yetkiler',
  '/admin/duyurular': 'Duyurular',
  '/admin/ayarlar': 'Site Ayarları',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editör',
  TEACHER: 'Öğretmen',
  ADMIN_STAFF: 'İdari Personel',
  MEMBER: 'Üye',
}

interface Props {
  userName?: string | null
  userRole: string
}

export function AdminHeader({ userName, userRole }: Props) {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const title = PAGE_TITLES[pathname] ?? 'Yönetim Paneli'
  const initials = (userName ?? 'A').slice(0, 2).toUpperCase()
  const roleLabel = ROLE_LABEL[userRole] ?? userRole
  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      {/* Left: title + date */}
      <div>
        <h1 className="font-bold text-gray-900 text-base leading-tight">{title}</h1>
        <p className="text-xs text-gray-400 capitalize">{today}</p>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-2">

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            placeholder="Ara..."
            className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-4.5 h-4.5 text-gray-500" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
        </button>

        {/* Profile avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{userName ?? 'Admin'}</p>
              <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-11 w-44 bg-white rounded-xl border border-gray-100 shadow-lg z-20 py-1 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800">{userName ?? 'Admin'}</p>
                  <p className="text-xs text-gray-400">{roleLabel}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/giris' })}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
