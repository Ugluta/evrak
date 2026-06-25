import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as { role?: string } | undefined
  if (!session?.user || !ALLOWED_ROLES.includes(user?.role || '')) {
    redirect('/giris')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar userRole={user?.role as 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'TEACHER' | 'ADMIN_STAFF' | 'MEMBER'} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
