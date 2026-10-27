import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUpRight,
  BellRing,
  Bookmark,
  MessageCircle,
  NotebookPen,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  RotateCcw,
  Send,
  Voicemail,
} from "lucide-react";
import { AbsoluteFill } from "remotion";

import { Accent, Logo, SceneShell } from "../../components/scene";
import { PhoneFrame } from "../../components/devices";
import { Badge, Button, Card, Checkbox } from "../../components/ui";
import { clinic, patient, site } from "../../data";
import { color, sans, serif, shadow } from "../../theme";
import { SlideChrome } from "./SlideChrome";

/**
 * "Telefonla randevunun gizli maliyeti" Instagram carousel'i (1080×1350).
 * Slaytlar durağandır; `appear` kullanan başlıklar bitsin diye son karede
 * render edilir (bkz. `scripts/carousel.mjs`). Para yok, süreler örnek.
 */

/** Panelin üstündeki ikon yuvası. */
export function IconDot({
  children,
  tone = "sage",
  size = 64,
}: {
  children: ReactNode;
  tone?: "sage" | "danger" | "warning" | "raised";
  size?: number;
}) {
  const bg =
    tone === "danger" ? color.dangerSoft : tone === "warning" ? color.warningSoft : tone === "raised" ? color.raised : color.sageSoft;
  const fg = tone === "danger" ? color.danger : tone === "warning" ? color.warning : color.sageDeep;
  return (
    <span
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size * 0.32,
        backgroundColor: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </span>
  );
}

/** Kilit ekranı bildirimi gibi beyaz kart. */
export function Notice({
  icon,
  title,
  body,
  meta,
  style,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  meta: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        gap: 20,
        alignItems: "center",
        padding: "22px 26px",
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.96)",
        boxShadow: shadow.card,
        fontFamily: sans,
        color: color.ink,
        ...style,
      }}
    >
      {icon}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: 26, fontWeight: 700 }}>
          <span>{title}</span>
          <span style={{ fontSize: 22, fontWeight: 500, color: color.muted, whiteSpace: "nowrap" }}>{meta}</span>
        </div>
        <div style={{ marginTop: 4, fontSize: 28, lineHeight: 1.3, color: color.ink }}>{body}</div>
      </div>
    </div>
  );
}

function Footnote({ children, top }: { children: ReactNode; top: number }) {
  return (
    <div style={{ position: "absolute", left: 96, top, fontSize: 24, fontWeight: 500, color: color.muted }}>{children}</div>
  );
}

/* 1 — Kapak */
export function Slide1Cover() {
  return (
    <SceneShell panelTop={640}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 120 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.12em", color: color.sageDeep, marginBottom: 26 }}>
          KLİNİK YÖNETİMİ
        </div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.025em" }}>
          Telefonla randevunun
          <br />
          <Accent>gizli maliyeti.</Accent>
        </div>
        <div style={{ marginTop: 30, fontSize: 40, lineHeight: 1.3, fontWeight: 500, color: color.muted }}>
          Fatura gelmiyor; ama her gün ödüyorsunuz.
        </div>
      </div>

      <Notice
        icon={<IconDot tone="danger"><PhoneMissed size={34} strokeWidth={2.2} /></IconDot>}
        title="Cevapsız arama (3)"
        meta="şimdi"
        body="0532 418 xx xx ve 2 numara daha"
        style={{ left: 130, right: 110, top: 720, rotate: "-2deg" }}
      />
      <Notice
        icon={<IconDot><MessageCircle size={34} strokeWidth={2.2} /></IconDot>}
        title="Hasta mesajı"
        meta="2 dk önce"
        body="Randevum saat kaçtaydı?"
        style={{ left: 100, right: 140, top: 878, rotate: "1.5deg" }}
      />
      <Notice
        icon={<IconDot tone="warning"><PhoneIncoming size={34} strokeWidth={2.2} /></IconDot>}
        title="Gelen arama…"
        meta="hasta koltukta"
        body="Yarın 15.00'e alabilir miyiz?"
        style={{ left: 150, right: 96, top: 1036, rotate: "-1deg" }}
      />
      <SlideChrome index={1} />
    </SceneShell>
  );
}

/* 2 — Bir randevunun arkasındaki iş zinciri */
const CHAIN = [
  { Icon: Phone, text: "Arama: müsait saat aranır", time: "~3 dk" },
  { Icon: NotebookPen, text: "Deftere ya da Excel'e yazılır", time: "~1 dk" },
  { Icon: PhoneOutgoing, text: "Meşgulse geri aranır", time: "~2 dk" },
  { Icon: BellRing, text: "Bir gün önce hatırlatma araması", time: "~2 dk" },
] as const;

