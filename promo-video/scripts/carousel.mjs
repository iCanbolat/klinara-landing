// Instagram carousel'lerini üretir.
//
//   npm run carousel [-- <set>] [-- <set> 03 07]
//
// Set verilmezse telefon-maliyeti. Durağan slaytlar son karelerinden PNG, video slayt MP4 olarak
// out/instagram/<set>/ altına yazılır. Slayt numarası verilirse yalnız onlar üretilir.

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

/** Set → Root.tsx kompozisyon öneki, slayt sayısı ve video slaytları. */
const SETS = {
  "telefon-maliyeti": { prefix: "Slayt", count: 9, videos: ["07"] },
  "tedavi-plani": { prefix: "Tedavi", count: 8, videos: ["08"] },
};

const args = process.argv.slice(2);
const name = args[0] in SETS ? args.shift() : "telefon-maliyeti";
const set = SETS[name];
const all = Array.from({ length: set.count }, (_, i) => String(i + 1).padStart(2, "0"));
const targets = args.length > 0 ? args : all;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out", "instagram", name);
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(root, "src", "index.ts") });
for (const n of targets) {
  const composition = await selectComposition({ serveUrl, id: `${set.prefix}${n}`, timeoutInMilliseconds: 90000 });
  if (set.videos.includes(n)) {
    const output = join(out, `${n}.mp4`);
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      crf: 20,
      pixelFormat: "yuv420p",
      outputLocation: output,
      timeoutInMilliseconds: 90000,
    });
    console.log(output);
  } else {
    const output = join(out, `${n}.png`);
    await renderStill({ composition, serveUrl, output, frame: composition.durationInFrames - 1, timeoutInMilliseconds: 90000 });
    console.log(output);
  }
}
