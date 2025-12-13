"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin } from "lucide-react"
import { api } from "@/lib/api"

type GalleryEvent = {
  id: number
  category: string
  image_url: string
  title: string
  description: string
  date: string
  location: string
  participants?: number | null
}

function fmtTRDate(d: string) {
  const dt = new Date(`${d}T00:00:00`)
  if (Number.isNaN(dt.getTime())) return d
  return dt.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function EventGallery() {
  const [items, setItems] = useState<GalleryEvent[]>([])
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<GalleryEvent[]>("/api/gallery-events")
        if (!alive) return
        const data = [...res.data].sort((a, b) => (a.date < b.date ? 1 : -1))
        setItems(data)
      } catch (e: any) {
        if (alive) setError(e.message || "İstek hatası")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <div>Yükleniyor…</div>
  if (error) return <div className="text-destructive">Hata: {error}</div>
  if (!items.length) return <div className="text-muted-foreground">Henüz galeri yok.</div>

  return (
    <div
      className="
        flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
        md:mx-0 md:px-0 md:overflow-visible md:snap-none
        md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6
      "
      /* iOS overscroll gölge taşmasını azalt */
    >
      {items.map((photo) => (
        <div
          key={photo.id}
          className="
            relative group cursor-pointer
            flex-none w-[85vw] sm:w-[70vw] snap-center
            md:w-auto
          "
          onMouseEnter={() => setHoveredId(photo.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative overflow-hidden rounded-lg aspect-[4/3] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.image_url || "/placeholder.svg"}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Kategori rozeti */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-background/90 text-foreground">
                {photo.category}
              </Badge>
            </div>

            {/* Hover paneli: desktopta görünür, mobilde hover olmadığı için gizli kalır */}
            {hoveredId === photo.id && (
              <div className="absolute inset-0 flex items-end p-0 animate-fade-in">
                <Card
                  className="
                    w-full
                    h-[70%] md:h-[75%]
                    bg-black/80 backdrop-blur
                    border-primary/20
                    pointer-events-auto
                    rounded-t-none md:rounded-t-lg
                  "
                >
                  <CardContent className="p-6 h-full overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-3 text-white">
                      {photo.title}
                    </h3>

                    <p className="text-sm text-white/90 mb-4 line-clamp-5 md:line-clamp-8">
                      {photo.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{fmtTRDate(photo.date)}</span>
                      </div>

                      {typeof photo.participants === "number" && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{photo.participants} kişi</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{photo.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
