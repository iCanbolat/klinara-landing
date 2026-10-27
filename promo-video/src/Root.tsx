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
    </>
  );
};
