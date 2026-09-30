import { site } from "~/config/site";
import { getPostMetas } from "~/lib/blog.server";
import { absoluteUrl } from "~/lib/seo";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function loader() {
  const posts = await getPostMetas();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(`${post.date}T08:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
    </item>`;
    })
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.name} Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Diş ve estetik klinikleri için klinik yönetimi yazıları.</description>
    <language>tr</language>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
