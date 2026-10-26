import { Link } from "react-router";

import type { Route } from "./+types/gizlilik";
import { LegalPage } from "~/components/legal-page";
import { site } from "~/config/site";
import { pageMeta } from "~/lib/seo";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Gizlilik Politikası | Klinara",
    description: "Klinara'nın web paneli ve iOS/Android uygulamalarında hangi verileri, neden ve nasıl işlediği.",
    path: "/gizlilik",
  });
}

/**
 * Play Console "Gizlilik politikası" ve App Store "Privacy Policy URL" alanlarının
 * gösterdiği sayfa. Veri güvenliği formundaki cevaplarla çelişmemeli: biri değişirse
 * diğeri de güncellenir.
 */
export default function Privacy() {
  const mail = site.contactEmail;
  return (
    <LegalPage
      title="Gizlilik Politikası"
      updated="27 Ekim 2026"
      lead="Klinara, diş ve sağlık kliniklerinin randevu ve hasta takibini yürüttüğü bir yazılımdır. Bu sayfa web paneli, iOS ve Android uygulamalarında hangi verilerin işlendiğini anlatır."
    >
      <h2>Kim, hangi rolde?</h2>
      <p>
        Klinikler hastalarına ait bilgileri Klinara'ya kendileri girer. Bu veriler için 6698 sayılı KVKK kapsamında{" "}
        <strong>veri sorumlusu kliniktir</strong>; Klinara klinik adına ve onun talimatıyla verileri işleyen{" "}
        <strong>veri işleyendir</strong>. Klinik personelinin hesap bilgileri için ise veri sorumlusu Klinara'dır.
      </p>
      <p>
        Hasta iseniz ve kaydınızla ilgili bir talebiniz varsa önce ilgili klinikle iletişime geçin; klinik talebi
        bize iletirse yerine getirmesine yardımcı oluruz.
      </p>

      <h2>İşlediğimiz veriler</h2>
      <h3>Personel hesapları</h3>
      <ul>
        <li>Ad soyad, e-posta adresi, telefon numarası, rol ve bağlı olunan şube.</li>
        <li>
          Giriş bilgileri: parola (yalnız tek yönlü özet olarak) ve passkey kullanılıyorsa açık anahtar. Passkey'in
          gizli anahtarı cihazınızda kalır, bize hiç gelmez.
        </li>
        <li>Bildirim gönderebilmek için cihazın bildirim anahtarı (Apple APNs / Google FCM).</li>
        <li>Güvenlik ve denetim kayıtları: giriş zamanları, yapılan işlemler, IP adresi.</li>
      </ul>
      <h3>Klinik adına işlenen hasta verileri</h3>
      <ul>
        <li>Ad soyad, telefon, doğum tarihi gibi kimlik ve iletişim bilgileri.</li>
        <li>Randevular, tedavi planları, seans kayıtları ve klinik notları (sağlık verisi).</li>
        <li>Klinik fotoğrafları ve yüklenen dosyalar.</li>
        <li>Onam formları ve imzaları.</li>
        <li>WhatsApp üzerinden gönderilen randevu mesajları ve yanıtları.</li>
      </ul>

      <h2>Uygulama izinleri</h2>
      <ul>
        <li>
          <strong>Kamera:</strong> yalnız siz fotoğraf çekmeyi seçtiğinizde, hasta dosyasına klinik fotoğrafı eklemek
          için kullanılır.
        </li>
        <li>
          <strong>Fotoğraflar:</strong> galerinize erişim izni istemeyiz. Dosya eklerken sistemin fotoğraf seçicisi
          açılır ve uygulama yalnız sizin seçtiğiniz görseli alır.
        </li>
        <li>
          <strong>Bildirimler:</strong> yeni randevu, değişiklik ve hatırlatmaları size iletmek için. Kapatmak
          uygulamanın diğer işlevlerini etkilemez.
        </li>
      </ul>
      <p>Uygulamalarda reklam, reklam kimliği ya da üçüncü taraf analiz/izleme aracı bulunmaz.</p>

      <h2>Neden işliyoruz?</h2>
      <ul>
        <li>Hizmeti sunmak: takvim, hasta dosyası, hatırlatma ve bildirimler (sözleşmenin ifası).</li>
        <li>Hesabınızı ve hasta verilerini korumak: kimlik doğrulama, yetki kontrolü, kötüye kullanım tespiti.</li>
        <li>Yasal yükümlülükler: kayıtların mevzuatın öngördüğü süre boyunca saklanması.</li>
      </ul>
      <p>Verileri pazarlama amacıyla kullanmayız, satmayız ve reklam için kimseyle paylaşmayız.</p>

      <h2>Kimlerle paylaşılır?</h2>
      <p>Yalnız hizmetin çalışması için gereken, sözleşmeyle bağlı hizmet sağlayıcılarla:</p>
      <ul>
        <li>Barındırma ve içerik dağıtımı (sunucu ve Cloudflare).</li>
        <li>Telefon doğrulama SMS'leri (Netgsm) ve e-posta gönderimi.</li>
        <li>WhatsApp mesajları için Meta WhatsApp Business Platform.</li>
        <li>Mobil bildirimler için Apple Push Notification service ve Google Firebase Cloud Messaging.</li>
        <li>Hata takibi (uygulama ve sunucu hatalarının teknik ayrıntıları).</li>
      </ul>
      <p>
        Bu sağlayıcıların bir kısmı yurt dışında bulunduğundan, verilerin aktarımı KVKK'nın yurt dışı aktarım
        hükümlerine uygun olarak yapılır.
      </p>

      <h2>Güvenlik</h2>
      <p>
        Tüm bağlantılar şifrelidir (HTTPS/TLS). Hassas alanlar veritabanında ayrıca şifrelenir, mobil cihazda oturum
        bilgisi cihazın güvenli anahtar deposuyla korunur. Personel yalnız rolünün izin verdiği verileri görür.
      </p>

      <h2>Saklama ve silme</h2>
      <p>
        Veriler, klinikle sözleşme sürdüğü ve mevzuatın gerektirdiği süre boyunca saklanır. Personel hesabınızın ve
        ilişkili verilerin silinmesini nasıl isteyeceğiniz{" "}
        <Link to="/hesap-silme">Hesap ve veri silme</Link> sayfasında anlatılıyor.
      </p>

      <h2>Haklarınız</h2>
      <p>
        KVKK'nın 11. maddesi kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini ya da silinmesini
        isteme ve itiraz etme haklarınız vardır. Talepleriniz için <a href={`mailto:${mail}`}>{mail}</a> adresine
        yazabilirsiniz; en geç 30 gün içinde yanıt veririz.
      </p>

      <h2>Çocuklar</h2>
      <p>
        Uygulamalar klinik personeli içindir ve çocuklara yönelik değildir. Reşit olmayan hastaların kayıtları
        klinik tarafından, veli onayıyla oluşturulur.
      </p>

      <h2>Değişiklikler</h2>
      <p>Bu politika değişirse güncel sürüm bu sayfada yayımlanır ve üstteki tarih güncellenir.</p>
    </LegalPage>
  );
}
