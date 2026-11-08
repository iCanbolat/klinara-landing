import { Check } from "lucide-react";

import { DemoRequestButton } from "~/components/demo-request";
import { includedFeatures, plans, type Plan } from "~/config/pricing";
import { site } from "~/config/site";
import { cn } from "~/lib/cn";

function PlanCard({ plan }: { plan: Plan }) {
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

      <ul className="mt-6 grid gap-2.5 border-t border-line pt-6 text-[15px]">
        <li className="flex items-center gap-3">
          <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          {plan.branches === 1 ? "1 şube" : `${plan.branches} şubeye kadar`}
        </li>
        <li className="flex items-start gap-3">
          <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          <span>
            {plan.practitioners} hekim ve uygulayıcıya kadar
            <span className="block text-[13px] text-muted">Resepsiyon ve yönetici hesapları sayılmaz</span>
          </span>
        </li>
        <li className="flex items-center gap-3">
          <Check className="size-4 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          Tüm özellikler dahil
        </li>
      </ul>

      <DemoRequestButton
        label={`${plan.name} planı`}
        variant={plan.featured ? "primary" : "secondary"}
        className="mt-8 w-full"
      >
        Demo talep et
      </DemoRequestButton>
    </article>
  );
}

export function Pricing() {
  return (
    <section id="fiyatlar" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="reveal flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-label text-accent">Planlar</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
            Ek modül yok. Her planda her şey.
          </h2>
          <p className="mt-5 text-lg text-muted">
            Planlar yalnız şube ve hekim sayısına göre ayrılır. Size uygun fiyat için demo talep edin.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
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
          İkiden fazla şubeniz ya da daha büyük bir ekibiniz varsa size özel plan için yazın:{" "}
          <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent underline underline-offset-4">
            {site.contactEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
