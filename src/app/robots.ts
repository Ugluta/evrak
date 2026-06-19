import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://evrak.ogretmenevrak.com'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/giris',
          '/kayit',
          '/belgelerim',
          '/favorilerim',
          '/profil',
          '/belge-olustur',
          '/ocr',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
