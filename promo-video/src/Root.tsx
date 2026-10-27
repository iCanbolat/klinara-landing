import { Composition, Folder } from "remotion";

import { KlinaraPromo } from "./KlinaraPromo";
import { AppsScene } from "./scenes/AppsScene";
import { BookingScene } from "./scenes/BookingScene";
import { BrandScene } from "./scenes/BrandScene";
import { CalendarScene } from "./scenes/CalendarScene";
import { ConsentScene } from "./scenes/ConsentScene";
import { EndScene } from "./scenes/EndScene";
import { PainScene } from "./scenes/PainScene";
import { TreatmentScene } from "./scenes/TreatmentScene";
import { WhatsAppScene } from "./scenes/WhatsAppScene";
import { CAROUSEL_VIDEO_FRAMES, CarouselVideo } from "./social/telefon-maliyeti/CarouselVideo";
import {
  Slide1Cover,
  Slide2Chain,
  Slide3WrongMoment,
  Slide4AfterHours,
  Slide5Math,
  Slide6NoShow,
  Slide8Relief,
  Slide9Cta,
} from "./social/telefon-maliyeti/slides";
import {
  Tedavi1Cover,
  Tedavi2Patient,
  Tedavi3Secretary,
  Tedavi4Loss,
  Tedavi5Ios,
  Tedavi6Android,
  Tedavi7Next,
} from "./social/tedavi-plani/slides";
import { TREATMENT_VIDEO_FRAMES, TreatmentVideo } from "./social/tedavi-plani/TreatmentVideo";

/** Durağan carousel slaytları; still'ler son karede alınır (`scripts/carousel.mjs`). */
const SLIDE_FRAMES = 45;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="KlinaraPromo" component={KlinaraPromo} width={1080} height={1350} fps={30} durationInFrames={1209} />
      <Folder name="Sahneler">
        <Composition id="Sorun" component={PainScene} width={1080} height={1350} fps={30} durationInFrames={150} />
        <Composition id="Marka" component={BrandScene} width={1080} height={1350} fps={30} durationInFrames={75} />
        <Composition id="OnlineRandevu" component={BookingScene} width={1080} height={1350} fps={30} durationInFrames={195} />
        <Composition id="Takvim" component={CalendarScene} width={1080} height={1350} fps={30} durationInFrames={135} />
        <Composition id="WhatsApp" component={WhatsAppScene} width={1080} height={1350} fps={30} durationInFrames={165} />
        <Composition id="Onam" component={ConsentScene} width={1080} height={1350} fps={30} durationInFrames={165} />
        <Composition id="TedaviPlani" component={TreatmentScene} width={1080} height={1350} fps={30} durationInFrames={165} />
        <Composition id="Uygulamalar" component={AppsScene} width={1080} height={1350} fps={30} durationInFrames={120} />
        <Composition id="Kapanis" component={EndScene} width={1080} height={1350} fps={30} durationInFrames={135} />
      </Folder>
      <Folder name="Instagram-TelefonMaliyeti">
        <Composition id="Slayt01" component={Slide1Cover} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt02" component={Slide2Chain} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt03" component={Slide3WrongMoment} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt04" component={Slide4AfterHours} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt05" component={Slide5Math} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt06" component={Slide6NoShow} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt07" component={CarouselVideo} width={1080} height={1350} fps={30} durationInFrames={CAROUSEL_VIDEO_FRAMES} />
        <Composition id="Slayt08" component={Slide8Relief} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Slayt09" component={Slide9Cta} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
      </Folder>
      <Folder name="Instagram-TedaviPlani">
        <Composition id="Tedavi01" component={Tedavi1Cover} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi02" component={Tedavi2Patient} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi03" component={Tedavi3Secretary} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi04" component={Tedavi4Loss} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi05" component={Tedavi5Ios} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi06" component={Tedavi6Android} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi07" component={Tedavi7Next} width={1080} height={1350} fps={30} durationInFrames={SLIDE_FRAMES} />
        <Composition id="Tedavi08" component={TreatmentVideo} width={1080} height={1350} fps={30} durationInFrames={TREATMENT_VIDEO_FRAMES} />
      </Folder>
    </>
  );
};
