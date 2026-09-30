import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check } from "lucide-react";

import { ButtonLink } from "~/components/button";
import { formatTL, includedFeatures, plans, yearlyMonthlyEquivalent, yearlyTotal, type Plan } from "~/config/pricing";
import { demoMailto, site } from "~/config/site";
import { cn } from "~/lib/cn";

type Billing = "monthly" | "yearly";

const ease = [0.2, 0.8, 0.2, 1] as const;

function BillingToggle({ value, onChange }: { value: Billing; onChange: (value: Billing) => void }) {
  const options: { id: Billing; label: string; note?: string }[] = [
    { id: "monthly", label: "Aylık" },
    { id: "yearly", label: "Yıllık", note: "2 ay bizden" },
  ];
  return (
    <LayoutGroup id="billing">
      <div role="radiogroup" aria-label="Ödeme dönemi" className="isolate inline-flex rounded-control border border-line bg-raised p-1">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "relative inline-flex h-10 items-center gap-2 rounded-[9px] px-4 text-[15px] font-semibold transition-colors duration-200",
                selected ? "text-on-primary" : "text-muted hover:text-ink",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="billing-pill"
                  className="absolute inset-0 rounded-[9px] bg-primary"
                  transition={{ duration: 0.28, ease }}
                />
              )}
              <span className="relative z-[1]">{option.label}</span>
              {option.note && (
                <span
                  className={cn(
                    "relative z-[1] rounded-full px-2 py-0.5 text-xs font-semibold",
                    selected ? "text-on-primary ring-1 ring-on-primary/50" : "bg-sage-soft text-accent",
                  )}
                >
                  {option.note}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const price = billing === "monthly" ? plan.monthly : yearlyMonthlyEquivalent(plan);
  return (
    <article
      className={cn(
        "reveal relative flex flex-col rounded-card border bg-raised p-7",
        plan.featured ? "border-sage ring-1 ring-sage" : "border-line",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-title-m">{plan.name}</h3>
        {plan.featured && (
          <span className="rounded-full bg-sage-soft px-3 py-1 text-xs font-semibold text-accent">Önerilen</span>
        )}
      </div>
      <p className="mt-2 min-h-[3em] text-[15px] text-muted">{plan.summary}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={`${plan.id}-${billing}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease }}
            className="font-serif text-5xl font-semibold tabular-nums tracking-[-0.02em]"
          >
            {formatTL(price)}
          </motion.span>
        </AnimatePresence>
        <span className="text-muted">/ay</span>
      </div>
      <p className="mt-2 h-5 text-sm text-muted">
        {billing === "yearly" ? `Yıllık ${formatTL(yearlyTotal(plan))} olarak faturalanır` : "Aylık faturalanır"}
      </p>

      <ul className="mt-6 grid gap-2.5 border-t border-line pt-6 text-[15px]">
        <li className="flex items-center gap-3">
          <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          {plan.branches === 1 ? "1 şube" : `${plan.branches} şubeye kadar`}
        </li>
        <li className="flex items-center gap-3">
          <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          {plan.practitioners} hekim ve uygulayıcıya kadar
        </li>
        <li className="flex items-center gap-3">
          <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          Tüm özellikler dahil
        </li>
      </ul>

      <ButtonLink
        href={demoMailto(`${plan.name} planı`)}
        variant={plan.featured ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        Demo talep et
      </ButtonLink>
    </article>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="fiyatlar" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="reveal flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-label text-accent">Fiyatlar</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
            Ek modül yok. Her planda her şey.
          </h2>
          <p className="mt-5 text-lg text-muted">
            Planlar yalnız şube ve hekim sayısına göre ayrılır. Fiyatlara KDV dahil değildir.
          </p>
        </div>
        <BillingToggle value={billing} onChange={setBilling} />
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} />
        ))}
      </div>

      <div className="reveal mt-14 rounded-card bg-sage-soft p-7 md:p-10">
        <h3 className="font-serif text-2xl font-semibold tracking-[-0.015em]">Her planda</h3>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {includedFeatures.map((group) => (
            <div key={group.group}>
              <p className="text-label text-muted">{group.group}</p>
              <ul className="mt-3 grid gap-2.5 text-[15px]">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-muted">
          Üçten fazla şubeniz ya da daha büyük bir ekibiniz varsa size özel fiyat için yazın:{" "}
          <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent underline underline-offset-4">
            {site.contactEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
