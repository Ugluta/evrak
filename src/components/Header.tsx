'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { FileText, User, LogOut, ChevronDown, Heart, ScanText, Sparkles, Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export function Header({ siteName = '2e Evrak' }: { siteName?: string }) {
  const { data: session } = useSession()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : session?.user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  const isAdmin =
    (session?.user as { role?: string })?.role === 'SUPER_ADMIN' ||
    (session?.user as { role?: string })?.role === 'ADMIN'

  const [first, ...rest] = siteName.split(' ')
  const second = rest.join(' ')

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.08)]' : 'border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect width="30" height="30" rx="8" fill="#1d4ed8" />
              <path d="M8 10h14M8 15h9M8 20h11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="text-[17px] font-semibold tracking-tight text-gray-900 leading-none">
              {first}{second && <span className="text-blue-600"> {second}</span>}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            <Link href="/sablonlar" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
              Şablonlar
            </Link>
            {session && (
              <>
                <Link href="/belgelerim" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                  Belgelerim
                </Link>
                <Link href="/favorilerim" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                  Favorilerim
                </Link>
                <Link href="/ocr" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors">
                  OCR
                </Link>
                <Link
                  href="/belge-olustur"
                  className="ml-1 flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Belge
                </Link>
              </>
            )}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[11px] font-bold">{initials}</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium hidden lg:block max-w-[120px] truncate">
                    {session.user?.name}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">{session.user?.name}</p>
                      <p className="text-[12px] text-gray-400 truncate">{session.user?.email}</p>
                    </div>
                    {[
                      { href: '/belgelerim', icon: FileText, label: 'Belgelerim' },
                      { href: '/favorilerim', icon: Heart, label: 'Favorilerim' },
                      { href: '/ocr', icon: ScanText, label: 'OCR Aracı' },
                      { href: '/belge-olustur', icon: Sparkles, label: 'AI Belge Oluştur' },
                      { href: '/profil', icon: User, label: 'Profilim' },
                    ].map(({ href, icon: Icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4 text-gray-400" /> {label}
                      </Link>
                    ))}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 text-gray-400" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/giris"
                  className="h-9 px-4 text-[13.5px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/kayit"
                  className="h-9 px-4 text-[13.5px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 ml-auto"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-5 py-4 space-y-0.5">
            <Link href="/sablonlar" className="block h-10 px-3 flex items-center text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
              Şablonlar
            </Link>
            {session && (
              <>
                <Link href="/belgelerim" className="block h-10 px-3 flex items-center text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Belgelerim
                </Link>
                <Link href="/favorilerim" className="block h-10 px-3 flex items-center text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Favorilerim
                </Link>
                <Link href="/ocr" className="block h-10 px-3 flex items-center text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  OCR
                </Link>
                <Link href="/belge-olustur" className="flex h-10 px-3 items-center gap-1.5 text-[14px] font-medium text-purple-600 hover:bg-purple-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  <Sparkles className="w-4 h-4" /> AI Belge Oluştur
                </Link>
                <Link href="/profil" className="block h-10 px-3 flex items-center text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  Profilim
                </Link>
              </>
            )}
            <div className="flex gap-2 pt-3 mt-1 border-t border-gray-100">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex-1 h-10 text-[13.5px] font-medium text-red-600 border border-red-200 rounded-lg"
                >
                  Çıkış Yap
                </button>
              ) : (
                <>
                  <Link href="/giris" className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-medium text-gray-700 border border-gray-200 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" className="flex-1 h-10 flex items-center justify-center text-[13.5px] font-semibold text-white bg-blue-600 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
