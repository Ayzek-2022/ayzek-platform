"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  date_label: string;
  image_url: string;
}

export function HorizontalTimeline() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { ticking = false })
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-lg text-gray-500">Yükleniyor...</div>
  }
  if (error) {
    return <div className="flex justify-center items-center h-64 text-lg text-red-500">Hata: {error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="relative py-0 overflow-hidden">
        {/* Kenar gradientleri: mobilde kapalı */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

        {/* Arkaplan efekt (ince), mobilde opaklığı az */}
        <div className="absolute inset-0 opacity-5 md:opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        {/* Timeline Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-6 md:pb-8 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollBehavior: "smooth" }}
        >
          {timelineEvents.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-lg text-gray-400">
              Henüz zaman çizelgesi verisi bulunmamaktadır.
            </div>
          ) : (
            <div className="relative">
              {/* Çizgi – paddingle uyumlu; mobilde daha dar kenar boşluğu */}
              <div className="absolute top-1/2 left-4 right-4 md:left-16 md:right-16 h-1 bg-ayzek-gradient rounded-full -translate-y-1/2 z-0 shadow-lg opacity-60" />

              {/* İç şerit */}
              <div className="flex gap-3 px-4 md:gap-8 md:px-16 min-w-max relative z-10">
                {timelineEvents.map((event) => (
                  <div
                    key={event.id}
                    className="relative flex-shrink-0 w-[46vw] sm:w-[45vw] md:w-96"
                  >
                    <Card className="w-full shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur hover:shadow-3xl transition-all duration-500 hover:scale-105 mt-16 md:mt-20">
                      <CardHeader className="relative overflow-hidden p-0">
                        <div className="relative h-40 md:h-48">
                          <img
                            src={event.image_url || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-3 left-3 md:top-4 md:left-4">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur text-[10px] md:text-xs">
                              {event.category}
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-ayzek-gradient shadow-lg" />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="p-3 md:p-4 pb-3 md:pb-4">
                          <div className="flex items-center justify-between mb-2 md:mb-3">
                            <CardTitle className="font-display text-sm md:text-xl leading-snug md:leading-normal">
                              {event.title}
                            </CardTitle>
                            <span className="text-[10px] md:text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                              {event.date_label}
                            </span>
                          </div>
                          <CardDescription className="text-xs md:text-sm leading-relaxed">
                            {event.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
