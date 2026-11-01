import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";

import { BookingDevices } from "~/components/browser";
import { Phone, PhoneFrame, ScreenImage } from "~/components/phone";
import type { ScreenName } from "~/config/screens";
import { cn } from "~/lib/cn";

/** `visual: "booking"`: telefon yerine tarayıcı + telefon (BookingDevices). */
type Chapter = { screen: ScreenName; visual?: "booking"; title: string; body: string; points: string[] };

const chapters: Chapter[] = [
  {
    screen: "calendar-agenda",
    title: "Takvim tek bakışta",
    body: "Günün randevuları uygulayıcıya göre süzülür. Planlandı, onaylandı ve geldi gibi durumlar ilk bakışta ayrılır.",
    points: ["Ajanda, gün ve hafta görünümü", "Uygulayıcı filtresi", "Çakışan randevu engellenir"],
  },
  {
    screen: "appointment-reminders",
    title: "Randevu durumu ve hatırlatmalar",
    body: "Danışan geldiğinde tek dokunuşla işaretlenir. Gönderilen WhatsApp hatırlatmaları randevunun içinde görünür.",
    points: ["Geldi, gelmedi, ertele", "Hatırlatma geçmişi", "Değişiklik kaydı"],
  },
  {
    screen: "online-booking",
    visual: "booking",
    title: "Kendi alan adınızda, hastanın dilinde",
    body: "Online randevu sayfanız randevu.kliniginiz.com gibi kendi alan adınızda açılır; hasta sayfayı Türkçe, İngilizce, Almanca ya da Rusça görür. Hizmeti seçtiğinde çalışma saatleri, molalar ve dolu randevular düşülür, yalnız uygun saatler listelenir.",
    points: ["Kendi alan adınız, HTTPS otomatik", "Hizmet adları ve sayfa metinleri panelden çevrilir", "Yalnız boş saatler, hazırlık payıyla"],
  },
  {
    screen: "treatment-plan",
    title: "Tedavi planı, aşama aşama",
    body: "İmplant, kanal tedavisi ya da ortodonti gibi haftalara yayılan tedavileri aşamalara bölün. Randevu tamamlanınca sıradaki aşamanın tarihi önerilir; randevusu olmayan aşama gözden kaçmaz.",
    points: ["Şablondan ya da hastaya özel plan", "Tüm aşamaları tek seferde planlama", "Hastaya WhatsApp ile aşama hatırlatması"],
  },
  {
    screen: "whatsapp-thread",
    title: "WhatsApp konuşmaları uygulamada",
    body: "Danışan mesajları ekibin ortak gelen kutusuna düşer. Otomatik hatırlatmalar ve yanıtlarınız aynı konuşmada kalır.",
    points: ["Kendi işletme numaranızdan", "Okunmamış ve kapalı ayrımı", "Konuşmadan randevu yönetimi"],
  },
  {
    screen: "report-occupancy",
    title: "Kararları raporlar verir",
    body: "Doluluk, uygulayıcı performansı, gelmeme ve geri dönüş oranları. Şube ve dönem bazında.",
    points: ["Uygulayıcı, şube ve gün kırılımı", "Gelmeme ve iptal oranı", "Web panelinden CSV çıktısı"],
  },
];

function ChapterBlock({ chapter, active, onActive }: { chapter: Chapter; active: boolean; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // Bölüm ekranın dikey ortasından geçerken aktif olur.
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });
  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-10 lg:min-h-[72vh] lg:py-0">
      <div className={cn("transition-opacity duration-500 ease-brand", active ? "opacity-100" : "lg:opacity-35")}>
        <h3 className="font-serif text-[28px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">{chapter.title}</h3>
        <p className="mt-4 max-w-[46ch] text-lg text-muted">{chapter.body}</p>
        <ul className="mt-6 grid gap-2.5">
          {chapter.points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-[15px]">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-sage-soft text-accent">
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
      {/* Mobil ve tablet: her bölümün kendi telefonu. */}
      {chapter.visual === "booking" ? (
        <BookingDevices
          className="mx-auto mt-10 w-full max-w-[440px] lg:hidden"
          sizes={{ browser: "(min-width: 480px) 414px, 92vw", phone: "(min-width: 480px) 200px, 44vw" }}
        />
      ) : (
        <div className="mx-auto mt-10 w-[250px] sm:w-[280px] lg:hidden">
          <Phone name={chapter.screen} sizes="280px" />
        </div>
      )}
    </div>
  );
}

export function FeatureStory() {
  const [active, setActive] = useState(0);
  const handlers = useRef(chapters.map((_, i) => () => setActive(i)));
  const bookingActive = chapters[active].visual === "booking";

  return (
    <section id="ozellikler" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:pt-28 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-label text-accent">Uygulamada</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
            Klinik gününüz, cebinizde.
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg text-muted">
            Aşağıdaki ekranlar Klinara iOS uygulamasından ve hastanın gördüğü online randevu sayfasından. Aynı veriler Android uygulamasında ve web panelinde de var.
          </p>
        </div>

        <div className="grid gap-x-16 pb-12 lg:grid-cols-[1fr_minmax(0,400px)] lg:pb-24">
          <div>
            {chapters.map((chapter, i) => (
              <ChapterBlock key={chapter.screen} chapter={chapter} active={active === i} onActive={handlers.current[i]} />
            ))}
          </div>

          {/* Masaüstü: yapışkan telefon, aktif bölüme göre ekran değişir. Online randevu
              bölümünde telefon çerçevesi söner, yerine tarayıcı + telefon gelir. */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[max(5.5rem,calc(50dvh-335px))] py-6">
              <div className="absolute inset-x-0 bottom-0 top-24 rounded-card bg-sage-soft" aria-hidden />
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{ opacity: bookingActive ? 0 : 1, y: bookingActive ? 10 : 0 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <PhoneFrame className="mx-auto w-[300px]">
                    {chapters.map((chapter, i) =>
                      chapter.visual ? null : (
                        <motion.div
                          key={chapter.screen}
                          initial={false}
                          animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 10 }}
                          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                          className={cn(i === 0 ? "relative" : "absolute inset-0")}
                          aria-hidden={active !== i}
                        >
                          <ScreenImage name={chapter.screen} sizes="300px" />
                        </motion.div>
                      ),
                    )}
                  </PhoneFrame>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: bookingActive ? 1 : 0, y: bookingActive ? 0 : 10 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className={cn("absolute inset-y-0 -right-2 left-0 flex items-center xl:-left-16", !bookingActive && "pointer-events-none")}
                  aria-hidden={!bookingActive}
                >
                  <BookingDevices
                    className="w-full"
                    sizes={{ browser: "(min-width: 1280px) 450px, 380px", phone: "(min-width: 1280px) 220px, 185px" }}
                  />
                </motion.div>
              </div>
              <ol className="relative mt-6 flex justify-center gap-2" aria-label="Ekranlar">
                {chapters.map((chapter, i) => (
                  <li
                    key={chapter.screen}
                    className={cn(
                      "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-brand",
                      active === i ? "w-6 bg-sage" : "w-1.5 bg-line",
                    )}
                  >
                    <span className="sr-only">{chapter.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
