import { ServerHeader } from '@/components/ServerHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — 2e Evrak',
  description: '2e Evrak KVKK kapsamındaki kişisel veri işleme politikası.',
}

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServerHeader />
      <main>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
          <p className="text-gray-500 text-sm mb-10">Son güncelleme: Ocak 2025</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Veri Sorumlusu</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu
                2e Evrak'tır. Sorularınız için{' '}
                <a href="mailto:destek@ikie.net" className="text-blue-600 hover:underline">
                  destek@ikie.net
                </a>{' '}
                adresiyle iletişime geçebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Toplanan Veriler</h2>
              <p className="mb-2">Platformu kullanırken aşağıdaki veriler işlenir:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ad, soyad, e-posta adresi (kayıt sırasında)</li>
                <li>Oluşturulan belgeler ve şablon tercihleri</li>
                <li>Kullanım istatistikleri ve oturum bilgileri</li>
                <li>OCR işlemleri için yüklenen görüntüler (işlem sonrası silinir)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. İşleme Amaçları</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hesap yönetimi ve kimlik doğrulama</li>
                <li>Belge oluşturma ve depolama hizmetlerinin sunulması</li>
                <li>Platform güvenliğinin sağlanması</li>
                <li>Hizmet kalitesinin iyileştirilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Verilerin Aktarımı</h2>
              <p>
                Kişisel verileriniz; yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz.
                Yapay zeka işlemleri için Anthropic API'si kullanılmakta olup, gönderilen içerik
                API sağlayıcısının gizlilik politikasına tabidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Saklama Süresi</h2>
              <p>
                Kişisel verileriniz, hesabınızın aktif olduğu süre boyunca ve hesap silinmesinden
                itibaren yasal süreler dahilinde saklanır. Belgeleriniz hesap silme talebinizle
                birlikte silinir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Çerezler</h2>
              <p>
                Platform, oturum yönetimi için zorunlu çerezler kullanır. Bu çerezler devre dışı
                bırakılamaz; aksi hâlde platforma giriş yapılamaz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. KVKK Haklarınız</h2>
              <p className="mb-2">KVKK'nın 11. maddesi uyarınca:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>Yanlış verilerin düzeltilmesini isteme</li>
                <li>Koşullar oluştuğunda silinmesini talep etme</li>
                <li>Aktarıldığı taraflara bildirim yapılmasını isteme</li>
                <li>Otomatik sistemlere itiraz etme</li>
              </ul>
              <p className="mt-3">
                Haklarınızı kullanmak için{' '}
                <a href="mailto:destek@ikie.net" className="text-blue-600 hover:underline">
                  destek@ikie.net
                </a>{' '}
                adresine yazabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Güvenlik</h2>
              <p>
                Verilerinizi korumak için şifreleme, erişim denetimleri ve güvenli bağlantı
                protokolleri (HTTPS) kullanılmaktadır. Şifreler tek yönlü hash algoritması ile
                saklanır, açık metin olarak tutulmaz.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
