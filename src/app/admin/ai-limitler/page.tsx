'use client'
import { useState } from 'react'
import { Gauge, Save } from 'lucide-react'

const ROLES = [
  { role: 'SUPER_ADMIN', label: 'Süper Admin', limit: 0, note: 'Sınırsız' },
  { role: 'ADMIN', label: 'Admin', limit: 0, note: 'Sınırsız' },
  { role: 'EDITOR', label: 'Editör', limit: 50, note: '50/gün' },
  { role: 'TEACHER', label: 'Öğretmen', limit: 30, note: '30/gün' },
  { role: 'ADMIN_STAFF', label: 'İdari Personel', limit: 20, note: '20/gün' },
  { role: 'MEMBER', label: 'Üye', limit: 10, note: '10/gün' },
]

export default function AiLimitlerPage() {
  const [limits, setLimits] = useState(ROLES)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Gauge className="w-6 h-6" /> AI Limit Yönetimi
        </h1>
        <p className="text-gray-500 text-sm mt-1">Role göre günlük AI kullanım kotaları (0 = sınırsız)</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        {limits.map((item, i) => (
          <div key={item.role} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-gray-900 text-sm">{item.label}</p>
              <p className="text-xs text-gray-400">{item.note}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                value={item.limit}
                onChange={(e) => {
                  const updated = [...limits]
                  updated[i] = { ...item, limit: Number(e.target.value), note: Number(e.target.value) === 0 ? 'Sınırsız' : `${e.target.value}/gün` }
                  setLimits(updated)
                }}
                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400 w-16">{item.limit === 0 ? 'sınırsız' : 'istek/gün'}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <Save className="w-4 h-4" />
        {saved ? 'Kaydedildi!' : 'Kaydet'}
      </button>

      <p className="text-xs text-gray-400">
        Not: Limit değişiklikleri şu an sadece görsel — DB entegrasyonu bir sonraki aşamada eklenecek.
      </p>
    </div>
  )
}
