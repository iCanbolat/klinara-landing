# Klinara landing

Klinara'nın tanıtım sitesi ve blogu. React Router 8 (framework modu, Vite) + Tailwind CSS v4 + Motion.
Çalışma anında sunucu yoktur: her sayfa ve her blog yazısı build sırasında statik HTML'e dönüşür
(`ssr: false` + `prerender`). Çıktı `build/client` herhangi bir statik host'a yüklenebilir.

## Başlarken

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # build/client
pnpm preview      # build çıktısını statik sunucuyla açar (http://localhost:4173)
pnpm typecheck
```

**Node sürümü:** React Router 8, Node 22.22 veya üstünü ister. Proje Node 24 kullanır (`package.json` `engines` ve `.nvmrc`); Vercel ve Cloudflare bu sürümü otomatik seçer. Yerelde `nvm use` ya da Node 24 kurulumu gerekir.

## Nerede ne var?

| Yol | İçerik |
|---|---|
| `app/config/site.ts` | Site adresi, iletişim e-postası (`Demo talep et` butonları buraya mailto açar), panel giriş adresi, menü |
| `app/config/pricing.ts` | Planlar, fiyatlar, şube ve uygulayıcı limitleri, "her planda" özellik listesi |
| `app/config/screens.ts` | iOS ekran görüntülerinin adları ve alt metinleri |
| `app/sections/*` | Ana sayfa bölümleri (hero, özellikler, bento, WhatsApp akışı, fiyatlar, SSS, blog, kapanış) |
| `app/app.css` | Marka token'ları (açık/koyu), tip ölçeği, animasyon yardımcıları |
| `content/blog/*.md` | Blog yazıları |
| `public/screens/` | Uygulama ekran görüntüleri (WebP, açık ve koyu) |
| `public/photos/` | Fotoğraflar (Unsplash License; kaynaklar monorepo `booking-page/template/assets/README.md`) |

Renkler ve fontlar Klinara iOS uygulamasının (`Assets.xcassets`) ve web panelinin token'larıyla aynıdır.
Açık temada uzun metin için `muted` ve `accent` tonları, erişilebilirlik (WCAG AA) için bir kademe koyudur;
gerekçesi `app/app.css` içinde yazıyor.

## Blog yazısı ekleme

`content/blog/` altına `<slug>.md` dosyası ekleyin. Dosya adı yazının adresi olur (`/blog/<slug>`).
`_` ile başlayan dosyalar yayımlanmaz (taslak).

```md
---
title: "Başlık"
description: "Arama sonuçlarında ve kartlarda görünen kısa özet."
date: 2026-10-01
segment: dis          # dis | estetik | guzellik
cover: "/photos/konsultasyon.webp"   # ya da "screen:whatsapp-thread"
author: "Klinara Ekibi"              # isteğe bağlı
---

Giriş paragrafı...

## Ara başlık (içindekiler listesine girer)
```

Build frontmatter'ı doğrular; eksik ya da hatalı alan varsa hangi dosyada olduğunu söyleyerek durur.
Yeni yazı sitemap (`/sitemap.xml`) ve RSS'e (`/rss.xml`) kendiliğinden eklenir.

## Ekran görüntülerini yenileme

Görüntüler iOS uygulamasının mock verisiyle simülatörden alınır; gerçek müşteri verisi içermez.

1. Monorepo'daki `klinara-ios` projesini geçici bir kopyada mock moda alın:
   `App/klinara_iosApp.swift` içinde `ServiceContainer.live()` yerine
   `ServiceContainer.mock(scenario: .passwordOnly, data: .conflictHeavy)`.
   Kopyayı ayrı bir bundle id ile derleyin (`PRODUCT_BUNDLE_IDENTIFIER=com.klinara-ios.screens`),
   böylece kurulu uygulamanız etkilenmez.
2. Temiz status bar:
   `xcrun simctl status_bar booted override --time 09:41 --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularBars 4`
3. Her ekran için açık ve koyu görüntü alın (dosya adları `app/config/screens.ts` ile aynı olmalı):
   ```bash
   xcrun simctl ui booted appearance light
   xcrun simctl io booted screenshot --mask=alpha assets/screens-raw/light/<ad>.png
   xcrun simctl ui booted appearance dark
   xcrun simctl io booted screenshot --mask=alpha assets/screens-raw/dark/<ad>.png
   ```
4. `pnpm screens` ile WebP'leri üretin (`public/screens/`). Ham PNG'ler git'e girmez.
5. `xcrun simctl status_bar booted clear` ile simülatörü eski haline getirin.

`pnpm brand` marka görsellerini (`public/brand`, favicon, `og.png`) `assets/brand/klinara-logo-source.png`
kaynağından yeniden üretir.

## Yayına alma

### Vercel

1. Repoyu Vercel'e bağlayın. `vercel.json` build komutunu (`pnpm build`) ve çıktı dizinini
   (`build/client`) zaten tanımlar; framework ayarı "Other" olarak kalır.
2. Alan adını (`klinara.app`) proje ayarlarından ekleyin.

### Cloudflare Pages

1. Pages projesi oluşturup repoyu bağlayın.
2. Build komutu `pnpm build`, çıktı dizini `build/client`.
3. Ortam değişkeni `NODE_VERSION=24` (ya da `.nvmrc` otomatik okunur).

`public/_headers` önbellek başlıklarını, `build/client/404.html` bulunamayan sayfaları karşılar.

### Cloudflare Workers (statik varlıklar)

```bash
pnpm build
npx wrangler deploy
```

`wrangler.jsonc` çıktı dizinini ve 404 davranışını tanımlar.

## Canlıya çıkmadan önce

- `app/config/site.ts`: `contactEmail` ve `adminUrl` adreslerini doğrulayın.
- `app/config/pricing.ts`: plan limitleri (şube ve uygulayıcı sayıları) öneri niteliğindedir.
- KVKK yazısı (`content/blog/estetik-kliniklerde-kvkk-ve-onam.md`) genel bilgilendirmedir; bir hukukçuya
  okutmanız önerilir.
