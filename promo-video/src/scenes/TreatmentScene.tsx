import { Check, MessageCircle, Route } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { progress } from "../anim";
import { BrowserFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Badge, Button, FloatingChip, ProgressBar, Sfx, Tap } from "../components/ui";
import { patient, planStages } from "../data";
import { color, serif } from "../theme";

/** Kartın sahnedeki sol-üst köşesi: tarayıcı + kenar menü + üst çubuk + başlık. */
const CARD = { x: 40 + 236 + 28, y: 450 + 54 + 64 + 160 };
const HEADER = 118;
const ROW = 110;
const T = { complete: 40, nextDue: 62, actions: 72, notify: 112, sent: 120 } as const;

type StageState = "completed" | "scheduled" | "unscheduled" | "waiting";

const LABEL: Record<StageState, string> = {
  completed: "Tamamlandı",
  scheduled: "Randevulu",
  unscheduled: "Randevu yok",
  waiting: "Sırada değil",
};

/** Web paneli STATE_CLASS eşlemesi (treatment-plans-panel.tsx). */
const CIRCLE: Record<StageState, { bg: string; fg: string }> = {
  completed: { bg: color.sage, fg: "#fff" },
  scheduled: { bg: color.sageSoft, fg: color.sageDeep },
  unscheduled: { bg: color.warningSoft, fg: color.warning },
  waiting: { bg: color.fill, fg: color.muted },
};

export function TreatmentScene() {
  const frame = useCurrentFrame();
  const completed = frame >= T.complete;
  const due = frame >= T.nextDue;
  const grow = progress(frame, T.nextDue, 14);
  const flash = interpolate(frame, [T.complete, T.complete + 6, T.complete + 30], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const states: StageState[] = [
    "completed",
    completed ? "completed" : "scheduled",
    due ? "unscheduled" : "waiting",
    "waiting",
  ];
  const done = completed ? 2 : 1;
  const rowTop = (i: number) => HEADER + i * ROW + (i > 2 ? grow * 50 : 0);

  return (
    <SceneShell
      title={
        <>
          Çok seanslı tedavi,
          <br />
          aşama aşama.
        </>
      }
      subtitle="Sıradaki aşama tarihi otomatik hesaplanır."
    >
      <BrowserFrame
        width={1000}
        height={940}
        style={{ left: 40, top: 450 }}
        active="customers"
        breadcrumb={patient.name}
        path="musteriler"
      >
        <div style={{ position: "absolute", top: 20, left: 28, fontFamily: serif, fontSize: 34, fontWeight: 600 }}>{patient.name}</div>
        <div style={{ position: "absolute", top: 66, left: 28, fontSize: 17, color: color.muted }}>{patient.phone}</div>
        <div
          style={{
            position: "absolute",
            top: 102,
            left: 28,
            display: "flex",
            gap: 4,
            padding: 4,
            borderRadius: 12,
            backgroundColor: color.fill,
          }}
        >
          {["Notlar", "Geçmiş", "Tedavi planları", "Dosyalar", "Onamlar"].map((tab) => (
            <span
              key={tab}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                fontSize: 17,
                fontWeight: 600,
                backgroundColor: tab === "Tedavi planları" ? color.raised : "transparent",
                color: tab === "Tedavi planları" ? color.ink : color.muted,
              }}
            >
              {tab}
            </span>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 160,
            left: 28,
            width: 708,
            height: 900,
            borderRadius: 20,
            backgroundColor: color.raised,
            border: `1.5px solid ${color.line}`,
          }}
        >
          <div style={{ position: "absolute", top: 22, left: 22, display: "flex", gap: 16 }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: color.sageSoft,
                color: color.sageDeep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Route size={28} strokeWidth={2.2} />
            </span>
            <span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24, fontWeight: 700 }}>Kanal tedavisi</span>
                <Badge tone="sage" size={15}>
                  Sürüyor
                </Badge>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, fontSize: 17, color: color.muted }}>
                <ProgressBar
                  value={interpolate(frame, [T.complete, T.complete + 16], [1 / 4, 2 / 4], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                  width={180}
                />
                <span style={{ fontVariantNumeric: "tabular-nums" }}>{done}/4 aşama</span>
                <span>·</span>
                <span>Sıradaki: {planStages[done].label}</span>
              </span>
            </span>
          </div>
          <div style={{ position: "absolute", top: HEADER - 14, left: 0, right: 0, height: 1.5, backgroundColor: color.line }} />

          {planStages.map((stage, i) => {
            const state = states[i];
            const top = rowTop(i);
            return (
              <div
                key={stage.label}
                style={{
                  position: "absolute",
                  top,
                  left: 10,
                  right: 10,
                  height: i === 2 ? ROW + grow * 50 : ROW,
                  borderRadius: 14,
                  backgroundColor:
                    i === 1
                      ? `rgba(234,240,231,${flash})`
                      : state === "unscheduled"
                        ? `rgba(244,236,225,${grow * 0.55})`
                        : "transparent",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 14,
                    width: 40,
                    height: 40,
                    borderRadius: 99,
                    backgroundColor: CIRCLE[state].bg,
                    color: CIRCLE[state].fg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 700,
                    scale: i === 1 ? `${1 + flash * 0.15}` : "1",
                  }}
                >
                  {state === "completed" ? <Check size={20} strokeWidth={3} /> : i + 1}
                </span>
                {i < planStages.length - 1 ? (
                  <span style={{ position: "absolute", top: 62, bottom: -14, left: 33, width: 1.5, backgroundColor: color.line }} />
                ) : null}
                <div style={{ position: "absolute", top: 18, left: 74, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 21, fontWeight: 600 }}>{stage.label}</span>
                  <Badge
                    tone={state === "completed" || state === "scheduled" ? "sage" : state === "unscheduled" ? "warning" : "muted"}
                    size={15}
                  >
                    {LABEL[state]}
                  </Badge>
                </div>
                <div style={{ position: "absolute", top: 56, left: 74, fontSize: 17, color: color.muted }}>
                  {stage.service}
                  {stage.when !== "" && (i !== 2 || due) ? ` · ${stage.when}` : ""}
                </div>
                {i === 2 ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 96,
                      left: 74,
                      display: "flex",
                      gap: 10,
                      opacity: progress(frame, T.actions, 12),
                    }}
                  >
                    <Button
                      variant="secondary"
                      size={17}
                      style={{
                        width: 260,
                        scale: frame >= T.notify - 2 && frame < T.notify + 6 ? "0.96" : "1",
                      }}
                    >
                      <MessageCircle size={19} strokeWidth={2.2} color={color.sageDeep} />
                      WhatsApp ile hatırlat
                    </Button>
                    <Button size={17} style={{ width: 110 }}>
                      Planla
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </BrowserFrame>

      <Tap x={CARD.x + 10 + 74 + 130} y={CARD.y + HEADER + 2 * ROW + 96 + 21} at={T.notify} />
      <Sfx name="chime" at={T.complete + 2} volume={0.25} />
      <Sfx name="tap" at={T.notify} />

      <FloatingChip
        icon={<MessageCircle size={26} strokeWidth={2.2} />}
        style={{
          right: 60,
          top: 596,
          opacity: progress(frame, T.sent, 12),
          translate: `0px ${(1 - progress(frame, T.sent, 16)) * 30}px`,
        }}
      >
        Aşama hatırlatması gönderildi
      </FloatingChip>
    </SceneShell>
  );
}
