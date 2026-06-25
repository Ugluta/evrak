'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy } from 'lucide-react'

export function KlonaButon({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClone() {
    if (!confirm('Bu şablonu kopyalamak istiyor musunuz?')) return
    setLoading(true)
    try {
      const res = await fetch('/api/sablonlar/kopyala', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/admin/sablonlar/${data.id}`)
        router.refresh()
      } else {
        alert('Kopyalama başarısız')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClone}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
      title="Şablonu Kopyala"
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      Kopyala
    </button>
  )
}
