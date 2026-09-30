/** Blog tipleri ve istemcide de kullanılan yardımcılar (sunucu kodu `blog.server.ts`). */

export const SEGMENTS = {
  dis: "Diş klinikleri",
  estetik: "Estetik klinikler",
  guzellik: "Güzellik merkezleri",
} as const;

export type Segment = keyof typeof SEGMENTS;

export type TocItem = { id: string; title: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  segment: Segment;
  /** `/photos/...` ya da `screen:<ekran-adı>` */
  cover: string;
  author: string;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string; toc: TocItem[] };

const dateFormat = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}
