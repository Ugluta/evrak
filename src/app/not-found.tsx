import Link from 'next/link'
import { Header } from '@/components/Header'
import { FileSearch } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center px-4 py-24">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <FileSearch className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Sayfa bulunamadı</h1>
          <p className="text-gray-500 mb-8">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="h-10 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center"
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/sablonlar"
              className="h-10 px-5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-white transition-colors flex items-center"
            >
              Şablonlara Bak
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
