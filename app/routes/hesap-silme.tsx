import { Link } from "react-router";

import type { Route } from "./+types/hesap-silme";
import { LegalPage } from "~/components/legal-page";
import { site } from "~/config/site";
import { pageMeta } from "~/lib/seo";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Hesap ve Veri Silme | Klinara",
    description: "Klinara personel hesabınızın ve ilişkili verilerin silinmesini nasıl isteyeceğiniz.",
    path: "/hesap-silme",
  });
}

/**
 * Play Console "Veri güvenliği → Hesap silme" alanının istediği web bağlantısı.
 * Play şunları arar: uygulama/geliştirici adı, silme talebinin adımları, hangi
 * verinin silinip hangisinin ne kadar süre tutulduğu.
 */
export default function AccountDeletion() {
  const mail = site.contactEmail;
  const subject = encodeURIComponent("Hesap silme talebi");
  return (
    <LegalPage
      title="Hesap ve veri silme"
      updated="27 Ekim 2026"
      lead="Klinara (web paneli, iOS ve Android uygulaması) personel hesabınızın ve ona bağlı verilerin silinmesini buradan isteyebilirsiniz."
    >
      <h2>Talep nasıl yapılır?</h2>
      <ol>
        <li>
          Hesabınıza kayıtlı e-posta adresinden <a href={`mailto:${mail}?subject=${subject}`}>{mail}</a> adresine
          “Hesap silme talebi” konulu bir e-posta gönderin.
        </li>
        <li>E-postada çalıştığınız kliniğin adını ve hesabınızdaki telefon numarasını belirtin.</li>
        <li>
          Kimliğinizi doğrulamak için size bir onay e-postası göndeririz; onayladığınızda silme işlemi başlar ve
          tamamlandığında size bildiririz.
        </li>
      </ol>
      <p>
        Alternatif olarak kliniğinizin yöneticisinden hesabınızı kapatmasını da isteyebilirsiniz; kapatılan hesapla
        artık giriş yapılamaz.
      </p>

      <h2>Neler silinir?</h2>
      <ul>
        <li>Ad soyad, e-posta, telefon ve profil bilgileriniz.</li>
        <li>Parola özeti ve kayıtlı passkey'leriniz.</li>
        <li>Cihaz bildirim anahtarlarınız ve açık oturumlarınız.</li>
      </ul>
      <p>Silme talebi onaylandıktan sonra en geç 30 gün içinde tamamlanır.</p>

      <h2>Neler saklanır?</h2>
      <ul>
        <li>
          <strong>Hasta kayıtları:</strong> randevular, tedavi notları ve fotoğraflar kliniğe aittir; sizin hesabınız
          silinse de klinik adına saklanmaya devam eder. Bu kayıtların silinmesi için kliniğe başvurulmalıdır.
        </li>
        <li>
          <strong>Denetim kayıtları:</strong> hangi işlemi kimin yaptığını gösteren kayıtlar, yasal yükümlülükler ve
          hasta güvenliği gereği mevzuatın öngördüğü süre boyunca tutulur.
        </li>
      </ul>

      <h2>Hasta iseniz</h2>
      <p>
        Kaydınızı tutan klinik veri sorumlusudur. Silme ya da düzeltme talebinizi doğrudan kliniğe iletin. Ayrıntılar{" "}
        <Link to="/gizlilik">Gizlilik Politikası</Link>'nda.
      </p>
    </LegalPage>
  );
}
