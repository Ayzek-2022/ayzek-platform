"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";

type EventItem = {
    id: number;
    slug: string;
    title: string;
    description: string;
    cover_image_url: string;
    start_at: string;
    location: string;
    category: string;
    capacity: number;
    registered: number;
    whatsapp_link: string;
    tags?: string | null;
};

const API = process.env.NEXT_PUBLIC_API_URL as string;

const eventTypes = [
    { id: "all", label: "All Events", color: "bg-gray-500" },
    { id: "workshop", label: "Workshop", color: "bg-blue-500" },
    { id: "meetup", label: "Meetup", color: "bg-green-500" },
    { id: "conference", label: "Conference", color: "bg-purple-500" },
    { id: "hackathon", label: "Hackathon", color: "bg-orange-500" },
];

function normalizeImage(u?: string | null) {
    if (!u) return "/placeholder.svg";
    return u.startsWith("http") ? u : u;
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric", weekday: "long" });
const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

export function EventsCalendar() {
    const [selectedType, setSelectedType] = useState("all");
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEvent, setOpenEvent] = useState<EventItem | null>(null);
    const params = useSearchParams();
    const router = useRouter();

    const getTypeColor = (t: string) => eventTypes.find((x) => x.id === t)?.color || "bg-gray-500";

    useEffect(() => {
        let cancel = false;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API}/events`, { cache: "no-store" });
                let data = await res.json();
                if (!Array.isArray(data)) data = Array.isArray(data?.items) ? data.items : [];
                if (!cancel) setEvents(data as EventItem[]);
            } catch {
                if (!cancel) setEvents([]);
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    useEffect(() => {
        const slug = params.get("open");
        if (!slug) { 
            setOpenEvent(null);
            return;
        }
        (async () => {
            const r = await fetch(`${API}/events/slug/${slug}`, { cache: "no-store" });
            if (r.ok) setOpenEvent(await r.json());
        })();
    }, [params]);

    const filteredEvents = useMemo(() => {
        const list = Array.isArray(events) ? events : [];
        return selectedType === "all" ? list : list.filter((e) => e?.category === selectedType);
    }, [events, selectedType]);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap gap-2 items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Etkinlikler</h2>
                <div className="flex flex-wrap gap-2">
                    {eventTypes.map((t) => (
                        <Button
                            key={t.id}
                            variant={selectedType === t.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedType(t.id)}
                            className="text-xs"
                        >
                            <span className={`w-2 h-2 rounded-full ${t.color} mr-2`} />
                            {t.label}
                        </Button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-muted-foreground">Yükleniyor…</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((e) => {
                        const tags = e.tags ? e.tags.split(",").map((x) => x.trim()) : [];
                        return (
                            <Card key={e.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <CardHeader className="relative overflow-hidden p-0">
                                    <div className="relative h-48">
                                        <img
                                            src={normalizeImage(e.cover_image_url)}
                                            alt={e.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <Badge className={`${getTypeColor(e.category)} text-white border-0`}>
                                                {eventTypes.find((x) => x.id === e.category)?.label ?? e.category}
                                            </Badge>
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <div className="text-sm font-medium">{formatDate(e.start_at)}</div>
                                            <div className="text-xs opacity-90">{formatTime(e.start_at)}</div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <CardTitle className="font-display text-lg mb-2 line-clamp-2">{e.title}</CardTitle>
                                    <CardDescription className="mb-4 line-clamp-2">{e.description}</CardDescription>
                                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{e.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>{e.registered}/{e.capacity} katılımcı</span>
                                        </div>
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {tags.slice(0, 3).map((t) => (
                                                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                            ))}
                                        </div>
                                    )}
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            setOpenEvent(e);
                                            router.replace(`/etkinlikler/${e.slug}`, { scroll: false });
                                        }}
                                    >
                                        Detayları Görüntüle
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Dialog
                open={!!openEvent}
                onOpenChange={(v) => {
                    if (!v) {
                        setOpenEvent(null);
                        router.replace("/etkinlikler", { scroll: false });
                    }
                }}
            >
                <DialogContent className="max-w-2xl">
                    {openEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-display text-2xl">{openEvent.title}</DialogTitle>
                                <DialogDescription className="text-base">{openEvent.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                                <img
                                    src={normalizeImage(openEvent.cover_image_url)}
                                    alt={openEvent.title}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <div className="font-medium">{formatDate(openEvent.start_at)}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Tarih: {new Date(openEvent.start_at).toLocaleDateString("tr-TR")} • Saat: {formatTime(openEvent.start_at)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <span>{formatTime(openEvent.start_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <span>{openEvent.location}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary" />
                                            <div>
                                                <div className="font-medium">{openEvent.registered} katılımcı</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {Math.max(openEvent.capacity - openEvent.registered, 0)} yer kaldı
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button asChild className="flex-1">
                                        <a href={openEvent.whatsapp_link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Şimdi Kaydol
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}