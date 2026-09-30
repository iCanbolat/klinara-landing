import { ArrowRight } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { demoMailto } from "~/config/site";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
      <div className="reveal relative isolate overflow-hidden rounded-card">
        <img
          src="/photos/hero-salon.webp"
          alt=""
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        {/* Metin kontrastı için soldan koyulaşan örtü; her iki temada aynı. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[rgb(22_25_23/0.86)] via-[rgb(22_25_23/0.62)] to-[rgb(22_25_23/0.18)]"
        />
        <div className="max-w-xl px-7 py-16 md:px-14 md:py-24">
          <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-[#F2EFEA] md:text-5xl">
            Kliniğinizde nasıl çalışacağını birlikte görelim.
          </h2>
          <p className="mt-5 text-lg text-[#F2EFEA]/85">
            Kısa bir görüşmede kendi hizmetleriniz ve ekibinizle örnek bir gün kuralım.
          </p>
          <ButtonLink href={demoMailto()} size="lg" variant="inverse" className="mt-9">
            Demo talep et
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
