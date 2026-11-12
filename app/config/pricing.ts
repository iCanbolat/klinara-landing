/**
 * Fiyatlandırma: add-on yok, her planda tüm özellikler var. Planlar yalnız
 * kapasitede (şube, hekim/uygulayıcı ve asistan sohbeti) ayrışır. Rakamlar
 * KDV hariç.
 *
 * ⚠️ `klinara/packages/shared/src/plans.ts` ile SENKRON. Çok Şubeli teklif
 * planı: fiyat ve sınırlar ihtiyaca göre (`custom`), kartta sayı yok.
 */
export type Plan = {
  id: string;
  name: string;
  /** Teklif planında `null`. */
  monthly: number | null;
  /** Teklif planında `null` (ihtiyaca göre). */
  branches: number | null;
  practitioners: number | null;
  /** Aylık WhatsApp asistanı sohbeti; teklif planında `null`. */
  assistantConversations: number | null;
  summary: string;
  custom?: boolean;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "baslangic",
    name: "Başlangıç",
    monthly: 1750,
    branches: 1,
    practitioners: 2,
    assistantConversations: 300,
    summary: "Tek hekimli muayenehane ve küçük diş klinikleri için.",
  },
  {
    id: "klinik",
    name: "Klinik",
    monthly: 3500,
    branches: 1,
    practitioners: 8,
    assistantConversations: 1000,
    summary: "Resepsiyonu ve birden çok uygulayıcısı olan klinikler için.",
    featured: true,
  },
  {
    id: "cok-subeli",
    name: "Çok Şubeli",
    monthly: null,
    branches: null,
    practitioners: null,
    assistantConversations: null,
    summary: "Birden fazla şubesi olan gruplar için; şube ve hekim sayınıza göre teklif.",
    custom: true,
  },
];

/** Yıllık ödemede 12 ay yerine 10 ay ödenir. */
export const PAID_MONTHS_PER_YEAR = 10;

export const yearlyTotal = (plan: Plan) =>
  plan.monthly === null ? null : plan.monthly * PAID_MONTHS_PER_YEAR;
export const yearlyMonthlyEquivalent = (plan: Plan) => {
  const total = yearlyTotal(plan);
  return total === null ? null : Math.round(total / 12);
};

const tl = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
export const formatTL = (value: number) => `₺${tl.format(value)}`;

/** Her planda olan özellikler; kartlarda tekrar edilmez, altta bir kez listelenir. */
export const includedFeatures: { group: string; items: string[] }[] = [
  {
    group: "Randevu",
    items: [
      "Takvim, çakışma kontrolü ve durum takibi",
      "Kendi alan adınızla online randevu sayfası",
      "Randevu sayfası Türkçe, İngilizce, Almanca ve Rusça",
      "Çalışma saatleri, izinler ve resmi tatiller",
    ],
  },
  {
    group: "İletişim",
    items: [
      "WhatsApp onay ve hatırlatma mesajları",
      "İki yönlü WhatsApp gelen kutusu",
      "Gönderim, ulaşma ve okunma kaydı",
    ],
  },
  {
    group: "Klinik",
    items: [
      "KVKK aydınlatma metni ve işlem onamı, tablet imza",
      "Çok aşamalı tedavi planı",
      "Danışan kartı, notlar, fotoğraf ve belgeler",
      "Seans paketi ve kalan hak takibi",
    ],
  },
  {
    group: "Yönetim",
    items: [
      "Doluluk, personel performansı ve gelmeme raporları",
      "Sahip, şube yöneticisi, resepsiyon ve uygulayıcı rolleri",
      "iOS ve Android personel uygulaması",
    ],
  },
];
