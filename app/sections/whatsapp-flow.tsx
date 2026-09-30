import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { BellRing, CalendarCheck, CalendarPlus, MessageCircleMore, RefreshCw } from "lucide-react";

import { Phone } from "~/components/phone";
import { cn } from "~/lib/cn";

/** Adımlar, API'deki standart WhatsApp şablonlarıyla (`whatsapp-standard-templates.ts`) birebir. */
const steps = [
  {
    icon: CalendarPlus,
    title: "Randevu oluşturulur",
    body: "Resepsiyondan, mobil uygulamadan ya da online randevu sayfanızdan.",
  },
  {
    icon: CalendarCheck,
    title: "Onay mesajı gider",
    body: "Tarih, saat, hizmet ve şube adresiyle. Haritada aç butonu danışanı kapınıza getirir.",
  },
  {
    icon: BellRing,
    title: "Randevudan önce hatırlatma",
    body: "Varsayılan olarak 24 ve 2 saat önce. Her şube kendi saatlerini seçebilir.",
  },
  {
    icon: MessageCircleMore,
    title: "Yanıt takvime işlenir",
    body: "Hatırlatmadaki Onaylıyorum ya da İptal etmek istiyorum butonu randevu durumunu günceller.",
  },
  {
    icon: RefreshCw,
    title: "Gelmeyen danışana takip",
    body: "Gelmedi olarak işaretlenen randevuda, yeni randevuya davet eden isteğe bağlı bir mesaj.",
  },
];

export function WhatsAppFlow() {
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.35 });

  return (
    <section className="border-y border-line bg-raised">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20 lg:px-8">
        <div className="reveal order-2 mx-auto w-[260px] sm:w-[300px] lg:order-1 lg:w-full lg:max-w-[320px]">
          <Phone name="message-log" sizes="(min-width: 1024px) 320px, 300px" />
        </div>

        <div className="order-1 lg:order-2">
          <div className="reveal max-w-xl">
            <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
              Hatırlatmayı WhatsApp üstlenir
            </h2>
            <p className="mt-5 text-lg text-muted">
              Meta onaylı şablonlarla, kendi WhatsApp Business numaranızdan. Pazarlama mesajı gönderilmez, yalnız
              randevuyla ilgili bildirim gider.
            </p>
          </div>

          <ol ref={listRef} className="relative isolate mt-10 grid gap-7">
            {/* Adımları bağlayan çizgi; bölüm görününce yukarıdan aşağı dolar. */}
            <span aria-hidden className="absolute bottom-5 left-[19px] top-5 -z-10 w-px bg-line" />
            <motion.span
              aria-hidden
              className="absolute bottom-5 left-[19px] top-5 -z-10 w-px origin-top bg-sage"
              initial={false}
              animate={{ scaleY: inView ? 1 : 0 }}
              transition={{ duration: 1.3, ease: [0.2, 0.8, 0.2, 1] }}
            />
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span
                  className={cn(
                    "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ease-brand",
                    inView ? "border-sage bg-sage-soft text-accent" : "border-line bg-raised text-muted",
                  )}
                  style={{ transitionDelay: inView ? `${150 + i * 240}ms` : "0ms" }}
                >
                  <step.icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="pt-1.5">
                  <h3 className="text-[17px] font-semibold">{step.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
