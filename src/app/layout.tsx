import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Evrak | Öğretmen Evrak', template: '%s | Öğretmen Evrak' },
  description: 'Okul yönetimi için resmi evrak şablonları ve belge oluşturma platformu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  )
}
