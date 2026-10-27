import type { CSSProperties, ReactNode } from "react";
import { Check, MessageCircle, Route, Smartphone, TabletSmartphone } from "lucide-react";

import { Badge, Button, ProgressBar } from "../../components/ui";
import { patient, planStages } from "../../data";
import { color, sans, serif } from "../../theme";

/**
 * Telefon ekranlarında çizilen tedavi planı (iOS / Android plan detay ekranı).
 * Ölçüler Instagram'da okunsun diye gerçeğinden büyük; durum eşlemesi
 * `scenes/TreatmentScene.tsx` (web STATE_CLASS) ile aynı.
 */

export type StageState = "completed" | "scheduled" | "unscheduled" | "waiting";

const LABEL: Record<StageState, string> = {
  completed: "Tamamlandı",
  scheduled: "Randevulu",
  unscheduled: "Randevu yok",
  waiting: "Sırada değil",
};

const CIRCLE: Record<StageState, { bg: string; fg: string }> = {
  completed: { bg: color.sage, fg: "#fff" },
  scheduled: { bg: color.sageSoft, fg: color.sageDeep },
  unscheduled: { bg: color.warningSoft, fg: color.warning },
  waiting: { bg: color.fill, fg: color.muted },
};

const TONE: Record<StageState, "sage" | "warning" | "muted"> = {
  completed: "sage",
  scheduled: "sage",
  unscheduled: "warning",
  waiting: "muted",
};

/** Kısa aşama adları: telefon genişliğine sığsın. */
export const STAGE_SHORT = ["1. seans", "2. seans", "Kalıcı dolgu", "6. ay kontrolü"] as const;

export function StageRow({
  index,
  state,
  sub,
  highlight = 0,
  last = false,
  children,
}: {
  index: number;
  state: StageState;
  sub?: string;
  /** 0–1: satırın yeşil vurgusu (aşama yeni tamamlandığında). */
  highlight?: number;
  last?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: 18,
        padding: "16px 14px",
        borderRadius: 18,
        backgroundColor: highlight > 0 ? `rgba(234,240,231,${highlight})` : "transparent",
      }}
    >
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: 99,
          backgroundColor: CIRCLE[state].bg,
          color: CIRCLE[state].fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 700,
          scale: `${1 + highlight * 0.15}`,
        }}
      >
        {state === "completed" ? <Check size={24} strokeWidth={3} /> : index + 1}
      </span>
      {last ? null : <span style={{ position: "absolute", left: 35, top: 62, bottom: -18, width: 2, backgroundColor: color.line }} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 23, fontWeight: 700, whiteSpace: "nowrap" }}>{STAGE_SHORT[index]}</span>
          <Badge tone={TONE[state]} size={16}>
            {LABEL[state]}
          </Badge>
        </div>
        {sub ? <div style={{ marginTop: 4, fontSize: 18, color: color.muted }}>{sub}</div> : null}
        {children}
      </div>
    </div>
  );
}

/** Plan başlığı: ikon, ad, "Sürüyor", ilerleme çubuğu. */
export function PlanHeader({ done, progress }: { done: number; progress?: number }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <span
        style={{
          width: 56,
          height: 56,
          flexShrink: 0,
          borderRadius: 16,
          backgroundColor: color.sageSoft,
          color: color.sageDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Route size={30} strokeWidth={2.2} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 700 }}>Kanal tedavisi</span>
          <Badge tone="sage" size={16}>
            Sürüyor
          </Badge>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, fontSize: 18, color: color.muted }}>
          <ProgressBar value={progress ?? done / planStages.length} width={150} height={9} />
          <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
            {done}/{planStages.length} aşama
          </span>
        </div>
      </div>
    </div>
  );
}

/** Uygulama ekranının üst kısmı: hasta adı ve sekme. */
export function PatientHeader({ top = 74, platform }: { top?: number; platform: "ios" | "android" }) {
  return (
    <div style={{ position: "absolute", top, left: 26, right: 26, fontFamily: sans, color: color.ink }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: color.sageDeep }}>{platform === "ios" ? "‹ Müşteriler" : "← Müşteri"}</div>
      <div style={{ marginTop: 8, fontFamily: serif, fontSize: 34, fontWeight: 600 }}>{patient.name}</div>
      <div style={{ marginTop: 2, fontSize: 18, color: color.muted }}>0532 418 xx xx</div>
    </div>
  );
}

/** "WhatsApp ile hatırlat" düğmesi (plan kartındaki ikincil eylem). */
export function RemindButton({ style }: { style?: CSSProperties }) {
  return (
    <Button variant="secondary" size={19} style={{ marginTop: 12, padding: "10px 16px", ...style }}>
      <MessageCircle size={20} strokeWidth={2.2} color={color.sageDeep} />
      WhatsApp ile hatırlat
    </Button>
  );
}

/** Cihazın üstündeki platform etiketi. */
export function PlatformTag({ platform, style }: { platform: "ios" | "android"; style?: CSSProperties }) {
  const Icon = platform === "ios" ? Smartphone : TabletSmartphone;
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 20px",
        borderRadius: 99,
        backgroundColor: color.ink,
        color: "#fff",
        fontFamily: sans,
        fontSize: 26,
        fontWeight: 700,
        ...style,
      }}
    >
      <Icon size={26} strokeWidth={2.2} />
      {platform === "ios" ? "iOS" : "Android"}
    </div>
  );
}

/** Tedavi aşaması WhatsApp şablonu (`klinara_tedavi_asama`) doldurulmuş hali. */
export const STAGE_REMINDER = `Merhaba ${patient.firstName}, Kanal tedavinizin sıradaki aşaması (Kalıcı dolgu) için randevu zamanı geldi. Uygun olduğunuz gün ve saati bu mesajı yanıtlayarak Nişantaşı şubemize iletebilirsiniz.`;
