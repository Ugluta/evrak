import { db } from './db'
import { unstable_cache } from 'next/cache'

export const getSettings = unstable_cache(
  async () => {
    const rows = await db.setting.findMany()
    return Object.fromEntries(rows.map((r) => [r.key, r.value]))
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 3600 }
)

export async function getSiteName(): Promise<string> {
  const s = await getSettings()
  return s.site_name ?? '2e Evrak'
}
