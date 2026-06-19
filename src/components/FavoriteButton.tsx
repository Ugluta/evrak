'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

export function FavoriteButton({
  templateId,
  initialFavorited,
}: {
  templateId: string
  initialFavorited: boolean
}) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/favoriler', {
        method: favorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      })
      if (res.status === 401) {
        router.push('/giris?next=/favorilerim')
        return
      }
      if (res.ok) setFavorited(!favorited)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`p-1.5 rounded-full transition-all ${
        favorited
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-gray-300 bg-white shadow-sm hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100'
      }`}
      title={favorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
    >
      <Heart className={`w-4 h-4 ${favorited ? 'fill-red-500' : ''}`} />
    </button>
  )
}
