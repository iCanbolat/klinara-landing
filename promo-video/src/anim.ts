import { Easing, interpolate } from "remotion";

/** Klinara hareket eğrisi (`--ease-brand`). */
export const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** `start`tan itibaren `duration` karede 0 → 1. */
export const progress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: ease });

/** İki değer arasında, markanın eğrisiyle. */
export const tween = (frame: number, start: number, duration: number, from: number, to: number) =>
  interpolate(frame, [start, start + duration], [from, to], { ...clamp, easing: ease });

/** Görün: opaklık + aşağıdan hafif yükselme. */
export const appear = (frame: number, start: number, distance = 24, duration = 18) => {
  const p = progress(frame, start, duration);
  return { opacity: p, translate: `0px ${(1 - p) * distance}px` };
};

/** Dokunma anında kısa bir basılma (1 → 0.96 → 1). */
export const press = (frame: number, at: number) =>
  interpolate(frame, [at - 2, at + 3, at + 10], [1, 0.95, 1], clamp);

/** Sürekli yavaş salınım (dağınık nesneler için). */
export const float = (frame: number, seed: number, amplitude = 8) =>
  Math.sin((frame + seed * 37) / (22 + seed * 3)) * amplitude;

/** `steps` içindeki adımlar arasında geçerli olanın indeksi. */
export const stepIndex = (frame: number, starts: number[]) => {
  let index = 0;
  starts.forEach((start, i) => {
    if (frame >= start) index = i;
  });
  return index;
};
