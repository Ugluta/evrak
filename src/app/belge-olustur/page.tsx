'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Sparkles, Copy, Download, Save, Loader2 } from 'lucide-react'

const CATEGORIES = [
  { value: 'DILEKCELER', label: 'Dilekçe' },
  { value: 'TUTANAKLAR', label: 'Tutanak' },
  { value: 'IZIN_FORMLARI', label: 'İzin Formu' },
  { value: 'ZIMMET', label: 'Zimmet' },
  { value: 'GOREVLENDIRME', label: 'Görevlendirme' },
  { value: 'YAZISMALAR', label: 'Yazışma' },
  { value: 'SOZLESMELER', label: 'Sözleşme' },
  { value: 'RAPORLAR', label: 'Rapor' },
  { value: 'DIGER', label: 'Diğer' },
]

export default function BelgeOlusturPage() {
  const { status } = useSession()
  const router = useRouter()

  const [category, setCategory] = useState('DILEKCELER')
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/belge-olustur')
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') return null

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult('')
    const res = await fetch('/api/ai/belge-olustur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, title, context }),
    })
    const data = await res.json()
    setResult(data.text || '')
    setLoading(false)
  }

  async function handleSave() {
    if (!result.trim()) return
    setSaving(true)
    const res = await fetch('/api/belgelerim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || 'AI Belgesi',
        category,
        content: result,
        fieldValues: {},
        isAiAssisted: true,
      }),
    })
    const doc = await res.json()
    setSaving(false)
    if (doc?.id) router.push(`/belgelerim/${doc.id}`)
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'belge'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AI Belge Oluştur</h1>
            </div>
            <p className="text-sm text-gray-500 ml-11.5">Yapay zeka ile resmi Türkçe evrak oluşturun</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Belge Türü</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`px-2 py-2 rounded-xl text-xs font-medium border transition-all ${
                          category === c.value
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık / Konu *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Örn: Yıllık izin talebi dilekçesi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ek Bilgi <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
                  </label>
                  <textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Kişi adı, tarih, okul adı, sebep gibi bilgileri buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Oluşturuluyor…</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Belge Oluştur</>
                  )}
                </button>
              </div>
            </form>

            {/* Right: Result */}
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Oluşturulan Belge</span>
                  {result && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copied ? 'Kopyalandı!' : 'Kopyala'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <Download className="w-3.5 h-3.5" /> İndir
                      </button>
                    </div>
                  )}
                </div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" />
                    <p className="text-sm text-gray-400">Belge oluşturuluyor, lütfen bekleyin…</p>
                  </div>
                ) : result ? (
                  <textarea
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    rows={18}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Sparkles className="w-10 h-10 text-purple-200 mb-3" />
                    <p className="text-sm text-gray-400">Belge türünü ve başlığı seçip\n\"Belge Oluştur\" butonuna tıklayın</p>
                  </div>
                )}
              </div>

              {result && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Kaydediliyor…' : 'Belgelerim'e Kaydet'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
