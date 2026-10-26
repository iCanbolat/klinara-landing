import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog-index.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
  route("gizlilik", "routes/gizlilik.tsx"),
  route("hesap-silme", "routes/hesap-silme.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("rss.xml", "routes/rss.ts"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
