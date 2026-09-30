import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { PostCardLarge, PostCardRow } from "~/components/post-card";
import type { PostMeta } from "~/lib/blog";

export function BlogTeaser({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  const [first, ...rest] = posts;
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
            Klinik yönetimi üzerine yazılar
          </h2>
          <Link to="/blog" className="inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4">
            Tüm yazılar
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div className="reveal">
            <PostCardLarge post={first} />
          </div>
          <div className="reveal grid content-start gap-10">
            {rest.map((post) => (
              <PostCardRow key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
