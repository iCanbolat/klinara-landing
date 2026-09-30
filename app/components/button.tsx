import { Link } from "react-router";
import { cn } from "~/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold transition-[background-color,border-color,color,translate] duration-200 ease-brand active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-[color-mix(in_oklab,var(--primary)_86%,var(--ink))]",
  secondary: "border border-line bg-raised text-ink hover:border-sage hover:bg-sage-soft",
  ghost: "text-ink hover:bg-fill",
  /* Fotoğraf üstündeki bantta: açık zemin, koyu metin, her iki temada aynı. */
  inverse: "bg-[#FAF8F5] text-[#2E3532] hover:bg-[#EAF0E7]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

/** Sayfa içi rota: `to`. Dış link, mailto veya çapa: `href`. */
export function ButtonLink(
  props: Common & ({ to: string; href?: never } | { href: string; to?: never }) & React.AriaAttributes,
) {
  const { variant, size, className, children, to, href, ...rest } = props;
  const cls = buttonClass(variant, size, className);
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}
