'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'

interface Field {
  name: string
  label: string
  type: 'text' | 'date' | 'number' | 'textarea'
  required: boolean
  placeholder: string
}

const CATEGORIES = [
  { value: 'DILEKCELER', label: 'Dilekçeler' },
  { value: 'TUTANAKLAR', label: 'Tutanaklar' },
  { value: 'IZIN_FORMLARI', label: 'İzin Formları' },
  { value: 'ZIMMET', label: 'Zimmet' },
  { value: 'GOREVLENDIRME', label: 'Görevlendirme' },
  { value: 'YAZISMALAR', label: 'Yazışmalar' },
  { value: 'SOZLESMELER', label: 'Sözleşmeler' },
  { value: 'RAPORLAR', label: 'Raporlar' },
  { value: 'DIGER', label: 'Diğer' },
]

export default function YeniSablonPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', slug: '', description: '', category: 'DILEKCELER',
    content: '', tags: '', isPublic: true, isPremium: false,
  })
  const [fields, setFields] = useState<Field[]>([
    { name: 'tarih', label: 'Tarih', type: 'date', required: true, placeholder: '' },
  ])

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const addField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false, placeholder: '' }])
  }

  const updateField = (i: number, k: string, v: unknown) => {
    setFields(fields.map((f, idx) => idx === i ? { ...f, [k]: v } : f))
  }

  const removeField = (i: number) => setFields(fields.filter((_, idx) => idx !== i))

  const generateSlug = (title: string) =>
    title.toLowerCase()
      .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.title),
      fields,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    }
    const res = await fetch('/api/sablonlar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (res.ok) router.push('/admin/sablonlar')
    else { const err = await res.json(); alert(err.error || 'Hata') }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Yeni Şablon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Temel Bilgiler</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Başlık *</label>
              <input required value={form.title}
                onChange={(e) => { set('title', e.target.value); if (!form.slug) set('slug', generateSlug(e.target.value)) }}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Şablon başlığı" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="url-slug" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiketler</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="virgülle ayırın" />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublic} onChange={(e) => set('isPublic', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm">Herkese Açık</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPremium} onChange={(e) => set('isPremium', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600" />
              <span className="text-sm">Premium</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Şablon İçeriği</h2>
            <p className="text-xs text-gray-400">{`{{alan_adi}}`} sözdizimini kullanın</p>
          </div>
          <textarea value={form.content} onChange={(e) => set('content', e.target.value)}
            rows={14} required
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={"Şablon metnini buraya yazın...\n\nÖrnek:\nSayın {{okul_muduru}},\nBu dilekçe ile {{sebep}} konusunda izin talep etmekteyim.\n\nTarih: {{tarih}}"} />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Form Alanları</h2>
            <button type="button" onClick={addField}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
              <Plus className="w-4 h-4" /> Alan Ekle
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-end p-3 bg-gray-50 rounded-xl">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Değişken Adı</label>
                  <input value={field.name} onChange={(e) => updateField(i, 'name', e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="tarih" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Etiket</label>
                  <input value={field.label} onChange={(e) => updateField(i, 'label', e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Tarih" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tip</label>
                  <select value={field.type} onChange={(e) => updateField(i, 'type', e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="text">Metin</option>
                    <option value="date">Tarih</option>
                    <option value="number">Sayı</option>
                    <option value="textarea">Paragraf</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                  <input value={field.placeholder} onChange={(e) => updateField(i, 'placeholder', e.target.value)}
                    className="w-full h-8 px-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="İsteğe bağlı…" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, 'required', e.target.checked)}
                      className="w-3.5 h-3.5" />
                    <span className="text-xs text-gray-600">Zorunlu</span>
                  </label>
                  <button type="button" onClick={() => removeField(i)} className="p-1 text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor…' : 'Şablon Kaydet'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
            İptal
          </button>
        </div>
      </form>
    </div>
  )
}
