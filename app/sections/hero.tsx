import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { Phone } from "~/components/phone";
import { demoMailto } from "~/config/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Derinlik: öndeki telefon biraz yukarı, arkadaki biraz aşağı kayar.
  const frontY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, 32]);

  return (
    <section ref={ref} className="relative overflow-hidden">
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
            Diş ve estetik klinikleri için takvim, WhatsApp hatırlatma, KVKK onamı ve seans takibi. Web, iOS ve
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
          className="animate-rise relative mx-auto h-[500px] w-full max-w-[520px] sm:h-[600px] lg:h-[660px]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <div className="absolute inset-x-0 bottom-6 top-20 rounded-card bg-sage-soft" aria-hidden />
          <motion.div style={{ y: backY }} className="absolute left-[4%] top-4 w-[46%] max-w-[250px] opacity-95">
            <Phone name="calendar-agenda" sizes="(min-width: 1024px) 250px, 46vw" priority />
          </motion.div>
          <motion.div style={{ y: frontY }} className="absolute right-[4%] top-16 w-[54%] max-w-[300px]">
            <Phone name="dashboard" sizes="(min-width: 1024px) 300px, 54vw" priority />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
