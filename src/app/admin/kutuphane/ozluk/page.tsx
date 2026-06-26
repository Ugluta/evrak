import { Scale, Upload } from 'lucide-react'
import Link from 'next/link'

const kategoriler = [
  { label: 'İzin Mevzuatı', count: 0 },
  { label: 'Atama & Nakil', count: 0 },
  { label: 'Ücret & Ek Ders', count: 0 },
  { label: 'Disiplin Mevzuatı', count: 0 },
  { label: 'Emeklilik', count: 0 },
  { label: 'Sağlık & Raporlar', count: 0 },
]

export default function OzlukHaklariPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scale className="w-6 h-6" /> Özlük Hakları
          </h1>
          <p className="text-gray-500 text-sm mt-1">Öğretmen özlük hakları mevzuat belgeleri</p>
        </div>
        <Link href="/admin/kutuphane/yukle"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" /> Dosya Yükle
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kategoriler.map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <Scale className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-medium text-gray-900 text-sm">{k.label}</p>
            <p className="text-xs text-gray-400 mt-1">{k.count} belge</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="font-medium text-gray-500">Henüz belge yüklenmedi</p>
        <p className="text-sm text-gray-400 mt-1">Özlük hakları belgelerini yükleyerek öğretmenlerin erişimine açın</p>
        <Link href="/admin/kutuphane/yukle"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Upload className="w-4 h-4" /> İlk Belgeyi Yükle
        </Link>
      </div>
    </div>
  )
}
