'use client'

import { Bell, Search, ChevronDown, Radio } from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editör',
  TEACHER: 'Öğretmen',
  ADMIN_STAFF: 'İdari Personel',
  MEMBER: 'Üye',
}

const TICKER_ITEMS = [
  'Yeni şablon kategorileri eklendi — dilekçe şablonları güncellendi',
  'AI Belge oluşturucu artık mahkeme dilekçelerini de destekliyor',
  'Referans kütüphanesi genişletildi: 150+ yeni Yargıtay kararı mevcut',
  'Özlük hakları bölümüne yeni belgeler yüklendi',
  'Sistem bakımı: Her Pazar 02:00–03:00 arası kısa kesinti olabilir',
]

interface Props {
  userName?: string | null
  userRole: string
}

export function AdminHeader({ userName, userRole }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = (userName ?? 'A').slice(0, 2).toUpperCase()
  const roleLabel = ROLE_LABEL[userRole] ?? userRole
  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
  const tickerText = TICKER_ITEMS.join('     ·     ')

  return (
    <header className="bg-white border-b-2 border-gray-200 shrink-0 sticky top-0 z-10">
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker 40s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ── Main row ── */}
      <div className="h-14 flex items-center justify-between px-6 gap-4">

        {/* Left: date only */}
        <p className="text-sm font-medium text-gray-500 capitalize shrink-0">{today}</p>

        {/* Center: search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              placeholder="Şablon, belge veya kullanıcı ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Right: bell + profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-[18px] h-[18px] text-gray-500" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-1 ring-white" />
          </button>

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
                <div className="absolute right-0 top-11 w-44 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-100">
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
      </div>

      {/* ── Kayan haber bandı ── */}
      <div className="h-8 border-t border-gray-200 bg-blue-50 flex items-center overflow-hidden">
        <div className="flex items-center gap-3 px-4 shrink-0 border-r border-blue-100 h-full">
          <Radio className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider whitespace-nowrap">Haberler</span>
        </div>
        <div className="flex-1 overflow-hidden h-full flex items-center">
          <div className="ticker-track inline-flex whitespace-nowrap">
            <span className="text-xs text-blue-800/80 pr-16">{tickerText}</span>
            <span className="text-xs text-blue-800/80 pr-16">{tickerText}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
