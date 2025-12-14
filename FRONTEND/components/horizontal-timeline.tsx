"use client"

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineEvent {
  id: number
  title: string
  description: string
  category: string
  date_label: string
  image_url: string
}

export function HorizontalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [centeredMode, setCenteredMode] = useState<boolean>(true)

  // layout measurement
  const [stepPx, setStepPx] = useState<number>(416)
  const [centerOffsetPx, setCenterOffsetPx] = useState<number>(0)
  const [itemWidthPx, setItemWidthPx] = useState<number>(0)
  const [padLeftPx, setPadLeftPx] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/timeline")
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data: TimelineEvent[] = await response.json()
        setTimelineEvents(data)
      } catch (e: any) {
        setError("Veriler yüklenirken bir hata oluştu: " + e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Measure step (distance between items), padding-left, and perfect center offset
  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const measure = () => {
      const items = Array.from(track.querySelectorAll<HTMLElement>("[data-timeline-item]"))
      if (items.length === 0) return

      const item0 = items[0]
      const itemWidth = item0.offsetWidth // ignore transforms

      const cs = window.getComputedStyle(track)
      const padLeft = parseFloat(cs.paddingLeft || "0") || 0

      let step = itemWidth + 32
      if (items.length > 1) {
        step = items[1].offsetLeft - items[0].offsetLeft
      }

      // Center offset should account for track padding-left
      const centerOffset = container.clientWidth / 2 - itemWidth / 2 - padLeft

      setItemWidthPx(itemWidth)
      setPadLeftPx(padLeft)
      setStepPx(step)
      setCenterOffsetPx(centerOffset)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [timelineEvents.length])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    isDraggingRef.current = true
    el.setPointerCapture(e.pointerId)
    startXRef.current = e.clientX
    setDragOffset(0)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - startXRef.current
    // clamp so it feels controlled
    const clamped = Math.max(-220, Math.min(220, dx))
    setDragOffset(clamped)
  }, [])

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = containerRef.current
      if (!el) return
      if (!isDraggingRef.current) return

      isDraggingRef.current = false
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}

      const threshold = 70

      if (dragOffset > threshold) {
        setActiveIndex((prev) => Math.max(0, prev - 1))
      } else if (dragOffset < -threshold) {
        setActiveIndex((prev) => Math.min(timelineEvents.length - 1, prev + 1))
      }

      setDragOffset(0)
    },
    [dragOffset, timelineEvents.length]
  )

  const baseTranslate = useMemo(() => {
    // First render: left-focused (no centerOffset). After first swipe: centered.
    const base = centeredMode ? centerOffsetPx : 0
    return base - activeIndex * stepPx
  }, [centeredMode, centerOffsetPx, activeIndex, stepPx])

  // A stronger tilt while dragging ("devrilme")
  const tiltDeg = useMemo(() => {
    // max about 18deg
    return (dragOffset / 260) * 18
  }, [dragOffset])

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-lg text-gray-500">Yükleniyor...</div>
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-lg text-red-500">Hata: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative py-0 overflow-hidden">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          className="relative w-full overflow-hidden pb-6 md:pb-8 cursor-grab active:cursor-grabbing select-none touch-pan-x"
          // Hide the far-right extra silhouette peek
          style={{
            WebkitMaskImage: "linear-gradient(to right, black 0%, black 96%, transparent 100%)",
            maskImage: "linear-gradient(to right, black 0%, black 96%, transparent 100%)",
          }}
        >
          {timelineEvents.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-lg text-gray-400">Henüz zaman çizelgesi verisi bulunmamaktadır.</div>
          ) : (
            <div className="relative">
              <div className="relative z-20 w-full">
                <div
                  ref={trackRef}
                  className="relative z-10 flex gap-3 px-4 md:gap-8 md:px-16 w-max transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(${baseTranslate + dragOffset}px)`,
                  }}
                >
                  {/* Timeline line INSIDE the moving track (interactive) */}
                  <div
                    className="pointer-events-none absolute top-1/2 h-1 bg-ayzek-gradient rounded-full -translate-y-1/2 shadow-lg opacity-30"
                    style={{
                      left: padLeftPx + itemWidthPx / 2,
                      width: Math.max(0, (timelineEvents.length - 1) * stepPx),
                      zIndex: -1,
                    }}
                  />

                  {timelineEvents.map((event, index) => {
                    const dist = Math.abs(index - activeIndex)
                    const arcY = Math.min(48, dist * 18)

                    // Slight tilt effect distributed: active tilts with drag, sides tilt less
                    const localTilt = dist === 0 ? tiltDeg : tiltDeg * 0.55

                    return (
                      <div
                        key={event.id}
                        data-timeline-item
                        style={{
                          translate: `0px ${arcY}px`,
                          rotate: `${localTilt}deg`,
                        }}
                        className={
                          "relative flex-shrink-0 w-[46vw] sm:w-[45vw] md:w-[384px] transition-all duration-500 ease-out will-change-transform " +
                          (activeIndex === index
                            ? "scale-[1.12] md:scale-[1.18] opacity-100 z-20"
                            : "scale-[0.82] md:scale-[0.86] opacity-100 z-10")
                        }
                      >
                        <Card
                          className={
                            "w-full shadow-2xl border-2 border-primary/20 bg-background transition-all duration-500 mt-10 md:mt-12 " +
                            (activeIndex === index ? "" : "blur-[3px]")
                          }
                        >
                          <CardHeader className="relative overflow-hidden p-0">
                            <div className="relative h-40 md:h-48">
                              <img src={event.image_url || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="p-3 md:p-4 pb-3 md:pb-4">
                              <div className="flex items-center justify-between mb-2 md:mb-3">
                                <CardTitle className="font-display text-sm md:text-xl leading-snug md:leading-normal">{event.title}</CardTitle>
                                <span className="text-[10px] md:text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                                  {event.date_label}
                                </span>
                              </div>
                              <CardDescription className="text-xs md:text-sm leading-relaxed">{event.description}</CardDescription>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
