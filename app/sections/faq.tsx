import { useId, useState } from "react";
import { Plus } from "lucide-react";

import { site } from "~/config/site";
import { cn } from "~/lib/cn";

export const faqs = [
  {
    q: "Klinara hangi klinikler için uygun?",
    a: "Diş klinikleri, tıp estetiği klinikleri ve seans bazlı çalışan merkezler için tasarlandı. Tek hekimli muayenehaneden çok şubeli gruplara kadar aynı sistem kullanılır.",
  },
  {
    q: "WhatsApp hatırlatmaları nasıl çalışıyor?",
    a: "Kliniğinizin WhatsApp Business numarasını WhatsApp Business Platform üzerinden bağlarsınız. Onay, hatırlatma ve iptal mesajları Meta onaylı şablonlarla gider; danışan hatırlatmadaki butonla randevuyu onaylar ya da iptal eder. Pazarlama mesajı gönderilmez.",
  },
  {
    q: "KVKK ve onam süreci nasıl yönetiliyor?",
    a: "Aydınlatma metni sürümlü tutulur ve hangi danışanın hangi sürümü onayladığı kayıt altındadır. Hizmete özel işlem onamları klinikte tablette imzalanır, imzalı PDF danışan kartına eklenir. Metinlerin içeriği kliniğinize aittir; hukuk danışmanınızla gözden geçirmenizi öneririz.",
  },
  {
    q: "Online randevu sayfası kendi alan adımızla çalışır mı?",
    a: "Evet. Sayfanız kliniginiz.klinara.app adresinde hazır gelir. İsterseniz kendi alan adınızı bağlarsınız; HTTPS sertifikası otomatik kurulur.",
  },
  {
    q: "Mobil uygulama var mı?",
    a: "Ekibiniz için iOS ve Android uygulaması var: takvim, danışan kartı, WhatsApp konuşmaları, paketler ve raporlar. Web paneli aynı verilerle çalışır.",
  },
  {
    q: "Ekipte kim neyi görebilir?",
    a: "Dört hazır rol var: işletme sahibi, şube yöneticisi, resepsiyon ve uygulayıcı. Uygulayıcı varsayılan olarak yalnız kendi randevularını görür, şube yöneticisi kendi şubesiyle sınırlıdır.",
  },
  {
    q: "Giriş güvenliği nasıl sağlanıyor?",
    a: "Parola yerine passkey ile Face ID ya da parmak iziyle giriş yapılabilir. İki adımlı doğrulama ve telefon numarası doğrulaması da desteklenir.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold"
        >
          {q}
          <Plus
            className={cn("size-5 shrink-0 text-accent transition-transform duration-300 ease-brand", open && "rotate-45")}
            strokeWidth={1.75}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-brand",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-[62ch] pb-6 text-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="sss" className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20 lg:px-8">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">Sık sorulanlar</h2>
          <p className="mt-5 text-lg text-muted">
            Aklınıza takılan başka bir şey varsa{" "}
            <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent underline underline-offset-4">
              {site.contactEmail}
            </a>{" "}
            adresine yazın.
          </p>
        </div>
        <div className="reveal border-t border-line">
          {faqs.map((item, i) => (
            <Item key={item.q} q={item.q} a={item.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
