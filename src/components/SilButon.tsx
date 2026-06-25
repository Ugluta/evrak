'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SilButon({ id, endpoint, label = 'Sil' }: { id: string; endpoint: string; label?: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2.5 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Evet, sil'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          İptal
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title={label}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
