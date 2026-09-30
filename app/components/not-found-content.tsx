import { ButtonLink } from "~/components/button";

export function NotFoundContent() {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-start justify-center px-4 py-24 sm:px-6">
      <p className="text-label text-accent">404</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">Bu sayfa bulunamadı</h1>
      <p className="mt-4 max-w-[48ch] text-muted">
        Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir. Ana sayfadan ya da blogdan devam edebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/">Ana sayfa</ButtonLink>
        <ButtonLink to="/blog" variant="secondary">
          Blog
        </ButtonLink>
      </div>
    </main>
  );
}