export function Slide2Chain() {
  return (
    <SceneShell
      title={
        <>
          Bir randevu,
          <br />
          tek arama değildir.
        </>
      }
      subtitle="Arkasında küçük işlerden bir zincir var."
      panelTop={460}
    >
      <div style={{ position: "absolute", left: 96, right: 96, top: 512 }}>
        <div style={{ position: "absolute", left: 40, top: 40, bottom: 40, width: 3, backgroundColor: color.line }} />
        {CHAIN.map(({ Icon, text, time }) => (
          <div key={text} style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, height: 106 }}>
            <span style={{ borderRadius: 26, backgroundColor: color.sageSoft, padding: 8 }}>
              <IconDot size={64} tone="raised">
                <Icon size={32} strokeWidth={2.2} />
              </IconDot>
            </span>
            <span style={{ flex: 1, fontSize: 34, fontWeight: 600 }}>{text}</span>
            <Badge tone="neutral" size={28}>{time}</Badge>
          </div>
        ))}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, height: 106 }}>
          <span style={{ borderRadius: 26, backgroundColor: color.sageSoft, padding: 8 }}>
            <IconDot size={64} tone="warning">
              <RotateCcw size={32} strokeWidth={2.2} />
            </IconDot>
          </span>
          <span style={{ flex: 1, fontSize: 34, fontWeight: 600 }}>Erteleme gelirse… hepsi baştan</span>
          <Badge tone="warning" size={28}>+ tekrar</Badge>
        </div>
      </div>

      <Card
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 1066,
          padding: "22px 32px",
          display: "flex",
          alignItems: "baseline",
          gap: 18,
          borderColor: color.sageDeep,
        }}
      >
        <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 60, letterSpacing: "-0.02em" }}>≈ 8 dk</span>
        <span style={{ fontSize: 32, fontWeight: 600, color: color.muted }}>tek bir randevu için</span>
      </Card>
      <Footnote top={1222}>Örnek süreler; kliniğe göre değişir.</Footnote>
      <SlideChrome index={2} />
    </SceneShell>
  );
}

/* 3 — Yanlış anda çalan telefon */
const DAY = [
  { time: "10:00", text: "Kanal tedavisi · Can Ö." },
  { time: "11:00", text: "Kompozit dolgu · Elif K." },
  { time: "12:00", text: "Muayene · Mert A." },
  { time: "13:30", text: "Diş taşı temizliği · Ayşe T." },
  { time: "14:00", text: `Kanal tedavisi · ${patient.firstName} A.` },
] as const;

function CallChip({ label, style }: { label: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 22px",
        borderRadius: 99,
        backgroundColor: color.raised,
        border: `2px solid ${color.danger}`,
        boxShadow: shadow.card,
        fontSize: 26,
        fontWeight: 700,
        color: color.danger,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <PhoneIncoming size={28} strokeWidth={2.4} />
      {label}
    </div>
  );
}

