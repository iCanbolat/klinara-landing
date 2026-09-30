import { Link } from "react-router";
import { Logo } from "~/components/logo";
import { nav, site } from "~/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[15px] text-muted">
            Diş ve estetik klinikleri için randevu ve klinik yönetimi. Web, iOS ve Android.
          </p>
        </div>

        <nav aria-label="Alt menü" className="grid content-start gap-2 text-[15px]">
          <p className="text-label text-muted">Sayfa</p>
          {nav.map((item) => (
            <Link key={item.href} to={item.href} className="w-fit text-ink hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="grid content-start gap-2 text-[15px]">
          <p className="text-label text-muted">İletişim</p>
          <a href={`mailto:${site.contactEmail}`} className="w-fit text-ink hover:text-accent">
            {site.contactEmail}
          </a>
          <a href={site.adminUrl} className="w-fit text-ink hover:text-accent">
            Yönetim paneline giriş
          </a>
          <a href="/rss.xml" className="w-fit text-ink hover:text-accent">
            Blog RSS
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted sm:px-6 lg:px-8">© {year} Klinara</p>
      </div>
    </footer>
  );
}
