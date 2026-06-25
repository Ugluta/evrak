import { Package, Check } from 'lucide-react'
import Link from 'next/link'

const paketler = [
  {
    name: 'Ücretsiz', slug: 'ucretsiz', price: '₺0', period: '',
    color: 'border-gray-200',
    features: ['10 AI istek/gün', 'Ücretsiz şablonlar', 'Temel belge oluşturma'],
    role: 'MEMBER',
  },
  {
    name: 'Öğretmen', slug: 'ogretmen', price: '₺99', period: '/ay',
    color: 'border-blue-500',
    features: ['30 AI istek/gün', 'Tüm şablonlar', 'PDF indirme', 'OCR', 'Referans kütüphane'],
    role: 'TEACHER',
    featured: true,
  },
  {
    name: 'Kurumsal', slug: 'kurumsal', price: '₺299', period: '/ay',
    color: 'border-purple-500',
    features: ['Sınırsız AI', 'Çoklu kullanıcı', 'Özel şablonlar', 'Öncelikli destek', 'API erişimi'],
    role: 'ADMIN_STAFF',
  },
]

export default function UyelikPaketleriPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6" /> Üyelik Paketleri
          </h1>
          <p className="text-gray-500 text-sm mt-1">Abonelik planları ve özellikleri</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          + Yeni Paket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {paketler.map((p) => (
          <div key={p.slug} className={`bg-white rounded-xl border-2 ${p.color} p-6 relative ${p.featured ? 'shadow-md' : ''}`}>
            {p.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                En Popüler
              </span>
            )}
            <div className="mb-4">
              <p className="font-bold text-gray-900 text-lg">{p.name}</p>
              <p className="text-xs text-gray-400 font-mono">{p.role}</p>
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">{p.price}</span>
              <span className="text-gray-500 text-sm">{p.period}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Düzenle
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Paket düzenleme ve gerçek ödeme entegrasyonu bir sonraki aşamada eklenecek.
      </p>
    </div>
  )
}
