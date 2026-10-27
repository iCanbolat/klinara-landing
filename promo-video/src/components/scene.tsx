import type { ReactNode } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

import { appear } from "../anim";
import { color, sans, serif } from "../theme";

/**
 * Her sahnenin iskeleti: krem zemin, üstte başlık, altta landing hero'sundaki
 * açık yeşil panel. Cihazlar panelin üstüne taşar.
 */
export function SceneShell({
  title,
  subtitle,
  subtitleDelay,
  panelTop = 400,
  children,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  subtitleDelay?: number;
  panelTop?: number;
  children: ReactNode;
}) {
  return (
    <AbsoluteFill style={{ backgroundColor: color.surface, fontFamily: sans, color: color.ink }}>
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 48,
          top: panelTop,
          bottom: 56,
          borderRadius: 48,
          backgroundColor: color.sageSoft,
        }}
      />
      {children}
      {title ? <Caption title={title} subtitle={subtitle} subtitleDelay={subtitleDelay} /> : null}
    </AbsoluteFill>
  );
}

export function Caption({
  title,
  subtitle,
  delay = 4,
  subtitleDelay = delay + 8,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  delay?: number;
  subtitleDelay?: number;
}) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 96 }}>
      <div
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: 76,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          color: color.ink,
          ...appear(frame, delay, 28, 20),
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div
          style={{
            marginTop: 22,
            fontSize: 40,
            lineHeight: 1.3,
            color: color.muted,
            fontWeight: 500,
            ...appear(frame, subtitleDelay, 20, 20),
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

/** Başlıktaki vurgulu kısım: hero'daki "tek ekranda." gibi serif italik yeşil. */
export function Accent({ children }: { children: ReactNode }) {
  return <em style={{ fontStyle: "italic", color: color.accent }}>{children}</em>;
}

export function Logo({ size = 72, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.32 }}>
      <Img src={staticFile("brand/mark-light.png")} style={{ width: size, height: size }} />
      {wordmark ? (
        <span
          style={{
            fontFamily: serif,
            fontSize: size * 0.56,
            letterSpacing: "0.28em",
            color: color.ink,
            paddingLeft: "0.1em",
          }}
        >
          KLINARA
        </span>
      ) : null}
    </div>
  );
}
