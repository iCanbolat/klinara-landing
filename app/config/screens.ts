/**
 * iOS uygulamasından (simülatör, mock veri) alınmış gerçek ekran görüntüleri.
 * Dosyalar `public/screens/{light,dark}/<ad>-{400,800}.webp`; üretim: `pnpm screens`.
 * Ekranlardaki kişi ve rakamlar uygulamanın örnek verisidir.
 */
export const screens = {
  dashboard: "Klinara iOS uygulamasında günün randevuları, doluluk ve personel işlem sayısını gösteren genel bakış ekranı",
  "calendar-agenda": "Takvimde günün randevuları, uygulayıcı filtreleri ve randevu durumları",
  "calendar-day": "Takvimin gün ızgarası görünümü, uygulayıcılara göre randevu blokları",
  appointment: "Randevu detayı: saat, hizmet ve planlandı, onaylandı, geldi adımlarıyla durum takibi",
  "appointment-reminders": "Randevu detayında gönderilen WhatsApp hatırlatmaları ve randevu geçmişi",
  "booking-slots": "Yeni randevu ekranında seçilen hizmete göre boş saatler",
  /**
   * Canlı online randevu sayfası (apps/web-booking, demo kiracı), İngilizce, mobil.
   * `pnpm capture:booking` ile çekilir. Kiracı temalı; koyu sürümü yok, iki klasörde aynı görüntü.
   */
  "online-booking": "Online randevu sayfasının İngilizce sürümü telefonda: kliniğin kendi alan adında tarih ve boş saat seçimi",
  customers: "Danışan listesi, etiketler ve arama",
  customer: "Danışan kartında randevu, işlem notu ve paket zaman çizelgesi",
  package: "Seans paketi detayı: kalan hak, geçerlilik ve kalem bazında kullanım",
  "treatment-plan": "İmplant tedavi planı: tamamlanan aşamalar, randevusu olmayan sıradaki aşama, planla ve WhatsApp ile hatırlat",
  "whatsapp-thread": "WhatsApp konuşması: danışan mesajı ve otomatik randevu hatırlatması",
  "message-log": "Mesaj günlüğü: ulaşan, okunan ve gönderilemeyen bildirimler",
  "reminder-settings": "Şubeye özel hatırlatma saatleri ayarı",
  "report-occupancy": "Doluluk raporu, uygulayıcılara göre grafik",
} as const;

export type ScreenName = keyof typeof screens;

/** Ham görüntü 1206×2622 (iPhone 17 Pro). */
export const SCREEN_RATIO = 1206 / 2622;

export const screenSrc = (name: ScreenName, mode: "light" | "dark", width: 400 | 800) =>
  `/screens/${mode}/${name}-${width}.webp`;

/**
 * Masaüstü tarayıcı görüntüleri, canlı randevu sayfasından (`pnpm capture:booking`).
 * Dosyalar `public/screens/web/<ad>-{720,1440}.webp`; tema yok, tek görüntü.
 */
export const webScreens = {
  booking: "Online randevu sayfası masaüstünde: Türkçe tarih ve saat seçimi, açık dil menüsünde Türkçe, English ve Deutsch",
} as const;

export type WebScreenName = keyof typeof webScreens;

/** Ham görüntü 2200×1376 (1100×688 @2x). */
export const WEB_SIZE = { width: 2200, height: 1376 } as const;

export const webScreenSrc = (name: WebScreenName, width: 720 | 1440) => `/screens/web/${name}-${width}.webp`;
