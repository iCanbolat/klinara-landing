import type { ReactNode } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Timer,
  UserRound,
  UsersRound,
} from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { progress, stepIndex } from "../anim";
import { WebsiteFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { FloatingChip, Sfx, Tap } from "../components/ui";
import { booking, clinic, doctor, serviceCategories } from "../data";
import { color } from "../theme";

/**
 * Online randevu sayfası masaüstünde (web-booking, kliniğin kendi alan adında):
 * adres çubuğuna alan adı yazılır, sayfa açılır; hizmet → uygulayıcı → saat
 * seçilir, sağdaki randevu özeti dolar, sonunda onay. Düzen gerçek masaüstü
 * akışının (adımlar üstte, sağda özet kartı) videoda okunacak ölçüde büyütülmüşü.
 */

/** Tarayıcının sahnedeki yeri (alt kenarı kadrajdan taşar, takvim sahnesindeki gibi). */
const WEB = { x: 40, y: 452, w: 1000, h: 960 } as const;
const PAGE_Y = WEB.y + 64;
/** Sol kart (adım içeriği) ve sağ özet kartının sayfadaki yeri. */
const CARD = { x: 30, y: 152, w: 610, h: 660 } as const;
const SUMMARY = { x: 670, y: 152, w: 300 } as const;
/** Kart içi kenar boşluğu ve içerik genişliği. */
const PAD = 28;
const INNER = CARD.w - PAD * 2;

/** Adres çubuğuna yazılan alan adı: bir karede bir harf. */
const TYPE_FROM = 2;
const LOADED = TYPE_FROM + clinic.domain.length + 2;
/** Adımların başladığı kareler: hizmet, uygulayıcı, saat, sonuç. */
const STEPS = [LOADED, 60, 100, 140] as const;
const TAPS = { service: 42, doctor: 82, slot: 120 } as const;

/** Kartın sahnedeki sol-üst köşesi (dokunuş koordinatları için). */
const CX = WEB.x + CARD.x;
const CY = PAGE_Y + CARD.y;

const TILE = { w: (INNER - 14) / 2, h: 88 } as const;
const ROW = { h: 96, gap: 12, top: 132 } as const;
const SLOT = { w: (INNER - 36) / 4, h: 60, gap: 12 } as const;
/** Öğle arası (12:15 → 14:00) listede yok: mola düşülmüş. */
const SLOT_GROUPS = [
  { label: "ÖĞLEDEN SONRA", top: 252, times: ["12:00", "12:15", booking.time, "14:15", "14:30", "14:45", "16:30", "16:45"] },
  { label: "AKŞAM", top: 444, times: ["17:00", "17:15"] },
];
/** Seçilen saatin kart içindeki yeri (dokunuş için). */
const PICKED = { col: 2, top: SLOT_GROUPS[0].top + 34 } as const;

const STEPPER = ["Şube", "Hizmet", "Uygulayıcı", "Tarih ve saat", "Onay", "İletişim", "Özet"] as const;

/** Bir adımın içeriği: yandan kayarak girer, sola kayarak çıkar. */
function Pane({ from, to, children }: { from: number; to: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 12) return null;
  const enter = progress(frame, from, 14);
  const exit = progress(frame, to, 12);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: enter * (1 - exit),
        translate: `${(1 - enter) * 50 - exit * 50}px 0px`,
      }}
    >
      {children}
    </div>
  );
}

function CardHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <div style={{ position: "absolute", top: 30, left: PAD, fontSize: 31, fontWeight: 700 }}>{title}</div>
      <div style={{ position: "absolute", top: 78, left: PAD, right: PAD, fontSize: 19, color: color.muted }}>{subtitle}</div>
    </>
  );
}

/** Seçim dairesi: boşken ince kenar, seçilince dolu ve tikli (web-booking'deki gibi). */
function Radio({ on, size = 28 }: { on: number; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 99,
        border: `2px solid ${on > 0.5 ? color.sageDeep : color.line}`,
        backgroundColor: on > 0.5 ? color.sageDeep : color.raised,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {on > 0.5 ? <Check size={size * 0.6} color="#fff" strokeWidth={3.2} style={{ scale: `${0.6 + on * 0.4}` }} /> : null}
    </span>
  );
}

