"use client"

import { useMemo, useRef, useEffect, useLayoutEffect, useState, UIEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- YENİ EKLENEN KISIMLAR ---
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000"

function normalizeImageUrl(v: string) {
  const s = (v || "").trim()
  if (!s) return ""

  // 1. Eğer tam bir http linki ise dokunma
  if (s.startsWith("http://") || s.startsWith("https://")) return s

  // 2. Başında slash yoksa ekle
  const path = s.startsWith("/") ? s : `/${s}`

  // 3. Backend'den gelen dosya ise
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) {
     return `${API_BASE}${path}`
  }

  // 4. Diğer durumlar
  return path
}
// -----------------------------

type Leader = {
  id: string | number
  name: string
  role: string
  avatar?: string
  about?: string
}

type YearSlide = {
  year: number
  leaders: Leader[]
}

function PersonCard({ leader }: { leader: Leader }) {
  return (
    <Card className="bg-white/90 dark:bg-black/70 border border-black/10 dark:border-white/10 backdrop-blur-sm transition-shadow hover:shadow-lg">
      <CardHeader className="text-center p-2.5 sm:p-3 md:p-4">
        <img
          // --- DEĞİŞİKLİK: normalizeImageUrl kullanıldı ---
          src={normalizeImageUrl(leader.avatar || "") || "/placeholder.svg"}
          alt={leader.name}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mx-auto mb-2 sm:mb-2.5 md:mb-3 object-cover"
        />
        <CardTitle className="font-display text-xs sm:text-sm md:text-base lg:text-lg leading-tight">{leader.name}</CardTitle>
        <p className="text-[10px] sm:text-xs text-muted-foreground">{leader.role}</p>
      </CardHeader>
      {leader.about && (
        <CardContent className="pt-0 px-2.5 pb-3 sm:px-3 sm:pb-4 md:px-4">
          <p className="text-[10px] sm:text-xs md:text-sm text-center italic line-clamp-2">"{leader.about}"</p>
        </CardContent>
      )}
    </Card>
  )
}

