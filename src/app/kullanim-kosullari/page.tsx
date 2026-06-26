import { ServerHeader } from '@/components/ServerHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Koşulları — 2e Evrak',
  description: '2e Evrak platformu kullanım koşulları ve hizmet şartları.',
}

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServerHeader />
      <main>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Koşulları</h1>
          <p className="text-gray-500 text-sm mb-10">Son güncelleme: Ocak 2025</p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Kabul</h2>
              <p>
                2e Evrak platformuna erişerek veya hizmetlerimizi kullanarak bu Kullanım
                Koşullarını kabul etmiş sayılırsınız. Kabul etmiyorsanız platformu kullanmayınız.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Hizmet Tanımı</h2>
              <p>
                2e Evrak, öğretmenlerin ve okul personelinin resmi evrak ve belgelerini
                şablonlar aracılığıyla veya yapay zeka desteğiyle oluşturabildiği, yönetip
                paylaşabildiği bir SaaS platformudur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Hesap Oluşturma</h2>
              <p className="mb-2">
                Platforma kayıt olurken sağladığınız bilgilerin doğru ve güncel olduğunu
                taahhüt edersiniz. Hesabınızın güvenliğinden siz sorumlusunuz; şifrenizi kimseyle
                paylaşmayınız.
              </p>
              <p>
                Platform, sahte bilgilerle açılan veya ihlal tespit edilen hesapları askıya alma
                ya da silme hakkını saklı tutar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Kullanım Kuralları</h2>
              <p className="mb-2">Aşağıdaki eylemler kesinlikle yasaktır:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Platformu yasadışı amaçlarla kullanmak</li>
                <li>Başkalarının kişisel verilerini izinsiz paylaşmak</li>
                <li>Sistemi aşırı yükleyecek ya da bozmaya yönelik girişimlerde bulunmak</li>
                <li>Yapay zeka araçlarını yanıltıcı veya kötü amaçlı içerik üretmek için kullanmak</li>
                <li>Sahte resmi evrak oluşturmak veya oluşturulmaya teşvik etmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. İçerik ve Belgeler</h2>
              <p>
                Oluşturduğunuz belgeler size aittir. Ancak yapay zeka tarafından üretilen
                içeriklerin doğruluğunu ve hukuki geçerliliğini kullanmadan önce bizzat
                doğrulamanız sizin sorumluluğunuzdadır. Platform, AI çıktılarından kaynaklanan
                hatalardan sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Premium Hizmetler</h2>
              <p>
                Bazı şablonlar ve özellikler ücretli abonelik gerektirebilir. Abonelik ücretleri
                ve iptal koşulları, satın alma sırasında ayrıca bildirilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Hizmet Değişiklikleri</h2>
              <p>
                Platform, özelliklerini, fiyatlandırmasını veya bu koşulları önceden bildirerek
                değiştirme hakkını saklı tutar. Değişiklik sonrası platformu kullanmaya devam
                etmeniz yeni koşulları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Sorumluluk Sınırı</h2>
              <p>
                Platform, yürürlükteki mevzuatın izin verdiği azami ölçüde, hizmetin
                kullanımından kaynaklanan dolaylı, tesadüfi veya sonuç olarak ortaya çıkan
                zararlardan sorumlu değildir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Uygulanacak Hukuk</h2>
              <p>
                Bu koşullar Türk hukukuna tabidir. Doğabilecek uyuşmazlıklarda Türkiye
                mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. İletişim</h2>
              <p>
                Kullanım koşullarına ilişkin sorularınız için{' '}
                <a href="mailto:destek@ikie.net" className="text-blue-600 hover:underline">
                  destek@ikie.net
                </a>{' '}
                adresine yazabilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
