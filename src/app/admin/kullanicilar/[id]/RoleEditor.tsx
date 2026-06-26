'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'

const ROLES = [
  { value: 'MEMBER',      label: 'Üye',            desc: 'Temel erişim' },
  { value: 'TEACHER',     label: 'Öğretmen',        desc: '30 AI istek/gün' },
  { value: 'ADMIN_STAFF', label: 'İdari Personel',  desc: '20 AI istek/gün' },
  { value: 'EDITOR',      label: 'Editör',           desc: 'Şablon yönetimi' },
  { value: 'ADMIN',       label: 'Admin',            desc: 'Yönetim paneli' },
  { value: 'SUPER_ADMIN', label: 'Süper Admin',      desc: 'Tam yetki' },
]

interface Props {
  userId: string
  currentRole: string
  actorRole: string
}

export function RoleEditor({ userId, currentRole, actorRole }: Props) {
  const [selected, setSelected] = useState(currentRole)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle')

  const canEdit = ['SUPER_ADMIN', 'ADMIN'].includes(actorRole)
  const visibleRoles = actorRole === 'SUPER_ADMIN'
    ? ROLES
    : ROLES.filter(r => r.value !== 'SUPER_ADMIN')

  async function handleSave() {
    if (selected === currentRole) return
    setStatus('saving')
    try {
      const res = await fetch(`/api/admin/kullanicilar/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selected }),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 2500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2500)
    }
  }

  if (!canEdit) {
    return (
      <div className="text-sm text-gray-400">Rol değiştirme yetkiniz yok.</div>
    )
  }

  return (
    <div className="space-y-2">
      {visibleRoles.map(r => (
        <button
          key={r.value}
          onClick={() => setSelected(r.value)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left text-sm transition-all ${
            selected === r.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-100 hover:border-gray-200 text-gray-700'
          }`}
        >
          <div>
            <p className="font-medium">{r.label}</p>
            <p className="text-xs text-gray-400">{r.desc}</p>
          </div>
          {selected === r.value && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
        </button>
      ))}

      <button
        onClick={handleSave}
        disabled={selected === currentRole || status === 'saving'}
        className="w-full mt-3 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'saving' ? 'Kaydediliyor...' : 'Rolü Güncelle'}
      </button>

      {status === 'ok' && (
        <p className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
          <CheckCircle className="w-3.5 h-3.5" /> Rol güncellendi
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> Bir hata oluştu
        </p>
      )}
    </div>
  )
}
