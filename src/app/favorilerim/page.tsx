import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { CATEGORY_LABELS } from '@/lib/utils'
import { FileText, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Favori Şablonlarım' }

export default async function FavorilerimPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris?next=/favorilerim')

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      template: {
        select: {
          id: true, title: true, slug: true, category: true,
          description: true, useCount: true, isPremium: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Favori Şablonlarım</h1>
            <p className="text-gray-500 text-sm mt-1">{favorites.length} favori şablon</p>
          </div>
          <Link href="/sablonlar" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <BookOpen className="w-4 h-4" /> Şablonlara Göz At
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">♡</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Henüz favori şablonunuz yok</h2>
            <p className="text-gray-500 text-sm mb-6">
              Şablonlar sayfasında kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
            </p>
            <Link href="/sablonlar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
              <BookOpen className="w-4 h-4" /> Şablonlara Git
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(({ template }) => (
              <Link key={template.id} href={`/sablonlar/${template.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all block">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {CATEGORY_LABELS[template.category] ?? template.category}
                  </span>
                  {template.isPremium && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Premium</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                {template.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {template.useCount} kullanım
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
