#!/usr/bin/env node
/*
 * "Özellikler" bölümündeki online randevu görsellerini CANLI randevu sayfasından
 * (demo kiracı, `demo-klinik.klinara.app`) çeker:
 *
 *   assets/screens-raw/web/booking.png                masaüstü, Türkçe, dil menüsü açık
 *   assets/screens-raw/{light,dark}/online-booking.png telefon, İngilizce, iOS çerçevesiyle
 *
 * Canlıya yazma yapılmaz: saat seçilince giden tutma (hold) istekleri tarayıcıda
 * sahte yanıtla karşılanır, akış onay adımına geçmez.
 *
 * Adres çubuklarında kliniğin kendi alan adı görünür (`DOMAIN`). Demo kiracıya
 * bağlı bir alan adı yok; ekran canlı, adres temsilî. Masaüstü adres çubuğu
 * landing'de HTML'dir (`app/components/browser.tsx`), telefonunki bu script'te
 * görüntüye işlenir; ikisi aynı alan adını göstermeli.
 *
 *   pnpm capture:booking && pnpm screens
 *
 * Yüklü Google Chrome'u kullanır (playwright-core, `channel: "chrome"`).
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = `${ROOT}/assets/screens-raw`;
const BASE = 'https://demo-klinik.klinara.app';
const DOMAIN = 'randevu.kliniginiz.com';

/** Telefon: iPhone 17 Pro, 402×874 pt @3x. Üstte status bar, altta Safari çubuğu. */
const PHONE = { width: 402, height: 874, status: 62, toolbar: 80 };
const PHONE_PAGE_HEIGHT = PHONE.height - PHONE.status - PHONE.toolbar;

const browser = await chromium.launch({ channel: 'chrome' });

/** Saat tutma isteklerini canlıya göndermeden yanıtlar; slotToken'ın gövdesinden saati okur. */
async function mockHolds(page) {
  await page.route('**/holds**', async (route) => {
    const request = route.request();
    if (request.method() === 'POST' && new URL(request.url()).pathname.endsWith('/holds')) {
      const { slotToken } = request.postDataJSON();
      const slot = JSON.parse(Buffer.from(slotToken.split('.')[0], 'base64url').toString());
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          holdToken: 'landing-capture',
          startsAt: slot.startsAt,
          endsAt: slot.endsAt,
          // Sayaç ekranda 10:04 gibi dolu görünsün.
          expiresAt: new Date(Date.now() + 10 * 60_000 + 5_000).toISOString(),
          otpRequired: true,
          otpVerified: false,
        }),
      });
    }
    return route.fulfill({ status: 204, body: '' });
  });
  page.on('request', (request) => {
    if (request.method() !== 'GET' && !request.url().includes('/holds')) {
      throw new Error(`Beklenmeyen yazma isteği: ${request.method()} ${request.url()}`);
    }
  });
}

/** Şube (varsayılan) → hizmet → uygulayıcı "Fark etmez" → tarih ve saat; ilk açık günün 10:00'ı seçilir. */
async function pickSlot(page, { next, service, held, tap }) {
  await page.getByRole('button', { name: next }).click();
  await page.getByText(service, { exact: true }).click();
  await page.getByRole('button', { name: next }).click();
  await page.getByRole('button', { name: next }).click();
  const slot = page.getByRole('button', { name: '10:00', exact: true }).first();
  await slot.waitFor();
  await (tap ? slot.tap() : slot.click());
  await page.getByText(held).first().waitFor();
}

async function captureDesktop() {
  const context = await browser.newContext({
    viewport: { width: 1100, height: 688 },
    deviceScaleFactor: 2,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  });
  const page = await context.newPage();
  await mockHolds(page);
  await page.goto(`${BASE}/randevu`, { waitUntil: 'networkidle' });
  await pickSlot(page, { next: 'Devam', service: 'Diş Taşı Temizliği', held: 'Seçtiğiniz saat sizin için tutuluyor' });
  await page.locator('button[aria-haspopup="true"]').first().click();
  await page.mouse.move(2, 680);
  await page.waitForTimeout(600);
  await mkdir(`${RAW}/web`, { recursive: true });
  await page.screenshot({ path: `${RAW}/web/booking.png` });
  await context.close();
}

