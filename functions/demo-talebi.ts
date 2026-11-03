/**
 * Cloudflare Pages Function — "Demo talep et" formunu e-postaya çevirir.
 *
 * Modal (`app/components/demo-request.tsx`) buraya JSON gönderir; talep Resend
 * ile `DEMO_REQUEST_TO` adresine düz metin e-posta olarak gider. Yol bilerek
 * `/api/*` altında değil: orası `[[path]].ts` ile VPS'e aktarılıyor. Function'ın
 * bu yolda çalışması için `public/_routes.json`'da da yazılı olması gerekir.
 *
 * Ad ve telefon yalnız e-postada yer alır; burada loglanmaz, saklanmaz.
 */

interface Env {
  RESEND_API_KEY?: string;
  /** Resend'de doğrulanmış alan adından; monorepo API'sinin `MAIL_FROM`'u ile aynı. */
  MAIL_FROM?: string;
  DEMO_REQUEST_TO?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface DemoRequest {
  name: string;
  clinic: string;
  phone: string;
  practitioners: number;
  source: string | null;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Klinara <bildirim@klinara.app>";
const DEFAULT_TO = "iletisim@klinara.app";
/** Dört kısa alan için fazlasıyla yeter; büyük gövde okunmadan reddedilir. */
const MAX_BODY_BYTES = 4_096;

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  // Yalnız `onRequestPost` verilseydi GET istekleri `[[path]].ts`'e düşüp VPS'e giderdi.
  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
  }

  // Form yalnız bu siteden gönderilir; başka sitenin sayfasından gelen istek reddedilir.
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "forbidden" }, 403);
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "invalid" }, 400);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }

  // Bot tuzağı doluysa başarılı görünür ama hiçbir şey gönderilmez.
  if (isRecord(input) && typeof input.website === "string" && input.website.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const demo = parseDemoRequest(input);
  if (!demo) return json({ error: "invalid" }, 400);

  if (!env.RESEND_API_KEY) {
    console.error("demo-talebi: RESEND_API_KEY tanımlı değil");
    return json({ error: "not_configured" }, 503);
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.MAIL_FROM || DEFAULT_FROM,
      to: [env.DEMO_REQUEST_TO || DEFAULT_TO],
      subject: `Demo talebi: ${demo.clinic}`,
      text: emailBody(demo),
    }),
  }).catch(() => null);

  if (!response?.ok) {
    // Resend'in hata gövdesi kişisel veri taşımaz (kod ve açıklama); talep içeriği loglanmaz.
    const detail = response ? (await response.text().catch(() => "")).slice(0, 300) : "zaman aşımı / ağ";
    console.error("demo-talebi: Resend reddetti", response?.status ?? 0, detail);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true }, 200);
}

function parseDemoRequest(input: unknown): DemoRequest | null {
  if (!isRecord(input)) return null;
  const name = text(input.name, 2, 100);
  const clinic = text(input.clinic, 2, 150);
  const phone = text(input.phone, 10, 30);
  const practitioners = Number(input.practitioners);
  if (!name || !clinic || !phone) return null;
  // Modaldaki `pattern` ile aynı: rakam, boşluk ve +()-. serbest; 10-15 rakam.
  if (!/^[+0-9 ().-]+$/.test(phone)) return null;
  const digits = phone.replace(/\D/g, "").length;
  if (digits < 10 || digits > 15) return null;
  if (!Number.isInteger(practitioners) || practitioners < 1 || practitioners > 999) return null;
  return { name, clinic, phone, practitioners, source: text(input.source, 1, 200) };
}

/** Kırpılmış, boşlukları tekleştirilmiş metin; satır sonu da kalmaz (e-posta konusu için). */
function text(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return clean.length >= min && clean.length <= max ? clean : null;
}

function emailBody(demo: DemoRequest): string {
  const sentAt = new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date());
  return [
    "Landing sayfasından yeni demo talebi:",
    "",
    `Ad soyad: ${demo.name}`,
    `Klinik: ${demo.clinic}`,
    `Telefon: ${demo.phone}`,
    `Hekim sayısı: ${demo.practitioners}`,
    `Kaynak: ${demo.source ?? "Demo talep et butonu"}`,
    `Gönderim: ${sentAt}`,
  ].join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function json(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}
