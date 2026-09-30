import { screens, screenSrc, type ScreenName } from "~/config/screens";
import { cn } from "~/lib/cn";

type ScreenImageProps = {
  name: ScreenName;
  /** Görüntünün ekrandaki genişliği, `sizes` için. */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Gerçek iOS ekran görüntüsü; açık ve koyu tema için iki ayrı dosya.
 * Gizli olan (`display:none` + lazy) indirilmez.
 */
export function ScreenImage({ name, sizes, priority = false, className }: ScreenImageProps) {
  const common = {
    width: 1206,
    height: 2622,
    sizes,
    decoding: "async" as const,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : undefined,
    alt: screens[name],
  };
  const set = (mode: "light" | "dark") => `${screenSrc(name, mode, 400)} 400w, ${screenSrc(name, mode, 800)} 800w`;
  return (
    <>
      <img {...common} src={screenSrc(name, "light", 800)} srcSet={set("light")} className={cn("block h-auto w-full dark:hidden", className)} />
      <img {...common} src={screenSrc(name, "dark", 800)} srcSet={set("dark")} className={cn("hidden h-auto w-full dark:block", className)} />
    </>
  );
}

/**
 * Ekran görüntüsünü saran ince cihaz çerçevesi. İçerik gerçek uygulama
 * görüntüsüdür; çerçeve yalnız bezel. Köşe yarıçapı eliptik yüzde ile
 * genişliğe orantılı tutulur (ekran oranı 1206:2622).
 */
/** `className` genişliği belirler; verilmezse kapsayıcıyı doldurur. */
export function PhoneFrame({ children, className = "w-full" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[15.5%/7.1%] bg-[#1d211f] p-[2.4%] shadow-[0_40px_80px_-32px_rgb(46_53_50/0.35)] ring-1 ring-black/5 dark:shadow-[0_40px_80px_-32px_rgb(0_0_0/0.6)] dark:ring-white/10",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[13.8%/6.35%] bg-surface">{children}</div>
    </div>
  );
}

export function Phone({
  name,
  sizes = "(min-width: 1024px) 320px, 70vw",
  priority,
  className,
}: {
  name: ScreenName;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <PhoneFrame className={className}>
      <ScreenImage name={name} sizes={sizes} priority={priority} />
    </PhoneFrame>
  );
}
