"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Lightbulb, LogOut, FileText, Settings } from "lucide-react";
import { toast } from "react-hot-toast";
import EventsTab, { EventItem, EventSuggestion } from "@/components/admin/admin-etkinlikler";
import ContentManagementTab from "@/components/admin/admin-icerik-yonetim";
import { api } from "@/lib/api";

interface AdminDashboardProps {
  onLogout: () => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventSuggestions, setEventSuggestions] = useState<EventSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientLoaded, setClientLoaded] = useState(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get("/events");
      const formatted: EventItem[] = data.map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        date: new Date(ev.start_at).toISOString().split("T")[0],
        time: new Date(ev.start_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        location: ev.location,
        attendees: ev.registered ?? 0,
        maxAttendees: ev.capacity,
        status: "upcoming",
        tags: ev.tags ? ev.tags.split(",").map((t: string) => t.trim()) : [],
      }));
      setEvents(formatted);
    } catch (e) {
      console.error("Etkinlikler yüklenemedi:", e);
      toast.error("Etkinlikler yüklenirken bir sorun oluştu.");
    }
  }, []);

  const fetchEventSuggestions = useCallback(async () => {
    try {
      const { data } = await api.get<EventSuggestion[]>("/event-suggestions");
      setEventSuggestions(data);
      setError(null);
    } catch (e: any) {
      console.error("Etkinlik önerileri yüklenemedi:", e?.response?.data || e);
      setError("Etkinlik önerileri yüklenemedi. Lütfen API'nin çalıştığından emin olun.");
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchEvents(), fetchEventSuggestions()]);
      setIsLoading(false);
    };
    init();
  }, [fetchEvents, fetchEventSuggestions]);

  const handleEventSuggestionAction = async (id: number, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "accepted" : "rejected";
    try {
      await api.patch(`/event-suggestions/${id}/status`, { status: newStatus });
      fetchEventSuggestions();
      toast.success(action === "approve" ? "Öneri onaylandı" : "Öneri reddedildi");
    } catch (e: any) {
      toast.error(`Güncelleme başarısız: ${e?.response?.data?.detail ?? "Bilinmeyen hata"}`);
    }
  };

  const handleEventSuggestionDelete = async (id: number) => {
    try {
      await api.delete(`/event-suggestions/${id}`);
      fetchEventSuggestions();
      toast.success("Öneri silindi");
    } catch (e: any) {
      toast.error(`Silme başarısız: ${e?.response?.data?.detail ?? "Bilinmeyen hata"}`);
    }
  };
  
  const handleAddEvent = async (payload: {
    title: string;
    description: string;
    image: string;
    date: string;
    time: string;
    location: string;
    maxAttendees: number;
    category: string;
    whatsappLink: string;
    tags: string[];
  }) => {
    try {
      const startAt = `${payload.date}T${payload.time}:00`;
      const base = slugify(payload.title);
      const uniq = `${base}-${Date.now().toString(36)}`;
      const body = {
        title: payload.title,
        description: payload.description,
        cover_image_url: payload.image,
        start_at: startAt,
        location: payload.location,
        category: payload.category,
        capacity: payload.maxAttendees,
        whatsapp_link: payload.whatsappLink,
        slug: uniq,
        tags: payload.tags.join(","),
      };
      const { status, data } = await api.post("/events", body);
      if (status === 201 || status === 200) {
        toast.success("Etkinlik başarıyla eklendi!");
        const newEvent: EventItem = {
          id: data.id,
          title: data.title,
          date: new Date(data.start_at).toISOString().split("T")[0],
          time: new Date(data.start_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          location: data.location,
          attendees: data.registered ?? 0,
          maxAttendees: data.capacity,
          status: "upcoming",
          tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
        };
        setEvents((prev) => [newEvent, ...prev]);
      } else {
        throw new Error("Sunucudan başarılı yanıt dönmedi.");
      }
    } catch (e: any) {
      console.error("Etkinlik eklenirken hata:", e?.response?.data || e);
      toast.error(e?.response?.data?.detail ?? "Etkinlik eklenirken bir sorun oluştu.");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await api.delete(`/events/${eventId}`);
      toast.success("Etkinlik başarıyla silindi!");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (e) {
      console.error("Etkinlik silinirken hata:", e);
      toast.error("Etkinlik silinirken bir sorun oluştu.");
    }
  };

  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
  const pendingSuggestions = eventSuggestions.filter((s) => s.status === "pending").length;

  if (!clientLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between">
          <div className="relative flex items-center h-10 rounded px-3">
            <div className="absolute inset-0 rounded bg-ayzek-gradient" />
            <div className="relative z-10 flex items-center gap-2">
              <img src="/ayzek-logo.png" alt="AYZEK" className="w-7 h-7" />
              <span className="text-white text-lg font-display font-bold tracking-wide">AYZEK</span>
              <span className="text-white/70">•</span>
              <span className="text-white text-lg font-display font-semibold tracking-wide">Yönetici Paneli</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout} 
              className="border-primary/20 hover:bg-primary/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-card/80 to-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Etkinlik</CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {totalEvents}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tüm zamanlar</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/50 border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yaklaşan Etkinlikler</CardTitle>
              <Calendar className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">Planlanmış</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/50 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen Öneriler</CardTitle>
              <Lightbulb className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{pendingSuggestions}</div>
              <p className="text-xs text-muted-foreground mt-1">İnceleme bekliyor</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card/50 border border-primary/10">
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Etkinlikler
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              İçerik Yönetimi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Yükleniyor...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
              <EventsTab 
                events={events} 
                suggestions={eventSuggestions}
                onAdd={handleAddEvent} 
                onDelete={handleDeleteEvent}
                onSuggestionAction={handleEventSuggestionAction}
                onSuggestionDelete={handleEventSuggestionDelete}
              />
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
