'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { FileText, User, LogOut, ChevronDown, BookOpen } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Öğretmen Evrak</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/sablonlar" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Şablonlar
          </Link>
          {session && (
            <Link href="/belgelerim" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Belgelerim
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 hidden md:block">{session.user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link href="/belgelerim" onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                    <FileText className="w-4 h-4" /> Belgelerim
                  </Link>
                  {((session.user as { role?: string })?.role === 'SUPER_ADMIN' ||
                    (session.user as { role?: string })?.role === 'ADMIN') && (
                    <Link href="/admin" onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/giris"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                Giriş Yap
              </Link>
              <Link href="/kayit"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
