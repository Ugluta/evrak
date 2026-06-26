import { Library, Upload, Scale, FolderOpen } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    href: '/admin/kutuphane/ozluk',
    icon: Scale,
    label: 'Özlük Hakları',
    description: 'İzin, atama, ücret, disiplin, emeklilik mevzuatı',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    href: '/admin/kutuphane/mahkeme',
    icon: Scale,
    label: 'Mahkeme Kararları',
    description: 'Danıştay, Bölge İdare, Anayasa Mahkemesi emsal kararları',
    color: 'bg-red-50 text-red-600',
  },
  {
    href: '/admin/kutuphane/yukle',
    icon: Upload,
    label: 'Dosya Yükle',
    description: 'PDF veya Word belgesi yükle ve kategorilendır',
    color: 'bg-green-50 text-green-600',
  },
]

export default function KutuphaneAnasayfaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Library className="w-6 h-6" /> Referans Kütüphane
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Öğretmenlerin indireceği özlük hakları, mahkeme kararları ve mevzuat belgeleri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all group">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{s.label}</h3>
            <p className="text-sm text-gray-500 mt-1">{s.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Kütüphane yapımı devam ediyor</p>
            <p className="text-sm text-amber-700 mt-1">
              Dosya yükleme, arama ve indirme sistemi bir sonraki aşamada eklenecek.
              Şu an klasör yapısını oluşturabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
