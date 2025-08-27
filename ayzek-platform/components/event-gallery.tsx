"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type GalleryEvent = {
  id: number;
  category: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export function EventGallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery-events`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Etkinlikler alınamadı");
        const data: GalleryEvent[] = await res.json();
        setEvents(data);
      } catch (e: any) {
        setErr(e?.message ?? "Bir şeyler ters gitti");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-white/70">Yükleniyor…</div>;
  if (err) return <div className="text-red-400">Hata: {err}</div>;
  if (!events.length) return <div className="text-white/70">Henüz etkinlik eklenmedi.</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((ev) => {
        const dateStr = (() => {
          try {
            return format(new Date(ev.date), "d MMMM yyyy", { locale: tr });
          } catch {
            return ev.date;
          }
        })();

        return (
          <div
            key={ev.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredId(ev.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <Image
                src={ev.image_url || "/placeholder.svg"}
                alt={ev.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Kategori rozeti */}
              <div className="absolute left-4 top-4">
                <Badge variant="secondary" className="bg-background/90 text-foreground">
                  {ev.category}
                </Badge>
              </div>

              {/* Hover detayları */}
              {hoveredId === ev.id && (
                <div className="absolute inset-0 flex items-end p-6">
                  <Card className="w-full border-primary/20 bg-background/95 backdrop-blur">
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-lg font-semibold">{ev.title}</h3>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {ev.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

