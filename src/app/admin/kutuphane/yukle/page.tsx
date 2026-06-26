import { Upload, FileText } from 'lucide-react'

export default function KutuphaneYuklePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Upload className="w-6 h-6" /> Referans Dosya Yükle
        </h1>
        <p className="text-gray-500 text-sm mt-1">Özlük hakları, mahkeme kararları ve mevzuat belgelerini yükleyin</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Dosya yükleme sistemi geliştiriliyor</p>
            <p className="text-sm text-amber-700 mt-1">
              PDF yükleme, kategori seçimi, etiketleme ve otomatik AI özetleme sistemi yakında aktif olacak.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
        <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="font-medium text-gray-500">PDF veya Word dosyası sürükleyin</p>
        <p className="text-sm text-gray-400 mt-1">veya dosya seçin (maks. 50MB)</p>
        <button disabled className="mt-4 px-6 py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed">
          Dosya Seç (Yakında)
        </button>
      </div>
    </div>
  )
}
