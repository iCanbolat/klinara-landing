import type { CSSProperties, ReactNode } from "react";
import {
  Building2,
  CalendarCheck,
  FileSpreadsheet,
  LayoutTemplate,
  MessageCircle,
  PhoneMissed,
  UserRound,
  UsersRound,
} from "lucide-react";

import { AndroidFrame, PhoneFrame } from "../../components/devices";
import { Accent, SceneShell } from "../../components/scene";
import { Badge, Button, Card, Checkbox } from "../../components/ui";
import { clinic, doctor, patient } from "../../data";
import { color, sans, serif, shadow } from "../../theme";
import { IconDot } from "../telefon-maliyeti/slides";
import { SlideChrome } from "../telefon-maliyeti/SlideChrome";
import { PatientHeader, PlanHeader, PlatformTag, RemindButton, STAGE_REMINDER, StageRow } from "./plan";

/**
 * "Hasta neden ikinci seansa gelmiyor?" Instagram carousel'i (1080×1350).
 * 1–4 sorun (hasta ve sekreter), 5–7 çözüm (iOS, Android, otomatik tarih +
 * hatırlatma), 8 video. Aşama hatırlatması personel tetikler; otomatik değil.
 */
export const TOTAL = 8;

function Chrome({ index, swipeHint }: { index: number; swipeHint?: boolean }) {
  return <SlideChrome index={index} total={TOTAL} swipeHint={swipeHint} />;
}

/** Cihazın yanında duran açıklama kartı. */
function Callout({ icon, children, style }: { icon: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 24px",
        borderRadius: 24,
        backgroundColor: color.raised,
        boxShadow: shadow.card,
        fontSize: 28,
        lineHeight: 1.3,
        fontWeight: 600,
        ...style,
      }}
    >
      <IconDot size={56}>{icon}</IconDot>
      <span>{children}</span>
    </div>
  );
}

/* 1 — Kapak */
const COVER_ROWS = [
  { label: "1. seans", badge: <Badge tone="solid" size={26}>Geldi</Badge>, done: true },
  { label: "2. seans", badge: <Badge tone="danger" size={26}>Gelmedi</Badge> },
  { label: "Kalıcı dolgu", badge: <Badge tone="muted" size={26}>Belirsiz</Badge> },
  { label: "6. ay kontrolü", badge: <Badge tone="muted" size={26}>Belirsiz</Badge> },
];

export function Tedavi1Cover() {
  return (
    <SceneShell panelTop={640}>
      <div style={{ position: "absolute", left: 80, right: 80, top: 120 }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.12em", color: color.sageDeep, marginBottom: 26 }}>
          TEDAVİ TAKİBİ
        </div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 104, lineHeight: 1.02, letterSpacing: "-0.025em" }}>
          Hasta neden
          <br />
          <Accent>ikinci seansa</Accent>
          <br />
          gelmiyor?
        </div>
      </div>

      <Card style={{ position: "absolute", left: 130, right: 130, top: 710, padding: "18px 34px", boxShadow: shadow.card }}>
        {COVER_ROWS.map(({ label, badge, done }, i) => (
          <div key={label} style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, height: 116 }}>
            <span
              style={{
                position: "relative",
                zIndex: 1,
                width: 56,
                height: 56,
                borderRadius: 99,
                backgroundColor: done ? color.sage : i === 1 ? color.dangerSoft : color.fill,
                color: done ? "#fff" : i === 1 ? color.danger : color.muted,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {done ? "✓" : i + 1}
            </span>
            {i < COVER_ROWS.length - 1 ? (
              <span
                style={{
                  position: "absolute",
                  left: 27,
                  top: 88,
                  height: 56,
                  width: 0,
                  borderLeft: i === 0 ? `3px solid ${color.sage}` : `3px dashed ${i === 1 ? color.danger : color.line}`,
                }}
              />
            ) : null}
            <span style={{ flex: 1, fontSize: 36, fontWeight: 700, color: i > 1 ? color.muted : color.ink }}>{label}</span>
            {badge}
          </div>
        ))}
      </Card>
      <Chrome index={1} />
    </SceneShell>
  );
}

/* 2 — Hastanın gözünden */
const THOUGHTS = [
  { text: "Ağrım geçti, acelesi yok herhalde.", left: 230, right: 96 },
  { text: "2. seans ne zamandı? Unuttum.", left: 150, right: 230 },
  { text: "Akşam aradım, mesai bitmişti.", left: 230, right: 150 },
  { text: "Sonraki aşama neden gerekli, bilmiyordum.", left: 150, right: 96 },
];

