import { Link } from "react-router";
import { cn } from "~/lib/cn";

/** Marka işareti. Koyu temada kömür bacak açık tona döner (`pnpm brand`). */
export function KlinaraMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-block shrink-0", className)} aria-hidden>
      <img src="/brand/mark-light.png" alt="" width={360} height={360} className="size-full dark:hidden" />
      <img src="/brand/mark-dark.png" alt="" width={360} height={360} className="hidden size-full dark:block" />
    </span>
  );
}

/** İşaret + "KLINARA" kelime markası. Kelime markası canlı metin (web-admin ile aynı). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5 rounded-control", className)} aria-label="Klinara ana sayfa">
      <KlinaraMark className="size-8" />
      <span className="font-serif text-[17px] tracking-[0.28em] text-ink">KLINARA</span>
    </Link>
  );
}
