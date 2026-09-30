/**
 * Site genelinde değişebilecek her şey burada. Canlıya çıkmadan önce
 * `contactEmail` ve `adminUrl` değerlerini doğrulayın.
 */
export const site = {
  name: "Klinara",
  url: "https://klinara.app",
  /** "Demo talep et" butonlarının açtığı adres. */
  contactEmail: "iletisim@klinara.app",
  /** Mevcut müşterilerin "Giriş" linki (yönetim paneli). */
  adminUrl: "https://yonetim.klinara.app",
  description:
    "Diş ve estetik klinikleri için randevu, WhatsApp hatırlatma, KVKK onamı ve seans paketi takibi. Web, iOS ve Android.",
} as const;

/** Demo talebi için hazır konu ve gövdeli mailto linki. */
export function demoMailto(context?: string): string {
  const subject = context ? `Klinara demo talebi (${context})` : "Klinara demo talebi";
  const body = [
    "Merhaba,",
    "",
    "Klinara'yı kliniğimizde görmek istiyoruz.",
    "",
    "Klinik adı:",
    "Şube sayısı:",
    "Hekim / uygulayıcı sayısı:",
    "Telefon:",
  ].join("\n");
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const nav = [
  { label: "Özellikler", href: "/#ozellikler" },
  { label: "Fiyatlar", href: "/#fiyatlar" },
  { label: "SSS", href: "/#sss" },
  { label: "Blog", href: "/blog" },
] as const;
