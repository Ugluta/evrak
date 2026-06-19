import Link from 'next/link'
import { LayoutDashboard, FileText, BookOpen, Users, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/admin/sablonlar', label: 'Şablonlar', icon: BookOpen },
  { href: '/admin/belgeler', label: 'Belgeler', icon: FileText },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 shrink-0">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 mt-auto border-t border-gray-100 absolute bottom-0 w-56">
          <Link href="/api/auth/signout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Çıkış Yap
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
