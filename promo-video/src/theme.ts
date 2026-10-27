import { loadFont as loadManrope } from "@remotion/google-fonts/Manrope";
import { loadFont as loadSourceSerif } from "@remotion/google-fonts/SourceSerif4";

/**
 * Klinara marka token'ları. Değerler landing `app/app.css` ve web paneli
 * `apps/web-admin/src/app/globals.css` (iOS Assets.xcassets kopyası) ile aynı.
 */
export const color = {
  surface: "#FAF8F5",
  raised: "#FFFFFF",
  ink: "#2E3532",
  muted: "#6E7A74",
  line: "#DFD9D0",
  fill: "#EDE9E3",
  sage: "#7F9A76",
  sageDeep: "#5E7856",
  sageSoft: "#EAF0E7",
  accent: "#566F4E",
  warning: "#8C6A3F",
  warningSoft: "#F4ECE1",
  danger: "#A6483C",
  dangerSoft: "#F6E7E4",
  bezel: "#1D211F",
  chat: "#EFEAE2",
} as const;

const turkish: ("latin" | "latin-ext")[] = ["latin", "latin-ext"];

export const sans = loadManrope("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: turkish,
}).fontFamily;

export const serif = loadSourceSerif("normal", {
  weights: ["400", "600"],
  subsets: turkish,
}).fontFamily;

loadSourceSerif("italic", { weights: ["400", "600"], subsets: turkish });

export const VIDEO = { width: 1080, height: 1350, fps: 30 } as const;

/** Kartlar ve cihaz gölgesi (landing phone.tsx ile aynı ton). */
export const shadow = {
  device: "0 60px 120px -40px rgba(46,53,50,0.45), 0 0 0 1px rgba(0,0,0,0.05)",
  card: "0 24px 60px -24px rgba(46,53,50,0.28), 0 0 0 1px rgba(46,53,50,0.06)",
  soft: "0 10px 30px -12px rgba(46,53,50,0.22)",
} as const;
