'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    await fetch('/api/auth/sifremi-unuttum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setStatus('sent')
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Şifremi Unuttum</h1>
          <p className="text-gray-500 text-sm mt-1">
            E-posta adresinize sıfırlama bağlantısı göndereceğiz.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Eğer bu e-posta adresine kayıtlı bir hesap varsa, sıfırlama bağlantısı gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </p>
            <Link href="/giris" className="block text-sm text-blue-600 font-medium hover:underline mt-2">
              Giriş sayfasına dön
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@ornek.com"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {status === 'loading' ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
            </button>
            <p className="text-center text-sm text-gray-500 pt-1">
              <Link href="/giris" className="text-blue-600 font-medium hover:underline">
                Giriş sayfasına dön
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
