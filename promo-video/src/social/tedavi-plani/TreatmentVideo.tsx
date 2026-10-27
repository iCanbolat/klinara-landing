import { ArrowUpRight, Monitor, Send } from "lucide-react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";

import { appear, progress } from "../../anim";
import { AndroidFrame, PhoneFrame } from "../../components/devices";
import { Accent, Logo, SceneShell } from "../../components/scene";
import { Badge, Button, Sfx, Tap } from "../../components/ui";
import { clinic, patient, site } from "../../data";
import { color, sans, serif, shadow } from "../../theme";
import { SlideChrome } from "../telefon-maliyeti/SlideChrome";
import { PlanHeader, PlatformTag, RemindButton, STAGE_REMINDER, StageRow, type StageState } from "./plan";
import { TOTAL } from "./slides";

const INTRO = 45;
const MAIN = 300;
const END = 120;
const FADE = 12;
export const TREATMENT_VIDEO_FRAMES = INTRO + MAIN + END - 2 * FADE;

/** Ana sahnenin yerel kareleri. Android aynı değişikliği `SYNC` kare sonra gösterir (canlı eşitleme). */
const T = { tap: 50, complete: 56, due: 92, remindTap: 150, sent: 158, whatsapp: 172, reply: 228 } as const;
const SYNC = 10;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** İlk kare dolu: Instagram videoyu ilk kareden oynatır. */
function Intro() {
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface, fontFamily: sans, color: color.ink, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 560,
          top: 675 - 560,
          width: 1120,
          height: 1120,
          borderRadius: 999,
          background: `radial-gradient(circle, ${color.sageSoft} 0%, ${color.sageSoft} 40%, rgba(234,240,231,0) 70%)`,
        }}
      />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <Logo size={80} />
        <div style={{ textAlign: "center", fontFamily: serif, fontWeight: 600, fontSize: 100, lineHeight: 1.05, letterSpacing: "-0.025em" }}>
          Tedavi takibi,
          <br />
          <Accent>cebinizde.</Accent>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <PlatformTag platform="ios" style={{ position: "relative" }} />
          <PlatformTag platform="android" style={{ position: "relative" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

/** Telefondaki plan: `f` bu cihazın gördüğü kare (Android için gecikmeli). */
function PlanScreen({ f, android }: { f: number; android?: boolean }) {
  const completed = f >= T.complete;
  const due = f >= T.due;
  const flash = interpolate(f, [T.complete, T.complete + 6, T.complete + 34], [0, 1, 0], clamp);
  const states: StageState[] = ["completed", completed ? "completed" : "scheduled", due ? "unscheduled" : "waiting", "waiting"];
  const sent = android && f >= T.sent;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
      <div style={{ position: "absolute", top: 70, left: 24, right: 24 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: color.sageDeep }}>{android ? "← Müşteri" : "‹ Müşteriler"}</div>
        <div style={{ marginTop: 6, fontFamily: serif, fontSize: 30, fontWeight: 600 }}>{patient.name}</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 168,
          left: 12,
          right: 12,
          padding: "18px 10px 8px",
          borderRadius: 24,
          backgroundColor: color.raised,
          border: `1.5px solid ${color.line}`,
        }}
      >
        <div style={{ padding: "0 8px 10px" }}>
          <PlanHeader done={completed ? 2 : 1} progress={interpolate(f, [T.complete, T.complete + 16], [1 / 4, 2 / 4], clamp)} />
        </div>
        <StageRow index={0} state={states[0]} sub="28 Eki" />
        <StageRow index={1} state={states[1]} sub="4 Kas" highlight={flash} />
        <StageRow index={2} state={states[2]} sub={due ? "Önerilen: 11 Kas" : "2. seanstan 1 hafta sonra"}>
          {android && due ? (
            sent ? (
              <Badge tone="solid" size={18} icon={<Send size={18} strokeWidth={2.4} />} style={{ marginTop: 12 }}>
                Hatırlatma gönderildi
              </Badge>
            ) : (
              <RemindButton
                style={{
                  opacity: progress(f, T.due + 8, 12),
                  scale: f >= T.remindTap - 2 && f < T.remindTap + 6 ? "0.96" : "1",
                }}
              />
            )
          ) : null}
        </StageRow>
        <StageRow index={3} state={states[3]} sub="6 ay sonra" last />
      </div>
    </div>
  );
}

