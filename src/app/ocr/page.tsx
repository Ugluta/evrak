'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { ScanText, Upload, X, Copy, Download, Loader2, Check } from 'lucide-react'

type Mode = 'extract' | 'clean' | 'summary'

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'extract', label: 'Metni Çıkar', desc: 'Görseldeki tüm metni aynen çıkarır' },
  { key: 'clean', label: 'Çıkar & Düzenle', desc: 'Metni okur ve yazım hatalarını düzeltir' },
  { key: 'summary', label: 'Özetle', desc: '3-5 cümle ile içeriği özetler' },
]

export default function OcrPage() {
  const { status } = useSession()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('extract')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/giris?next=/ocr')
  }, [status, router])

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setResult('')
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleProcess() {
    if (!preview) return
    setLoading(true)
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: preview, mode }),
      })
      const data = await res.json()
      setResult(data.text || '')
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result)
    a.download = 'ocr-sonuc.txt'
    a.click()
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ScanText className="w-7 h-7 text-blue-600" />
            OCR — Görüntüden Metin
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Fotoğraf veya belge görselinden metin çıkarın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Upload + Mode */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => !preview && inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl transition-colors ${
                preview
                  ? 'border-gray-200 bg-white'
                  : 'border-blue-200 bg-blue-50 hover:border-blue-400 cursor-pointer'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Yüklenen görsel"
                    className="w-full rounded-xl object-contain max-h-80"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreview(null); setResult('') }}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <Upload className="w-10 h-10 text-blue-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">Görsel sürükleyin veya tıklayın</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG desteklenir</p>
                </div>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">İşlem Modu</p>
              <div className="space-y-2">
                {MODES.map((m) => (
                  <label key={m.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="mode"
                      value={m.key}
                      checked={mode === m.key}
                      onChange={() => setMode(m.key)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!preview || loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> İşleniyor...</>
                : <><ScanText className="w-4 h-4" /> Metni Çıkar</>}
            </button>
          </div>

          {/* Right: Result */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Sonuç</h2>
              {result && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> .txt İndir
                  </button>
                </div>
              )}
            </div>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder={loading ? 'İşleniyor...' : 'Sonuç burada görünecek...'}
              rows={24}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
