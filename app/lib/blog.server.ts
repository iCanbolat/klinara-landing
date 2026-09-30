/**
 * Blog içeriği: `content/blog/<slug>.md`. Yalnız build sırasında (prerender
 * loader'larında) çalışır; `.server` eki bu modülün tarayıcı paketine girmesini engeller.
 *
 * Frontmatter:
 *   title:       Başlık (zorunlu)
 *   description: Özet, arama sonucu ve kart metni (zorunlu)
 *   date:        YYYY-MM-DD (zorunlu)
 *   segment:     dis | estetik | guzellik (zorunlu)
 *   cover:       /photos/... görseli ya da screen:<ekran-adı> (zorunlu)
 *   author:      İsteğe bağlı, varsayılan "Klinara Ekibi"
 */
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

import { SEGMENTS, type PostMeta, type Post, type Segment, type TocItem } from "~/lib/blog";
import { screens } from "~/config/screens";

const CONTENT_DIR = join(process.cwd(), "content/blog");
const WORDS_PER_MINUTE = 200;

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };

export function slugify(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıİöşüâîû]/g, (ch) => TR_MAP[ch] ?? ch)
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(file: string, message: string): never {
  throw new Error(`content/blog/${file}: ${message}`);
}

function toISODate(value: unknown, file: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  fail(file, "`date` YYYY-MM-DD biçiminde olmalı");
}

function validate(data: Record<string, unknown>, file: string) {
  for (const key of ["title", "description", "segment", "cover"] as const) {
    if (typeof data[key] !== "string" || !(data[key] as string).trim()) fail(file, `\`${key}\` alanı eksik`);
  }
  const segment = data.segment as string;
  if (!(segment in SEGMENTS)) fail(file, `\`segment\` şunlardan biri olmalı: ${Object.keys(SEGMENTS).join(", ")}`);
  const cover = data.cover as string;
  if (cover.startsWith("screen:") && !(cover.slice(7) in screens)) fail(file, `bilinmeyen ekran: ${cover}`);
  if (!cover.startsWith("screen:") && !cover.startsWith("/")) fail(file, "`cover` /photos/... ya da screen:<ad> olmalı");
}

function render(markdown: string) {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const base = slugify(html) || "bolum";
        const n = used.get(base) ?? 0;
        used.set(base, n + 1);
        const id = n === 0 ? base : `${base}-${n + 1}`;
        if (depth === 2) toc.push({ id, title: html.replace(/<[^>]+>/g, "") });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' rel="noopener" target="_blank"' : "";
        const titleAttr = title ? ` title="${title}"` : "";
        return `<a href="${href}"${titleAttr}${attrs}>${text}</a>`;
      },
    },
  });
  const html = marked.parse(markdown, { async: false }) as string;
  return { html, toc };
}

async function readPost(file: string): Promise<Post> {
  const raw = await readFile(join(CONTENT_DIR, file), "utf8");
  const { data, content } = matter(raw);
  validate(data, file);
  const words = content.split(/\s+/).filter(Boolean).length;
  const { html, toc } = render(content);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    description: data.description,
    date: toISODate(data.date, file),
    segment: data.segment as Segment,
    cover: data.cover,
    author: typeof data.author === "string" ? data.author : "Klinara Ekibi",
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    html,
    toc,
  };
}

let cache: Promise<Post[]> | null = null;

/** Tüm yazılar, yeniden eskiye. */
export function getAllPosts(): Promise<Post[]> {
  cache ??= (async () => {
    const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
    const posts = await Promise.all(files.map(readPost));
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  })();
  return cache;
}

export async function getPostMetas(): Promise<PostMeta[]> {
  return (await getAllPosts()).map(({ html: _html, toc: _toc, ...meta }) => meta);
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((post) => post.slug === slug);
}
