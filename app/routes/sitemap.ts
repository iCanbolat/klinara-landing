import { getPostMetas } from "~/lib/blog.server";
import { absoluteUrl } from "~/lib/seo";

export async function loader() {
  const posts = await getPostMetas();
  const latest = posts[0]?.date;
  const urls = [
    { loc: absoluteUrl("/"), lastmod: latest },
    { loc: absoluteUrl("/blog"), lastmod: latest },
    ...posts.map((post) => ({ loc: absoluteUrl(`/blog/${post.slug}`), lastmod: post.date })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
