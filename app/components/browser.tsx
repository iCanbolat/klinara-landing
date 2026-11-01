import { Lock } from "lucide-react";

import { Phone } from "~/components/phone";
import { WEB_SIZE, webScreens, webScreenSrc, type WebScreenName } from "~/config/screens";
import { cn } from "~/lib/cn";

/**
 * Görsellerde kliniğin kendi alan adı. Demo kiracıya bağlı bir alan adı yok;
 * ekranlar canlı, adres temsilî. Alt alan adı: özel alan adı CNAME ile
 * bağlanır ve kök alan adında CNAME olmaz. `scripts/capture-booking.mjs` telefon
 * görüntüsünün Safari çubuğuna aynı adı işler.
 */
export const BOOKING_DOMAIN = "randevu.kliniginiz.com";

/** Masaüstü tarayıcı penceresi: üç nokta ve ortada adres çubuğu. Adres metindir, görüntü değil. */
export function BrowserFrame({
  domain,
  path = "",
  className,
  children,
}: {
  domain: string;
  path?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[10px] bg-raised shadow-[0_40px_80px_-32px_rgb(46_53_50/0.35)] ring-1 ring-black/5 dark:shadow-[0_40px_80px_-32px_rgb(0_0_0/0.6)] dark:ring-white/10",
        className,
      )}
    >
      <div className="flex h-8 items-center gap-3 border-b border-line bg-fill px-3" aria-hidden>
        <div className="flex w-10 shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ec6a5e]" />
          <span className="size-2.5 rounded-full bg-[#f4bf4f]" />
          <span className="size-2.5 rounded-full bg-[#61c554]" />
        </div>
        <div className="flex h-5 min-w-0 flex-1 items-center justify-center gap-1 rounded-md bg-raised px-2 text-[11px] leading-none">
          <Lock className="size-2.5 shrink-0 text-muted" strokeWidth={2.5} />
          <span className="truncate">
            <span className="font-semibold">{domain}</span>
            <span className="text-muted">{path}</span>
          </span>
        </div>
        <div className="w-10 shrink-0" />
      </div>
      {children}
    </div>
  );
}

export function WebScreenImage({ name, sizes }: { name: WebScreenName; sizes: string }) {
  return (
    <img
      src={webScreenSrc(name, 1440)}
      srcSet={`${webScreenSrc(name, 720)} 720w, ${webScreenSrc(name, 1440)} 1440w`}
      sizes={sizes}
      width={WEB_SIZE.width}
      height={WEB_SIZE.height}
      loading="lazy"
      decoding="async"
      alt={webScreens[name]}
      className="block h-auto w-full"
    />
  );
}

/**
 * Online randevu sayfası iki cihazda: masaüstünde Türkçe, telefonda İngilizce;
 * ikisinin adres çubuğunda kliniğin alan adı. Telefon tarayıcının sağ altına
 * biner. Ölçüler genişliğe oranlı: tarayıcı %94, telefon %46; alt boşluk telefonun
 * tarayıcının yarısından başlamasını sağlar.
 */
export function BookingDevices({ className, sizes }: { className?: string; sizes: { browser: string; phone: string } }) {
  return (
    <div className={cn("relative pb-[64%]", className)}>
      <BrowserFrame domain={BOOKING_DOMAIN} path="/randevu" className="w-[94%]">
        <WebScreenImage name="booking" sizes={sizes.browser} />
      </BrowserFrame>
      <Phone name="online-booking" sizes={sizes.phone} className="absolute bottom-0 right-0 w-[46%]" />
    </div>
  );
}
