import type { MetaDescriptor } from "react-router";
import { site } from "~/config/site";

type PageMeta = {
  title: string;
  description: string;
  /** Kök göreli yol, örn. `/blog`. */
  path: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>[];
  extra?: MetaDescriptor[];
};

/**
 * Mutlak adres. Sayfa yolları eğik çizgiyle biter: Cloudflare Pages `/blog`'u
 * `/blog/`'a 308 ile yönlendiriyor; canonical ve sitemap yönlendirmeye işaret
 * etmesin. Uzantılı dosyalar (`/og.png`, `/rss.xml`) olduğu gibi kalır.
 */
export const absoluteUrl = (path: string) => {
  const url = new URL(path, site.url);
  if (!url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) url.pathname += "/";
  return url.toString();
};

/** Sayfa başlığı, açıklama, canonical, Open Graph ve Twitter etiketleri. */
export function pageMeta({ title, description, path, image = "/og.png", type = "website", jsonLd = [], extra = [] }: PageMeta): MetaDescriptor[] {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: site.name },
    { property: "og:locale", content: "tr_TR" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: img },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
    ...jsonLd.map((data) => ({ "script:ld+json": data })),
    ...extra,
  ];
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: absoluteUrl("/apple-touch-icon.png"),
  email: site.contactEmail,
};
