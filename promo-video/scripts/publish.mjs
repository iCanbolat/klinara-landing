// Render çıktılarını landing'e taşır: iki MP4 + WebP poster → ../public/videos/.
//
//   npm run publish:landing   (önce: npm run render)

import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const landing = join(root, "..");
const target = join(landing, "public", "videos");
// sharp landing'in bağımlılığı; buraya ayrıca kurulmaz.
const sharp = createRequire(join(landing, "package.json"))("sharp");

mkdirSync(target, { recursive: true });
for (const name of ["klinara-promo.mp4", "klinara-promo-720.mp4"]) {
  copyFileSync(join(root, "out", name), join(target, name));
  console.log(join(target, name));
}
await sharp(join(root, "out", "klinara-promo-poster.jpg"))
  .webp({ quality: 82 })
  .toFile(join(target, "klinara-promo-poster.webp"));
console.log(join(target, "klinara-promo-poster.webp"));
