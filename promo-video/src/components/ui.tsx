import type { CSSProperties, ReactNode } from "react";
import { Check } from "lucide-react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";

import { color, shadow } from "../theme";

type Tone = "sage" | "solid" | "neutral" | "muted" | "warning" | "danger";

const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  // Web paneli status.ts: Planlandı → sage-soft zemin, sage-deep yazı.
  sage: { bg: color.sageSoft, fg: color.sageDeep, border: color.line },
  // Onaylandı / Geldi / Tamamlandı → koyu yazı, sage-deep kenar.
  solid: { bg: color.sageSoft, fg: color.ink, border: color.sageDeep },
  neutral: { bg: color.raised, fg: color.ink, border: color.line },
  muted: { bg: color.fill, fg: color.muted, border: "transparent" },
  warning: { bg: color.warningSoft, fg: color.warning, border: "transparent" },
  danger: { bg: color.dangerSoft, fg: color.danger, border: color.danger },
};

export function Badge({
  tone = "sage",
  size = 18,
  icon,
  children,
  style,
}: {
  tone?: Tone;
  size?: number;
  icon?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const t = TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.4,
        padding: `${size * 0.28}px ${size * 0.7}px`,
        borderRadius: 999,
        fontSize: size,
        fontWeight: 600,
        lineHeight: 1.15,
        whiteSpace: "nowrap",
        backgroundColor: t.bg,
        color: t.fg,
        border: `1.5px solid ${t.border}`,
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

/** İşaretlenme oranı 0–1; kutu dolar, tik büyür. */
export function Checkbox({ checked, size = 30 }: { checked: number; size?: number }) {
  return (
    <span
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size * 0.26,
        border: `2px solid ${checked > 0.5 ? color.sageDeep : color.line}`,
        backgroundColor: checked > 0 ? `rgba(94,120,86,${checked})` : color.raised,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check size={size * 0.7} strokeWidth={3.2} color="#fff" style={{ scale: `${checked}` }} />
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  size = 24,
  style,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: number;
  style?: CSSProperties;
}) {
  const primary = variant === "primary";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: size * 0.4,
        padding: `${size * 0.62}px ${size * 1.1}px`,
        borderRadius: size * 0.6,
        fontSize: size,
        fontWeight: 600,
        whiteSpace: "nowrap",
        backgroundColor: primary ? color.sageDeep : color.raised,
        color: primary ? "#fff" : color.ink,
        border: primary ? "none" : `1.5px solid ${color.line}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, width, height = 10 }: { value: number; width: number; height?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width,
        height,
        borderRadius: 99,
        backgroundColor: color.fill,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "block",
          width: `${Math.max(0, Math.min(1, value)) * 100}%`,
          height: "100%",
          borderRadius: 99,
          backgroundColor: color.sageDeep,
        }}
      />
    </span>
  );
}

/** Beyaz kart; web panelinin `rounded-xl border` kartı. */
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: color.raised,
        border: `1.5px solid ${color.line}`,
        borderRadius: 22,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Havada duran bilgi rozeti (cihazların üstüne taşan). */
export function FloatingChip({ icon, children, style }: { icon: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 24px 16px 18px",
        borderRadius: 22,
        backgroundColor: color.raised,
        boxShadow: shadow.card,
        fontSize: 26,
        fontWeight: 600,
        color: color.ink,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: color.sageSoft,
          color: color.sageDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

/** Parmak dokunuşu: beliren nokta + yayılan halka. Konum sahne koordinatında. */
export function Tap({ x, y, at }: { x: number; y: number; at: number }) {
  const frame = useCurrentFrame();
  if (frame < at - 10 || frame > at + 22) return null;
  const dot = interpolate(frame, [at - 10, at - 4, at + 8, at + 16], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring = interpolate(frame, [at, at + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 60,
          top: y - 60,
          width: 120,
          height: 120,
          borderRadius: 99,
          border: `4px solid ${color.sageDeep}`,
          opacity: frame >= at ? (1 - ring) * 0.6 : 0,
          scale: `${0.4 + ring * 0.9}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 30,
          top: y - 30,
          width: 60,
          height: 60,
          borderRadius: 99,
          backgroundColor: "rgba(46,53,50,0.18)",
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: shadow.soft,
          opacity: dot,
          scale: `${frame >= at && frame < at + 6 ? 0.85 : 1}`,
        }}
      />
    </>
  );
}

/** Kısa efekt sesi; `at` sahnenin yerel karesi. */
export function Sfx({ name, at, volume = 0.3 }: { name: "tap" | "chime"; at: number; volume?: number }) {
  return (
    <Sequence from={at} durationInFrames={45} layout="none" name={`Sfx ${name}`}>
      <Audio src={staticFile(`audio/sfx-${name}.wav`)} volume={volume} />
    </Sequence>
  );
}
