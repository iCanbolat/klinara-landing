import type { ReactNode } from "react";
import { CheckCheck, ChevronLeft, CircleCheck, Clock, ExternalLink, Reply } from "lucide-react";
import { Img, staticFile, useCurrentFrame } from "remotion";

import { progress } from "../anim";
import { PhoneFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Badge, Sfx, Tap } from "../components/ui";
import { booking, clinic, patient } from "../data";
import { color, sans, shadow } from "../theme";

const PHONE = { x: 440, y: 440, w: 560 };
const SX = PHONE.x + PHONE.w * 0.024;
const SY = PHONE.y + PHONE.w * 0.024;

const T = { reminder: 14, tap: 78, reply: 88, confirmed: 106, badge: 114 } as const;

/** Sohbet balonu: sol (klinik) ya da sağ (hasta), belirirken hafifçe büyür. */
function Bubble({
  at,
  side,
  top,
  width,
  children,
}: {
  at: number;
  side: "in" | "out";
  top: number;
  width?: number;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 12);
  return (
    <div
      style={{
        position: "absolute",
        top,
        ...(side === "in" ? { left: 18 } : { right: 18 }),
        width,
        maxWidth: 440,
        padding: "14px 18px 10px",
        borderRadius: 22,
        borderTopLeftRadius: side === "in" ? 6 : 22,
        borderTopRightRadius: side === "out" ? 6 : 22,
        backgroundColor: side === "in" ? color.raised : "#DCE8D3",
        boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
        fontSize: 21,
        lineHeight: 1.42,
        opacity: p,
        scale: `${0.92 + p * 0.08}`,
        transformOrigin: side === "in" ? "top left" : "top right",
      }}
    >
      {children}
    </div>
  );
}

function Time({ value, read }: { value: string; read?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, fontSize: 15, color: color.muted, marginTop: 2 }}>
      {value}
      {read ? <CheckCheck size={18} color={color.sageDeep} strokeWidth={2.4} /> : null}
    </div>
  );
}

export function WhatsAppScene() {
  const frame = useCurrentFrame();
  const reminder = progress(frame, T.reminder, 12);
  const confirmed = progress(frame, T.badge, 10);

  return (
    <SceneShell
      title={
        <>
          Hatırlatmayı
          <br />
          WhatsApp üstlenir.
        </>
      }
      subtitle="24 ve 2 saat önce; yanıt takvime işlenir."
    >
      <PhoneFrame width={PHONE.w} style={{ left: PHONE.x, top: PHONE.y }} screenColor={color.chat}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 160,
              backgroundColor: color.surface,
              borderBottom: `1.5px solid ${color.line}`,
            }}
          >
            <div style={{ position: "absolute", top: 86, left: 16, right: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <ChevronLeft size={36} strokeWidth={2.2} color={color.sageDeep} />
              <span
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 99,
                  backgroundColor: color.raised,
                  border: `1.5px solid ${color.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Img src={staticFile("brand/mark-light.png")} style={{ width: 34, height: 34 }} />
              </span>
              <span>
                <span style={{ display: "block", fontSize: 23, fontWeight: 700 }}>{clinic.name}</span>
                <span style={{ display: "block", fontSize: 16, color: color.muted }}>İşletme hesabı</span>
              </span>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 182,
              left: "50%",
              translate: "-50% 0px",
              padding: "6px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.8)",
              fontSize: 16,
              color: color.muted,
            }}
          >
            Bugün
          </div>

          <Bubble at={T.reminder} side="in" top={230} width={440}>
            Merhaba {patient.firstName}, {booking.dateLong} {booking.time} tarihindeki {booking.service} randevunuzu
            hatırlatırız. Sizi {clinic.branch} şubemizde bekliyoruz.
            <div style={{ marginTop: 8 }}>Katılımınızı aşağıdaki butonlarla bildirebilirsiniz.</div>
            <Time value="13:00" />
          </Bubble>

          {[
            { label: "Onaylıyorum", Icon: Reply },
            { label: "İptal etmek istiyorum", Icon: Reply },
            { label: "Haritada aç", Icon: ExternalLink },
          ].map(({ label, Icon }, i) => (
            <div
              key={label}
              style={{
                position: "absolute",
                top: 476 + i * 62,
                left: 18,
                width: 440,
                height: 56,
                borderRadius: 16,
                backgroundColor: color.raised,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontSize: 21,
                fontWeight: 600,
                color: color.sageDeep,
                opacity: reminder,
                scale: i === 0 && frame >= T.tap - 2 && frame < T.tap + 6 ? "0.97" : "1",
              }}
            >
              <Icon size={22} strokeWidth={2.2} />
              {label}
            </div>
          ))}

          <Bubble at={T.reply} side="out" top={680}>
            Onaylıyorum
            <Time value="13:02" read />
          </Bubble>
          <Bubble at={T.confirmed} side="in" top={764}>
            Randevunuz onaylandı. Görüşmek üzere!
            <Time value="13:02" />
          </Bubble>
        </div>
      </PhoneFrame>

      <Tap x={SX + 18 + 220} y={SY + 476 + 28} at={T.tap} />
      <Sfx name="tap" at={T.tap} />
      <Sfx name="chime" at={T.badge} volume={0.3} />

      <div
        style={{
          position: "absolute",
          left: 40,
          top: 1000,
          width: 400,
          padding: "22px 24px",
          borderRadius: 24,
          backgroundColor: color.raised,
          boxShadow: shadow.card,
          fontFamily: sans,
          opacity: progress(frame, 40, 14),
          translate: `0px ${(1 - progress(frame, 40, 18)) * 30}px`,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "0.08em", color: color.muted }}>TAKVİM · 28 EKİM</div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>{patient.name}</div>
        <div style={{ fontSize: 20, color: color.muted, marginTop: 2 }}>
          {booking.time} · {booking.service}
        </div>
        <div style={{ position: "relative", height: 40, marginTop: 14 }}>
          <Badge
            tone="muted"
            size={19}
            icon={<Clock size={18} strokeWidth={2.4} />}
            style={{ position: "absolute", opacity: 1 - confirmed }}
          >
            Müşteri onayı bekleniyor
          </Badge>
          <Badge
            tone="solid"
            size={19}
            icon={<CircleCheck size={18} strokeWidth={2.4} color={color.sageDeep} />}
            style={{ position: "absolute", opacity: confirmed, scale: `${0.9 + confirmed * 0.1}` }}
          >
            Müşteri onayladı
          </Badge>
        </div>
      </div>
    </SceneShell>
  );
}
