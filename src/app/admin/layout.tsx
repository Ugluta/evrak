import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'
import { AdminHeader } from '@/components/AdminHeader'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR']

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'TEACHER' | 'ADMIN_STAFF' | 'MEMBER'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user as { role?: string; name?: string | null } | undefined
  if (!session?.user || !ALLOWED_ROLES.includes(user?.role || '')) {
    redirect('/giris')
  }

  const role = (user?.role ?? 'MEMBER') as Role

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <AdminSidebar userRole={role} userName={user?.name} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader userRole={role} userName={user?.name} />
        <main className="flex-1 overflow-auto p-7">{children}</main>
      </div>
    </div>
  )
}
