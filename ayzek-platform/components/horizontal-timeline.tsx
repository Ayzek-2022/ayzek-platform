"use client";

import { useRef, useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Frontend'in beklediği veri yapısı
type TimelineEventDTO = {
    id: number | string;
    title: string;
    description: string;
    category: string;
    date_label: string;
    image_url: string;
};

// UI için formatlanmış veri yapısı
type TimelineEventUI = {
    id: number | string;
    title: string;
    description: string;
    category: string;
    date: string;
    image: string;
    color: string;
    position: number;
};

const CATEGORY_COLORS: Record<string, string> = {
    "Kilometre Taşı": "bg-ayzek-gradient",
    "Başarı": "bg-gradient-to-r from-yellow-400 to-orange-500",
    "Eğitim": "bg-gradient-to-r from-purple-500 to-pink-500",
    "Etkinlik": "bg-gradient-to-r from-green-500 to-teal-500",
    "Proje": "bg-gradient-to-r from-blue-500 to-cyan-500",
    "Kuruluş": "bg-gradient-to-r from-purple-500 to-pink-500",
    default: "bg-gradient-to-r from-indigo-500 to-purple-600",
};

// Görsel URL'ini normalleştiren yardımcı fonksiyon
function normalizeImage(u?: string) {
    if (!u) return "/placeholder.svg";
    if (u.startsWith("http")) return u;
    return "/" + u.replace(/^\/+/, "");
}

// Tarih etiketini sıralama için sayıya çeviren yardımcı fonksiyon
const TR_MONTHS: Record<string, number> = {
    ocak: 0, şubat: 1, mart: 2, nisan: 3, mayıs: 4, haziran: 5,
    temmuz: 6, ağustos: 7, eylül: 8, ekim: 9, kasım: 10, aralık: 11,
};
function toTime(d: string): number {
    const iso = Date.parse(d);
    if (!Number.isNaN(iso)) return iso;
    const p = d.trim().split(/\s+/);
    if (p.length === 2) {
        const m = TR_MONTHS[p[0].toLowerCase()];
        const y = parseInt(p[1], 10);
        if (m !== undefined && !Number.isNaN(y)) return new Date(y, m, 1).getTime();
    }
    return 0;
}

// API URL'ini ortam değişkeninden al, yoksa varsayılanı kullan
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function HorizontalTimeline() {
    // Düzeltildi: HTMLDivElement olarak tanımlandı
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<TimelineEventUI[]>([]);
    const [loading, setLoading] = useState(true);

    // Veriyi çekme işlemi
    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/timeline`, {
                    cache: "no-store",
                    headers: { accept: "application/json" },
                });

                if (!res.ok) {
                    throw new Error("Timeline verileri yüklenemedi.");
                }

                const data: TimelineEventDTO[] = await res.json();
                
                // Gelen verideki ID'leri benzersiz yapıp tarihe göre sırala
                const uniq = Array.from(new Map(data.map(d => [String(d.id), d])).values());
                uniq.sort((a, b) => toTime(b.date_label) - toTime(a.date_label));

                const mapped: TimelineEventUI[] = uniq.map((e, i) => ({
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    category: e.category,
                    date: e.date_label,
                    image: normalizeImage(e.image_url),
                    color: CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS.default,
                    position: i,
                }));

                if (!cancel) setItems(mapped);
            } catch (e) {
                console.error("Timeline verisi çekilirken hata oluştu:", e);
                if (!cancel) setItems([]);
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    // Scroll animasyonu için useRef
    useEffect(() => {
        const c = scrollContainerRef.current;
        if (!c) return;
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => { ticking = false; });
            }
        };
        c.addEventListener("scroll", onScroll);
        return () => c.removeEventListener("scroll", onScroll);
    }, []);

    // Veri yükleniyor veya boşsa
    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="text-muted-foreground">Yükleniyor...</span>
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="text-muted-foreground">Henüz zaman kapsülü verisi bulunmuyor.</span>
            </div>
        );
    }
    
    // Bileşenin ana gövdesi
    return (
        <div className="space-y-8">
            <div className="relative py-0 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                </div>

                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scrollbar-hide pb-8 scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollBehavior: "smooth" }}
                >
                    <div className="flex gap-8 px-16 min-w-max relative">
                        <div className="absolute top-1/2 left-16 right-16 h-1 bg-ayzek-gradient rounded-full -translate-y-1/2 z-0 shadow-lg opacity-60" />
                        {items.map((event) => (
                            <div key={event.id} className="relative flex-shrink-0 w-96 z-10">
                                <Card className="w-full shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur hover:shadow-3xl transition-all duration-500 hover:scale-105 mt-20">
                                    <CardHeader className="relative overflow-hidden p-0">
                                        <div className="relative h-48">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                                                    {event.category}
                                                </Badge>
                                            </div>
                                            <div className={`absolute bottom-4 right-4 w-3 h-3 rounded-full ${event.color} shadow-lg`} />
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        <div className="p-4 pb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <CardTitle className="font-display text-xl">{event.title}</CardTitle>
                                                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                                    {event.date}
                                                </span>
                                            </div>
                                            <CardDescription className="text-sm leading-relaxed">{event.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-primary/20 shadow-lg">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs text-muted-foreground font-medium">Yatay kaydırarak keşfedin</span>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}