import { useState } from "react";

import type { Route } from "./+types/blog-index";
import { PostCardFeatured, PostCardLarge } from "~/components/post-card";
import { SEGMENTS, type Segment } from "~/lib/blog";
import { getPostMetas } from "~/lib/blog.server";
import { cn } from "~/lib/cn";
import { pageMeta } from "~/lib/seo";

export async function loader() {
  return { posts: await getPostMetas() };
}

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Blog | Klinara",
    description: "Diş klinikleri, estetik klinikler ve güzellik merkezleri için randevu, iletişim, KVKK ve seans takibi üzerine pratik yazılar.",
    path: "/blog",
  });
}

type Filter = "all" | Segment;

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [filter, setFilter] = useState<Filter>("all");
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "Tümü" },
    ...(Object.entries(SEGMENTS) as [Segment, string][]).map(([id, label]) => ({ id, label })),
  ];
  const visible = filter === "all" ? posts : posts.filter((post) => post.segment === filter);
  const [featured, ...rest] = visible;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 md:pt-20 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="animate-rise font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[56px]">
          Klinik yönetimi üzerine yazılar
        </h1>
        <p className="animate-rise mt-5 max-w-[56ch] text-lg text-muted" style={{ "--i": 1 } as React.CSSProperties}>
          Randevu, iletişim, KVKK ve seans takibi üzerine; diş klinikleri, estetik klinikler ve güzellik merkezleri için
          pratik notlar.
        </p>
      </header>

      <div role="group" aria-label="Kategori" className="mt-10 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "h-10 rounded-full border px-4 text-[15px] font-medium transition-colors duration-200",
              filter === item.id
                ? "border-primary bg-primary text-on-primary"
                : "border-line bg-raised text-ink hover:border-sage",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-12 rounded-card border border-dashed border-line p-10 text-center">
          <p className="font-serif text-2xl font-semibold">Bu kategoride henüz yazı yok</p>
          <p className="mt-2 text-muted">Yakında eklenecek. Diğer kategorilere göz atabilirsiniz.</p>
        </div>
      ) : (
        <>
          <div className="mt-12">
            <PostCardFeatured post={featured} />
          </div>
          {rest.length > 0 && (
            <div className="mt-16 grid gap-14 border-t border-line pt-14 md:grid-cols-2">
              {rest.map((post) => (
                <PostCardLarge key={post.slug} post={post} headingLevel="h2" />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
