import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { MotionConfig } from "motion/react";

import "@fontsource-variable/manrope/index.css";
import "@fontsource/source-serif-4/400.css";
import "@fontsource/source-serif-4/600.css";
import "@fontsource/source-serif-4/400-italic.css";
import "@fontsource/source-serif-4/600-italic.css";
import "./app.css";

import type { Route } from "./+types/root";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { NotFoundContent } from "~/components/not-found-content";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/favicon.png" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "alternate", type: "application/rss+xml", title: "Klinara Blog", href: "/rss.xml" },
];

/**
 * Boyamadan önce temayı belirler: kayıtlı tercih varsa o, yoksa sistem ayarı.
 * Böylece koyu modda açık tema flaşı olmaz.
 */
const themeScript = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FAF8F5" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#161917" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </MotionConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <MotionConfig reducedMotion="user">
      <SiteHeader />
      {notFound ? (
        <NotFoundContent />
      ) : (
        <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
          <h1 className="text-display-m">Bir şeyler ters gitti</h1>
          <p className="mt-4 text-muted">Sayfayı yenilemeyi deneyin. Sorun sürerse bize yazın.</p>
          {import.meta.env.DEV && error instanceof Error && (
            <pre className="mt-6 overflow-x-auto rounded-card border border-line bg-raised p-4 text-sm">{error.stack}</pre>
          )}
        </main>
      )}
      <SiteFooter />
    </MotionConfig>
  );
}
