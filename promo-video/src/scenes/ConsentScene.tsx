import { FileText } from "lucide-react";
import { useCurrentFrame } from "remotion";

import { progress, tween } from "../anim";
import { TabletFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Badge, Button, Checkbox, FloatingChip, Sfx, Tap } from "../components/ui";
import { consentText, patient } from "../data";
import { color, sans, serif } from "../theme";

const TABLET = { x: 40, y: 450, w: 1000, h: 760 };
const SX = TABLET.x + 22;
const SY = TABLET.y + 22;

const T = { scroll: 8, check: 58, signStart: 66, signEnd: 108, submit: 116, thanks: 124, pdf: 136 } as const;

/** İmza: tek bir el yazısı çizgisi, `pathLength=1` ile orana göre çizilir. */
const SIGNATURE =
  "M24 112 C 40 58, 70 52, 78 96 C 84 132, 104 134, 116 92 C 126 58, 146 62, 146 100 C 146 128, 168 124, 180 96 C 192 70, 210 72, 214 100 C 218 126, 240 120, 252 94 C 262 74, 280 78, 292 98 C 300 110, 312 104, 326 86";

export function ConsentScene() {
  const frame = useCurrentFrame();
  const scrolled = progress(frame, T.scroll, 44);
  const checked = progress(frame, T.check, 8);
  const signed = tween(frame, T.signStart, T.signEnd - T.signStart, 0, 1);
  const thanks = progress(frame, T.thanks, 14);

  return (
    <SceneShell
      title={
        <>
          Onam tablette,
          <br />
          kâğıtsız.
        </>
      }
      subtitle="İmzalı PDF, hasta kartında."
    >
      <TabletFrame width={TABLET.w} height={TABLET.h} style={{ left: TABLET.x, top: TABLET.y }}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <div style={{ position: "absolute", top: 28, left: 36, fontSize: 17, color: color.muted }}>Belge 1 / 1</div>
          <div style={{ position: "absolute", top: 52, left: 36, fontFamily: serif, fontSize: 31, fontWeight: 600 }}>
            Kanal Tedavisi Bilgilendirilmiş Onam Formu
          </div>
          <div style={{ position: "absolute", top: 96, left: 36, fontSize: 16, color: color.muted }}>Sürüm 1</div>

          <div
            style={{
              position: "absolute",
              top: 132,
              left: 36,
              width: 500,
              height: 500,
              borderRadius: 18,
              backgroundColor: color.raised,
              border: `1.5px solid ${color.line}`,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "22px 24px", fontSize: 18, lineHeight: 1.6, translate: `0px ${scrolled * -230}px` }}>
              {consentText.map((line, i) => (
                <div key={i} style={{ minHeight: line === "" ? 14 : undefined, fontWeight: /^\d\./.test(line) || i === 0 ? 600 : 400 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 646,
              left: 36,
              fontSize: 16,
              color: scrolled > 0.98 ? color.sageDeep : color.muted,
              fontWeight: 600,
            }}
          >
            {scrolled > 0.98 ? "Metnin sonuna ulaştınız." : "Onaylamak için metni sonuna kadar okuyun."}
          </div>

          <div style={{ position: "absolute", top: 132, left: 572, width: 348, display: "flex", gap: 14 }}>
            <Checkbox checked={checked} size={30} />
            <span style={{ fontSize: 19, lineHeight: 1.4, fontWeight: 500 }}>Yukarıdaki metni okudum, anladım ve onaylıyorum.</span>
          </div>

          <div
            style={{
              position: "absolute",
              top: 240,
              left: 572,
              display: "flex",
              gap: 4,
              padding: 4,
              borderRadius: 14,
              border: `1.5px solid ${color.line}`,
              backgroundColor: color.raised,
            }}
          >
            {["Kendim", "Velisi / vasisi"].map((v, i) => (
              <span
                key={v}
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: 17,
                  fontWeight: 600,
                  backgroundColor: i === 0 ? color.sage : "transparent",
                  color: i === 0 ? "#fff" : color.ink,
                }}
              >
                {v}
              </span>
            ))}
          </div>

          <div style={{ position: "absolute", top: 306, left: 572, fontSize: 15, fontWeight: 600, color: color.muted }}>Ad soyad</div>
          <div
            style={{
              position: "absolute",
              top: 330,
              left: 572,
              width: 348,
              height: 54,
              borderRadius: 14,
              border: `1.5px solid ${color.line}`,
              backgroundColor: color.raised,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              fontSize: 20,
            }}
          >
            {patient.name}
          </div>

          <div
            style={{
              position: "absolute",
              top: 402,
              left: 572,
              width: 348,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: color.muted,
            }}
          >
            <span>İMZA</span>
            <span style={{ letterSpacing: 0, fontWeight: 500 }}>Temizle</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 428,
              left: 572,
              width: 348,
              height: 170,
              borderRadius: 16,
              border: `2px dashed ${color.line}`,
              backgroundColor: color.raised,
            }}
          >
            <svg width={348} height={170} viewBox="0 0 348 170" style={{ position: "absolute", inset: -2 }}>
              <path
                d={SIGNATURE}
                pathLength={1}
                fill="none"
                stroke={color.ink}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={1}
                strokeDashoffset={1 - signed}
              />
            </svg>
          </div>

          <Button
            size={22}
            style={{
              position: "absolute",
              top: 616,
              left: 572,
              width: 348,
              opacity: signed > 0.99 ? 1 : 0.55,
              scale: frame >= T.submit - 2 && frame < T.submit + 6 ? "0.97" : "1",
            }}
          >
            Onayla ve imzala
          </Button>

          {frame >= T.thanks ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: color.surface,
                opacity: thanks,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
              }}
            >
              <svg width={120} height={120} viewBox="0 0 120 120" style={{ scale: `${0.7 + thanks * 0.3}` }}>
                <circle cx={60} cy={60} r={56} fill={color.sageSoft} />
                <path d="M36 62 L52 78 L86 44" fill="none" stroke={color.sageDeep} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ fontFamily: serif, fontSize: 48, fontWeight: 600 }}>Teşekkür ederiz</div>
              <div style={{ fontSize: 24, color: color.muted }}>Onamlarınız kaydedildi. Lütfen tableti görevliye verin.</div>
            </div>
          ) : null}
        </div>
      </TabletFrame>

      <Tap x={SX + 572 + 15} y={SY + 132 + 15} at={T.check} />
      <Tap x={SX + 572 + 174} y={SY + 616 + 32} at={T.submit} />
      <Sfx name="tap" at={T.check} />
      <Sfx name="tap" at={T.submit} />
      <Sfx name="chime" at={T.thanks + 4} volume={0.3} />

      <FloatingChip
        icon={<FileText size={26} strokeWidth={2.2} />}
        style={{
          right: 64,
          top: 1156,
          opacity: progress(frame, T.pdf, 12),
          translate: `0px ${(1 - progress(frame, T.pdf, 16)) * 40}px`,
        }}
      >
        Kanal Tedavisi Onamı.pdf
        <Badge tone="solid" size={18}>
          İmzalandı
        </Badge>
      </FloatingChip>
    </SceneShell>
  );
}