/** Seçilebilir kutu (hizmet, uygulayıcı); `on` 0–1 seçimin geçişi. */
function Option({
  left,
  top,
  width,
  height,
  on,
  children,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  on: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        borderRadius: 18,
        border: `2px solid ${on > 0.5 ? color.sageDeep : color.line}`,
        backgroundColor: `rgba(234,240,231,${on * 0.9})`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 20px",
      }}
    >
      {children}
    </div>
  );
}

/** Türk bayrağı (dil seçicideki gibi), küçük. */
function TrFlag() {
  return (
    <svg width={28} height={19} viewBox="0 0 30 20" style={{ borderRadius: 3, boxShadow: "0 0 0 1px rgba(0,0,0,0.08)" }}>
      <rect width={30} height={20} fill="#E30A17" />
      <circle cx={11} cy={10} r={5} fill="#fff" />
      <circle cx={12.25} cy={10} r={4} fill="#E30A17" />
      <path d="M16.2 10l4.6-1.5-2.85 3.9V7.6l2.85 3.9z" fill="#fff" />
    </svg>
  );
}

function Header() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 78,
        borderBottom: `1.5px solid ${color.line}`,
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
        gap: 18,
      }}
    >
      <span style={{ flex: 1, fontSize: 25, fontWeight: 700 }}>{clinic.name}</span>
      <span
        style={{
          height: 44,
          padding: "0 14px",
          borderRadius: 99,
          border: `1.5px solid ${color.line}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        <TrFlag />
        TR
        <ChevronDown size={18} strokeWidth={2.2} color={color.muted} />
      </span>
      <span style={{ fontSize: 17, color: color.muted }}>Ana sayfaya dön</span>
    </div>
  );
}

/** Üstteki 7 adım; `current` 0 tabanlı, öncekiler tikli. */
function Stepper({ current }: { current: number }) {
  return (
    <div style={{ position: "absolute", top: 100, left: 30, right: 30, height: 36, display: "flex", alignItems: "center", gap: 10 }}>
      {STEPPER.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {i > 0 ? <span style={{ width: 8, height: 2, backgroundColor: color.line }} /> : null}
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 99,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 700,
                backgroundColor: done ? color.sage : color.raised,
                border: done ? "none" : `2px solid ${active ? color.sageDeep : color.line}`,
                color: active ? color.ink : color.muted,
                boxShadow: active ? `0 0 0 4px ${color.sageSoft}` : "none",
              }}
            >
              {done ? <Check size={18} color="#fff" strokeWidth={3} /> : i + 1}
            </span>
            <span style={{ fontSize: 17, fontWeight: active ? 700 : 500, color: done || active ? color.ink : color.muted }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Özet kartının bir satırı; değer seçilince yumuşak bir vurguyla dolar. */
function SummaryRow({
  icon,
  label,
  value,
  at,
  last,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  /** Değerin dolduğu kare; yoksa baştan dolu. */
  at?: number;
  last?: boolean;
}) {
  const frame = useCurrentFrame();
  const filled = at === undefined ? 1 : progress(frame, at, 10);
  const flash =
    at === undefined
      ? 0
      : interpolate(frame, [at, at + 6, at + 30], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "16px 12px",
        margin: "0 -12px",
        borderRadius: 14,
        backgroundColor: `rgba(234,240,231,${flash})`,
        borderBottom: last ? "none" : `1.5px solid ${color.fill}`,
      }}
    >
      <span style={{ color: color.muted, paddingTop: 2 }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em", color: color.muted }}>{label}</span>
        <span style={{ position: "relative", display: "block", height: 28, marginTop: 4, fontSize: 19 }}>
          <span style={{ position: "absolute", inset: 0, color: color.muted, opacity: 1 - filled }}>Seçilmedi</span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              fontWeight: 600,
              whiteSpace: "nowrap",
              opacity: filled,
              translate: `0px ${(1 - filled) * 8}px`,
            }}
          >
            {value}
          </span>
        </span>
      </span>
    </div>
  );
}

function Summary() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SUMMARY.x,
        top: SUMMARY.y,
        width: SUMMARY.w,
        borderRadius: 24,
        backgroundColor: color.raised,
        border: `1.5px solid ${color.line}`,
        boxShadow: "0 10px 30px -18px rgba(46,53,50,0.25)",
        padding: "22px 24px 10px",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Randevu özeti</div>
      <SummaryRow icon={<MapPin size={20} strokeWidth={2} />} label="ŞUBE" value={clinic.branch} />
      <SummaryRow icon={<Sparkles size={20} strokeWidth={2} />} label="HİZMET" value={booking.service} at={TAPS.service + 4} />
      <SummaryRow icon={<UserRound size={20} strokeWidth={2} />} label="UYGULAYICI" value={doctor.name} at={TAPS.doctor + 4} />
      <SummaryRow
        icon={<CalendarClock size={20} strokeWidth={2} />}
        label="TARİH VE SAAT"
        value={`${booking.dateLong} ${booking.time}`}
        at={TAPS.slot + 4}
        last
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderTop: `1.5px solid ${color.fill}`,
          padding: "14px 0 10px",
          fontSize: 18,
          color: color.muted,
          opacity: progress(frame, TAPS.service + 4, 10),
        }}
      >
        <Clock size={20} strokeWidth={2} />
        {booking.duration}
      </div>
    </div>
  );
}

/** Kategori başlığı ve altında iki sütun hizmet kutusu; hizmet konumları kategoriler boyunca birikir. */
const SERVICE_LAYOUT = (() => {
  let top = 128;
  return serviceCategories.map((category) => {
    const labelTop = top;
    const tiles = category.services.map((service, i) => ({
      service,
      left: PAD + (i % 2) * (TILE.w + 14),
      top: labelTop + 34 + Math.floor(i / 2) * (TILE.h + 14),
    }));
    top = labelTop + 34 + Math.ceil(category.services.length / 2) * (TILE.h + 14) + 18;
    return { name: category.name, labelTop, tiles };
  });
})();
const PICKED_TILE = SERVICE_LAYOUT.flatMap((c) => c.tiles).find((t) => t.service.name === booking.service)!;

function ServiceStep() {
  const frame = useCurrentFrame();
  const chosen = progress(frame, TAPS.service, 8);
  return (
    <>
      <CardHeading title="Hizmet seçin" subtitle="Randevu almak istediğiniz hizmeti seçin." />
      {SERVICE_LAYOUT.map((category) => (
        <div key={category.name}>
          <div
            style={{
              position: "absolute",
              top: category.labelTop,
              left: PAD,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: color.muted,
            }}
          >
            {category.name}
          </div>
          {category.tiles.map(({ service, left, top }) => {
            const on = service.name === booking.service ? chosen : 0;
            return (
              <Option key={service.name} left={left} top={top} width={TILE.w} height={TILE.h} on={on}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 21, fontWeight: 600, whiteSpace: "nowrap" }}>{service.name}</span>
                  <span style={{ display: "block", fontSize: 16, color: color.muted, marginTop: 2 }}>{service.duration}</span>
                </span>
                <Radio on={on} />
              </Option>
            );
          })}
        </div>
      ))}
    </>
  );
}

function DoctorStep() {
  const frame = useCurrentFrame();
  const chosen = progress(frame, TAPS.doctor, 8);
  const options = [
    { name: "Fark etmez", sub: "En uygun saatler gösterilir", initials: "" },
    { name: doctor.name, sub: doctor.title, initials: doctor.initials },
    { name: "Dr. Elif Yalçın", sub: "Periodontoloji Uzmanı", initials: "EY" },
    { name: "Dr. Can Öztürk", sub: "Ağız, Diş ve Çene Cerrahı", initials: "CÖ" },
  ];
  return (
    <>
      <CardHeading title="Uygulayıcı seçin" subtitle="Belirli bir hekim seçebilir ya da kliniğe bırakabilirsiniz." />
      {options.map((d, i) => {
        const on = i === 1 ? chosen : i === 0 ? 1 - chosen : 0;
        return (
          <Option key={d.name} left={PAD} top={ROW.top + i * (ROW.h + ROW.gap)} width={INNER} height={ROW.h} on={on}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 99,
                backgroundColor: color.sageSoft,
                color: color.sageDeep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {d.initials || <UsersRound size={26} strokeWidth={2} />}
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 22, fontWeight: 600 }}>{d.name}</span>
              <span style={{ display: "block", fontSize: 17, color: color.muted, marginTop: 2 }}>{d.sub}</span>
            </span>
            <Radio on={on} />
          </Option>
        );
      })}
    </>
  );
}

function SlotStep() {
  const frame = useCurrentFrame();
  const chosen = progress(frame, TAPS.slot, 6);
  const held = progress(frame, TAPS.slot + 6, 10);
  // Tutma sayacı 10:00'dan geri sayar (saniyede bir).
  const left = 600 - Math.max(0, Math.floor((frame - TAPS.slot - 6) / 30));
  const timer = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
  const days = [
    ["BUGÜN", "27"],
    [booking.dayLabel.toLocaleUpperCase("tr"), booking.day],
    ["PER", "29"],
    ["CUM", "30"],
    ["CMT", "31"],
  ];
  return (
    <>
      <CardHeading title="Tarih ve saat seçin" subtitle="Saatler kliniğin saat diliminde gösteriliyor." />
      {[ChevronLeft, ChevronRight].map((Icon, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 154,
            left: i === 0 ? PAD : PAD + INNER - 44,
            width: 44,
            height: 44,
            borderRadius: 99,
            border: `1.5px solid ${color.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: i === 0 ? 0.45 : 1,
          }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </span>
      ))}
      {days.map(([d, n], i) => {
        const selected = i === 1;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              top: 128,
              left: PAD + 58 + i * 88,
              width: 78,
              height: 96,
              borderRadius: 20,
              border: `1.5px solid ${selected ? color.sageDeep : color.line}`,
              backgroundColor: selected ? color.sageDeep : color.raised,
              color: selected ? "#fff" : i === 0 ? color.muted : color.ink,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              opacity: i === 0 ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em" }}>{d}</span>
            <span style={{ fontSize: 28, fontWeight: 700 }}>{n}</span>
            {i > 0 ? (
              <span
                style={{ width: 22, height: 6, borderRadius: 9, backgroundColor: selected ? "rgba(255,255,255,0.7)" : color.sageDeep }}
              />
            ) : null}
          </div>
        );
      })}
      {SLOT_GROUPS.map((group) => (
        <div key={group.label}>
          <div
            style={{
              position: "absolute",
              top: group.top,
              left: PAD,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: color.muted,
            }}
          >
            {group.label} <span style={{ fontWeight: 500, marginLeft: 6 }}>{group.times.length}</span>
          </div>
          {group.times.map((t, i) => {
            const on = t === booking.time ? chosen : 0;
            return (
              <div
                key={t}
                style={{
                  position: "absolute",
                  top: group.top + 34 + Math.floor(i / 4) * (SLOT.h + SLOT.gap),
                  left: PAD + (i % 4) * (SLOT.w + SLOT.gap),
                  width: SLOT.w,
                  height: SLOT.h,
                  borderRadius: 99,
                  border: `1.5px solid ${on > 0.5 ? color.sageDeep : color.line}`,
                  backgroundColor: on > 0.5 ? color.sageDeep : color.raised,
                  color: on > 0.5 ? "#fff" : color.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: 562,
          left: PAD,
          width: INNER,
          height: 64,
          borderRadius: 99,
          border: `1.5px solid ${color.line}`,
          backgroundColor: color.raised,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 19,
          opacity: held,
          translate: `0px ${(1 - held) * 10}px`,
        }}
      >
        <Timer size={22} strokeWidth={2.2} />
        <span style={{ flex: 1 }}>Seçtiğiniz saat sizin için tutuluyor</span>
        <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 700, fontSize: 21 }}>{timer}</span>
      </div>
    </>
  );
}

function DoneStep() {
  const frame = useCurrentFrame();
  // Onay halkası: önce çember, sonra tik çizilir.
  const ring = progress(frame, STEPS[3] + 6, 16);
  const tick = progress(frame, STEPS[3] + 16, 12);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: progress(frame, STEPS[3] + 4, 18) }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ position: "absolute", top: 150, left: (CARD.w - 140) / 2 }}>
        <circle cx={70} cy={70} r={62} fill={color.sageSoft} />
        <circle
          cx={70}
          cy={70}
          r={62}
          fill="none"
          stroke={color.sageDeep}
          strokeWidth={6}
          strokeDasharray={390}
          strokeDashoffset={390 * (1 - ring)}
          transform="rotate(-90 70 70)"
          strokeLinecap="round"
        />
        <path
          d="M44 72 L62 90 L98 52"
          fill="none"
          stroke={color.sageDeep}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={80}
          strokeDashoffset={80 * (1 - tick)}
        />
      </svg>
      <div style={{ position: "absolute", top: 324, left: 0, right: 0, textAlign: "center", fontSize: 33, fontWeight: 700 }}>
        Randevunuz oluşturuldu
      </div>
      <div
        style={{
          position: "absolute",
          top: 378,
          left: 60,
          right: 60,
          textAlign: "center",
          fontSize: 20,
          lineHeight: 1.4,
          color: color.muted,
        }}
      >
        Randevu bilgileriniz WhatsApp ile telefonunuza gönderildi.
      </div>
    </div>
  );
}

