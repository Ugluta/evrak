import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

async function saveSettings(data: FormData) {
  'use server'
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!['SUPER_ADMIN', 'ADMIN'].includes(role ?? '')) redirect('/giris')

  const siteName = (data.get('site_name') as string)?.trim()
  if (!siteName) return

  await db.setting.upsert({
    where: { key: 'site_name' },
    update: { value: siteName },
    create: { key: 'site_name', value: siteName },
  })

  revalidateTag('site-settings')
}

export default async function AyarlarPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!['SUPER_ADMIN', 'ADMIN'].includes(role ?? '')) redirect('/')

  const settings = await db.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Ayarları</h1>
        <p className="text-sm text-gray-500 mb-8">Header ve footer'da görünen marka adını buradan değiştirebilirsiniz.</p>

        <form action={saveSettings} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Site / Marka Adı
            </label>
            <input
              name="site_name"
              defaultValue={map.site_name ?? '2e Evrak'}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2e Evrak"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Örnek: &quot;2e Evrak&quot;, &quot;ikie Evrak&quot;. İlk kelime normal, ikinci kelime mavi renkte görünür.
            </p>
          </div>

          <button
            type="submit"
            className="h-10 px-6 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kaydet
          </button>
        </form>
      </main>
    </div>
  )
}
