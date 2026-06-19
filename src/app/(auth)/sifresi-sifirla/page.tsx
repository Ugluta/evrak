'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function SifresiSifirlaForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''

  const [form, setForm] = useState({ password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token || !email) {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-gray-600">Geçersiz veya süresi dolmuş sıfırlama bağlantısı.</p>
        <Link href="/sifremi-unuttum" className="text-sm text-blue-600 hover:underline font-medium">
          Yeni bağlantı iste
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Şifreler eşleşmiyor')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/sifresi-sifirla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password: form.password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Bir hata oluştu')
      setLoading(false)
      return
    }

    router.push('/giris?sifre-sifirlanda=1')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Yeni Şifre</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="En az 8 karakter"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre Tekrar</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Şifrenizi tekrar girin"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Kaydediliyor…' : 'Şifremi Güncelle'}
      </button>
    </form>
  )
}

export default function SifresiSifirlaPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Şifre</h1>
          <p className="text-gray-500 text-sm mt-1">Hesabınız için yeni bir şifre belirleyin.</p>
        </div>
        <Suspense fallback={<div className="h-32 flex items-center justify-center text-sm text-gray-400">Yükleniyor…</div>}>
          <SifresiSifirlaForm />
        </Suspense>
      </div>
    </div>
  )
}
