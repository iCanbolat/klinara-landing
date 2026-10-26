import type { ReactNode } from "react";

/**
 * Gizlilik ve hesap silme gibi düz metin sayfaların ortak iskeleti. Play Console ve
 * App Store bu sayfaları URL olarak istiyor; içerik değişince `updated` da değişir.
 */
export function LegalPage({ title, lead, updated, children }: { title: string; lead: string; updated: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 md:pt-14 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-label text-muted">Son güncelleme: {updated}</p>
        <h1 className="mt-4 font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[52px]">{title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-muted">{lead}</p>
      </header>
      <article className="prose prose-lg prose-klinara mt-12 max-w-[68ch]">{children}</article>
    </main>
  );
}
