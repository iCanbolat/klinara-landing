import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "~/lib/cn";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Açık/koyu tema düğmesi. Tercih kaydedilmediyse sistem ayarını izler;
 * kullanıcı seçtiğinde `localStorage`'a yazılır.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        /* depolama kapalı: sistem ayarını izlemeye devam */
      }
      if (stored) return;
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* depolama kapalı: yalnız bu oturum için geçerli */
    }
    setTheme(next);
  }

  const label = theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-control text-muted transition-colors duration-200 hover:bg-fill hover:text-ink",
        className,
      )}
    >
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.75} aria-hidden />
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.75} aria-hidden />
    </button>
  );
}
