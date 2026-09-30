import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { Logo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { demoMailto, nav, site } from "~/config/site";
import { cn } from "~/lib/cn";
import { LAYER } from "~/lib/layers";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();

  // Yalnız eşik geçilince state değişir; her karede render olmaz.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 border-b backdrop-blur-md transition-colors duration-200",
        LAYER.header,
        scrolled || open ? "border-line bg-surface/90" : "border-transparent bg-surface/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Ana menü" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="rounded-control px-3 py-2 text-[15px] font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={site.adminUrl}
            className="hidden rounded-control px-3 py-2 text-[15px] font-medium text-muted transition-colors duration-200 hover:text-ink sm:inline-flex"
          >
            Giriş
          </a>
          <ButtonLink href={demoMailto()} size="sm" className="mx-1.5 hidden sm:inline-flex">
            Demo talep et
          </ButtonLink>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-control text-ink hover:bg-fill lg:hidden"
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobil-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn("absolute inset-x-0 top-full border-b border-line bg-surface lg:hidden", LAYER.menu)}
          >
            <nav aria-label="Mobil menü" className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-control px-2 py-3 text-lg font-medium text-ink hover:bg-fill"
                >
                  {item.label}
                </Link>
              ))}
              <a href={site.adminUrl} className="rounded-control px-2 py-3 text-lg font-medium text-muted hover:bg-fill">
                Giriş
              </a>
              <ButtonLink href={demoMailto()} size="lg" className="mt-3 w-full">
                Demo talep et
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
