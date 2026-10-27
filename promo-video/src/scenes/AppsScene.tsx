import type { ReactNode } from "react";
import { CalendarDays, CircleCheck, Hospital, Monitor, Smartphone, TabletSmartphone, UserRoundX } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { appear } from "../anim";
import { BrowserFrame, PhoneFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Badge } from "../components/ui";
import { booking, clinic, doctor, patient } from "../data";
import { color, sans, serif } from "../theme";

/** 0'dan hedefe sayan değer; Türkçe ondalık virgülle. */
function useCount(target: number, start: number, decimals = 0) {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [start, start + 30], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return value.toFixed(decimals).replace(".", ",");
}

function Kpi({
  label,
  icon,
  value,
  sub,
  width,
  scale = 1,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  sub: string;
  width: number;
  scale?: number;
}) {
  return (
    <div
      style={{
        width,
        borderRadius: 18 * scale,
        backgroundColor: color.raised,
        border: `1.5px solid ${color.line}`,
        padding: `${16 * scale}px ${16 * scale}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12.5 * scale,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: color.muted,
        }}
      >
        {label}
        {icon}
      </div>
      <div style={{ fontFamily: serif, fontSize: 34 * scale, fontWeight: 600, marginTop: 8 * scale }}>{value}</div>
      <div style={{ fontSize: 14 * scale, color: color.muted, marginTop: 4 * scale }}>{sub}</div>
    </div>
  );
}

export function AppsScene() {
  const frame = useCurrentFrame();
  const today = useCount(12, 8);
  const occupancy = useCount(72, 10);
  const completed = useCount(186, 12);
  const noShow = useCount(3.8, 14, 1);
  const iconProps = { size: 18, strokeWidth: 2.2, color: color.sageDeep };

  return (
    <SceneShell
      title={
        <>
          Klinik gününüz
          <br />
          cebinizde.
        </>
      }
      subtitle="Web, iOS ve Android'de."
    >
      <BrowserFrame
        width={860}
        height={700}
        style={{ left: 40, top: 470, opacity: 0.95 }}
        active="dashboard"
        breadcrumb="Genel bakış"
        path="dashboard"
      >
        <div style={{ position: "absolute", top: 22, left: 28, fontFamily: serif, fontSize: 30, fontWeight: 600 }}>
          Merhaba, {doctor.name}
        </div>
        <div style={{ position: "absolute", top: 66, left: 28, fontSize: 16, color: color.muted }}>
          {booking.dateLong} · Kliniğinizin bugünkü durumu
        </div>
        <div style={{ position: "absolute", top: 108, left: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Kpi label="BUGÜNKÜ RANDEVU" icon={<CalendarDays {...iconProps} />} value={today} sub="9 aktif · 3 tamamlandı" width={268} />
          <Kpi label="BU AY DOLULUK" icon={<Hospital {...iconProps} />} value={`%${occupancy}`} sub="Geçen aya göre +8" width={268} />
        </div>
      </BrowserFrame>

      <PhoneFrame width={480} style={{ left: 560, top: 440 }}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <div style={{ position: "absolute", top: 76, left: 24, right: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 30 }}>Dashboard</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 99,
                backgroundColor: color.raised,
                boxShadow: "0 4px 14px -6px rgba(46,53,50,0.3)",
                fontSize: 16,
                color: color.sageDeep,
              }}
            >
              <Hospital size={17} strokeWidth={2} /> {clinic.branch}
            </span>
          </div>
          <div style={{ position: "absolute", top: 134, left: 24, right: 24, fontFamily: serif, fontSize: 34, fontWeight: 600, lineHeight: 1.15 }}>
            Merhaba, {doctor.name}
          </div>
          <div style={{ position: "absolute", top: 222, left: 24, fontSize: 18, color: color.muted }}>{booking.dateLong}</div>

          <div style={{ position: "absolute", top: 264, left: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Kpi label="BUGÜNKÜ RANDEVU" icon={<CalendarDays {...iconProps} />} value={today} sub="9 aktif · 3 tamamlandı" width={204} />
            <Kpi label="BU AY DOLULUK" icon={<Hospital {...iconProps} />} value={`%${occupancy}`} sub="Geçen aya göre +8" width={204} />
            <Kpi label="TAMAMLANAN" icon={<CircleCheck {...iconProps} />} value={completed} sub="Bu ay" width={204} />
            <Kpi label="GELMEME" icon={<UserRoundX {...iconProps} />} value={`%${noShow}`} sub="Geçen aya göre −2,1" width={204} />
          </div>

          <div
            style={{
              position: "absolute",
              top: 578,
              left: 24,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: color.muted,
            }}
          >
            SIRADAKİ RANDEVULAR
          </div>
          <div
            style={{
              position: "absolute",
              top: 604,
              left: 18,
              right: 18,
              borderRadius: 18,
              backgroundColor: color.raised,
              border: `1.5px solid ${color.line}`,
              padding: "4px 18px",
            }}
          >
            {[
              { time: booking.time, name: patient.name, service: booking.service, badge: "Onaylandı" },
              { time: "15:00", name: "Burak Şahin", service: "Ortodonti Kontrolü", badge: "Planlandı" },
            ].map((r, i) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 0",
                  borderTop: i === 0 ? "none" : `1.5px solid ${color.fill}`,
                  ...appear(frame, 30 + i * 6, 14),
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 600, width: 52 }}>{r.time}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 18, fontWeight: 600 }}>{r.name}</span>
                  <span style={{ display: "block", fontSize: 15, color: color.muted }}>{r.service}</span>
                </span>
                <Badge tone={r.badge === "Onaylandı" ? "sage" : "neutral"} size={13}>
                  {r.badge}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <div style={{ position: "absolute", left: 64, top: 1196, display: "flex", gap: 14 }}>
        {[
          { label: "Web", Icon: Monitor },
          { label: "iOS", Icon: Smartphone },
          { label: "Android", Icon: TabletSmartphone },
        ].map(({ label, Icon }, i) => (
          <span
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 24px",
              borderRadius: 99,
              backgroundColor: color.raised,
              boxShadow: "0 10px 30px -12px rgba(46,53,50,0.3)",
              fontFamily: sans,
              fontSize: 26,
              fontWeight: 600,
              ...appear(frame, 40 + i * 6, 20),
            }}
          >
            <Icon size={26} strokeWidth={2.2} color={color.sageDeep} />
            {label}
          </span>
        ))}
      </div>
    </SceneShell>
  );
}