async function capturePhone() {
  // isMobile kapalı: açıkken Chromium tarayıcı çubuğunun gizlenmesini taklit edip
  // innerHeight'ı büyütüyor ve alttaki sabit "Continue" çubuğu kadrajdan taşıyor.
  const context = await browser.newContext({
    viewport: { width: PHONE.width, height: PHONE_PAGE_HEIGHT },
    deviceScaleFactor: 3,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    locale: 'en-GB',
    timezoneId: 'Europe/Istanbul',
  });
  const page = await context.newPage();
  await mockHolds(page);
  await page.goto(`${BASE}/en/randevu`, { waitUntil: 'networkidle' });
  await pickSlot(page, {
    next: 'Continue',
    service: 'Scale and polish',
    held: 'Your selected time is being held for you',
    tap: true,
  });
  await page.waitForTimeout(600);
  const shot = await page.screenshot();
  await context.close();

  const frame = await browser.newContext({ viewport: { width: PHONE.width, height: PHONE.height }, deviceScaleFactor: 3 });
  const wrap = await frame.newPage();
  await wrap.setContent(phoneChrome(`data:image/png;base64,${shot.toString('base64')}`));
  await wrap.waitForTimeout(300);
  const png = await wrap.screenshot();
  await frame.close();
  for (const mode of ['light', 'dark']) {
    await mkdir(`${RAW}/${mode}`, { recursive: true });
    await writeFile(`${RAW}/${mode}/online-booking.png`, png);
  }
}

/** iOS status bar (09:41) + sayfa + Safari alt çubuğu, alan adı ortada. */
function phoneChrome(src) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${PHONE.width}px; height: ${PHONE.height}px; overflow: hidden; background: #f9f9f7; color: #111;
    font-family: -apple-system, "SF Pro Text", system-ui, sans-serif; }
  .status { position: absolute; inset: 0 0 auto; height: ${PHONE.status}px; }
  .time { position: absolute; left: 0; top: 21px; width: 140px; text-align: center; font: 600 17px/22px -apple-system, "SF Pro Text"; letter-spacing: -0.2px; }
  .icons { position: absolute; right: 30px; top: 23px; display: flex; gap: 6px; align-items: center; }
  .page { position: absolute; top: ${PHONE.status}px; left: 0; width: ${PHONE.width}px; height: ${PHONE_PAGE_HEIGHT}px; display: block; }
  .bar { position: absolute; inset: auto 0 0; height: ${PHONE.toolbar}px; background: #f9f9f7; border-top: 0.5px solid rgba(0,0,0,0.08); }
  .row { position: absolute; top: 8px; left: 16px; right: 16px; height: 44px; display: flex; gap: 10px; align-items: center; }
  .round, .pill { height: 44px; border-radius: 22px; background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.06);
    display: flex; align-items: center; justify-content: center; }
  .round { width: 44px; flex-shrink: 0; }
  .pill { flex: 1; gap: 6px; font: 500 16px/1 -apple-system, "SF Pro Text"; letter-spacing: -0.2px; }
  .home { position: absolute; bottom: 8px; left: 50%; width: 140px; height: 5px; margin-left: -70px; border-radius: 3px; background: #111; }
</style></head><body>
  <div class="status">
    <div class="time">09:41</div>
    <div class="icons">
      <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1" fill="#111"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1" fill="#111"/><rect x="10" y="3" width="3.2" height="9" rx="1" fill="#111"/><rect x="15" y="0" width="3.2" height="12" rx="1" fill="#111"/></svg>
      <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.6 11.4.5 8.5.5S3 1.6 1 3.6l1.2 1.2C3.9 3.2 6.1 2.3 8.5 2.3Zm0 3.5c1.4 0 2.8.5 3.8 1.5l1.2-1.2C12.2 4.8 10.4 4 8.5 4S4.8 4.8 3.5 6.1l1.2 1.2c1-1 2.4-1.5 3.8-1.5Zm0 3.4c-.5 0-1 .2-1.4.6L8.5 11.2l1.4-1.4c-.4-.4-.9-.6-1.4-.6Z" fill="#111"/></svg>
      <svg width="28" height="13" viewBox="0 0 28 13"><rect x="0.5" y="0.5" width="24" height="12" rx="3.8" fill="none" stroke="#111" stroke-opacity="0.4"/><rect x="2" y="2" width="21" height="9" rx="2.5" fill="#111"/><path d="M26 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#111" fill-opacity="0.45"/></svg>
    </div>
  </div>
  <img class="page" src="${src}" alt="">
  <div class="bar">
    <div class="row">
      <div class="round"><svg width="12" height="20" viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="pill">
        <svg width="11" height="14" viewBox="0 0 11 14"><rect x="0.5" y="6" width="10" height="7.5" rx="1.8" fill="#111"/><path d="M2.6 6V4.2a2.9 2.9 0 0 1 5.8 0V6" fill="none" stroke="#111" stroke-width="1.5"/></svg>
        <span>${DOMAIN}</span>
      </div>
      <div class="round"><svg width="20" height="5" viewBox="0 0 20 5"><circle cx="2.5" cy="2.5" r="2.2" fill="#111"/><circle cx="10" cy="2.5" r="2.2" fill="#111"/><circle cx="17.5" cy="2.5" r="2.2" fill="#111"/></svg></div>
    </div>
    <div class="home"></div>
  </div>
</body></html>`;
}

try {
  await captureDesktop();
  console.log('✓ web/booking.png');
  await capturePhone();
  console.log('✓ light|dark/online-booking.png');
} finally {
  await browser.close();
}
