'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-3">Hata</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Bir şeyler ters gitti</h1>
        <p className="text-gray-500 text-[15px] mb-8">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="h-10 px-5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="h-10 px-5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-white transition-colors flex items-center"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
