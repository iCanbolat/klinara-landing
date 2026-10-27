import type { CSSProperties, ReactNode } from "react";
import { FileSpreadsheet, MessageCircle, PhoneMissed } from "lucide-react";
import { useCurrentFrame } from "remotion";

import { float, progress } from "../anim";
import { SceneShell } from "../components/scene";
import { Badge } from "../components/ui";
import { color, serif, shadow } from "../theme";

/** Dağınık nesnelerin toplandığı nokta; marka sahnesindeki logo burada belirir. */
const GATHER = { x: 540, y: 520 };

/**
 * Bir nesne: sırayla belirir, hafifçe salınır, sonda merkeze çekilip kaybolur.
 * `box` sahne koordinatında sol-üst köşe ve boyut.
 */
function Scattered({
  index,
  box,
  rotate,
  children,
  style,
}: {
  index: number;
  box: { x: number; y: number; w: number; h: number };
  rotate: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const enter = progress(frame, 6 + index * 7, 18);
  const gather = progress(frame, 104 + index * 3, 26);
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const dx = (GATHER.x - cx) * gather;
  const dy = (GATHER.y - cy) * gather + (1 - enter) * 40 + float(frame, index) * (1 - gather);
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        opacity: enter * (1 - gather),
        translate: `${dx}px ${dy}px`,
        rotate: `${rotate * (1 - gather)}deg`,
        scale: `${(0.92 + enter * 0.08) * (1 - gather * 0.8)}`,
        boxShadow: shadow.card,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PainScene() {
  const frame = useCurrentFrame();
  // "Gelmedi" rozeti belirince kısa bir sarsıntı.
  const shake = frame > 62 && frame < 80 ? Math.sin(frame * 1.6) * 3 : 0;

  return (
    <SceneShell
      title={
        <>
          Defter, Excel,
          <br />
          dağınık mesajlar.
        </>
      }
      subtitle="Boş kalan koltuk saati geri gelmez."
      subtitleDelay={52}
    >
      <Scattered
        index={0}
        box={{ x: 88, y: 466, w: 440, h: 330 }}
        rotate={-5}
        style={{
          borderRadius: 18,
          backgroundColor: "#FFFDF6",
          backgroundImage: "repeating-linear-gradient(transparent 0 47px, #E7E0D2 47px 49px)",
          padding: "34px 24px 0 56px",
          borderLeft: "3px solid #E5B9B0",
        }}
      >
        <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: 26, lineHeight: "48px", color: "#3B4A63", whiteSpace: "nowrap" }}>
          <div>Salı 14.00 — Şule A. dolgu?</div>
          <div style={{ textDecoration: "line-through", opacity: 0.6 }}>Çrş 10.30 — Can Ö.</div>
          <div>Per ?? — Zeynep K. arayacak</div>
          <div style={{ opacity: 0.7 }}>Cuma tekrar kontrol…</div>
        </div>
      </Scattered>

      <Scattered
        index={1}
        box={{ x: 566, y: 452, w: 430, h: 276 }}
        rotate={4}
        style={{ borderRadius: 18, backgroundColor: color.raised, padding: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, fontWeight: 600 }}>
          <FileSpreadsheet size={30} color="#3F7D4F" strokeWidth={2} />
          hasta_listesi_son_v3.xlsx
        </div>
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 34,
                borderRadius: 4,
                backgroundColor: i < 4 ? color.fill : "#F6F3EE",
                fontSize: 16,
                color: i === 9 ? color.danger : color.muted,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
              }}
            >
              {i === 9 ? "#YOK" : i === 6 ? "05xx…" : ""}
            </div>
          ))}
        </div>
      </Scattered>

      <Scattered
        index={2}
        box={{ x: 592, y: 790, w: 400, h: 196 }}
        rotate={2}
        style={{ borderRadius: 24, backgroundColor: color.chat, padding: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 25 }}>
          <span style={{ alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 16, padding: "12px 18px" }}>
            Yarın 15.00'e alabilir miyiz?
          </span>
          <span style={{ alignSelf: "flex-start", backgroundColor: "#fff", borderRadius: 16, padding: "12px 18px" }}>
            Randevum saat kaçtaydı?
          </span>
        </div>
        <span
          style={{
            position: "absolute",
            top: -18,
            right: -14,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 99,
            backgroundColor: color.danger,
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <MessageCircle size={20} strokeWidth={2.4} /> 12
        </span>
      </Scattered>

      <Scattered
        index={3}
        box={{ x: 110, y: 864, w: 430, h: 158 }}
        rotate={-2}
        style={{
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.7)",
          border: `3px dashed ${color.line}`,
          padding: "26px 28px",
          boxShadow: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>16:30</div>
            <div style={{ fontSize: 24, color: color.muted, marginTop: 4 }}>Boş koltuk</div>
          </div>
          <Badge
            tone="danger"
            size={24}
            style={{
              opacity: progress(frame, 60, 8),
              scale: `${0.7 + progress(frame, 60, 10) * 0.3}`,
              rotate: `${shake}deg`,
            }}
          >
            Gelmedi
          </Badge>
        </div>
      </Scattered>

      <Scattered
        index={4}
        box={{ x: 300, y: 1078, w: 380, h: 84 }}
        rotate={-1}
        style={{
          borderRadius: 99,
          backgroundColor: color.raised,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 28px",
          fontSize: 26,
          fontWeight: 600,
        }}
      >
        <PhoneMissed size={30} color={color.danger} strokeWidth={2.2} />3 cevapsız arama
      </Scattered>

      <div
        style={{
          position: "absolute",
          left: GATHER.x - 40,
          top: GATHER.y - 40,
          width: 80,
          height: 80,
          borderRadius: 99,
          backgroundColor: color.sage,
          opacity: progress(frame, 128, 10),
          scale: `${0.2 + progress(frame, 128, 16) * 0.8}`,
        }}
      />
    </SceneShell>
  );
}
