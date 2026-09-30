import { data, Link } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Route } from "./+types/blog-post";
import { ButtonLink } from "~/components/button";
import { PostCardRow, PostMetaLine } from "~/components/post-card";
import { PostCover } from "~/components/post-cover";
import { demoMailto } from "~/config/site";
import { getAllPosts } from "~/lib/blog.server";
import { absoluteUrl, organizationLd, pageMeta } from "~/lib/seo";

export async function loader({ params }: Route.LoaderArgs) {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) throw data("Yazı bulunamadı", { status: 404 });
  // İlgili yazılar: önce aynı segment, sonra en yeniler.
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.segment === post.segment) - Number(a.segment === post.segment))
    .slice(0, 2)
    .map(({ html: _html, toc: _toc, ...meta }) => meta);
  return { post, related };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Yazı bulunamadı | Klinara" }];
  const { post } = loaderData;
  const image = post.cover.startsWith("/") ? post.cover : "/og.png";
  return pageMeta({
    title: `${post.title} | Klinara Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    image,
    type: "article",
    extra: [{ property: "article:published_time", content: post.date }],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: "tr-TR",
        image: absoluteUrl(image),
        mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        author: { "@type": "Organization", name: post.author },
        publisher: organizationLd,
      },
    ],
  });
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post, related } = loaderData;
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 md:pt-14 lg:px-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-[15px] font-medium text-muted hover:text-ink">
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
        Blog
      </Link>

      <header className="mt-8 max-w-3xl">
        <PostMetaLine post={post} />
        <h1 className="mt-4 font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[52px]">
          {post.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-muted">{post.description}</p>
      </header>

      <PostCover post={post} priority className="mt-10 aspect-[16/9] rounded-card md:aspect-[21/9]" sizes="(min-width: 1280px) 1216px, 100vw" />

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article
          className="prose prose-lg prose-klinara max-w-[68ch]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav aria-label="İçindekiler" className="sticky top-28">
              <p className="text-label text-muted">İçindekiler</p>
              <ol className="mt-4 grid gap-2.5 border-l border-line text-[15px]">
                {post.toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted hover:border-sage hover:text-ink">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      <aside className="mt-16 max-w-[68ch] rounded-card bg-sage-soft p-7 md:p-9">
        <p className="font-serif text-2xl font-semibold tracking-[-0.015em]">Bunları tek yerde yönetmek ister misiniz?</p>
        <p className="mt-3 text-muted">
          Klinara takvimi, WhatsApp hatırlatmayı, KVKK onamını ve seans takibini diş ve estetik klinikleri için tek
          sistemde toplar.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ButtonLink href={demoMailto(post.title)}>Demo talep et</ButtonLink>
          <Link to="/#ozellikler" className="inline-flex items-center gap-2 font-semibold text-accent hover:underline hover:underline-offset-4">
            Özellikleri incele
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </aside>

      {related.length > 0 && (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-serif text-3xl font-semibold tracking-[-0.02em]">Diğer yazılar</h2>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {related.map((item) => (
              <PostCardRow key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
