/**
 * Cloudflare Pages Function — kök alan adındaki randevu yollarını VPS'e aktarır.
 *
 * `klinara.app` bu statik sitedir; ama doğrudan randevu bağlantıları
 * (`/randevu?klinik=slug`, `/r/{token}`) ve onların varlıkları (`/_next/*`),
 * proxy uçları (`/api/*`) ve yönetim panelinin önizleme iframe'i
 * (`/preview.frame`) monorepo'daki web-booking uygulamasında yaşıyor.
 * Hangi yolların buraya geldiğini `public/_routes.json` belirler; geri kalan
 * her istek statik varlık olarak sunulur ve bu fonksiyonu hiç çalıştırmaz.
 *
 * Kaynak sunucu (`ORIGIN_URL`, ör. https://origin.klinara.app) isteği yalnız
 * `X-Klinara-Origin-Secret` doğruysa kabul eder. Sır, ziyaretçinin gerçek
 * IP'sinin (`X-Klinara-Client-Ip`) sahte olmadığının da kanıtıdır: public
 * randevu uçlarının hız sınırı IP bazlı ve IP iletilmezse bütün ziyaretçiler
 * tek bir Cloudflare adresini paylaşırdı.
 */

interface Env {
  ORIGIN_URL: string;
  ORIGIN_SHARED_SECRET: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

/** Ziyaretçinin gönderdiği bu başlıklara asla güvenilmez; kaynağa biz yazarız. */
const STRIPPED_HEADERS = [
  "x-klinara-origin-secret",
  "x-klinara-client-ip",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-real-ip",
];

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  if (!env.ORIGIN_URL || !env.ORIGIN_SHARED_SECRET) {
    return new Response("Randevu hizmeti yapılandırılmamış", { status: 503 });
  }

  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, env.ORIGIN_URL);

  const headers = new Headers(request.headers);
  for (const name of STRIPPED_HEADERS) headers.delete(name);
  headers.set("x-klinara-origin-secret", env.ORIGIN_SHARED_SECRET);
  headers.set("x-klinara-client-ip", request.headers.get("cf-connecting-ip") ?? "");

  // Next'in içerik hash'li derleme çıktısı değişmez: kenarda bir yıl tutulur.
  const immutable = url.pathname.startsWith("/_next/static/");
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const init: RequestInit & { cf?: Record<string, unknown> } = {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // Yönlendirmeler (ör. 307) tarayıcıya olduğu gibi gitmeli, burada izlenmemeli.
    redirect: "manual",
    ...(immutable ? { cf: { cacheEverything: true, cacheTtl: 31_536_000 } } : {}),
  };

  const response = await fetch(target, init);
  return new Response(response.body, response);
}
