import type { CSSProperties, ReactNode } from "react";
import { Bell, CalendarDays, ChartColumn, FilePen, LayoutGrid, MessageSquare, Users, BatteryFull, Signal, Wifi } from "lucide-react";
import { Img, staticFile } from "remotion";

import { color, sans, serif, shadow } from "../theme";

/** iPhone ekran oranı (1206×2622), landing `Phone` bileşeniyle aynı. */
const PHONE_RATIO = 2622 / 1206;

/** Telefon ekranının genişliği (bezel düşülmüş) — içerik bu ölçüye göre çizilir. */
export const phoneScreenWidth = (width: number) => width * (1 - 2 * 0.024);

/**
 * Landing `app/components/phone.tsx` bezel'inin kopyası: eliptik yüzde köşe,
 * koyu çerçeve, ince ring. İçerik iOS uygulamasının yeniden çizimi.
 */
export function PhoneFrame({
  width,
  style,
  children,
  statusBar = true,
  screenColor = color.surface,
}: {
  width: number;
  style?: CSSProperties;
  children: ReactNode;
  statusBar?: boolean;
  screenColor?: string;
}) {
  const k = phoneScreenWidth(width) / 402;
  return (
    <div
      style={{
        position: "absolute",
        width,
        height: width * PHONE_RATIO,
        borderRadius: "15.5% / 7.1%",
        backgroundColor: color.bezel,
        padding: `${width * 0.024}px`,
        boxShadow: shadow.device,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "13.8% / 6.35%",
          backgroundColor: screenColor,
        }}
      >
        {children}
        {statusBar ? <StatusBar k={k} /> : null}
      </div>
    </div>
  );
}

function StatusBar({ k }: { k: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 54 * k,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${4 * k}px ${34 * k}px 0`,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 17 * k,
        color: color.ink,
      }}
    >
      <span>09:41</span>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 11 * k,
          width: 124 * k,
          height: 36 * k,
          marginLeft: -62 * k,
          borderRadius: 999,
          backgroundColor: "#000",
        }}
      />
      <span style={{ display: "flex", gap: 6 * k, alignItems: "center" }}>
        <Signal size={17 * k} strokeWidth={2.6} />
        <Wifi size={17 * k} strokeWidth={2.6} />
        <BatteryFull size={24 * k} strokeWidth={2} />
      </span>
    </div>
  );
}

/** Yatay tablet: klinikte onam imzası için. */
export function TabletFrame({
  width,
  height,
  style,
  children,
}: {
  width: number;
  height: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 52,
        backgroundColor: color.bezel,
        padding: 22,
        boxShadow: shadow.device,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: 32,
          backgroundColor: color.surface,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const NAV = [
  { key: "dashboard", label: "Genel bakış", Icon: LayoutGrid },
  { key: "calendar", label: "Takvim", Icon: CalendarDays },
  { key: "customers", label: "Müşteriler", Icon: Users },
  { key: "messages", label: "Mesajlar", Icon: MessageSquare },
  { key: "consent", label: "Onam metni", Icon: FilePen },
  { key: "reports", label: "Raporlar", Icon: ChartColumn },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

/**
 * Web paneli (yonetim.klinara.app): tarayıcı çubuğu + beyaz kenar menü +
 * üst çubuk. Ölçüler videoda okunsun diye gerçeğinden büyük.
 */
export function BrowserFrame({
  width,
  height,
  style,
  active,
  breadcrumb,
  path,
  bellCount = 0,
  bellPulse = 0,
  children,
}: {
  width: number;
  height: number;
  style?: CSSProperties;
  active: NavKey;
  breadcrumb: string;
  path: string;
  bellCount?: number;
  /** 0–1: zilin yeni bildirimle büyüyüp sönmesi. */
  bellPulse?: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 26,
        overflow: "hidden",
        backgroundColor: color.surface,
        boxShadow: shadow.device,
        display: "flex",
        flexDirection: "column",
        fontFamily: sans,
        color: color.ink,
        ...style,
      }}
    >
      <div
        style={{
          height: 54,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 22px",
          backgroundColor: color.fill,
          borderBottom: `1px solid ${color.line}`,
        }}
      >
        {["#E8746A", "#E9B949", "#7DBA6A"].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: c, opacity: 0.85 }} />
        ))}
        <div
          style={{
            marginLeft: 22,
            flex: 1,
            maxWidth: 520,
            height: 34,
            borderRadius: 10,
            backgroundColor: color.raised,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            fontSize: 17,
            color: color.muted,
          }}
        >
          yonetim.klinara.app/{path}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div
          style={{
            width: 236,
            flexShrink: 0,
            backgroundColor: color.raised,
            borderRight: `1px solid ${color.line}`,
            padding: "22px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px 20px" }}>
            <Img src={staticFile("brand/mark-light.png")} style={{ width: 30, height: 30 }} />
            <span style={{ fontFamily: serif, fontSize: 20, letterSpacing: "0.28em" }}>KLINARA</span>
          </div>
          {NAV.map(({ key, label, Icon }) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 12,
                fontSize: 19,
                fontWeight: key === active ? 600 : 500,
                backgroundColor: key === active ? color.sageSoft : "transparent",
                color: key === active ? color.ink : color.muted,
              }}
            >
              <Icon size={20} strokeWidth={2} color={key === active ? color.sageDeep : color.muted} />
              {label}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div
            style={{
              height: 64,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 26px",
              backgroundColor: color.raised,
              borderBottom: `1px solid ${color.line}`,
              fontSize: 18,
              color: color.muted,
            }}
          >
            <span>
              Klinara Yönetim <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: color.ink, fontWeight: 600 }}>{breadcrumb}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ position: "relative", display: "flex", scale: `${1 + bellPulse * 0.25}` }}>
                <Bell size={24} strokeWidth={2} color={color.ink} />
                {bellCount > 0 ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -10,
                      minWidth: 22,
                      height: 22,
                      borderRadius: 99,
                      backgroundColor: color.sageDeep,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 5px",
                    }}
                  >
                    {bellCount}
                  </span>
                ) : null}
              </span>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 99,
                  backgroundColor: color.sageSoft,
                  color: color.sageDeep,
                  fontSize: 15,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ZA
              </span>
            </span>
          </div>
          <div style={{ flex: 1, position: "relative", padding: 28, minHeight: 0 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
