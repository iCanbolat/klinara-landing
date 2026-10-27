import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile } from "remotion";

import { AppsScene } from "./scenes/AppsScene";
import { BookingScene } from "./scenes/BookingScene";
import { BrandScene } from "./scenes/BrandScene";
import { CalendarScene } from "./scenes/CalendarScene";
import { ConsentScene } from "./scenes/ConsentScene";
import { EndScene } from "./scenes/EndScene";
import { PainScene } from "./scenes/PainScene";
import { TreatmentScene } from "./scenes/TreatmentScene";
import { WhatsAppScene } from "./scenes/WhatsAppScene";
import { color } from "./theme";

/**
 * Landing hero promo videosu: sorun → marka → tek hastanın yolculuğu
 * (online randevu, takvim, WhatsApp hatırlatma, onam, tedavi planı) → uygulamalar → kapanış.
 * Sahne süreleri toplamı 1305 kare; 8 geçiş × 12 kare örtüşmeyle 1209 kare (40,3 sn).
 */
export function KlinaraPromo() {
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Sorun" durationInFrames={150}>
          <PainScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Marka" durationInFrames={75}>
          <BrandScene />
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
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Onam" durationInFrames={165}>
          <ConsentScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Tedavi planı" durationInFrames={165}>
          <TreatmentScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Uygulamalar" durationInFrames={120}>
          <AppsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence name="Kapanış" durationInFrames={135}>
          <EndScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Audio name="Fon müziği" src={staticFile("audio/klinara-calm.wav")} volume={0.6} />
    </AbsoluteFill>
  );
}
