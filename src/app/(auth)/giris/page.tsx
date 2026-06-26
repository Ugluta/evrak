'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function GirisForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sifirlanda = searchParams.get('sifre-sifirlanda')

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('E-posta veya şifre hatalı')
    } else {
      router.push('/belgelerim')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">2</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Giriş Yap</h1>
          <p className="text-gray-500 text-sm mt-1">Belgelerinize erişin</p>
        </div>

        {sifirlanda && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4">
            Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-posta</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@ornek.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">Şifre</label>
              <Link href="/sifremi-unuttum" className="text-xs text-blue-600 hover:underline">
                Şifremi Unuttum
              </Link>
            </div>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şifreniz"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="text-blue-600 font-medium hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-8 h-80 animate-pulse" />
      </div>
    }>
      <GirisForm />
    </Suspense>
  )
}