function Main() {
  const frame = useCurrentFrame();
  const wa = progress(frame, T.whatsapp, 16);
  const reply = progress(frame, T.reply, 12);
  return (
    <SceneShell
      title={
        <>
          Seans biter,
          <br />
          <Accent>plan ilerler.</Accent>
        </>
      }
      subtitle="iPhone ve Android'de aynı plan, anında."
      panelTop={430}
    >
      <PhoneFrame width={450} style={{ left: 60, top: 480 }}>
        <PlanScreen f={frame} />
      </PhoneFrame>
      <AndroidFrame width={450} style={{ left: 570, top: 500 }}>
        <PlanScreen f={frame - SYNC} android />
      </AndroidFrame>
      <PlatformTag platform="ios" style={{ left: 80, top: 440, scale: "0.8", transformOrigin: "left center" }} />
      <PlatformTag platform="android" style={{ left: 590, top: 460, scale: "0.8", transformOrigin: "left center" }} />

      <Tap x={330} y={905} at={T.tap} />
      <Sfx name="tap" at={T.tap} />
      <Tap x={800} y={1090} at={T.remindTap} />
      <Sfx name="tap" at={T.remindTap} />
      <Sfx name="chime" at={T.whatsapp} volume={0.3} />

      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 1000,
          zIndex: 5,
          padding: "16px 18px 18px",
          borderRadius: 28,
          backgroundColor: color.chat,
          boxShadow: shadow.device,
          fontFamily: sans,
          opacity: wa,
          translate: `0px ${(1 - wa) * 60}px`,
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 700, color: color.muted, padding: "0 6px 10px" }}>
          WhatsApp · {clinic.name} → {patient.firstName}
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 18, backgroundColor: color.raised, fontSize: 21, lineHeight: 1.4, color: color.ink }}>
          {STAGE_REMINDER}
        </div>
        <div
          style={{
            marginTop: 10,
            marginLeft: "auto",
            width: "fit-content",
            padding: "12px 18px",
            borderRadius: 18,
            backgroundColor: "#D9F2CF",
            fontSize: 22,
            fontWeight: 600,
            color: color.ink,
            opacity: reply,
            translate: `0px ${(1 - reply) * 16}px`,
          }}
        >
          Perşembe öğleden sonra uyar mı?
        </div>
      </div>
    </SceneShell>
  );
}

function End() {
  const frame = useCurrentFrame();
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
      <div style={{ position: "absolute", top: 250, ...appear(frame, 2, 20) }}>
        <Logo size={96} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 420,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 72,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          ...appear(frame, 8, 28, 22),
        }}
      >
        Randevudan tedavi planına,
        <br />
        <Accent>takip cebinizde.</Accent>
      </div>
      <div style={{ position: "absolute", top: 650, display: "flex", gap: 16, ...appear(frame, 18, 20) }}>
        <PlatformTag platform="ios" style={{ position: "relative" }} />
        <PlatformTag platform="android" style={{ position: "relative" }} />
        <Badge tone="neutral" size={26} icon={<Monitor size={26} strokeWidth={2.2} />} style={{ padding: "10px 20px" }}>
          Web
        </Badge>
      </div>
      <div style={{ position: "absolute", top: 820, ...appear(frame, 28, 20) }}>
        <Button size={36} style={{ padding: "26px 46px", borderRadius: 22 }}>
          Demo için profildeki bağlantı
          <ArrowUpRight size={36} strokeWidth={2.4} />
        </Button>
      </div>
      <div style={{ position: "absolute", top: 966, fontSize: 32, fontWeight: 600, color: color.sageDeep, ...appear(frame, 36, 16) }}>
        {site.domain}
      </div>
    </AbsoluteFill>
  );
}

/** Carousel'in son slaytı: aşama tamamlanır → iki cihazda plan ilerler → tek dokunuş hatırlatma → kapanış. */
export function TreatmentVideo() {
  const fadeOut = (f: number) => interpolate(f, [TREATMENT_VIDEO_FRAMES - 24, TREATMENT_VIDEO_FRAMES - 1], [0.6, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Giriş" durationInFrames={INTRO}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />
        <TransitionSeries.Sequence name="Plan" durationInFrames={MAIN}>
          <Main />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />
        <TransitionSeries.Sequence name="Kapanış" durationInFrames={END}>
          <End />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SlideChrome index={TOTAL} total={TOTAL} />
      <Audio name="Fon müziği" src={staticFile("audio/klinara-calm.wav")} volume={fadeOut} />
    </AbsoluteFill>
  );
}
