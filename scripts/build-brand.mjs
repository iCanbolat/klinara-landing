#!/usr/bin/env node
/*
 * Landing'in marka görsellerini TEK kaynaktan üretir: `assets/brand/klinara-logo-source.png`
 * (monorepo `assets/brand/` kopyası). Yöntem monorepo'daki `tools/brand/build-icons.mjs` ile
 * aynıdır: kaynak düz iki renkli ve beyaz zeminli, her piksel `a·renk + (1−a)·beyaz`
 * karışımı olduğu için alfa geri hesaplanır ve işaret açık/koyu paletle yeniden boyanır.
 *
 *   pnpm brand
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = `${ROOT}/assets/brand/klinara-logo-source.png`;

/** Kaynaktaki işaretin sınır kutusu (kelime markası hariç). */
const MARK_BOX = { left: 388, top: 292, width: 250, height: 306 };
/** İşaret + "KLINARA" kelime markası birlikte (OG görseli için). */
const LOGO_BOX = { left: 200, top: 280, width: 624, height: 460 };
const SRC_SAGE = [127, 154, 118];
const SRC_CHAR = [46, 53, 50];

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const bg = (h) => {
  const [r, g, b] = rgb(h);
  return { r, g, b, alpha: 1 };
};
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

/* iOS `Assets.xcassets` değerleri (BrandSage / Charcoal / Surface). */
const LIGHT = { sage: rgb('#7F9A76'), char: rgb('#2E3532') };
const DARK = { sage: rgb('#9DB894'), char: rgb('#F2EFEA') };

function unmix(p, c) {
  let num = 0;
  let den = 0;
  for (let k = 0; k < 3; k++) {
    const w = 255 - c[k];
    num += w * (255 - p[k]);
    den += w * w;
  }
  const a = den === 0 ? 0 : Math.max(0, Math.min(1, num / den));
  let err = 0;
  for (let k = 0; k < 3; k++) err += (a * c[k] + (1 - a) * 255 - p[k]) ** 2;
  return { a, err };
}

async function recolor(box, { sage, char }) {
  const { data, info } = await sharp(SOURCE).extract(box).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const p = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
    const s = unmix(p, SRC_SAGE);
    const c = unmix(p, SRC_CHAR);
    const hit = s.err <= c.err ? { a: s.a, t: sage } : { a: c.a, t: char };
    out.set(hit.t, i * 4);
    out[i * 4 + 3] = hit.a < 0.02 ? 0 : Math.round(hit.a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function square(input, { size, pad, ground = CLEAR }) {
  const inner = Math.round(size * (1 - 2 * pad));
  const mark = await sharp(input).resize(inner, inner, { fit: 'contain', background: CLEAR }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: ground } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toBuffer();
}

/** 1200×630 paylaşım görseli: solda logo, sağda gerçek dashboard ekranı. */
async function ogImage(logo) {
  const W = 1200;
  const H = 630;
  const logoImg = await sharp(logo).resize({ height: 300 }).toBuffer();
  const logoMeta = await sharp(logoImg).metadata();
  const phoneH = 560;
  const phone = await sharp(`${ROOT}/assets/screens-raw/light/dashboard.png`).resize({ height: phoneH }).toBuffer();
  const phoneMeta = await sharp(phone).metadata();
  // İnce kenarlık: ekran görüntüsünün arkasına 8px'lik kömür çerçeve.
  const frame = Buffer.from(
    `<svg width="${phoneMeta.width + 16}" height="${phoneH + 16}"><rect width="100%" height="100%" rx="58" fill="#2E3532"/></svg>`,
  );
  const phoneLeft = W - phoneMeta.width - 150;
  return sharp({ create: { width: W, height: H, channels: 4, background: bg('#EAF0E7') } })
    .composite([
      { input: logoImg, left: 130, top: Math.round((H - logoMeta.height) / 2) },
      { input: frame, left: phoneLeft - 8, top: Math.round((H - phoneH) / 2) + 60 - 8 },
      { input: phone, left: phoneLeft, top: Math.round((H - phoneH) / 2) + 60 },
    ])
    .png()
    .toBuffer();
}

const markLight = await recolor(MARK_BOX, LIGHT);
const markDark = await recolor(MARK_BOX, DARK);
const logoLight = await recolor(LOGO_BOX, LIGHT);

const TARGETS = [
  ['public/brand/mark-light.png', () => square(markLight, { size: 360, pad: 0.02 })],
  ['public/brand/mark-dark.png', () => square(markDark, { size: 360, pad: 0.02 })],
  ['public/favicon.png', () => square(markLight, { size: 64, pad: 0.04 })],
  ['public/apple-touch-icon.png', () => square(markLight, { size: 180, pad: 0.16, ground: bg('#FAF8F5') })],
  ['public/og.png', () => ogImage(logoLight)],
];

for (const [file, make] of TARGETS) {
  const abs = `${ROOT}/${file}`;
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, await make());
  console.log('✓', file);
}
