import type { ReactNode } from "react";
import { BadgeCheck, Check, Clock, ShieldCheck, UsersRound } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { progress } from "../anim";
import { PhoneFrame } from "../components/devices";
import { SceneShell } from "../components/scene";
import { Checkbox, FloatingChip, ProgressBar, Sfx, Tap } from "../components/ui";
import { booking, clinic, doctor, services } from "../data";
import { color, sans } from "../theme";

/** Telefon ekranının sahnedeki sol-üst köşesi (dokunuş koordinatları için). */
const PHONE = { x: 250, y: 450, w: 580 };
const SX = PHONE.x + PHONE.w * 0.024;
const SY = PHONE.y + PHONE.w * 0.024;

/** Adımların başladığı kareler: hizmet, uygulayıcı, saat, sonuç. */
const STEPS = [0, 52, 98, 140] as const;
const TAPS = { service: 28, doctor: 76, slot: 118 } as const;

/** Bir adımın içeriği: yandan kayarak girer, sola kayarak çıkar. */
function Pane({ from, to, children }: { from: number; to: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 12) return null;
  const enter = from === 0 ? 1 : progress(frame, from, 14);
  const exit = progress(frame, to, 12);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: enter * (1 - exit),
        translate: `${(1 - enter) * 60 - exit * 60}px 0px`,
      }}
    >
      {children}
    </div>
  );
}

function StepHeader({ label, step }: { label: string; step: number }) {
  return (
    <>
      <div style={{ position: "absolute", top: 166, left: 32, right: 32, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 26, fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 21, color: color.muted, paddingTop: 4 }}>Adım {step} / 7</span>
      </div>
      <div style={{ position: "absolute", top: 212, left: 32 }}>
        <ProgressBar value={step / 7} width={488} height={8} />
      </div>
    </>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 246,
        left: 20,
        width: 512,
        height: 700,
        borderRadius: 30,
        backgroundColor: color.raised,
        border: `1.5px solid ${color.line}`,
      }}
    >
      <div style={{ position: "absolute", top: 28, left: 28, fontSize: 32, fontWeight: 700 }}>{title}</div>
      <div style={{ position: "absolute", top: 76, left: 28, right: 28, fontSize: 21, lineHeight: 1.35, color: color.muted }}>
        {subtitle}
      </div>
      {children}
    </div>
  );
}

/** Kart içindeki satır (koordinatlar kartın içine göre). */
function Row({ top, height, selected, children }: { top: number; height: number; selected: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 24,
        width: 464,
        height,
        borderRadius: 20,
        border: `2px solid ${selected > 0.5 ? color.sageDeep : color.line}`,
        backgroundColor: `rgba(234,240,231,${selected})`,
        display: "flex",
        alignItems: "center",
        padding: "0 22px",
        gap: 16,
      }}
    >
      {children}
    </div>
  );
}

