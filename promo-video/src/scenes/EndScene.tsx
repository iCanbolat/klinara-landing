import { ArrowRight } from "lucide-react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

import { appear, progress } from "../anim";
import { Accent, Logo } from "../components/scene";
import { Button } from "../components/ui";
import { site } from "../data";
import { color, sans, serif } from "../theme";

/** Kapanış: logo, hero başlığı ve demo çağrısı. Hero döngüsünde sakin bir son kare. */
export function EndScene() {
  const frame = useCurrentFrame();
  const glow = progress(frame, 0, 30);

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
          opacity: glow,
          scale: `${0.85 + glow * 0.15}`,
        }}
      />
      <div style={{ position: "absolute", top: 300, ...appear(frame, 2, 20) }}>
        <Logo size={96} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 470,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 84,
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          ...appear(frame, 10, 28, 22),
        }}
      >
        Randevudan onama,
        <br />
        kliniğiniz <Accent>tek ekranda.</Accent>
      </div>
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 100,
          right: 100,
          textAlign: "center",
          fontSize: 38,
          lineHeight: 1.35,
          fontWeight: 500,
          color: color.muted,
          ...appear(frame, 20, 20),
        }}
      >
        Diş ve sağlık klinikleri için takvim, WhatsApp hatırlatma, onam ve tedavi takibi.
      </div>
      <div style={{ position: "absolute", top: 900, ...appear(frame, 30, 20) }}>
        <Button size={36} style={{ padding: "26px 46px", borderRadius: 22 }}>
          Demo talep et
          <ArrowRight size={36} strokeWidth={2.4} />
        </Button>
      </div>
      <div style={{ position: "absolute", top: 1046, fontSize: 32, fontWeight: 600, color: color.sageDeep, ...appear(frame, 38, 16) }}>
        {site.domain}
      </div>
    </AbsoluteFill>
  );
}
