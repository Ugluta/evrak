import { getSiteName } from '@/lib/settings'
import { Header } from './Header'

export async function ServerHeader() {
  const siteName = await getSiteName()
  return <Header siteName={siteName} />
}
