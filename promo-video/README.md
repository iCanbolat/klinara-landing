# Klinara promo videosu

Landing hero'sundaki 40 saniyelik tanıtım videosunun kaynağı (Remotion, React).
Ekranlar web paneli, online randevu sayfası ve iOS uygulamasının koddaki yeniden çizimidir; görüntü değildir.
Fon müziği ve efekt sesleri `scripts/generate-audio.mjs` ile üretilir, lisans gerektirmez.

Landing build'ine dahil değildir (`tsconfig.json` `exclude`); yalnız render çıktıları `public/videos/` altına kopyalanır.

## Komutlar

```bash
npm i
npm run dev              # Remotion Studio, http://localhost:3100
npm run audio            # public/audio/*.wav (müzik + efektler; dev ve render öncesi kendiliğinden)
npm run stills           # out/stills/: her sahnenin anahtar kareleri (kontrol için)
npm run render           # out/: 1080×1350 MP4, 720×900 MP4, poster
npm run publish:landing  # out/ → ../public/videos/ (poster WebP'ye çevrilir)
npm run carousel [-- tedavi-plani]  # out/instagram/<set>/: Instagram carousel PNG + MP4
```

## Nerede ne var?

| Yol | İçerik |
|---|---|
| `src/KlinaraPromo.tsx` | Ana video: sahne sırası, süreler, geçişler, müzik |
| `src/scenes/*` | Sahneler (Studio'da "Sahneler" klasöründe tek tek de açılır) |
| `src/data.ts` | Senaryo verisi: klinik, hasta, hekim, hizmet, tedavi planı aşamaları |
| `src/theme.ts` | Marka renkleri ve fontlar (landing `app/app.css` ile aynı) |
| `src/components/devices.tsx` | Telefon, tablet ve web paneli çerçeveleri |
| `src/social/*` | Instagram içerikleri; aynı token ve sahnelerle. `npm run carousel` → `out/instagram/` |

Kurallar: ekranda para (tutar/ciro) yok; randevu durumu Planlandı → Geldi → Tamamlandı, "Onaylandı" yalnız rozet.
Süre değişirse `Root.tsx`'teki toplam kare sayısı, `scripts/generate-audio.mjs` (1209 kare) ve
`package.json` `poster` karesi birlikte güncellenir.

Remotion lisansı: 3 kişiye kadar ekipler için ücretsiz; daha büyük şirketler için şirket lisansı gerekir
(https://www.remotion.dev/license).
