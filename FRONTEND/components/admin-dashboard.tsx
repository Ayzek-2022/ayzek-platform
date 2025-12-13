"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, CheckCircle, Clock, Lightbulb, LogOut, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import ApplicationsTab, { Application } from "@/components/admin-basvurular";
import EventsTab, { EventItem } from "@/components/admin-etkinlikler";
import ContentManagementTab from "@/components/admin-icerik-yonetim";
import EventSuggestionsTab, { EventSuggestion } from "@/components/admin-etkinlik-onerileri";
import { api } from "@/lib/api";

interface AdminDashboardProps {
  onLogout: () => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventSuggestions, setEventSuggestions] = useState<EventSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DÜZENLEME: Saat formatlama işlemini sadece client'ta yapmak için bir state eklendi.
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
        // DÜZENLEME: Saat formatlaması client tarafına taşındı. 
        // Burada sadece ham tarih tutuluyor.
        time: new Date(ev.start_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }), // "tr-TR" yerine "en-GB" (HH:mm) formatı kullanıldı
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

  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await api.get<Application[]>("/community/applications", { params: { limit: 500 } });
      setApplications(data);
    } catch (e) {
      console.error("Başvurular yüklenemedi:", e);
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
      await Promise.all([fetchApplications(), fetchEvents(), fetchEventSuggestions()]);
      setIsLoading(false);
    };
    init();
  }, [fetchApplications, fetchEvents, fetchEventSuggestions]);

  const handleApplicationAction = async (id: number, action: "accepted" | "rejected" | "reviewed") => {
    try {
      await api.patch(`/community/applications/${id}/status`, { status: action });
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } as Application : a)));
    } catch (e: any) {
      alert(`Durum güncellenemedi: ${e?.response?.data?.detail ?? "Bilinmeyen hata"}`);
    }
  };

  const handleEventSuggestionAction = async (id: number, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "accepted" : "rejected";
    try {
      await api.patch(`/event-suggestions/${id}/status`, { status: newStatus });
      fetchEventSuggestions();
    } catch (e: any) {
      alert(`Güncelleme başarısız: ${e?.response?.data?.detail ?? "Bilinmeyen hata"}`);
    }
  };

  const handleEventSuggestionDelete = async (id: number) => {
    try {
      await api.delete(`/event-suggestions/${id}`);
      fetchEventSuggestions();
    } catch (e: any) {
      alert(`Silme başarısız: ${e?.response?.data?.detail ?? "Bilinmeyen hata"}`);
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

  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const approvedCount = applications.filter((a) => a.status === "accepted").length;
  const totalEvents = events.length;
  const upcomingEvents = events.filter((e) => e.status === "upcoming").length;
  const pendingSuggestions = eventSuggestions.filter((s) => s.status === "pending").length;

  // DÜZENLEME: Eğer client yüklenmediyse, null render ederek hydration hatasını önle.
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
            <Button variant="outline" size="sm" onClick={onLogout} className="border-primary/20 hover:bg-primary/10 bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-card/50 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bekleyen Başvurular</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">İnceleme bekliyor</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Onaylanan Üyeler</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
                    <p className="text-xs text-muted-foreground">Aktif topluluk üyeleri</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Etkinlik</CardTitle>
                    <Calendar className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-accent">{totalEvents}</div>
                    <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Yaklaşan Etkinlikler</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">{upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">Sonraki 30 gün</p>
                </CardContent>
            </Card>

            <Card className="bg-card/50 border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Etkinlik Önerileri</CardTitle>
                    <Lightbulb className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{pendingSuggestions}</div>
                    <p className="text-xs text-muted-foreground">Bekleyen öneriler</p>
                </CardContent>
            </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="applications">Başvurular</TabsTrigger>
            <TabsTrigger value="events">Etkinlikler</TabsTrigger>
            <TabsTrigger value="content">İçerik Yönetimi</TabsTrigger>
            <TabsTrigger value="suggestions">Etkinlik Önerileri</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTab applications={applications} onAction={handleApplicationAction} />
            <div className="flex justify-end">
              <Button variant="outline" onClick={fetchApplications}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                Yenile
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsTab events={events} onAdd={handleAddEvent} onDelete={handleDeleteEvent} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentManagementTab />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button onClick={fetchEventSuggestions} disabled={isLoading} variant="outline" className="flex items-center gap-2">
                <RefreshCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Yenile
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center text-muted-foreground py-10">Yükleniyor...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">{error}</div>
            ) : (
              <EventSuggestionsTab suggestions={eventSuggestions} onAction={handleEventSuggestionAction} onDelete={handleEventSuggestionDelete} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}