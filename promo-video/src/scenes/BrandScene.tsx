import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

import { appear, progress } from "../anim";
import { Accent } from "../components/scene";
import { color, sans, serif } from "../theme";

/** Dağınıklık tek noktada toplanır: logo, ardından tek cümlelik vaat. */
export function BrandScene() {
  const frame = useCurrentFrame();
  const grow = progress(frame, 0, 22);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color.surface,
        fontFamily: sans,
        color: color.ink,
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 540 - 560,
          top: 640 - 560,
          width: 1120,
          height: 1120,
          borderRadius: 999,
          background: `radial-gradient(circle, ${color.sageSoft} 0%, ${color.sageSoft} 45%, rgba(234,240,231,0) 70%)`,
          scale: `${0.3 + grow * 0.7}`,
          opacity: grow,
        }}
      />
      <Img
        src={staticFile("brand/mark-light.png")}
        style={{
          position: "absolute",
          top: 420,
          width: 200,
          height: 200,
          scale: `${0.4 + progress(frame, 0, 16) * 0.6}`,
          opacity: progress(frame, 0, 8),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 654,
          fontFamily: serif,
          fontSize: 58,
          letterSpacing: "0.32em",
          paddingLeft: "0.32em",
          ...appear(frame, 8, 16),
        }}
      >
        KLINARA
      </div>
      <div
        style={{
          position: "absolute",
          top: 800,
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 80,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          ...appear(frame, 18, 24),
        }}
      >
        Randevudan onama,
        <br />
        <Accent>tek akış.</Accent>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1010,
          fontSize: 40,
          fontWeight: 500,
          color: color.muted,
          ...appear(frame, 28, 18),
        }}
      >
        Diş ve sağlık klinikleri için.
      </div>
    </AbsoluteFill>
  );
}