export function CommunityJourney() {
  const [slides, setSlides] = useState<YearSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [phase, setPhase] = useState(0)
  const centersRef = useRef<number[]>([])
  
  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        // --- DEĞİŞİKLİK: API_BASE kullanıldı ---
        const response = await fetch(`${API_BASE}/journey/`);
        if (!response.ok) throw new Error("Veriler alınamadı. Sunucu yanıt vermiyor.");
        const dataFromBackend: Record<string, any[]> = await response.json();

        const formattedSlides: YearSlide[] = Object.entries(dataFromBackend)
          .map(([year, leaders]) => ({
            year: parseInt(year, 10),
            leaders: (leaders as any[]).map(leader => ({
              id: leader.id,
              name: leader.name,
              role: leader.role,
              avatar: leader.photo_url,
              about: leader.description,
            })),
          }))
          .sort((a, b) => a.year - b.year);

        if (formattedSlides.length === 0) {
          setSlides([]);
        } else {
          setSlides(formattedSlides);
          const currentYear = new Date().getFullYear();
          let initialIndex = formattedSlides.findIndex(s => s.year === currentYear);
          if (initialIndex === -1) initialIndex = formattedSlides.length - 1;
          setActiveIdx(initialIndex);
        }
      } catch (err: any) {
        setError(err.message);
        console.error("CommunityJourney fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  useEffect(() => {
    if (isLoading || slides.length === 0) return;
    const el = containerRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    if (items.length === 0) return;

    centersRef.current = items.map(it => it.offsetLeft + it.clientWidth / 2);
    const child = items[activeIdx];
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "instant" as ScrollBehavior });
  }, [isLoading, slides, activeIdx]);

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"))
    centersRef.current = items.map(it => it.offsetLeft + it.clientWidth / 2)
  })

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const center = el.scrollLeft + el.clientWidth / 2
    setScrollLeft(el.scrollLeft)

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"))
    const centers = items.map(it => it.offsetLeft + it.clientWidth / 2)

    let best = 0
    let bestDist = Infinity
    centers.forEach((c, i) => {
      const d = Math.abs(c - center)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    setActiveIdx(best)

    let ph = 0
    const cur = centers[best]
    const prev = centers[best - 1]
    const next = centers[best + 1]
    if (next !== undefined) {
      const span = Math.max(1, Math.abs(next - cur))
      ph = (center - cur) / span
    } else if (prev !== undefined) {
      const span = Math.max(1, Math.abs(cur - prev))
      ph = (center - cur) / span
    }
    ph = Math.max(-1, Math.min(1, ph))
    setPhase(ph)
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
    }
  }

  const go = (dir: -1 | 1) => {
    const next = Math.min(Math.max(activeIdx + dir, 0), slides.length - 1)
    const el = containerRef.current
    if (!el) return
    const child = el.querySelectorAll<HTMLElement>("[data-slide]")[next]
    if (!child) return
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2
    el.scrollTo({ left, behavior: "smooth" })
    setActiveIdx(next)
  }

  if (isLoading) return <div className="text-center py-20">Zaman Çizelgesi yükleniyor...</div>
  if (error) return <div className="text-center py-20 text-red-500">Hata: {error}</div>
  if (slides.length === 0) return <div className="text-center py-20 text-muted-foreground">Gösterilecek 'Yolculuğumuz' verisi bulunamadı.</div>

  const currentYear = slides[activeIdx]?.year ?? slides[0]?.year;
  const leftEmph = Math.max(0, -phase)
  const rightEmph = Math.max(0, phase)

  return (
    <section className="relative py-10 sm:py-12 md:py-16">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 px-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 sm:mb-3 md:mb-4 gradient-text">Zaman Çizelgemiz</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
          AYZEK'i teknoloji meraklıları ve yenilikçiler için canlı bir topluluk haline getiren tutkulu bireylerdir.
        </p>
      </div>

      {/* timeline bar ve yıl balonları */}
      <div className="relative h-16 mb-8">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] opacity-60"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(59,130,246,0.55) 0 32px, transparent 32px 64px)",
            backgroundPosition: `${-scrollLeft * 0.5}px 0`,
          }}
        />
        <div
          aria-hidden
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[6px] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(59,130,246,0.35) 0 16px, transparent 16px 80px)",
            borderRadius: "9999px",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            backgroundPosition: `${-scrollLeft * 0.25}px 0`,
          }}
        />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-primary/40" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 sm:-top-2.5 md:-top-3">
          <div className="px-4 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-base sm:text-lg md:text-xl font-bold shadow-lg border border-white/20">
            {currentYear}
          </div>
        </div>
        {slides[activeIdx - 1] && (
          <div
            className="absolute top-1/2 -translate-y-1/2 left-[12%] sm:left-[14%] md:left-[16%]"
            style={{ transform: `translateY(-50%) translateX(${(phase < 0 ? -phase : 0) * 40}px)` }}
          >
            <div
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-lg sm:rounded-xl border bg-background/80 backdrop-blur font-medium text-primary shadow-sm transition-all duration-200 text-xs sm:text-sm md:text-base"
              style={{ opacity: 0.6 + leftEmph * 0.4, transform: `scale(${0.9 + leftEmph * 0.15})` }}
            >
              {slides[activeIdx - 1].year}
            </div>
          </div>
        )}
        {slides[activeIdx + 1] && (
          <div
            className="absolute top-1/2 -translate-y-1/2 right-[12%] sm:right-[14%] md:right-[16%]"
            style={{ transform: `translateY(-50%) translateX(${(phase > 0 ? -phase : 0) * -40}px)` }}
          >
            <div
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-lg sm:rounded-xl border bg-background/80 backdrop-blur font-medium text-primary shadow-sm transition-all duration-200 text-xs sm:text-sm md:text-base"
              style={{ opacity: 0.6 + rightEmph * 0.4, transform: `scale(${0.9 + rightEmph * 0.15})` }}
            >
              {slides[activeIdx + 1].year}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <Button
          variant="secondary"
          size="icon"
          className="hidden md:flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 rounded-full shadow transition-transform hover:scale-105 active:scale-95 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
          onClick={() => go(-1)}
          aria-label="Önceki yıl"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="hidden md:flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 rounded-full shadow transition-transform hover:scale-105 active:scale-95 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10"
          onClick={() => go(1)}
          aria-label="Sonraki yıl"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <div
          ref={containerRef}
          onScroll={onScroll}
          onWheel={onWheel}
          className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex min-w-full">
            {slides.map((s) => (
              <div
                key={s.year}
                data-slide
                className="snap-center shrink-0 w-full px-1.5 sm:px-2 md:px-4 lg:px-6"
              >
                {/* MOBİL: tek satırda 2 kart | MD+: eskisi gibi 3 sütun */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 lg:gap-6">
                  {s.leaders.map(ld => (
                    <PersonCard key={ld.id} leader={ld} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-3 sm:mt-4 text-center text-[10px] sm:text-xs text-muted-foreground md:hidden px-2">
          Yıllar arasında gezinmek için yana kaydırın.
        </p>
      </div>
    </section>
  )
}