export function Tedavi2Patient() {
  return (
    <SceneShell
      title={
        <>
          Hastanın gözünden:
          <br />
          <Accent>“Ağrım geçti.”</Accent>
        </>
      }
      subtitle="Ağrı geçince tedavi bitti sanılıyor."
      panelTop={460}
    >
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 520,
          width: 104,
          height: 104,
          borderRadius: 99,
          backgroundColor: color.raised,
          boxShadow: shadow.soft,
          color: color.sageDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UserRound size={52} strokeWidth={2} />
      </div>
      {THOUGHTS.map(({ text, left, right }, i) => (
        <div
          key={text}
          style={{
            position: "absolute",
            left,
            right,
            top: 540 + i * 136,
            padding: "24px 30px",
            borderRadius: 30,
            borderTopLeftRadius: i === 0 ? 8 : 30,
            backgroundColor: color.raised,
            boxShadow: shadow.card,
            fontSize: 32,
            fontWeight: 600,
            rotate: `${i % 2 === 0 ? -1 : 1}deg`,
          }}
        >
          {text}
        </div>
      ))}
      <div style={{ position: "absolute", left: 96, right: 96, top: 1110, fontFamily: serif, fontStyle: "italic", fontSize: 40, color: color.accent }}>
        Hasta isteksiz değil; hatırlatılmıyor.
      </div>
      <Chrome index={2} />
    </SceneShell>
  );
}

