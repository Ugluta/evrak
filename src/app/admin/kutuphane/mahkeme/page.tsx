import { Scale, Upload } from 'lucide-react'
import Link from 'next/link'

const kategoriler = [
  { label: 'Danıştay Kararları', count: 0 },
  { label: 'Bölge İdare Mahkemesi', count: 0 },
  { label: 'Anayasa Mahkemesi', count: 0 },
  { label: 'İdare Mahkemesi', count: 0 },
]

export default function MahkemeKararlariPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-6 h-6" /> Mahkeme Kararları
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danıştay, Bölge İdare ve Anayasa Mahkemesi emsal kararları</p>
        </div>
        <Link href="/admin/kutuphane/yukle"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" /> Karar Ekle
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kategoriler.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center mb-3">
              <Scale className="w-4 h-4 text-red-600" />
            </div>
            <p className="font-medium text-gray-900 text-sm">{k.label}</p>
            <p className="text-xs text-gray-400 mt-1">{k.count} karar</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Scale className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-medium text-gray-500">Henüz karar yüklenmedi</p>
        <p className="text-sm text-gray-400 mt-1">Mahkeme kararlarını PDF olarak yükleyerek öğretmenlerin kullanımına açın</p>
        <Link href="/admin/kutuphane/yukle"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" /> İlk Kararı Yükle
        </Link>
      </div>
    </div>
  )
}
