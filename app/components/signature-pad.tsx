import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, Eraser } from "lucide-react";

/**
 * Çalışan küçük imza alanı: klinikte tablette alınan onam imzasının bir örneği.
 * Parmak, kalem ya da fareyle çizilir; hiçbir veri bir yere gönderilmez.
 */
export function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.2;
      setSigned(false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function stroke(event: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = event.currentTarget.getContext("2d");
    if (!ctx || !drawing.current || !last.current) return;
    const next = point(event);
    ctx.strokeStyle = getComputedStyle(event.currentTarget).color;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigned(false);
  }

  return (
    <div className="rounded-card border border-line bg-surface p-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          aria-label="Örnek imza alanı. Parmağınız ya da farenizle imza atabilirsiniz."
          role="img"
          className="block h-36 w-full cursor-crosshair touch-none rounded-control bg-raised text-ink"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drawing.current = true;
            last.current = point(event);
          }}
          onPointerMove={stroke}
          onPointerUp={() => {
            if (drawing.current) setSigned(true);
            drawing.current = false;
            last.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
        {!signed && (
          <span className="pointer-events-none absolute inset-x-6 bottom-8 border-b border-dashed border-line pb-1 text-center text-sm text-muted">
            Burayı imzalayın
          </span>
        )}
      </div>
      <div className="mt-3 flex min-h-9 items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {signed ? (
            <motion.p
              key="signed"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-2 text-sm font-medium text-accent"
            >
              <CircleCheck className="size-4" strokeWidth={2} aria-hidden />
              İmza alındı, PDF danışan kartına eklenir
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted"
            >
              İşlem onamı · Lazer epilasyon
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={clear}
          className="inline-flex h-9 items-center gap-1.5 rounded-control px-3 text-sm font-medium text-muted hover:bg-fill hover:text-ink"
        >
          <Eraser className="size-4" strokeWidth={1.75} aria-hidden />
          Temizle
        </button>
      </div>
    </div>
  );
}
