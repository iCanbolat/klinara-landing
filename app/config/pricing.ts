/**
 * Fiyatlandırma: add-on yok, her planda tüm özellikler var. Planlar yalnız
 * kapasitede (şube ve hekim/uygulayıcı sayısı) ayrışır. Rakamlar KDV hariç.
 */
export type Plan = {
  id: string;
  name: string;
  monthly: number;
  branches: number;
  practitioners: number;
  summary: string;
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "baslangic",
    name: "Başlangıç",
    monthly: 1490,
    branches: 1,
    practitioners: 2,
    summary: "Tek hekimli muayenehane ve küçük estetik stüdyoları için.",
  },
  {
    id: "klinik",
    name: "Klinik",
    monthly: 2990,
    branches: 1,
    practitioners: 8,
    summary: "Resepsiyonu ve birden çok uygulayıcısı olan klinikler için.",
    featured: true,
  },
  {
    id: "cok-subeli",
    name: "Çok Şubeli",
    monthly: 6490,
    branches: 3,
    practitioners: 25,
    summary: "Birden fazla şubeyi tek panelden yöneten gruplar için.",
  },
];

/** Yıllık ödemede 12 ay yerine 10 ay ödenir. */
export const PAID_MONTHS_PER_YEAR = 10;

export const yearlyTotal = (plan: Plan) => plan.monthly * PAID_MONTHS_PER_YEAR;
export const yearlyMonthlyEquivalent = (plan: Plan) => Math.round(yearlyTotal(plan) / 12);

const tl = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
export const formatTL = (value: number) => `₺${tl.format(value)}`;

/** Her planda olan özellikler; kartlarda tekrar edilmez, altta bir kez listelenir. */
export const includedFeatures: { group: string; items: string[] }[] = [
  {
    group: "Randevu",
    items: [
      "Takvim, çakışma kontrolü ve durum takibi",
      "Kendi alan adınızla online randevu sayfası",
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
      "Danışan kartı, notlar, fotoğraf ve belgeler",
      "Seans paketi ve kalan hak takibi",
    ],
  },
  {
    group: "Yönetim",
    items: [
      "Doluluk, ciro, personel ve gelmeme raporları",
      "Sahip, şube yöneticisi, resepsiyon ve uygulayıcı rolleri",
      "iOS ve Android personel uygulaması",
    ],
  },
];
