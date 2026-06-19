'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { User, FileText, Heart, Lock, CheckCircle } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Süper Admin',
  ADMIN: 'Admin',
  EDITOR: 'Editör',
  TEACHER: 'Öğretmen',
  ADMIN_STAFF: 'İdari Personel',
  MEMBER: 'Üye',
}

interface ProfileData {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  _count: { documents: number; favorites: number }
}

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [saving, setSaving] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/profil')
    if (status === 'authenticated') {
      fetch('/api/profil')
        .then(r => r.json())
        .then(d => {
          setProfile(d)
          setName(d.name || '')
        })
    }
  }, [status, router])

  async function saveName() {
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSuccess('İsim güncellendi')
      setProfile(p => p ? { ...p, name } : p)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Hata oluştu')
    } finally { setSaving(false) }
  }

  async function changePassword() {
    if (newPw !== confirmPw) { setError('Şifreler eşleşmiyor'); return }
    setPwSaving(true); setError(''); setSuccess('')
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      setSuccess('Şifre güncellendi')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Hata oluştu')
    } finally { setPwSaving(false) }
  }

  if (status === 'loading' || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const initials = profile.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">{profile.name || 'İsimsiz'}</h2>
              <p className="text-gray-500 text-sm">{profile.email}</p>
              <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {ROLE_LABELS[profile.role] || profile.role}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-gray-900">{profile._count.documents}</p>
              <p className="text-xs text-gray-500">Belge</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-gray-900">{profile._count.favorites}</p>
              <p className="text-xs text-gray-500">Favori</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <User className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-gray-700 mt-1.5">
                {new Date(profile.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
              </p>
              <p className="text-xs text-gray-500">Katılım</p>
            </div>
          </div>
        </div>

        {/* Name Edit */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ad Soyad</h3>
          <div className="flex gap-3">
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={saveName} disabled={saving || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Şifre Değiştir
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={changePassword} disabled={pwSaving || !currentPw || !newPw || !confirmPw}
              className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
              {pwSaving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </div>
        </div>

        <div className="flex gap-3 text-sm">
          <Link href="/belgelerim" className="text-blue-600 hover:underline">Belgelerime Git</Link>
          <span className="text-gray-300">|</span>
          <Link href="/favorilerim" className="text-blue-600 hover:underline">Favorilerim</Link>
        </div>
      </div>
    </div>
  )
}
