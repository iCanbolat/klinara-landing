import { ArrowRight } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { HeroVideo } from "~/components/hero-video";
import { demoMailto } from "~/config/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 md:pt-16 lg:min-h-[min(calc(100dvh-4rem),860px)] lg:grid-cols-[1.25fr_1fr] lg:gap-8 lg:px-8 lg:pb-20 lg:pt-12">
        <div>
          <h1
            className="animate-rise pb-1 font-serif text-[40px] font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[44px] xl:text-[56px]"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            Randevudan onama,
            <br className="hidden sm:block" /> kliniğiniz <em className="font-semibold text-accent">tek ekranda.</em>
          </h1>
          <p
            className="animate-rise mt-6 max-w-[46ch] text-lg leading-relaxed text-muted"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            Diş ve sağlık klinikleri için takvim, WhatsApp hatırlatma, KVKK onamı ve seans takibi. Web, iOS ve
            Android'de.
          </p>
          <div className="animate-rise mt-9 flex flex-wrap gap-3" style={{ "--i": 2 } as React.CSSProperties}>
            <ButtonLink href={demoMailto()} size="lg">
              Demo talep et
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </ButtonLink>
            <ButtonLink to="/#fiyatlar" size="lg" variant="secondary">
              Fiyatları gör
            </ButtonLink>
          </div>
        </div>

        <div
          className="animate-rise relative mx-auto w-full max-w-[520px] pb-4 pr-4 sm:pb-5 sm:pr-5"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {/* Videonun arkasında, sağ alta kaymış açık yeşil panel: önceki telefon düzenindeki derinlik. */}
          <div className="absolute bottom-0 left-8 right-0 top-12 rounded-card bg-sage-soft" aria-hidden />
          <HeroVideo />
        </div>
      </div>
    </section>
  );
}
