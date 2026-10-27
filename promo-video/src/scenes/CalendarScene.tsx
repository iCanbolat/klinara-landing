import type { CSSProperties } from "react";
import { Bell, Globe } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { progress } from "../anim";
import { BrowserFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Badge, Sfx } from "../components/ui";
import { booking, doctor, patient } from "../data";
import { color, serif, shadow } from "../theme";

const HOUR = 92;
const HEADER = 52;
const GUTTER = 72;
const COLUMN = 318;
const FIRST_HOUR = 9;

const ARRIVE = 30;

type Block = {
  col: 0 | 1;
  start: number;
  hours: number;
  name: string;
  service: string;
  status: "Planlandı" | "Onaylandı" | "Geldi" | "Tamamlandı";
};

const EXISTING: Block[] = [
  { col: 0, start: 9, hours: 1, name: "Ayşe Yılmaz", service: "Kanal Tedavisi", status: "Tamamlandı" },
  { col: 0, start: 10.5, hours: 0.5, name: "Mehmet Demir", service: "Muayene ve Kontrol", status: "Geldi" },
  { col: 0, start: 12, hours: 0.75, name: "Selin Koç", service: "Diş Taşı Temizliği", status: "Onaylandı" },
  { col: 1, start: 9.5, hours: 1, name: "Elif Şahin", service: "Kompozit Dolgu", status: "Tamamlandı" },
  { col: 1, start: 11, hours: 1, name: "Burak Aydın", service: "Diş Beyazlatma", status: "Onaylandı" },
  { col: 1, start: 13, hours: 0.5, name: "Merve Çelik", service: "Muayene ve Kontrol", status: "Planlandı" },
  { col: 1, start: 14.5, hours: 1, name: "Deniz Arslan", service: "Kanal Tedavisi", status: "Planlandı" },
];

