import { ArrowRight, Globe, Lock, Package, ShieldCheck, Users } from "lucide-react";

import { Phone } from "~/components/phone";
import { SignaturePad } from "~/components/signature-pad";

const bookingSteps = ["Şube", "Hizmet", "Uzman", "Saat", "KVKK onayı", "Telefon kodu"];
const roles = ["İşletme sahibi", "Şube yöneticisi", "Resepsiyon", "Uygulayıcı"];

function CellTitle({ icon: Icon, children }: { icon: typeof Globe; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2.5 font-serif text-2xl font-semibold tracking-[-0.015em]">
      <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
      {children}
    </h3>
  );
}

export function FeatureBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="reveal max-w-2xl">
        <h2 className="font-serif text-4xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-5xl">
          Randevu defterinin ötesinde
        </h2>
        <p className="mt-5 max-w-[56ch] text-lg text-muted">
          Online randevu sayfası, KVKK onamı, seans paketleri ve ekip yetkileri aynı sistemin parçası. Ayrı bir araç
          gerekmez.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {/* Online randevu sayfası */}
        <article className="reveal flex flex-col justify-between gap-8 rounded-card bg-sage-soft p-7 md:col-span-2 lg:col-span-7 lg:p-9">
          <div>
            <CellTitle icon={Globe}>Online randevu sayfası</CellTitle>
            <p className="mt-3 max-w-[48ch] text-muted">
              Danışanlarınız günün her saati randevu alır. Telefon koduyla doğrulanır, kendi linkinden erteleyip iptal
              edebilir.
            </p>
          </div>
          <div>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-raised px-4 py-2 text-[15px]">
              <Lock className="size-3.5 shrink-0 text-accent" strokeWidth={2} aria-hidden />
              <span className="truncate">
                <span className="text-muted">https://</span>kliniginiz.klinara.app
              </span>
            </div>
            <ol className="mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-2 text-sm" aria-label="Randevu adımları">
              {bookingSteps.map((step, i) => (
                <li key={step} className="flex items-center gap-1.5">
                  <span className="rounded-full bg-raised px-3 py-1.5 font-medium">{step}</span>
                  {i < bookingSteps.length - 1 && <ArrowRight className="size-3.5 text-muted" strokeWidth={1.75} aria-hidden />}
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-muted">Kendi alan adınızı da bağlayabilirsiniz, HTTPS otomatik kurulur.</p>
          </div>
        </article>

        {/* KVKK ve onam */}
        <article className="reveal flex flex-col gap-6 rounded-card border border-line bg-raised p-7 md:col-span-2 lg:col-span-5 lg:p-9">
          <div>
            <CellTitle icon={ShieldCheck}>KVKK ve işlem onamı</CellTitle>
            <p className="mt-3 text-muted">
              Sürümlü aydınlatma metni ve hizmete özel onam formları. Danışan klinikte tablette imzalar, imzalı PDF
              kartına eklenir. Deneyin:
            </p>
          </div>
          <SignaturePad />
        </article>

        {/* Seans paketleri */}
        <article className="reveal relative flex min-h-[360px] flex-col overflow-hidden rounded-card border border-line bg-raised p-7 lg:col-span-5">
          <CellTitle icon={Package}>Seans paketleri</CellTitle>
          <p className="mt-3 max-w-[40ch] text-muted">
            12 seanslık paketin 7'si kaldı. Kalan hak, geçerlilik ve kullanım her kalem için ayrı tutulur.
          </p>
          <div className="relative -mb-40 mt-8 flex justify-center">
            <Phone name="package" sizes="260px" className="w-[260px]" />
          </div>
        </article>

        {/* Çift randevu yok */}
        <article className="reveal flex flex-col justify-between gap-10 rounded-card bg-primary p-7 text-on-primary lg:col-span-3">
          <p className="font-serif text-[28px] font-semibold leading-tight tracking-[-0.015em]">Aynı saate iki randevu yok.</p>
          <p className="text-[15px] leading-relaxed">
            Bir uygulayıcıya çakışan randevu veritabanı seviyesinde engellenir. Hazırlık ve temizlik payı da takvimde yer
            tutar.
          </p>
        </article>

        {/* Roller ve şubeler */}
        <article className="reveal flex flex-col justify-between gap-8 rounded-card border border-line bg-dots p-7 md:col-span-2 lg:col-span-4">
          <div>
            <CellTitle icon={Users}>Roller ve şubeler</CellTitle>
            <p className="mt-3 text-muted">
              Herkes yalnız yetkisi olanı görür. Uygulayıcı kendi randevularını, şube yöneticisi kendi şubesini.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <li key={role} className="rounded-full border border-line bg-raised px-3.5 py-1.5 text-sm font-medium">
                {role}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
