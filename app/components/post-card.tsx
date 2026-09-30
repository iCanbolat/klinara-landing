import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

import { PostCover } from "~/components/post-cover";
import { formatDate, SEGMENTS, type PostMeta } from "~/lib/blog";
import { cn } from "~/lib/cn";

export function PostMetaLine({ post, className }: { post: PostMeta; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted", className)}>
      <span className="font-semibold text-accent">{SEGMENTS[post.segment]}</span>
      <span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>, {post.readingMinutes} dk okuma
      </span>
    </p>
  );
}

/** Büyük kart: üstte kapak, altta başlık ve özet. */
export function PostCardLarge({ post, headingLevel = "h3" }: { post: PostMeta; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <PostCover post={post} className="aspect-[16/10] rounded-card" />
      <PostMetaLine post={post} className="mt-5" />
      <Heading className="mt-2 font-serif text-[28px] font-semibold leading-tight tracking-[-0.015em] transition-colors duration-200 group-hover:text-accent md:text-[32px]">
        {post.title}
      </Heading>
      <p className="mt-3 max-w-[60ch] text-muted">{post.description}</p>
    </Link>
  );
}

/** Öne çıkan yazı: masaüstünde kapak solda, metin sağda. */
export function PostCardFeatured({ post }: { post: PostMeta }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      <PostCover post={post} priority className="aspect-[16/10] rounded-card" />
      <div>
        <PostMetaLine post={post} />
        <h2 className="mt-3 font-serif text-[30px] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent md:text-[38px]">
          {post.title}
        </h2>
        <p className="mt-4 text-lg text-muted">{post.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
          Yazıyı oku
          <ArrowRight className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

/** Yatay küçük kart: solda kapak, sağda başlık. */
export function PostCardRow({ post }: { post: PostMeta }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group grid grid-cols-[112px_1fr] items-start gap-5 sm:grid-cols-[168px_1fr]">
      <PostCover post={post} className="aspect-[4/3] rounded-card" sizes="168px" />
      <div>
        <PostMetaLine post={post} />
        <h3 className="mt-1.5 font-serif text-xl font-semibold leading-snug tracking-[-0.01em] transition-colors duration-200 group-hover:text-accent">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
