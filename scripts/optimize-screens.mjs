#!/usr/bin/env node
/*
 * iOS simülatöründen alınan ham PNG'leri (`assets/screens-raw/{light,dark}`) landing'de
 * kullanılan WebP'lere çevirir: `public/screens/{light,dark}/<ad>-{400,800}.webp`.
 * Masaüstü tarayıcı görüntüleri (`assets/screens-raw/web`, `pnpm capture:booking`)
 * `public/screens/web/<ad>-{720,1440}.webp` olur.
 * Ekranları yeniden çekme adımları: README → "Ekran görüntülerini yenileme".
 *
 *   pnpm screens
 */
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTHS = { light: [400, 800], dark: [400, 800], web: [720, 1440] };

for (const [mode, widths] of Object.entries(WIDTHS)) {
  const src = `${ROOT}/assets/screens-raw/${mode}`;
  const out = `${ROOT}/public/screens/${mode}`;
  await mkdir(out, { recursive: true });
  const files = (await readdir(src)).filter((f) => f.endsWith('.png'));
  for (const file of files) {
    const name = file.replace(/\.png$/, '');
    for (const w of widths) {
      await sharp(`${src}/${file}`)
        .resize({ width: w })
        .webp({ quality: 82, alphaQuality: 90, effort: 6 })
        .toFile(`${out}/${name}-${w}.webp`);
    }
    console.log('✓', mode, name);
  }
}
