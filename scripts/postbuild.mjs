#!/usr/bin/env node
/*
 * Prerender `/404` yolunu `build/client/404/index.html` olarak yazar. Statik
 * host'lar (Cloudflare `not_found_handling: "404-page"`, Vercel) kökte `404.html`
 * bekler; burada kopyalanır.
 */
import { copyFile, access } from "node:fs/promises";

const from = "build/client/404/index.html";
const to = "build/client/404.html";
await access(from);
await copyFile(from, to);
console.log(`✓ ${to}`);