/* 3 — Sekreterin gözünden */
function Scrap({ box, rotate, children, style }: { box: { x: number; y: number; w: number; h: number }; rotate: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        rotate: `${rotate}deg`,
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Tedavi3Secretary() {
  return (
    <SceneShell
      title={
        <>
          Sekreterin gözünden:
          <br />
          <Accent>kim hangi seansta?</Accent>
        </>
      }
      subtitle="Takip hafızaya, deftere ve Excel'e kalıyor."
      panelTop={460}
    >
      <Scrap
        box={{ x: 84, y: 510, w: 560, h: 370 }}
        rotate={-3}
        style={{
          borderRadius: 18,
          backgroundColor: "#FFFDF6",
          backgroundImage: "repeating-linear-gradient(transparent 0 53px, #E7E0D2 53px 55px)",
          padding: "36px 24px 0 52px",
          borderLeft: "3px solid #E5B9B0",
        }}
      >
        <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 29, lineHeight: "55px", color: "#3B4A63", whiteSpace: "nowrap" }}>
          <div>Şule A. — kanal 2. seans ??</div>
          <div>Can Ö. — implant kontrol (3 ay?)</div>
          <div style={{ textDecoration: "line-through", opacity: 0.6 }}>Elif K. — dolgu</div>
          <div>Mert A. — aranacak!!</div>
          <div style={{ opacity: 0.7 }}>Ayşe T. — 6. ay ne zaman?</div>
        </div>
      </Scrap>

      <Scrap
        box={{ x: 670, y: 530, w: 330, h: 290 }}
        rotate={4}
        style={{ backgroundColor: "#F5E7B9", padding: "34px 30px", borderRadius: 6 }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: "#6B5527" }}>Bu hafta aranacaklar</div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 92, lineHeight: 1.1, color: "#4A3A18", marginTop: 14 }}>14</div>
        <div style={{ fontSize: 28, fontWeight: 600, color: "#6B5527" }}>kişi</div>
      </Scrap>

      <Scrap box={{ x: 590, y: 880, w: 410, h: 230 }} rotate={2} style={{ borderRadius: 18, backgroundColor: color.raised, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 23, fontWeight: 600 }}>
          <FileSpreadsheet size={30} color="#3F7D4F" strokeWidth={2} />
          kontrol_tarihleri.xlsx
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {["Hasta", "Aşama", "Tarih", "Şule A.", "2. seans", "#YOK", "Can Ö.", "kontrol", "?"].map((cell, i) => (
            <div
              key={i}
              style={{
                height: 38,
                borderRadius: 4,
                backgroundColor: i < 3 ? color.fill : "#F6F3EE",
                fontSize: 18,
                fontWeight: 600,
                color: cell === "#YOK" || cell === "?" ? color.danger : color.muted,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      </Scrap>

      <Scrap
        box={{ x: 100, y: 940, w: 450, h: 92 }}
        rotate={-1.5}
        style={{
          borderRadius: 99,
          backgroundColor: color.raised,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 30px",
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <PhoneMissed size={32} color={color.danger} strokeWidth={2.2} />
        Ulaşılamadı (3. deneme)
      </Scrap>
      <Chrome index={3} />
    </SceneShell>
  );
}

/* 4 — İki taraf için kayıp */
function LossCard({ icon, title, items, left }: { icon: ReactNode; title: string; items: string[]; left: number }) {
  return (
    <Card style={{ position: "absolute", left, top: 520, width: 432, padding: "28px 30px", boxShadow: shadow.card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <IconDot tone="danger" size={56}>
          {icon}
        </IconDot>
        <span style={{ fontSize: 36, fontWeight: 700 }}>{title}</span>
      </div>
      {items.map((item) => (
        <div key={item} style={{ marginTop: 22, paddingTop: 22, borderTop: `1.5px solid ${color.line}`, fontSize: 29, lineHeight: 1.3, fontWeight: 500 }}>
          {item}
        </div>
      ))}
    </Card>
  );
}

export function Tedavi4Loss() {
  return (
    <SceneShell
      title={
        <>
          Yarım kalan tedavi,
          <br />
          <Accent>iki taraf için kayıp.</Accent>
        </>
      }
      subtitle="Ve çoğu zaman kimse fark etmez."
      panelTop={460}
    >
      <LossCard
        icon={<UserRound size={30} strokeWidth={2.2} />}
        title="Hasta"
        items={["Ağrı geri dönebilir", "Diş risk altında kalır", "Tedavi uzar"]}
        left={96}
      />
      <LossCard
        icon={<Building2 size={30} strokeWidth={2.2} />}
        title="Klinik"
        items={["Boş kalan koltuk saati", "Plan baştan kurulur", "Takip için saatler gider"]}
        left={552}
      />
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 930,
          padding: "28px 34px",
          borderRadius: 26,
          backgroundColor: color.sageDeep,
          color: "#fff",
          fontSize: 34,
          lineHeight: 1.3,
          fontWeight: 600,
        }}
      >
        Sorun hasta değil;
        <br />
        takibin <span style={{ fontFamily: serif, fontStyle: "italic", fontSize: 40 }}>kimseye ait olmaması.</span>
      </div>
      <Chrome index={4} />
    </SceneShell>
  );
}

/* 5 — iOS: planı aç */
export function Tedavi5Ios() {
  return (
    <SceneShell
      title={
        <>
          Randevuda
          <br />
          <Accent>planı açın.</Accent>
        </>
      }
      subtitle="Şablondan tek dokunuş; 4 aşama hazır."
      panelTop={460}
    >
      <PhoneFrame width={470} style={{ left: 96, top: 500 }}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <PatientHeader top={74} platform="ios" />
          <div
            style={{
              position: "absolute",
              top: 214,
              left: 22,
              right: 22,
              display: "flex",
              gap: 4,
              padding: 4,
              borderRadius: 14,
              backgroundColor: color.fill,
            }}
          >
            {["Geçmiş", "Tedavi planı", "Onam"].map((tab) => (
              <span
                key={tab}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: 11,
                  fontSize: 18,
                  fontWeight: 600,
                  backgroundColor: tab === "Tedavi planı" ? color.raised : "transparent",
                  color: tab === "Tedavi planı" ? color.ink : color.muted,
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: 280,
              left: 16,
              right: 16,
              padding: "20px 14px 10px",
              borderRadius: 24,
              backgroundColor: color.raised,
              border: `1.5px solid ${color.line}`,
            }}
          >
            <div style={{ padding: "0 6px 12px" }}>
              <PlanHeader done={0} />
            </div>
            <StageRow index={0} state="scheduled" sub="28 Eki · 14:00" />
            <StageRow index={1} state="waiting" sub="1 hafta sonra" />
            <StageRow index={2} state="waiting" sub="1 hafta sonra" />
            <StageRow index={3} state="waiting" sub="6 ay sonra" last />
          </div>
        </div>
      </PhoneFrame>

      <PlatformTag platform="ios" style={{ left: 612, top: 530 }} />
      <Callout icon={<LayoutTemplate size={28} strokeWidth={2.2} />} style={{ left: 612, right: 72, top: 640 }}>
        “Kanal tedavisi” şablonu: aşamalar ve aralıklar hazır
      </Callout>
      <Callout icon={<CalendarCheck size={28} strokeWidth={2.2} />} style={{ left: 612, right: 72, top: 840 }}>
        İlk seans bugünkü randevuya bağlanır
      </Callout>
      <Callout icon={<UsersRound size={28} strokeWidth={2.2} />} style={{ left: 612, right: 72, top: 1010 }}>
        Hekim ve sekreter aynı planı görür
      </Callout>
      <Chrome index={5} />
    </SceneShell>
  );
}

/* 6 — Android: toplu planla */
const BATCH = [
  { stage: "2. seans", when: "Çar 4 Kas · 14:00" },
  { stage: "Kalıcı dolgu", when: "Çar 11 Kas · 14:00" },
  { stage: "6. ay kontrolü", when: "Sal 27 Nis · 10:00" },
];

export function Tedavi6Android() {
  return (
    <SceneShell
      title={
        <>
          Kalan seansları
          <br />
          <Accent>tek seferde planlayın.</Accent>
        </>
      }
      subtitle="Hasta tarihleri WhatsApp'tan öğrenir."
      panelTop={460}
    >
      <AndroidFrame width={470} style={{ left: 514, top: 500 }}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <div style={{ position: "absolute", top: 76, left: 26, right: 26 }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>← Toplu planla</div>
            <div style={{ marginTop: 6, fontSize: 18, color: color.muted }}>
              Kanal tedavisi · {patient.name}
            </div>
          </div>
          <div style={{ position: "absolute", top: 180, left: 18, right: 18, display: "flex", flexDirection: "column", gap: 12 }}>
            {BATCH.map(({ stage, when }) => (
              <div
                key={stage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 18px",
                  borderRadius: 20,
                  backgroundColor: color.raised,
                  border: `1.5px solid ${color.line}`,
                }}
              >
                <Checkbox checked={1} size={34} />
                <div>
                  <div style={{ fontSize: 23, fontWeight: 700 }}>{stage}</div>
                  <div style={{ marginTop: 4, fontSize: 18, color: color.muted }}>
                    {when} · {doctor.name.replace("Zeynep ", "")}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                borderRadius: 20,
                backgroundColor: color.sageSoft,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 700 }}>
                <MessageCircle size={22} strokeWidth={2.2} color={color.sageDeep} />
                Müşteriye bildir
              </span>
              <span style={{ position: "relative", width: 58, height: 32, borderRadius: 99, backgroundColor: color.sageDeep }}>
                <span style={{ position: "absolute", right: 4, top: 4, width: 24, height: 24, borderRadius: 99, backgroundColor: "#fff" }} />
              </span>
            </div>
            <Button size={22} style={{ marginTop: 6, width: "100%", boxSizing: "border-box" }}>
              3 randevu oluştur
            </Button>
          </div>
        </div>
      </AndroidFrame>

      <PlatformTag platform="android" style={{ left: 96, top: 530 }} />
      <Callout icon={<CalendarCheck size={28} strokeWidth={2.2} />} style={{ left: 96, width: 380, top: 640 }}>
        Her aşamaya tarih ve hekim seçin
      </Callout>
      <Callout icon={<LayoutTemplate size={28} strokeWidth={2.2} />} style={{ left: 96, width: 380, top: 820 }}>
        3 randevu, tek dokunuş
      </Callout>
      <Callout icon={<MessageCircle size={28} strokeWidth={2.2} />} style={{ left: 96, width: 380, top: 1000 }}>
        Hastaya WhatsApp ile bildirilir
      </Callout>
      {/* Kaydırma ipucu Android çerçevesinin kenarına biniyor. */}
      <Chrome index={6} swipeHint={false} />
    </SceneShell>
  );
}

/* 7 — Sıradaki tarih + tek dokunuş hatırlatma */
export function Tedavi7Next() {
  return (
    <SceneShell
      title={
        <>
          Tarih açıkta
          <br />
          <Accent>kalmaz.</Accent>
        </>
      }
      subtitle="Sıradaki tarih kendiliğinden hesaplanır."
      panelTop={460}
    >
      <Card style={{ position: "absolute", left: 96, right: 96, top: 510, padding: "24px 20px 12px", boxShadow: shadow.card }}>
        <div style={{ padding: "0 14px 14px" }}>
          <PlanHeader done={2} />
        </div>
        <StageRow index={0} state="completed" sub="28 Eki" />
        <StageRow index={1} state="completed" sub="4 Kas" />
        <StageRow index={2} state="unscheduled" sub="Önerilen: 11 Kas · otomatik hesaplandı" last>
          <RemindButton />
        </StageRow>
      </Card>

      <div
        style={{
          position: "absolute",
          left: 200,
          right: 72,
          top: 960,
          padding: "18px 20px 20px",
          borderRadius: 28,
          backgroundColor: color.chat,
          boxShadow: shadow.card,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 700, color: color.muted, padding: "0 6px 12px" }}>
          <MessageCircle size={22} strokeWidth={2.2} color={color.sageDeep} />
          WhatsApp · {clinic.name}
        </div>
        <div style={{ padding: "16px 20px", borderRadius: 18, backgroundColor: color.raised, fontSize: 22, lineHeight: 1.4 }}>
          {STAGE_REMINDER}
        </div>
      </div>
      <Chrome index={7} />
    </SceneShell>
  );
}
