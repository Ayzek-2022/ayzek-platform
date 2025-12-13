"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Poster = {
  id: number;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  image_url?: string | null;
  is_active: boolean;
  order_index: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

function buildImgSrc(raw?: string | null) {
  if (!raw) return "/ayzek-logo.png";
  const url = raw.trim();
  if (url.startsWith("/public/")) return url.replace(/^\/?public\//, "/");
  if (url.startsWith("/")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}/${url.replace(/^\/+/, "")}`;
}

export function AutoSlidingBanner() {
  const [slides, setSlides] = useState<Poster[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // drag/swipe
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/posters?active=true&limit=20`, {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!r.ok) throw new Error(`posters fetch failed: ${r.status}`);
        const d: Poster[] = await r.json();
        if (!cancelled && !ac.signal.aborted) setSlides(d);
      } catch (err: any) {
        if (err?.name !== "AbortError") console.error(err);
      }
    })();
    return () => {
      cancelled = true;
      try { ac.abort(); } catch {}
    };
  }, []);

  const activeSlides = useMemo(
    () => slides.filter((s) => s.is_active !== false),
    [slides]
  );

  useEffect(() => {
    if (!activeSlides.length) return;
    setCurrent((p) => Math.min(p, activeSlides.length - 1));
  }, [activeSlides.length]);

  useEffect(() => {
    if (!activeSlides.length || isPaused || dragging) return;
    const t = setInterval(
      () => setCurrent((p) => (p + 1) % activeSlides.length),
      5000
    );
    return () => clearInterval(t);
  }, [activeSlides.length, isPaused, dragging]);

  const pauseForManualNav = () => {
    setIsPaused(true);
    // kısa süre duraklat, sonra otomatiğe izin ver
    setTimeout(() => setIsPaused(false), 1500);
  };

  const goToNext = () => {
    if (!activeSlides.length) return;
    pauseForManualNav();
    setCurrent((p) => Math.min(p + 1, activeSlides.length - 1));
  };
  const goToPrev = () => {
    if (!activeSlides.length) return;
    pauseForManualNav();
    setCurrent((p) => Math.max(p - 1, 0));
  };
  const goToSlide = (i: number) => {
    if (!activeSlides.length) return;
    pauseForManualNav();
    setCurrent(Math.max(0, Math.min(i, activeSlides.length - 1)));
  };

  // --- swipe/drag handlers (pointer events) ---
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    // sadece sol tık/primary veya touch
    if (e.button !== 0 && e.pointerType === "mouse") return;
    startX.current = e.clientX;
    deltaX.current = 0;
    setDragging(true);
    setIsPaused(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    deltaX.current = e.clientX - startX.current;
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const dx = deltaX.current;
    setDragging(false);
    setIsPaused(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    const THRESH = 48; // sürükleme eşiği ~48px
    if (Math.abs(dx) >= THRESH) {
      if (dx < 0) goToNext();
      else goToPrev();
    }
    deltaX.current = 0;
  };

  if (!activeSlides.length) {
    return <div className="h-[500px] md:h-[600px] rounded-xl bg-muted/40" />;
  }

  return (
    <div
      ref={wrapRef}
      className={[
        "relative w-full h-[360px] sm:h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-lg md:rounded-xl",
        "bg-gradient-to-r from-primary/10 to-accent/10",
        // drag sırasında seçim olmasın; dikey kaydırma engellenmesin
        dragging ? "select-none" : "",
        "touch-pan-y",
      ].join(" ")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !dragging && setIsPaused(false)}
      // drag / swipe
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {activeSlides.map((slide) => {
          const imgSrc = buildImgSrc(slide.image_url);
          return (
            <div
              key={slide.id}
              className="relative w-full h-full flex-shrink-0 flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-background/20 z-10" />
              <img
                src={imgSrc}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/ayzek-logo.png";
                }}
              />

              <div className="relative z-20 container max-w-screen-xl mx-auto px-4">
                <div className="max-w-2xl animate-fade-in">
                  {slide.subtitle && (
                    <h2 className="text-[11px] md:text-sm font-medium text-primary mb-1 md:mb-2 tracking-wide uppercase">
                      {slide.subtitle}
                    </h2>
                  )}
                  <h1 className="text-2xl sm:text-3xl md:text-6xl font-display font-bold mb-3 md:mb-6 text-foreground leading-tight max-w-[92vw] md:max-w-none">
                    {slide.title}
                  </h1>
                  {slide.content && (
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed md:leading-7 max-w-[92vw] md:max-w-2xl">
                      {slide.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Silüet oklar (dolgusuz, sadece kontur). Her zaman görünür, sınırda disable. */}
      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Önceki"
            disabled={current === 0}
            className={[
              "absolute left-3 top-1/2 -translate-y-1/2 z-30",
              "inline-flex items-center justify-center w-11 h-11 rounded-full",
              "bg-transparent border border-white/35 hover:border-white/80",
              "backdrop-blur-0",
              "transition focus:outline-none focus:ring-2 focus:ring-white/40",
              current === 0 ? "opacity-50 cursor-not-allowed" : "",
            ].join(" ")}
          >
            <ChevronLeft className="w-6 h-6 text-white/80" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Sonraki"
            disabled={current === activeSlides.length - 1}
            className={[
              "absolute right-3 top-1/2 -translate-y-1/2 z-30",
              "inline-flex items-center justify-center w-11 h-11 rounded-full",
              "bg-transparent border border-white/35 hover:border-white/80",
              "backdrop-blur-0",
              "transition focus:outline-none focus:ring-2 focus:ring-white/40",
              current === activeSlides.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "",
            ].join(" ")}
          >
            <ChevronRight className="w-6 h-6 text-white/80" />
          </button>
        </>
      )}

      {/* Nokta göstergeleri */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-primary scale-125" : "bg-background/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
