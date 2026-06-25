import { UserCog, Crown, Shield, BookOpen, Users, User } from 'lucide-react'

const roles = [
  {
    role: 'SUPER_ADMIN', label: 'Süper Admin', icon: Crown, color: 'text-amber-600 bg-amber-50',
    perms: ['Tüm sisteme tam erişim', 'Kullanıcı rol yönetimi', 'Sistem ayarları', 'Üyelik paketleri', 'AI limit yönetimi'],
  },
  {
    role: 'ADMIN', label: 'Admin', icon: Shield, color: 'text-blue-600 bg-blue-50',
    perms: ['Şablon & belge yönetimi', 'Kullanıcı listesi', 'AI kullanım raporu', 'Referans kütüphane', 'İstatistikler'],
  },
  {
    role: 'EDITOR', label: 'Editör', icon: BookOpen, color: 'text-green-600 bg-green-50',
    perms: ['Şablon oluştur & düzenle', 'Kendi şablonlarını yönet'],
  },
  {
    role: 'TEACHER', label: 'Öğretmen', icon: Users, color: 'text-purple-600 bg-purple-50',
    perms: ['Belgelerini oluştur & yönet', 'Şablonlardan belge türet', 'AI ile belge yaz', 'OCR kullan', 'Referans kütüphane indir'],
  },
  {
    role: 'ADMIN_STAFF', label: 'İdari Personel', icon: User, color: 'text-teal-600 bg-teal-50',
    perms: ['Belgelerini oluştur & yönet', 'Şablonlardan belge türet', 'AI ile belge yaz', 'OCR kullan'],
  },
  {
    role: 'MEMBER', label: 'Üye', icon: User, color: 'text-gray-600 bg-gray-100',
    perms: ['Ücretsiz şablonlara erişim', 'Temel belge oluşturma', 'Sınırlı AI kullanımı'],
  },
]

export default function RollerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCog className="w-6 h-6" /> Roller & Yetkiler
        </h1>
        <p className="text-gray-500 text-sm mt-1">Platform rol hiyerarşisi ve yetki tanımları</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roles.map((r) => {
          const Icon = r.icon
          return (
            <div key={r.role} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{r.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{r.role}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {r.perms.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
