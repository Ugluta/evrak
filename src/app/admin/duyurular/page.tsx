import { Bell, Plus } from 'lucide-react'

export default function DuyurularPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" /> Duyurular
          </h1>
          <p className="text-gray-500 text-sm mt-1">Kullanıcılara sistem duyuruları gönder</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Yeni Duyuru
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Duyuru sistemi yapım aşamasında</p>
            <p className="text-sm text-amber-700 mt-1">
              Kullanıcılara bildirim gönderme, duyuru yönetimi ve zamanlama özellikleri yakında eklenecek.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
