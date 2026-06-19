import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

const ALLOWED_ROLES = ['SUPER_ADMIN', 'ADMIN']

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || !ALLOWED_ROLES.includes((session.user as { role?: string }).role || '')) {
    redirect('/giris')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
