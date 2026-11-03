import { createContext, useCallback, useContext, useId, useRef, useState } from "react";
import { CircleCheck, X } from "lucide-react";
import { Link } from "react-router";

import { buttonClass } from "~/components/button";
import { site } from "~/config/site";

/** Talebi e-postaya çeviren Pages Function (`functions/demo-talebi.ts`). */
const ENDPOINT = "/demo-talebi";

type Status = "idle" | "sending" | "sent" | "invalid" | "failed";

/**
 * `label` modalın üst etiketinde görünür (ör. "Klinik planı"); `source` talebin
 * hangi butondan geldiğini e-postaya yazar (ör. blog yazısının başlığı).
 */
type Origin = { label?: string; source?: string };

const DemoRequestContext = createContext<((origin: Origin) => void) | null>(null);

/**
 * "Demo talep et" butonlarının ortak modalı. Tek bir `<dialog>` kökte durur;
 * butonlar `useDemoRequest()` ile açar.
 */
export function DemoRequestProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [origin, setOrigin] = useState<Origin>({});

  const open = useCallback((next: Origin) => {
    setOrigin(next);
    dialogRef.current?.showModal();
  }, []);

  return (
    <DemoRequestContext value={open}>
      {children}
      <DemoRequestDialog dialogRef={dialogRef} origin={origin} />
    </DemoRequestContext>
  );
}

export function useDemoRequest() {
  const open = useContext(DemoRequestContext);
  if (!open) throw new Error("useDemoRequest, DemoRequestProvider içinde kullanılmalı");
  return open;
}

type ButtonProps = Origin & {
  variant?: Parameters<typeof buttonClass>[0];
  size?: Parameters<typeof buttonClass>[1];
  className?: string;
  /** Modal açılmadan önce; ör. mobil menüyü kapatmak için. */
  onClick?: () => void;
  children: React.ReactNode;
};

export function DemoRequestButton({ label, source, variant, size, className, onClick, children }: ButtonProps) {
  const open = useDemoRequest();
  return (
    <button
      type="button"
      className={buttonClass(variant, size, className)}
      onClick={() => {
        onClick?.();
        open({ label, source: source ?? label });
      }}
    >
      {children}
    </button>
  );
}

const inputClass =
  "h-11 w-full rounded-control border border-line bg-surface px-3.5 text-[15px] text-ink transition-colors duration-200 placeholder:text-muted/70 hover:border-sage focus:border-sage";

function DemoRequestDialog({
  dialogRef,
  origin,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  origin: Origin;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const titleId = useId();
  const fieldId = useId();

  const close = () => dialogRef.current?.close();

  // Gönderilmiş talep kapanınca form sıfırlanır; hata durumunda girilenler kalır.
  const onClose = () => {
    if (status === "sent") {
      formRef.current?.reset();
      setStatus("idle");
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          clinic: data.get("clinic"),
          phone: data.get("phone"),
          practitioners: Number(data.get("practitioners")),
          source: origin.source ?? null,
          website: data.get("website"),
        }),
      });
      setStatus(response.ok ? "sent" : response.status === 400 ? "invalid" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // Yalnız örtüye tıklama kapatır; içerik `div`'i tıklamayı kendine alır.
      onClick={(event) => event.target === event.currentTarget && close()}
      className="animate-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(calc(100%-2rem),440px)] overflow-y-auto rounded-card border border-line bg-raised p-0 text-ink shadow-[0_24px_64px_-16px_rgb(22_25_23/0.35)] backdrop:bg-[rgb(22_25_23/0.55)] backdrop:backdrop-blur-[2px]"
    >
      <div className="relative p-6 sm:p-8">
        {status === "sent" ? (
          <div className="py-4 text-center">
            <CircleCheck className="mx-auto size-11 text-accent" strokeWidth={1.5} aria-hidden />
            <h2 id={titleId} className="mt-4 text-display-m">
              Talebiniz bize ulaştı
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              En kısa sürede sizi arayıp kliniğinize uygun bir tanıtım saati ayarlayacağız.
            </p>
            <button type="button" className={buttonClass("secondary", "md", "mt-7 w-full")} onClick={close}>
              Kapat
            </button>
          </div>
        ) : (
          <>
            <p className="text-label text-accent">{origin.label ?? "Demo"}</p>
            <h2 id={titleId} className="mt-2 pr-8 text-display-m">
              Demo talep edin
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Bilgilerinizi bırakın, sizi arayıp kliniğinize uygun bir tanıtım saati ayarlayalım.
            </p>

            <form ref={formRef} onSubmit={onSubmit} className="mt-6 grid gap-4">
              <Field id={`${fieldId}-name`} label="Ad soyad">
                <input
                  id={`${fieldId}-name`}
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>
              <Field id={`${fieldId}-clinic`} label="Klinik adı">
                <input
                  id={`${fieldId}-clinic`}
                  name="clinic"
                  required
                  minLength={2}
                  maxLength={150}
                  autoComplete="organization"
                  className={inputClass}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
                <Field id={`${fieldId}-phone`} label="Telefon">
                  <input
                    id={`${fieldId}-phone`}
                    name="phone"
                    type="tel"
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="05xx xxx xx xx"
                    // Sunucu da aynı kuralı uygular: 10-15 rakam, boşluk ve +()- serbest.
                    pattern="[+0-9 \(\)\-\.]{10,30}"
                    maxLength={30}
                    className={inputClass}
                  />
                </Field>
                <Field id={`${fieldId}-practitioners`} label="Hekim sayısı">
                  <input
                    id={`${fieldId}-practitioners`}
                    name="practitioners"
                    type="number"
                    required
                    min={1}
                    max={999}
                    inputMode="numeric"
                    placeholder="ör. 3"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Bot tuzağı: insan görmez ve doldurmaz; dolu gelen talep sessizce düşer. */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] size-px opacity-0"
              />

              {(status === "invalid" || status === "failed") && (
                <p role="alert" className="rounded-control bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] px-3.5 py-2.5 text-[14px] text-danger">
                  {status === "invalid" ? (
                    "Bilgileri kontrol edip tekrar deneyin."
                  ) : (
                    <>
                      Talebiniz gönderilemedi. Biraz sonra tekrar deneyin ya da{" "}
                      <a href={`mailto:${site.contactEmail}`} className="font-medium underline underline-offset-2">
                        {site.contactEmail}
                      </a>{" "}
                      adresine yazın.
                    </>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className={buttonClass("primary", "lg", "mt-1 w-full disabled:opacity-70")}
              >
                {status === "sending" ? "Gönderiliyor…" : "Gönder"}
              </button>
              <p className="text-[13px] leading-relaxed text-muted">
                Bilgileriniz yalnız demo için sizinle iletişime geçmek amacıyla kullanılır.{" "}
                <Link to="/gizlilik" className="underline underline-offset-2 hover:text-ink" onClick={close}>
                  Gizlilik
                </Link>
              </p>
            </form>
          </>
        )}

        <button
          type="button"
          aria-label="Kapat"
          onClick={close}
          className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-control text-muted hover:bg-fill hover:text-ink sm:right-4 sm:top-4"
        >
          <X className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </dialog>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[14px] font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