const clock = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 === 0.5 ? "30" : h % 1 === 0.75 ? "45" : "00"}`;

function BlockView({ block, style }: { block: Block; style?: CSSProperties }) {
  const top = HEADER + (block.start - FIRST_HOUR) * HOUR + 3;
  const height = block.hours * HOUR - 6;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: GUTTER + block.col * COLUMN + 6,
        width: COLUMN - 12,
        height,
        borderRadius: 12,
        backgroundColor: "#EEF2EB",
        border: `1.5px solid ${color.line}`,
        borderLeft: `5px solid ${color.sage}`,
        padding: height < 60 ? "6px 12px" : "10px 14px",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 700, whiteSpace: "nowrap" }}>{block.name}</span>
        {height >= 60 ? (
          <Badge tone={block.status === "Planlandı" ? "sage" : "solid"} size={13}>
            {block.status}
          </Badge>
        ) : null}
      </div>
      <div style={{ fontSize: 15, color: color.muted, marginTop: 3, whiteSpace: "nowrap" }}>
        {clock(block.start)} · {block.service}
      </div>
    </div>
  );
}

export function CalendarScene() {
  const frame = useCurrentFrame();
  const arrive = progress(frame, ARRIVE, 16);
  const glow = interpolate(frame, [ARRIVE, ARRIVE + 10, ARRIVE + 60], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toastIn = progress(frame, ARRIVE + 8, 14);
  const toastOut = progress(frame, 112, 12);
  // Aynı saate ikinci randevu denemesi: hayalet blok belirir, uyarı verir, geri çekilir.
  const ghost = interpolate(frame, [72, 80, 100, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fresh: Block = { col: 0, start: 14, hours: 1, name: patient.name, service: booking.service, status: "Planlandı" };

  return (
    <SceneShell title="Takvime anında düşer." subtitle="Ekip aynı takvimi görür; çakışma olmaz." panelTop={320}>
      <BrowserFrame
        width={1000}
        height={1000}
        style={{ left: 40, top: 360 }}
        active="calendar"
        breadcrumb="Takvim"
        path="takvim"
        bellCount={frame >= ARRIVE + 4 ? 3 : 2}
        bellPulse={interpolate(frame, [ARRIVE + 4, ARRIVE + 9, ARRIVE + 16], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      >
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 28,
            right: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontFamily: serif, fontSize: 32, fontWeight: 600 }}>{booking.dateLong}</span>
          <span style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, border: `1.5px solid ${color.line}`, backgroundColor: color.raised }}>
            {["Gün", "Hafta"].map((v, i) => (
              <span
                key={v}
                style={{
                  padding: "6px 16px",
                  borderRadius: 9,
                  fontSize: 17,
                  fontWeight: 600,
                  backgroundColor: i === 0 ? color.sage : "transparent",
                  color: i === 0 ? "#fff" : color.ink,
                }}
              >
                {v}
              </span>
            ))}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 84,
            left: 28,
            width: GUTTER + COLUMN * 2,
            height: 1000,
            borderRadius: 18,
            backgroundColor: color.raised,
            border: `1.5px solid ${color.line}`,
            overflow: "hidden",
          }}
        >
          {[doctor.name, "Dr. Can Öztürk"].map((name, i) => (
            <div
              key={name}
              style={{
                position: "absolute",
                top: 0,
                left: GUTTER + i * COLUMN,
                width: COLUMN,
                height: HEADER,
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                fontSize: 18,
                fontWeight: 600,
                borderLeft: `1.5px solid ${color.line}`,
                borderBottom: `1.5px solid ${color.line}`,
              }}
            >
              {name}
            </div>
          ))}
          {Array.from({ length: 8 }, (_, h) => (
            <div key={h}>
              <div
                style={{
                  position: "absolute",
                  top: HEADER + h * HOUR - 10,
                  left: 0,
                  width: GUTTER - 10,
                  textAlign: "right",
                  fontSize: 15,
                  color: color.muted,
                }}
              >
                {h === 0 ? "" : `${String(FIRST_HOUR + h).padStart(2, "0")}:00`}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: HEADER + h * HOUR,
                  left: GUTTER,
                  right: 0,
                  height: 1.5,
                  backgroundColor: color.fill,
                }}
              />
            </div>
          ))}
          <div style={{ position: "absolute", top: HEADER, bottom: 0, left: GUTTER + COLUMN, width: 1.5, backgroundColor: color.line }} />

          {EXISTING.map((b) => (
            <BlockView key={b.name + b.start} block={b} />
          ))}

          <BlockView
            block={fresh}
            style={{
              opacity: arrive,
              translate: `0px ${(1 - arrive) * -40}px`,
              scale: `${1.06 - arrive * 0.06}`,
              backgroundColor: color.raised,
              borderLeft: `5px solid ${color.sageDeep}`,
              boxShadow: `0 0 0 ${glow * 8}px rgba(127,154,118,0.35), ${shadow.soft}`,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: HEADER + 5 * HOUR + 62,
              left: GUTTER + 20,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 700,
              color: color.sageDeep,
              opacity: arrive,
            }}
          >
            <Globe size={15} strokeWidth={2.4} /> Online randevu
          </span>

          <div
            style={{
              position: "absolute",
              top: HEADER + 5 * HOUR + 40,
              left: GUTTER + 60,
              width: COLUMN - 40,
              height: HOUR * 0.5,
              borderRadius: 12,
              border: `3px dashed ${color.danger}`,
              backgroundColor: color.dangerSoft,
              boxShadow: shadow.soft,
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontSize: 17,
              fontWeight: 700,
              color: color.danger,
              opacity: ghost,
              translate: `${(1 - ghost) * 30}px ${(1 - ghost) * 20}px`,
              rotate: "-2deg",
            }}
          >
            Bu saat dolu
          </div>
        </div>
      </BrowserFrame>

      <div
        style={{
          position: "absolute",
          top: 496,
          right: 40,
          width: 400,
          display: "flex",
          gap: 16,
          padding: "20px 22px",
          borderRadius: 20,
          backgroundColor: color.raised,
          boxShadow: shadow.card,
          opacity: toastIn * (1 - toastOut),
          translate: `${(1 - toastIn) * 60}px 0px`,
        }}
      >
        <span
          style={{
            width: 48,
            height: 48,
            flexShrink: 0,
            borderRadius: 14,
            backgroundColor: color.sageSoft,
            color: color.sageDeep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={26} strokeWidth={2.2} />
        </span>
        <span>
          <span style={{ display: "block", fontSize: 23, fontWeight: 700 }}>Yeni online randevu</span>
          <span style={{ display: "block", fontSize: 19, color: color.muted, marginTop: 4 }}>
            {patient.name} · {booking.dayLabel} {booking.time}
          </span>
        </span>
      </div>
      <Sfx name="chime" at={ARRIVE + 4} volume={0.25} />
    </SceneShell>
  );
}
