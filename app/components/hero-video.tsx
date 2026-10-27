import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "~/lib/cn";

const POSTER = "/videos/klinara-promo-poster.webp";

/**
 * Hero'daki promo videosu (kaynağı `promo-video/`, Remotion). Sessiz döngüde
 * oynar; ses ve duraklatma düğmeleri kullanıcıda. `autoPlay` özniteliği yok:
 * oynatma, görünür olduğunda ve hareket azaltma tercihi yoksa effect'ten başlar.
 * Böylece prerender HTML'i azaltılmış hareket isteyene de oynamaz.
 */
export function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  /** Kullanıcı duraklattıysa görünürlük değişse de kendiliğinden başlamaz. */
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && !reduceMotion && !userPaused) {
      video.play().catch(() => {
        /* tarayıcı otomatik oynatmayı engelledi: poster ve oynat düğmesi kalır */
      });
    } else if (!visible) {
      video.pause();
    }
  }, [visible, reduceMotion, userPaused]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    } else {
      setUserPaused(true);
      video.pause();
    }
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (!video.muted && video.paused) {
      setUserPaused(false);
      video.play().catch(() => {});
    }
  }

  // Video her iki temada da açık renkli; düğmeler de temadan bağımsız açık kalır.
  const control =
    "inline-flex size-10 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#2E3532] shadow-[0_6px_16px_-6px_rgb(46_53_50/0.35)] ring-1 ring-[#DFD9D0] backdrop-blur transition-colors duration-200 hover:bg-[#EAF0E7]";

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-surface shadow-[0_40px_80px_-32px_rgb(46_53_50/0.35)] ring-1 ring-line dark:shadow-[0_40px_80px_-32px_rgb(0_0_0/0.6)]",
        className,
      )}
    >
      <img
        src={POSTER}
        width={1080}
        height={1350}
        alt=""
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Klinara tanıtım videosu: online randevu, takvim, WhatsApp hatırlatma, tablette onam ve tedavi planı"
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        className={cn(
          "absolute inset-0 size-full object-cover transition-opacity duration-500 ease-brand",
          started ? "opacity-100" : "opacity-0",
        )}
      >
        <source src="/videos/klinara-promo-720.mp4" type="video/mp4" media="(max-width: 640px)" />
        <source src="/videos/klinara-promo.mp4" type="video/mp4" />
      </video>

      {!started && reduceMotion ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto inline-flex size-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform duration-200 hover:scale-105"
          aria-label="Videoyu oynat"
        >
          <Play className="ml-1 size-7" strokeWidth={2} aria-hidden />
        </button>
      ) : null}

      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className={control}
          aria-label={playing ? "Videoyu duraklat" : "Videoyu oynat"}
          title={playing ? "Duraklat" : "Oynat"}
        >
          {playing ? <Pause className="size-4" strokeWidth={2.2} aria-hidden /> : <Play className="size-4" strokeWidth={2.2} aria-hidden />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          className={control}
          aria-label={muted ? "Sesi aç" : "Sesi kapat"}
          aria-pressed={!muted}
          title={muted ? "Sesi aç" : "Sesi kapat"}
        >
          {muted ? <VolumeX className="size-4" strokeWidth={2.2} aria-hidden /> : <Volume2 className="size-4" strokeWidth={2.2} aria-hidden />}
        </button>
      </div>
    </div>
  );
}