/** Adres alanı: alan adı harf harf yazılır, sayfa açılınca kilit ve yol belirir. */
function Address() {
  const frame = useCurrentFrame();
  const typed = clinic.domain.slice(0, Math.max(0, Math.min(clinic.domain.length, frame - TYPE_FROM)));
  const loaded = progress(frame, LOADED, 8);
  const caret = frame < LOADED && Math.floor(frame / 8) % 2 === 0;
  return (
    <>
      <Lock size={20} strokeWidth={2.4} color={color.muted} style={{ opacity: loaded }} />
      <span style={{ color: color.ink, fontWeight: 600, whiteSpace: "nowrap" }}>
        {typed}
        <span style={{ color: color.muted, fontWeight: 500, opacity: loaded }}>/randevu</span>
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: 26,
            marginLeft: 2,
            verticalAlign: "-5px",
            backgroundColor: caret ? color.ink : "transparent",
          }}
        />
      </span>
    </>
  );
}

export function BookingScene() {
  const frame = useCurrentFrame();
  const step = stepIndex(frame, [0, STEPS[1], STEPS[2], STEPS[3]]);
  const page = progress(frame, LOADED, 12);

  return (
    <SceneShell
      title={
        <>
          Hasta 7/24
          <br />
          online randevu alır.
        </>
      }
      subtitle="Kendi alan adınızda, WhatsApp doğrulamalı."
    >
      <WebsiteFrame width={WEB.w} height={WEB.h} style={{ left: WEB.x, top: WEB.y }} url={<Address />}>
        <div style={{ position: "absolute", inset: 0, opacity: page, translate: `0px ${(1 - page) * 12}px` }}>
          <Header />
          <Stepper current={[1, 2, 3, 6][step]} />
          <div
            style={{
              position: "absolute",
              left: CARD.x,
              top: CARD.y,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 26,
              backgroundColor: color.raised,
              border: `1.5px solid ${color.line}`,
              boxShadow: "0 10px 30px -18px rgba(46,53,50,0.25)",
              overflow: "hidden",
            }}
          >
            <Pane from={STEPS[0]} to={STEPS[1]}>
              <ServiceStep />
            </Pane>
            <Pane from={STEPS[1]} to={STEPS[2]}>
              <DoctorStep />
            </Pane>
            <Pane from={STEPS[2]} to={STEPS[3]}>
              <SlotStep />
            </Pane>
            {frame >= STEPS[3] ? <DoneStep /> : null}
          </div>
          <Summary />
        </div>
      </WebsiteFrame>

      {/* Hizmet ve hekimde dokunuş seçim dairesine: isim okunur kalsın. */}
      <Tap x={CX + PICKED_TILE.left + TILE.w - 34} y={CY + PICKED_TILE.top + TILE.h / 2} at={TAPS.service} />
      <Tap x={CX + PAD + INNER - 34} y={CY + ROW.top + ROW.h + ROW.gap + ROW.h / 2} at={TAPS.doctor} />
      <Tap x={CX + PAD + PICKED.col * (SLOT.w + SLOT.gap) + SLOT.w / 2} y={CY + PICKED.top + SLOT.h / 2} at={TAPS.slot} />
      <Sfx name="tap" at={TAPS.service} />
      <Sfx name="tap" at={TAPS.doctor} />
      <Sfx name="tap" at={TAPS.slot} />
      <Sfx name="chime" at={STEPS[3] + 16} volume={0.35} />

      <FloatingChip
        icon={<ShieldCheck size={26} strokeWidth={2.2} />}
        style={{
          left: 40,
          top: 1110,
          opacity: progress(frame, STEPS[3] + 20, 12),
          translate: `${interpolate(progress(frame, STEPS[3] + 20, 16), [0, 1], [-40, 0])}px 0px`,
        }}
      >
        KVKK açık rızası alındı
      </FloatingChip>
      <FloatingChip
        icon={<BadgeCheck size={26} strokeWidth={2.2} />}
        style={{
          right: 40,
          top: 1196,
          opacity: progress(frame, STEPS[3] + 28, 12),
          translate: `${interpolate(progress(frame, STEPS[3] + 28, 16), [0, 1], [40, 0])}px 0px`,
        }}
      >
        WhatsApp ile doğrulandı
      </FloatingChip>
    </SceneShell>
  );
}
