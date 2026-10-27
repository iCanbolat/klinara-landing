import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, interpolate, staticFile } from "remotion";

import { Accent, Logo } from "../../components/scene";
import { BookingScene } from "../../scenes/BookingScene";
import { CalendarScene } from "../../scenes/CalendarScene";
import { WhatsAppScene } from "../../scenes/WhatsAppScene";
import { color, sans, serif } from "../../theme";
import { SlideChrome } from "./SlideChrome";

/** Giriş kartı + 3 sahne − 3 geçiş × 12 kare. */
export const CAROUSEL_VIDEO_FRAMES = 45 + 195 + 135 + 165 - 3 * 12;

/** İlk karede tam görünür başlık: Instagram videoyu ilk kareden oynatır. */
function Intro() {
  return (
    <AbsoluteFill
      style={{ backgroundColor: color.surface, fontFamily: sans, color: color.ink, alignItems: "center", justifyContent: "center" }}
    >
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
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        <Logo size={80} />
        <div
          style={{
            textAlign: "center",
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
          }}
        >
          Aynı randevu,
          <br />
          <Accent>Klinara ile.</Accent>
        </div>
        <div style={{ fontSize: 38, fontWeight: 500, color: color.muted }}>Hiç telefon açılmadan.</div>
      </div>
    </AbsoluteFill>
  );
}

/** Carousel'in 7. slaytı: online randevu → takvim → WhatsApp hatırlatma. */
export function CarouselVideo() {
  const fadeOut = (f: number) =>
    interpolate(f, [CAROUSEL_VIDEO_FRAMES - 24, CAROUSEL_VIDEO_FRAMES - 1], [0.6, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Giriş" durationInFrames={45}>
          <Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Online randevu" durationInFrames={195}>
          <BookingScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Takvim" durationInFrames={135}>
          <CalendarScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="WhatsApp" durationInFrames={165}>
          <WhatsAppScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SlideChrome index={7} swipeHint={false} />
      <Audio name="Fon müziği" src={staticFile("audio/klinara-calm.wav")} volume={fadeOut} />
    </AbsoluteFill>
  );
}
