/**
 * Site genelinde değişebilecek her şey burada. Canlıya çıkmadan önce
 * `contactEmail` ve `adminUrl` değerlerini doğrulayın.
 */
export const site = {
  name: "Klinara",
  url: "https://klinara.app",
  /** Sitedeki iletişim adresi. Demo formu da buraya düşer (alıcı `functions/demo-talebi.ts`). */
  contactEmail: "iletisim@klinara.app",
  /** Mevcut müşterilerin "Giriş" linki (yönetim paneli). */
  adminUrl: "https://yonetim.klinara.app",
  description:
    "Diş ve sağlık klinikleri için randevu, WhatsApp hatırlatma, KVKK onamı ve seans paketi takibi. Web, iOS ve Android.",
} as const;

export const nav = [
  { label: "Özellikler", href: "/#ozellikler" },
  { label: "Fiyatlar", href: "/#fiyatlar" },
  { label: "SSS", href: "/#sss" },
  { label: "Blog", href: "/blog" },
] as const;
