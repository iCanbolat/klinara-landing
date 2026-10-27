// Kontrol için seçili kareleri PNG'ye alır (tek bundle, çok kare).
//
//   node scripts/stills.mjs [Kompozisyon:kare ...]
//
// Argüman verilmezse her sahnenin birkaç anahtar karesi out/stills/ altına yazılır.

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out", "stills");
mkdirSync(out, { recursive: true });

const defaults = [
  "Sorun:40", "Sorun:90", "Sorun:135",
  "Marka:60",
  "OnlineRandevu:34", "OnlineRandevu:84", "OnlineRandevu:140", "OnlineRandevu:190",
  "Takvim:60", "Takvim:92",
  "WhatsApp:60", "WhatsApp:150",
  "Onam:100", "Onam:160",
  "TedaviPlani:100", "TedaviPlani:150",
  "Uygulamalar:100",
  "Kapanis:120",
];
const targets = (process.argv.length > 2 ? process.argv.slice(2) : defaults).map((t) => {
  const [id, frame] = t.split(":");
  return { id, frame: Number(frame) };
});

const serveUrl = await bundle({ entryPoint: join(root, "src", "index.ts") });
for (const { id, frame } of targets) {
  const composition = await selectComposition({ serveUrl, id, timeoutInMilliseconds: 90000 });
  const output = join(out, `${id}-${frame}.png`);
  await renderStill({ composition, serveUrl, output, frame, timeoutInMilliseconds: 90000 });
  console.log(output);
}
