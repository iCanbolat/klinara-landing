import { ArrowRight } from "lucide-react";

import { color, sans } from "../../theme";

export const SLIDE_COUNT = 9;

/** Carousel slaytlarının ortak süsü: sağ üstte `n/toplam`, son slayt hariç sağ altta kaydırma ipucu. */
export function SlideChrome({
  index,
  total = SLIDE_COUNT,
  swipeHint = index < total,
}: {
  index: number;
  total?: number;
  swipeHint?: boolean;
}) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 56,
          padding: "8px 18px",
          borderRadius: 99,
          backgroundColor: color.fill,
          fontFamily: sans,
          fontSize: 24,
          fontWeight: 700,
          color: color.muted,
          letterSpacing: "0.04em",
        }}
      >
        {index}/{total}
      </div>
      {swipeHint ? (
        <div
          style={{
            position: "absolute",
            right: 92,
            bottom: 88,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: sans,
            fontSize: 26,
            fontWeight: 700,
            color: color.sageDeep,
          }}
        >
          Kaydır
          <ArrowRight size={30} strokeWidth={2.6} />
        </div>
      ) : null}
    </>
  );
}