export function Slide3WrongMoment() {
  return (
    <SceneShell
      title={
        <>
          Ve hep en
          <br />
          <Accent>yanlış anda</Accent> çalar.
        </>
      }
      subtitle="Arama kısa sürer; böldüğü iş uzun."
      panelTop={460}
    >
      <Card style={{ position: "absolute", left: 96, right: 96, top: 520, padding: "18px 0", boxShadow: shadow.card }}>
        <div style={{ padding: "8px 32px 18px", fontSize: 26, fontWeight: 700, color: color.muted }}>
          Bugün · {clinic.name}
        </div>
        {DAY.map(({ time, text }) => (
          <div
            key={time}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              height: 108,
              padding: "0 32px",
              borderTop: `1.5px solid ${color.line}`,
            }}
          >
            <span style={{ width: 96, fontSize: 30, fontWeight: 700 }}>{time}</span>
            <span
              style={{
                flex: 1,
                height: 72,
                borderRadius: 16,
                backgroundColor: color.sageSoft,
                borderLeft: `6px solid ${color.sageDeep}`,
                display: "flex",
                alignItems: "center",
                padding: "0 20px",
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </Card>
      <CallChip label="Hasta koltukta" style={{ right: 70, top: 650, rotate: "3deg" }} />
      <CallChip label="Karşılama sırasında" style={{ right: 70, top: 866, rotate: "-2deg" }} />
      <CallChip label="Tedavi ortasında" style={{ right: 84, top: 1080, rotate: "2deg" }} />
      <SlideChrome index={3} />
    </SceneShell>
  );
}

/* 4 — Mesai sonrası */
export function Slide4AfterHours() {
  return (
    <SceneShell
      title={
        <>
          Mesai bitince
          <br />
          telefon da susar.
        </>
      }
      subtitle="Hasta randevuyu çoğu zaman akşam hatırlar."
      panelTop={460}
    >
      <PhoneFrame width={400} statusBar={false} screenColor="#2B332F" style={{ left: 96, top: 520 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #3E4B44 0%, #2B332F 60%)",
            color: "#fff",
            fontFamily: sans,
            textAlign: "center",
          }}
        >
          <div style={{ marginTop: 92, fontSize: 24, fontWeight: 600, opacity: 0.8 }}>Çarşamba 28 Ekim</div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>08:55</div>
        </div>
      </PhoneFrame>

      <Notice
        icon={<IconDot tone="danger"><PhoneMissed size={34} strokeWidth={2.2} /></IconDot>}
        title="Cevapsız arama"
        meta="dün 21:40"
        body="0532 418 xx xx"
        style={{ left: 330, right: 72, top: 760 }}
      />
      <Notice
        icon={<IconDot tone="danger"><PhoneMissed size={34} strokeWidth={2.2} /></IconDot>}
        title="Cevapsız arama"
        meta="dün 22:15"
        body="0544 207 xx xx"
        style={{ left: 330, right: 72, top: 904 }}
      />
      <Notice
        icon={<IconDot tone="warning"><Voicemail size={34} strokeWidth={2.2} /></IconDot>}
        title="Sesli mesaj"
        meta="dün 22:16"
        body="“Merhaba, yarın için randevu…”"
        style={{ left: 330, right: 72, top: 1048 }}
      />
      <SlideChrome index={4} />
    </SceneShell>
  );
}

/* 5 — Örnek hesap */
function CalcRow({ left, right, strong = false }: { left: string; right: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "22px 0",
        borderTop: `1.5px solid ${color.line}`,
      }}
    >
      <span style={{ fontSize: 34, fontWeight: 600, color: strong ? color.ink : color.muted }}>{left}</span>
      <span style={{ fontFamily: serif, fontWeight: 600, fontSize: strong ? 64 : 48, letterSpacing: "-0.02em" }}>{right}</span>
    </div>
  );
}

export function Slide5Math() {
  return (
    <SceneShell
      title={
        <>
          Peki haftada
          <br />
          ne kadar?
        </>
      }
      subtitle="Orta büyüklükte bir klinik için örnek hesap."
      panelTop={460}
    >
      <Card style={{ position: "absolute", left: 96, right: 96, top: 520, padding: "10px 40px 18px", boxShadow: shadow.card }}>
        <div style={{ borderTop: "none" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "22px 0" }}>
            <span style={{ fontSize: 34, fontWeight: 600, color: color.muted }}>Randevu araması / gün</span>
            <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 48 }}>25</span>
          </div>
        </div>
        <CalcRow left="Arama başına (not + geri arama)" right="× 4 dk" />
        <CalcRow left="Günde" right="100 dk" strong />
        <CalcRow left="Haftada (5 gün)" right="8 sa 20 dk" strong />
      </Card>

      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 1050,
          padding: "28px 34px",
          borderRadius: 26,
          backgroundColor: color.sageDeep,
          color: "#fff",
          fontSize: 36,
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        Neredeyse <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 42 }}>bir tam iş günü,</span>
        <br />
        yalnızca telefonda.
      </div>
      <Footnote top={1236}>Örnek varsayım. Kendi kliniğinizin rakamlarıyla hesaplayın.</Footnote>
      <SlideChrome index={5} />
    </SceneShell>
  );
}