export function BookingScene() {
  const frame = useCurrentFrame();
  const serviceChecked = progress(frame, TAPS.service, 8);
  const doctorChecked = progress(frame, TAPS.doctor, 8);
  const slotChecked = progress(frame, TAPS.slot, 6);
  const done = progress(frame, STEPS[3] + 4, 18);
  // Sonuç ekranındaki onay halkası: önce çember, sonra tik çizilir.
  const ring = progress(frame, STEPS[3] + 6, 16);
  const tick = progress(frame, STEPS[3] + 16, 12);

  return (
    <SceneShell
      title={
        <>
          Hasta 7/24
          <br />
          online randevu alır.
        </>
      }
      subtitle="WhatsApp doğrulamalı, KVKK onaylı."
    >
      <PhoneFrame width={PHONE.w} style={{ left: PHONE.x, top: PHONE.y }}>
        <div style={{ position: "absolute", inset: 0, fontFamily: sans, color: color.ink }}>
          <div
            style={{
              position: "absolute",
              top: 84,
              left: 32,
              right: 32,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700 }}>{clinic.name}</span>
            <span style={{ fontSize: 19, color: color.muted }}>Ana sayfa</span>
          </div>
          <div style={{ position: "absolute", top: 146, left: 0, right: 0, height: 1.5, backgroundColor: color.line }} />

          <Pane from={STEPS[0]} to={STEPS[1]}>
            <StepHeader label="Hizmet" step={2} />
            <StepCard title="Hizmet seçin" subtitle="Birden fazla hizmet seçebilirsiniz; süreler toplanır.">
              {services.map((s, i) => (
                <Row key={s.name} top={146 + i * 96} height={84} selected={s.name === booking.service ? serviceChecked * 0.9 : 0}>
                  <span style={{ flex: 1, fontSize: 25, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 21, color: color.muted }}>{s.duration}</span>
                  <Checkbox checked={s.name === booking.service ? serviceChecked : 0} size={32} />
                </Row>
              ))}
            </StepCard>
          </Pane>

          <Pane from={STEPS[1]} to={STEPS[2]}>
            <StepHeader label="Uygulayıcı" step={3} />
            <StepCard title="Uygulayıcı seçin" subtitle="Belirli bir hekim seçebilir ya da kliniğe bırakabilirsiniz.">
              {[
                { name: "Fark etmez", sub: "En uygun saatler gösterilir", initials: "" },
                { name: doctor.name, sub: doctor.title, initials: doctor.initials },
                { name: "Dr. Elif Yalçın", sub: "Periodontoloji Uzmanı", initials: "EY" },
              ].map((d, i) => {
                const selected = i === 1 ? doctorChecked : i === 0 ? 1 - doctorChecked : 0;
                return (
                  <Row key={d.name} top={146 + i * 112} height={100} selected={selected * 0.9}>
                    <span
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 99,
                        backgroundColor: color.sageSoft,
                        color: color.sageDeep,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 19,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {d.initials || <UsersRound size={26} strokeWidth={2} />}
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 25, fontWeight: 600 }}>{d.name}</span>
                      <span style={{ display: "block", fontSize: 20, color: color.muted, marginTop: 2 }}>{d.sub}</span>
                    </span>
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 99,
                        border: `2px solid ${selected > 0.5 ? color.sageDeep : color.line}`,
                        backgroundColor: selected > 0.5 ? color.sageDeep : color.raised,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selected > 0.5 ? <Check size={18} color="#fff" strokeWidth={3} /> : null}
                    </span>
                  </Row>
                );
              })}
            </StepCard>
          </Pane>

          <Pane from={STEPS[2]} to={STEPS[3]}>
            <StepHeader label="Tarih ve saat" step={4} />
            <StepCard title="Tarih ve saat seçin" subtitle="Saatler kliniğin saat diliminde gösteriliyor.">
              {[
                ["BUGÜN", "27"],
                ["ÇAR", booking.day],
                ["PER", "29"],
                ["CUM", "30"],
                ["CMT", "31"],
              ].map(([d, n], i) => (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    top: 140,
                    left: 24 + i * 92,
                    width: 82,
                    height: 100,
                    borderRadius: 20,
                    border: `1.5px solid ${i === 1 ? color.sageDeep : color.line}`,
                    backgroundColor: i === 1 ? color.sageDeep : color.raised,
                    color: i === 1 ? "#fff" : i === 0 ? color.muted : color.ink,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.06em" }}>{d}</span>
                  <span style={{ fontSize: 30, fontWeight: 700 }}>{n}</span>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  top: 272,
                  left: 28,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: color.muted,
                }}
              >
                ÖĞLEDEN SONRA · 5
              </div>
              {["12:00", booking.time, "14:15", "14:30", "16:45"].map((t, i) => {
                const chosen = t === booking.time ? slotChecked : 0;
                return (
                  <div
                    key={t}
                    style={{
                      position: "absolute",
                      top: 312 + Math.floor(i / 3) * 80,
                      left: 24 + (i % 3) * 158,
                      width: 148,
                      height: 66,
                      borderRadius: 18,
                      border: `1.5px solid ${chosen > 0.5 ? color.sageDeep : color.line}`,
                      backgroundColor: chosen > 0.5 ? color.sageDeep : color.raised,
                      color: chosen > 0.5 ? "#fff" : color.ink,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 25,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </div>
                );
              })}
              <div
                style={{
                  position: "absolute",
                  top: 492,
                  left: 24,
                  width: 464,
                  borderRadius: 18,
                  backgroundColor: color.sageSoft,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 20,
                  fontWeight: 600,
                  color: color.sageDeep,
                  opacity: progress(frame, TAPS.slot + 6, 10),
                }}
              >
                <Clock size={24} strokeWidth={2.2} />
                Seçtiğiniz saat sizin için tutuluyor
              </div>
            </StepCard>
          </Pane>

          {frame >= STEPS[3] ? (
            <div style={{ position: "absolute", inset: 0, opacity: done }}>
              <svg
                width={140}
                height={140}
                viewBox="0 0 140 140"
                style={{ position: "absolute", top: 200, left: 206 }}
              >
                <circle cx={70} cy={70} r={62} fill={color.sageSoft} />
                <circle
                  cx={70}
                  cy={70}
                  r={62}
                  fill="none"
                  stroke={color.sageDeep}
                  strokeWidth={6}
                  strokeDasharray={390}
                  strokeDashoffset={390 * (1 - ring)}
                  transform="rotate(-90 70 70)"
                  strokeLinecap="round"
                />
                <path
                  d="M44 72 L62 90 L98 52"
                  fill="none"
                  stroke={color.sageDeep}
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={80}
                  strokeDashoffset={80 * (1 - tick)}
                />
              </svg>
              <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", fontSize: 34, fontWeight: 700 }}>
                Randevunuz oluşturuldu
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 424,
                  left: 56,
                  right: 56,
                  textAlign: "center",
                  fontSize: 21,
                  lineHeight: 1.4,
                  color: color.muted,
                }}
              >
                Randevu bilgileriniz WhatsApp ile telefonunuza gönderildi.
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 520,
                  left: 28,
                  width: 496,
                  borderRadius: 26,
                  backgroundColor: color.raised,
                  border: `1.5px solid ${color.line}`,
                  padding: "8px 26px",
                  translate: `0px ${(1 - progress(frame, STEPS[3] + 14, 16)) * 30}px`,
                }}
              >
                {[
                  ["Tarih", booking.dateLong],
                  ["Saat", booking.time],
                  ["Hizmet", booking.service],
                  ["Hekim", doctor.name],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderTop: i === 0 ? "none" : `1.5px solid ${color.fill}`,
                      fontSize: 22,
                    }}
                  >
                    <span style={{ color: color.muted }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </PhoneFrame>

      <Tap x={SX + 466} y={SY + 246 + 146 + 96 + 42} at={TAPS.service} />
      <Tap x={SX + 260} y={SY + 246 + 146 + 112 + 50} at={TAPS.doctor} />
      <Tap x={SX + 20 + 24 + 158 + 74} y={SY + 246 + 312 + 33} at={TAPS.slot} />
      <Sfx name="tap" at={TAPS.service} />
      <Sfx name="tap" at={TAPS.doctor} />
      <Sfx name="tap" at={TAPS.slot} />
      <Sfx name="chime" at={STEPS[3] + 16} volume={0.35} />

      <FloatingChip
        icon={<ShieldCheck size={26} strokeWidth={2.2} />}
        style={{
          left: 40,
          top: 606,
          opacity: progress(frame, STEPS[3] + 20, 12),
          translate: `${interpolate(progress(frame, STEPS[3] + 20, 16), [0, 1], [-40, 0])}px 0px`,
        }}
      >
        KVKK açık rızası alındı
      </FloatingChip>
      <FloatingChip
        icon={<BadgeCheck size={26} strokeWidth={2.2} />}
        style={{
          right: 40,
          top: 700,
          opacity: progress(frame, STEPS[3] + 28, 12),
          translate: `${interpolate(progress(frame, STEPS[3] + 28, 16), [0, 1], [40, 0])}px 0px`,
        }}
      >
        WhatsApp ile doğrulandı
      </FloatingChip>
    </SceneShell>
  );
}
