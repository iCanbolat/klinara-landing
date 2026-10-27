/**
 * Senaryonun kurgusal verisi tek yerde. İsimler uygulamanın demo/mock
 * verisinden; metinler ürünün gerçek Türkçe ekran ve şablon metinleri.
 * Para yok (tutar/ciro gösterilmez), durum akışı Planlandı → Geldi → Tamamlandı.
 */
export const clinic = {
  name: "Nişantaşı Diş Kliniği",
  branch: "Nişantaşı",
} as const;

export const site = { domain: "klinara.app" } as const;

export const patient = {
  name: "Şule Aydın",
  firstName: "Şule",
  phone: "+90 532 418 •• ••",
} as const;

export const doctor = {
  name: "Dr. Zeynep Aksoy",
  title: "Endodonti Uzmanı",
  initials: "ZA",
} as const;

export const booking = {
  service: "Kanal Tedavisi",
  duration: "60 dk",
  dayLabel: "Çar",
  day: "28",
  dateLong: "28 Ekim Çarşamba",
  time: "14:00",
} as const;

export const services = [
  { name: "Diş Taşı Temizliği", duration: "45 dk" },
  { name: "Kanal Tedavisi", duration: "60 dk" },
  { name: "Kompozit Dolgu", duration: "30 dk" },
  { name: "Muayene ve Kontrol", duration: "30 dk" },
] as const;

/** Demo "Kanal Tedavisi" tedavi planı şablonu (seed-demo-site.ts), kısaltılmış. */
export const planStages = [
  { label: "Kanal tedavisi — 1. seans", service: "Kanal Tedavisi", when: "Randevu: 28 Eki 14:00" },
  { label: "Kanal tedavisi — 2. seans", service: "Kanal Tedavisi", when: "Randevu: 4 Kas 14:00" },
  { label: "Kalıcı restorasyon (dolgu)", service: "Kompozit Dolgu", when: "Önerilen: 11 Kas" },
  { label: "6. ay kontrolü ve röntgen", service: "Muayene ve Kontrol", when: "" },
] as const;

export const consentText = [
  "KANAL TEDAVİSİ (ENDODONTİK TEDAVİ) BİLGİLENDİRİLMİŞ ONAM FORMU",
  "",
  "1. İşlemin tanımı",
  "Kanal tedavisi, dişin iç kısmındaki iltihaplı ya da enfekte dokunun temizlenmesi, kök kanallarının şekillendirilip dezenfekte edilmesi ve doldurulması işlemidir.",
  "",
  "2. Beklenen faydalar",
  "Ağrının ve enfeksiyonun giderilmesi, dişin ağızda korunması ve çiğneme fonksiyonunun sürdürülmesi.",
  "",
  "3. Olası riskler",
  "Tedavi sonrası birkaç gün süren hassasiyet, ağrı ya da şişlik.",
  "",
  "4. Alternatifler",
  "Dişin çekimi ve sonrasında protez ya da implant ile yerine konması.",
  "",
  "5. Hasta beyanı",
  "Hekimim tarafından işlem, riskleri ve alternatifleri hakkında bilgilendirildim; sorularım yanıtlandı.",
] as const;
