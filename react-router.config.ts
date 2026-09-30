import { readdirSync } from "node:fs";
import type { Config } from "@react-router/dev/config";

/** Blog yazıları `content/blog/<slug>.md`; her biri build'de statik HTML'e dönüşür. */
function blogSlugs(): string[] {
  return readdirSync("content/blog")
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => file.replace(/\.md$/, ""));
}

export default {
  // Çalışma anında sunucu yok: her sayfa build'de HTML'e dönüşür, çıktı
  // `build/client` herhangi bir statik host'a (Vercel, Cloudflare) yüklenir.
  ssr: false,
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), ...blogSlugs().map((slug) => `/blog/${slug}`), "/404"];
  },
} satisfies Config;
