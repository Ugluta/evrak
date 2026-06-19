'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { CATEGORY_LABELS, formatDate } from '@/lib/utils'
import { Header } from '@/components/Header'

interface Field {
  name: string
  label: string
  type: 'text' | 'date' | 'number' | 'textarea'
  required?: boolean
  placeholder?: string
}

interface Template {
  id: string
  title: string
  category: string
  description: string
  content: string
  fields: Field[]
  tags: string[]
  useCount: number
  createdAt: string
}

export default function SablonDetayPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/sablonlar/${slug}`)
      .then(r => r.json())
      .then(data => {
        setTemplate(data)
        const init: Record<string, string> = {}
        data.fields?.forEach((f: Field) => { init[f.name] = '' })
        setValues(init)
        setPreview(data.content)
      })
      .finally(() => setLoading(false))
  }, [slug])

  function updatePreview(newValues: Record<string, string>) {
    if (!template) return
    let txt = template.content
    for (const [key, val] of Object.entries(newValues)) {
      txt = txt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val || `{{${key}}}`)
    }
    setPreview(txt)
  }

  function handleChange(name: string, val: string) {
    const updated = { ...values, [name]: val }
    setValues(updated)
    updatePreview(updated)
  }

  async function handleAiAssist() {
    if (!template) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/doldur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateContent: template.content,
          fieldValues: values,
          title: template.title,
        }),
      })
      const data = await res.json()
      if (data.content) setPreview(data.content)
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSave() {
    if (!template) return
    setSaving(true)
    try {
      const res = await fetch('/api/belgelerim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          templateId: template.id,
          category: template.category,
          content: preview,
          fieldValues: values,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/belgelerim/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
          <p className="text-gray-500">Şablon bulunamadı</p>
          <Link href="/sablonlar" className="mt-3 text-blue-600 hover:underline">Geri Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          {/* Site logo — links to home */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm hidden sm:block">Öğretmen Evrak</span>
          </Link>

          <div className="w-px h-5 bg-gray-200 shrink-0" />

          {/* Back to templates */}
          <Link href="/sablonlar" className="text-gray-500 hover:text-gray-700 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">{template.title}</h1>
            <p className="text-sm text-gray-400">
              {CATEGORY_LABELS[template.category] ?? template.category} &bull; {template.useCount} kullanım
            </p>
          </div>

          <div className="ml-auto flex gap-2 shrink-0">
            <button onClick={handleAiAssist} disabled={aiLoading}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50">
              {aiLoading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              AI İle Düzenle
            </button>
            <button onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fields */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">Bilgileri Doldurun</h2>
          {template.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={4}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />
              ) : (
                <input
                  type={field.type}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        {/* Preview */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4">Belge Önizleme</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm min-h-64 font-mono text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">
            {preview}
          </div>
          <p className="text-xs text-gray-400 mt-2">Doldurulmamış alanlar \{\{alan\_adı\}\} olarak görünür</p>
        </div>
      </div>
    </div>
  )
}
