import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('admin123456', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@ogretmenevrak.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@ogretmenevrak.com',
      password,
      role: 'SUPER_ADMIN',
    },
  })

  const templates = [
    {
      title: 'Mazeret Dilekçesi',
      slug: 'mazeret-dilekcesi',
      description: 'Öğretmen mazeret bildirimi için standart dilekçe şablonu',
      category: 'DILEKCELER' as const,
      content: `Sayın {{mudur_adi}},\n\n{{tarih}} tarihinde {{neden}} nedeniyle görevime gelemeyeceğimi/gelemediğimi saygıyla arz ederim.\n\nGereğini bilgilerinize arz ederim.\n\n{{tarih}}\n\n{{ad_soyad}}\n{{gorev}}\n{{okul_adi}}`,
      fields: [
        { name: 'mudur_adi', label: 'Müdürün Adı Soyadı', type: 'text', required: true, placeholder: 'Ahmet Yılmaz' },
        { name: 'tarih', label: 'Tarih', type: 'date', required: true },
        { name: 'neden', label: 'Mazeret Nedeni', type: 'text', required: true, placeholder: 'hastalık/acil durum' },
        { name: 'ad_soyad', label: 'Adınız Soyadınız', type: 'text', required: true },
        { name: 'gorev', label: 'Göreviniz', type: 'text', required: true, placeholder: 'Matematik Öğretmeni' },
        { name: 'okul_adi', label: 'Okul Adı', type: 'text', required: true },
      ],
      tags: ['dilekçe', 'mazeret', 'öğretmen'],
    },
    {
      title: 'Yıllık İzin Talep Dilekçesi',
      slug: 'yillik-izin-talep-dilekcesi',
      description: 'Yıllık izin talebi için dilekçe şablonu',
      category: 'IZIN_FORMLARI' as const,
      content: `{{okul_adi}} MÜDÜRLÜĞÜNE\n\nOkulunuzda {{gorev}} olarak görev yapmaktayım. {{baslangic_tarihi}} - {{bitis_tarihi}} tarihleri arasında {{gun_sayisi}} günlük yıllık iznimin kullandırılmasını saygıyla arz ederim.\n\n{{tarih}}\n\n{{ad_soyad}}\n{{tc_no}}`,
      fields: [
        { name: 'okul_adi', label: 'Okul Adı', type: 'text', required: true },
        { name: 'gorev', label: 'Göreviniz', type: 'text', required: true, placeholder: 'Türkçe Öğretmeni' },
        { name: 'baslangic_tarihi', label: 'İzin Başlangıç Tarihi', type: 'date', required: true },
        { name: 'bitis_tarihi', label: 'İzin Bitiş Tarihi', type: 'date', required: true },
        { name: 'gun_sayisi', label: 'Gün Sayısı', type: 'number', required: true },
        { name: 'tarih', label: 'Dilekçe Tarihi', type: 'date', required: true },
        { name: 'ad_soyad', label: 'Ad Soyad', type: 'text', required: true },
        { name: 'tc_no', label: 'TC Kimlik No', type: 'text', required: true },
      ],
      tags: ['izin', 'yıllık izin', 'dilekçe'],
    },
    {
      title: 'Zimmet Tutanağı',
      slug: 'zimmet-tutanagi',
      description: 'Malzeme ve ekipman zimmet formu',
      category: 'ZIMMET' as const,
      content: `ZİMMET TUTANAĞI\n\nAşağıda listesi verilen malzeme/ekipmanlar {{tarih}} tarihinde {{teslim_alan}} adlı personele zimmetlenmiştir.\n\nOkul: {{okul_adi}}\n\nZimmete Alınan Malzemeler:\n{{malzeme_listesi}}\n\nTeslim Eden: {{teslim_eden}}\nTeslim Alan: {{teslim_alan}}\nTarih: {{tarih}}`,
      fields: [
        { name: 'okul_adi', label: 'Okul Adı', type: 'text', required: true },
        { name: 'teslim_eden', label: 'Teslim Eden (Ad Soyad/Ünvan)', type: 'text', required: true },
        { name: 'teslim_alan', label: 'Teslim Alan (Ad Soyad)', type: 'text', required: true },
        { name: 'malzeme_listesi', label: 'Malzeme Listesi', type: 'textarea', required: true, placeholder: '1. Dizüstü bilgisayar - Seri No: ...\n2. ...' },
        { name: 'tarih', label: 'Tarih', type: 'date', required: true },
      ],
      tags: ['zimmet', 'tutanak', 'malzeme'],
    },
    {
      title: 'Görevlendirme Yazısı',
      slug: 'gorevlendirme-yazisi',
      description: 'Personel görevlendirme resmi yazı şablonu',
      category: 'GOREVLENDIRME' as const,
      content: `T.C.\n{{il_adi}} VALİLİĞİ\nİl Millî Eğitim Müdürlüğü\n\nSayı: ...\nKonu: Görevlendirme\n\n{{okul_adi}} MÜDÜRLÜĞÜNE\n\nOkulunuz {{gorev}} {{ad_soyad}}'ın {{etkinlik_adi}} etkinliğinde görevlendirilmesi uygun görülmüştür.\n\nBilgilerini ve gereğini rica ederim.\n\n{{tarih}}\n\n{{imzalayan_adi}}\nMüdür`,
      fields: [
        { name: 'il_adi', label: 'İl Adı', type: 'text', required: true, placeholder: 'İstanbul' },
        { name: 'okul_adi', label: 'Okul Adı', type: 'text', required: true },
        { name: 'gorev', label: 'Görev/Unvan', type: 'text', required: true, placeholder: 'Matematik Öğretmeni' },
        { name: 'ad_soyad', label: 'Personel Ad Soyad', type: 'text', required: true },
        { name: 'etkinlik_adi', label: 'Etkinlik/Görev Adı', type: 'text', required: true },
        { name: 'tarih', label: 'Tarih', type: 'date', required: true },
        { name: 'imzalayan_adi', label: 'İmzalayan Ad Soyad', type: 'text', required: true },
      ],
      tags: ['görevlendirme', 'resmi yazı'],
    },
    {
      title: 'Veli Bilgilendirme Formu',
      slug: 'veli-bilgilendirme-formu',
      description: 'Öğrenci velilerini bilgilendirmek için standart form',
      category: 'YAZISMALAR' as const,
      content: `VELİ BİLGİLENDİRME FORMU\n\nSayın Veli,\n\n{{konu}} konusunda sizi bilgilendirmek isteriz.\n\n{{icerik}}\n\nBilgilerinize saygıyla sunarız.\n\n{{tarih}}\n\n{{okul_adi}}\n{{ogretmen_adi}}\n{{gorev}}`,
      fields: [
        { name: 'konu', label: 'Konu', type: 'text', required: true },
        { name: 'icerik', label: 'Bilgilendirme İçeriği', type: 'textarea', required: true },
        { name: 'tarih', label: 'Tarih', type: 'date', required: true },
        { name: 'okul_adi', label: 'Okul Adı', type: 'text', required: true },
        { name: 'ogretmen_adi', label: 'Öğretmen Adı Soyadı', type: 'text', required: true },
        { name: 'gorev', label: 'Görevi', type: 'text', required: true },
      ],
      tags: ['veli', 'bilgilendirme', 'form'],
    },
  ]

  for (const tmpl of templates) {
    await db.template.upsert({
      where: { slug: tmpl.slug },
      update: {},
      create: { ...tmpl, fields: tmpl.fields, createdById: admin.id },
    })
  }

  console.log('Seed tamamlandi: admin + 5 sablon')
}

main().catch(console.error).finally(() => db.$disconnect())
