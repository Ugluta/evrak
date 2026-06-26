'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Download, Trash2, Save, Copy, Check,
  Bot, Share2, X, Link2,
} from 'lucide-react'
import { CATEGORY_LABELS, formatDate } from '@/lib/utils'
import { Header } from '@/components/Header'

interface Document {
  id: string
  title: string
  slug: string
  category: string
  content: string
  status: string
  fieldValues: Record<string, string>
  isAiAssisted: boolean
  shareToken?: string | null
  createdAt: string
  updatedAt: string
  template?: { title: string; slug: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Taslak', REVIEW: 'İncelemede', APPROVED: 'Onaylı',
  PUBLISHED: 'Yayında', ARCHIVED: 'Arşivlendi',
}

export default function BelgeDetayPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const sharePanelRef = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareLoading, setShareLoading] = useState(false)
  const [showSharePanel, setShowSharePanel] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/belgelerim/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDoc(data)
        setEditContent(data.content || '')
        if (data.shareToken) {
          setShareUrl(`${window.location.origin}/paylasim/${data.shareToken}`)
        }
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sharePanelRef.current && !sharePanelRef.current.contains(e.target as Node)) {
        setShowSharePanel(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/belgelerim/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    })
    setSaving(false)
    setIsDirty(false)
  }

  const handleDelete = async () => {
    if (!confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/belgelerim/${id}`, { method: 'DELETE' })
    router.push('/belgelerim')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAiImprove = async () => {
    if (!doc) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/doldur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateContent: editContent,
          fieldValues: doc.fieldValues,
          title: doc.title,
        }),
      })
      const data = await res.json()
      if (data.content) {
        setEditContent(data.content)
        setIsDirty(true)
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleShare = async () => {
    if (shareUrl) {
      setShowSharePanel(true)
      return
    }
    setShareLoading(true)
    try {
      const res = await fetch(`/api/belgelerim/${id}/paylas`, { method: 'POST' })
      const data = await res.json()
      if (data.shareToken) {
        const url = `${window.location.origin}/paylasim/${data.shareToken}`
        setShareUrl(url)
        setShowSharePanel(true)
      }
    } finally {
      setShareLoading(false)
    }
  }

  const handleRevokeShare = async () => {
    await fetch(`/api/belgelerim/${id}/paylas`, { method: 'DELETE' })
    setShareUrl(null)
    setShowSharePanel(false)
  }

  const copyShareUrl = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <p className="text-gray-500 mb-4">Belge bulunamadı</p>
          <Link href="/belgelerim" className="text-blue-600 hover:underline">Belgelerime Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/belgelerim" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base font-bold text-gray-900 truncate">{doc.title}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {STATUS_LABELS[doc.status] || doc.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {CATEGORY_LABELS[doc.category] || doc.category}
              </span>
              {doc.isAiAssisted && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 flex items-center gap-1">
                  <Bot className="w-3 h-3" /> AI
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(doc.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAiImprove}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 disabled:opacity-50 transition-colors"
            >
              {aiLoading
                ? <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                : <Bot className="w-4 h-4" />}
              AI Geliştir
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
            <a
              href={`/api/belgelerim/${id}/pdf`}
              download
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4" /> PDF İndir
            </a>
            <div className="relative" ref={sharePanelRef}>
              <button
                onClick={handleShare}
                disabled={shareLoading}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                  shareUrl
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {shareLoading
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : shareUrl ? <Link2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {shareUrl ? 'Paylaşımda' : 'Paylaş'}
              </button>
              {showSharePanel && shareUrl && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80 z-30">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-800">Paylaşım Linki</p>
                    <button onClick={() => setShowSharePanel(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Link 7 gün geçerlidir.</p>
                  <div className="flex gap-2 mb-3">
                    <input
                      readOnly
                      value={shareUrl}
                      className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 truncate focus:outline-none"
                    />
                    <button
                      onClick={copyShareUrl}
                      className="shrink-0 px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {shareCopied ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                  </div>
                  <button
                    onClick={handleRevokeShare}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    Paylaşımı Kaldır
                  </button>
                </div>
              )}
            </div>
            {isDirty && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">İçerik Düzenle</h2>
          <textarea
            value={editContent}
            onChange={(e) => { setEditContent(e.target.value); setIsDirty(true) }}
            rows={24}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 mb-3">Önizleme</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 min-h-96 shadow-sm">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <p className="text-lg font-bold text-center text-gray-900">{doc.title}</p>
              <p className="text-xs text-right text-gray-400 mt-1">{formatDate(doc.createdAt)}</p>
            </div>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {editContent}
            </pre>
          </div>
          {doc.template && (
            <p className="text-xs text-gray-400 mt-2">
              Şablon:{' '}
              <Link href={`/sablonlar/${doc.template.slug}`} className="text-blue-600 hover:underline">
                {doc.template.title}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