/* 6 — Unutulan randevu */
function SlotRow({ time, children, dashed = false }: { time: string; children: ReactNode; dashed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
      <span style={{ width: 110, fontSize: 34, fontWeight: 700 }}>{time}</span>
      <div
        style={{
          flex: 1,
          height: dashed ? 200 : 118,
          borderRadius: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          backgroundColor: dashed ? "rgba(255,255,255,0.7)" : color.raised,
          border: dashed ? `3px dashed ${color.line}` : `1.5px solid ${color.line}`,
          boxShadow: dashed ? "none" : shadow.soft,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Slide6NoShow() {
  return (
    <SceneShell
      title={
        <>
          En pahalı boşluk:
          <br />
          <Accent>unutulan randevu.</Accent>
        </>
      }
      subtitle="Boş kalan koltuk saati geri gelmez."
      panelTop={460}
    >
      <div style={{ position: "absolute", left: 96, right: 96, top: 530, display: "flex", flexDirection: "column", gap: 26 }}>
        <SlotRow time="15:30">
          <span style={{ fontSize: 30, fontWeight: 600 }}>Kompozit dolgu · Elif K.</span>
          <Badge tone="solid" size={24}>Geldi</Badge>
        </SlotRow>
        <SlotRow time="16:30" dashed>
          <div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>Boş koltuk</div>
            <div style={{ fontSize: 28, color: color.muted, marginTop: 6 }}>60 dk · Kanal tedavisi</div>
          </div>
          <Badge tone="danger" size={32} style={{ rotate: "-4deg" }}>Gelmedi</Badge>
        </SlotRow>
        <SlotRow time="17:30">
          <span style={{ fontSize: 30, fontWeight: 600 }}>Muayene · Mert A.</span>
          <Badge tone="sage" size={24}>Planlandı</Badge>
        </SlotRow>
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 1094,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "22px 28px",
          borderRadius: 24,
          backgroundColor: color.raised,
          boxShadow: shadow.card,
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        <IconDot tone="warning" size={56}>
          <PhoneOff size={28} strokeWidth={2.2} />
        </IconDot>
        Hatırlatma araması yapılamadı; gün çok yoğundu.
      </div>
      <SlideChrome index={6} />
    </SceneShell>
  );
}

/* 8 — Çözüm özeti */
const RELIEF = [
  { title: "7/24 online randevu", sub: "Hasta saati kendisi seçer; telefon gerekmez." },
  { title: "WhatsApp hatırlatma", sub: "24 ve 2 saat önce kendiliğinden gider." },
  { title: "Ertelemede otomatik bildirim", sub: "Saat değişince hasta WhatsApp'tan öğrenir." },
  { title: "Tek, canlı takvim", sub: "Resepsiyon ve hekim aynı takvimi anında görür." },
] as const;

export function Slide8Relief() {
  return (
    <SceneShell
      title={
        <>
          Telefon yine çalacak.
          <br />
          <Accent>Ama daha az.</Accent>
        </>
      }
      subtitle="Tekrar eden işler kendiliğinden yürür."
      panelTop={460}
    >
      <Card style={{ position: "absolute", left: 96, right: 96, top: 520, padding: "8px 36px", boxShadow: shadow.card }}>
        {RELIEF.map(({ title, sub }, i) => (
          <div
            key={title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "28px 0",
              borderTop: i === 0 ? "none" : `1.5px solid ${color.line}`,
            }}
          >
            <Checkbox checked={1} size={48} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>{title}</div>
              <div style={{ marginTop: 6, fontSize: 27, lineHeight: 1.3, color: color.muted }}>{sub}</div>
            </div>
          </div>
        ))}
      </Card>
      <SlideChrome index={8} />
    </SceneShell>
  );
}

/* 9 — Kapanış */
export function Slide9Cta() {
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface, fontFamily: sans, color: color.ink, alignItems: "center" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 620,
          top: 700 - 620,
          width: 1240,
          height: 1240,
          borderRadius: 999,
          background: `radial-gradient(circle, ${color.sageSoft} 0%, ${color.sageSoft} 42%, rgba(234,240,231,0) 70%)`,
        }}
      />
      <div style={{ position: "absolute", top: 230 }}>
        <Logo size={96} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 410,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 88,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
        }}
      >
        Kaydedin,
        <br />
        <Accent>ekibinizle paylaşın.</Accent>
      </div>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 110,
          right: 110,
          textAlign: "center",
          fontSize: 38,
          lineHeight: 1.35,
          fontWeight: 500,
          color: color.muted,
        }}
      >
        Kurulumu biz yapıyoruz;
        <br />
        siz hastalarınıza odaklanın.
      </div>
      <div style={{ position: "absolute", top: 800, display: "flex", gap: 22 }}>
        <Badge tone="neutral" size={30} icon={<Bookmark size={30} strokeWidth={2.2} />}>
          Kaydet
        </Badge>
        <Badge tone="neutral" size={30} icon={<Send size={30} strokeWidth={2.2} />}>
          Paylaş
        </Badge>
      </div>
      <div style={{ position: "absolute", top: 930 }}>
        <Button size={36} style={{ padding: "26px 46px", borderRadius: 22 }}>
          Demo için profildeki bağlantı
          <ArrowUpRight size={36} strokeWidth={2.4} />
        </Button>
      </div>
      <div style={{ position: "absolute", top: 1076, fontSize: 32, fontWeight: 600, color: color.sageDeep }}>{site.domain}</div>
      <SlideChrome index={9} />
    </AbsoluteFill>
  );
}
