// app/events/page.tsx

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { usePathname } from "next/navigation"
import { AdminNavbar } from "@/components/navbar"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, PlusCircle, Loader2 } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animations"
import { EventsCalendar, type Event } from "@/components/events-calendar"
import EventGallery from "@/components/event-gallery"
import { toast } from "sonner"

// Admin paneli için yeni bileşen
const AdminPanel = () => {
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        category: "",
        start_at: "",
        location: "",
        cover_image_url: "",
        capacity: 0,
        whatsapp_link: "",
        tags: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setEventData(prevState => ({
            ...prevState,
            [id]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await axios.post("http://127.0.0.1:8000/events", {
                ...eventData,
                // Kapasiteyi sayıya dönüştür
                capacity: Number(eventData.capacity),
                // Etiketleri diziye dönüştür
                tags: eventData.tags.split(",").map(tag => tag.trim()),
            })
            toast.success("Etkinlik başarıyla eklendi!")
            setEventData({
                title: "",
                description: "",
                category: "",
                start_at: "",
                location: "",
                cover_image_url: "",
                capacity: 0,
                whatsapp_link: "",
                tags: "",
            })
        } catch (error) {
            console.error("Etkinlik eklenirken bir hata oluştu:", error)
            toast.error("Etkinlik eklenirken bir hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="container max-w-screen-xl py-12">
                <h1 className="text-3xl font-bold mb-8">Yeni Etkinlik Ekle</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Başlık</Label>
                            <Input id="title" value={eventData.title} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input id="category" value={eventData.category} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea id="description" value={eventData.description} onChange={handleInputChange} rows={4} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start_at">Tarih ve Saat</Label>
                            <Input id="start_at" type="datetime-local" value={eventData.start_at} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Mekan</Label>
                            <Input id="location" value={eventData.location} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="cover_image_url">Kapak Görseli URL</Label>
                            <Input id="cover_image_url" type="url" value={eventData.cover_image_url} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp_link">WhatsApp Grubu Bağlantısı</Label>
                            <Input id="whatsapp_link" type="url" value={eventData.whatsapp_link} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Kapasite</Label>
                            <Input id="capacity" type="number" value={eventData.capacity} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
                            <Input id="tags" value={eventData.tags} onChange={handleInputChange} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="bg-ayzek-gradient hover:opacity-90">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Etkinlik Ekleniyor...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Etkinliği Oluştur
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}

// Ana EventsPage bileşeni
export default function EventsPage() {
    const pathname = usePathname()
    const isAdmin = pathname === "/admin/events"

    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        contact: "",
    })

    const handleEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://127.0.0.1:8000/event-suggestions", eventForm)
            console.log("Event suggestion submitted:", response.data)
            setIsEventModalOpen(false)
            setEventForm({
                title: "",
                description: "",
                contact: "",
            })
            toast.success("Etkinlik öneriniz başarıyla gönderildi!")
        } catch (error) {
            console.error("Event suggestion submission failed:", error)
            toast.error("Etkinlik önerisi gönderilirken bir hata oluştu.")
        }
    }

    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchUpcomingEvents = async () => {
            try {
                setLoading(true)
                const response = await axios.get<any[]>("http://127.0.0.1:8000/events/upcoming")
                const formattedEvents = response.data.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    type: event.category,
                    date: event.start_at,
                    time: event.start_at,
                    duration: "3 saat",
                    location: event.location,
                    image: event.cover_image_url,
                    attendees: event.registered,
                    maxAttendees: event.capacity,
                    registrationLink: event.whatsapp_link,
                    tags: event.tags ? (typeof event.tags === 'string' ? event.tags.split(',') : event.tags) : [],
                }));
                setUpcomingEvents(formattedEvents)
            } catch (err: any) {
                setError(err)
                console.error("Etkinlikler çekilirken bir hata oluştu:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchUpcomingEvents()
    }, [])

    if (isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted theme-transition">
                <AdminNavbar onNotificationsClick={() => setIsNotificationsOpen(true)} />
                <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                <AdminPanel />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted theme-transition">
            {/* Navigation Header */}
            <AdminNavbar onNotificationsClick={() => setIsNotificationsOpen(true)} />

            {/* Notifications Panel */}
            <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

            {/* Hero Section with Background Pattern */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="waves" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M0 10 Q5 5 10 10 T20 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#waves)" />
                    </svg>
                </div>
        <div className="container max-w-screen-xl mx-auto text-center relative z-10">
          <ScrollAnimation animation="fade-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text leading-[1.25] pb-2">
              Topluluk Etkinlikleri
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Teknoloji topluluğumuzu ilham vermeye, eğitmeye ve birbirine bağlamaya yönelik tasarlanmış atölyeler,
              buluşmalar, konferanslar ve hackathonları keşfedin.
            </p>
          </ScrollAnimation>
        </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 px-4">
                <div className="container max-w-screen-xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <ScrollAnimation animation="scale-up" delay={0}>
                            <div className="hover-lift theme-transition rounded-lg p-6 bg-purple-500/90 text-white shadow-lg">
                                <div className="text-3xl font-display font-bold mb-2 animate-float">25+</div>
                                <div className="text-white/90">Bu Yıl Etkinlik</div>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation animation="scale-up" delay={100}>
                            <div className="hover-lift theme-transition rounded-lg p-6 bg-green-500/90 text-white shadow-lg">
                                <div className="text-3xl font-display font-bold mb-2 animate-float" style={{ animationDelay: "0.5s" }}>
                                    500+
                                </div>
                                <div className="text-white/90">Toplam Katılımcı</div>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation animation="scale-up" delay={200}>
                            <div className="hover-lift theme-transition rounded-lg p-6 bg-purple-500/90 text-white shadow-lg">
                                <div className="text-3xl font-display font-bold mb-2 animate-float" style={{ animationDelay: "1s" }}>
                                    5
                                </div>
                                <div className="text-white/90">Mekan Ortağı</div>
                            </div>
                        </ScrollAnimation>
                        <ScrollAnimation animation="scale-up" delay={300}>
                            <div className="hover-lift theme-transition rounded-lg p-6 bg-green-500/90 text-white shadow-lg">
                                <div className="text-3xl font-display font-bold mb-2 animate-float" style={{ animationDelay: "1.5s" }}>
                                    1000+
                                </div>
                                <div className="text-white/90">Öğrenme Saati</div>
                            </div>
                        </ScrollAnimation>
                    </div>
                </div>
            </section>

            {/* Events Calendar */}
            <section className="py-16 px-4">
                <div className="container max-w-screen-xl mx-auto">
                    <ScrollAnimation animation="fade-up" className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold mb-4">Yaklaşan Etkinlikler</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Yaklaşan etkinliklerimize göz atın, türe göre filtreleyin ve en çok ilginizi çekenlere kayıt olun.
                        </p>
                    </ScrollAnimation>
                    <ScrollAnimation animation="fade-up" delay={200}>
                        {loading ? (
                            <p className="text-center text-muted-foreground">Etkinlikler yükleniyor...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">Etkinlikler çekilirken bir hata oluştu.</p>
                        ) : upcomingEvents.length > 0 ? (
                            <EventsCalendar events={upcomingEvents} loading={loading} />
                        ) : (
                            <p className="text-center text-muted-foreground">Şu an için yaklaşan etkinlik bulunmamaktadır.</p>
                        )}
                    </ScrollAnimation>
                </div>
            </section>

            <section className="py-16 px-4 bg-card/30 theme-transition">
                <div className="container max-w-screen-xl mx-auto">
                    <ScrollAnimation animation="fade-up" className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold mb-4">Etkinlik Galerisi</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Geçmiş etkinliklerimizden unutulmaz anlar ve topluluk deneyimlerimizin görsel hikayesi.
                        </p>
                    </ScrollAnimation>
                    <ScrollAnimation animation="fade-up" delay={200}>
                        <EventGallery />
                    </ScrollAnimation>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="container max-w-screen-xl mx-auto text-center">
                    <ScrollAnimation animation="fade-up">
                        <h2 className="text-3xl font-display font-bold mb-4">Etkinlik Düzenlemek İster misiniz?</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Atölye, buluşma veya sunum için bir fikriniz mi var? Bilginizi topluluğumuzla paylaşmanıza yardımcı olmaktan
                            memnuniyet duyarız.
                        </p>
                    </ScrollAnimation>
                    <ScrollAnimation animation="scale-up" delay={200}>
                        <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="text-lg px-8 bg-ayzek-gradient hover:opacity-90">
                                    <Send className="w-5 h-5 mr-2" />
                                    Etkinlik Öner
                                </Button>
                            </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Etkinlik Önerisi Gönder</DialogTitle>
                                <DialogDescription>
                                    Etkinlik fikrinizi bizimle paylaşın. Tüm öneriler değerlendirilir ve size geri dönüş yapılır.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEventSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Etkinlik Başlığı</Label>
                                        <Input
                                            id="title"
                                            value={eventForm.title}
                                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                            placeholder="Örn: React ile Modern Web Geliştirme"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Etkinlik Açıklaması</Label>
                                    <Textarea
                                        id="description"
                                        value={eventForm.description}
                                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                        placeholder="Etkinliğinizin içeriği, hedefleri ve katılımcıların neler öğreneceği hakkında detaylı bilgi verin..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact">İletişim Bilgisi</Label>
                                    <Input
                                        id="contact"
                                        type="email"
                                        value={eventForm.contact}
                                        onChange={(e) => setEventForm({ ...eventForm, contact: e.target.value })}
                                        placeholder="E-posta adresiniz"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <Button type="button" variant="outline" onClick={() => setIsEventModalOpen(false)}>
                                        İptal
                                    </Button>
                                    <Button type="submit" className="bg-ayzek-gradient hover:opacity-90">
                                        <Send className="w-4 h-4 mr-2" />
                                        Önerimi Gönder
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border bg-black/80">
                <div className="container max-w-screen-xl mx-auto">
                    <ScrollAnimation animation="fade-up">
                        <div className="flex flex-col items-center space-y-6">
                        <div className="flex items-center space-x-2">
                            <img src="/ayzek-logo.png" alt="AYZEK" className="w-6 h-6" />
                            <span className="text-xl font-display font-bold text-primary">AYZEK</span>
                        </div>
                        <p className="text-muted-foreground text-center max-w-md">
                            Anılar inşa ediyor, bağlantıları güçlendiriyor ve geleceği birlikte yaratıyoruz.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a
                                href="https://youtube.com/@ayzekselcuk?si=8fbutC3-be5GmIne"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a2.965 2.965 0 0 0-2.087-2.1C19.561 3.5 12 3.5 12 3.5s-7.561 0-9.411.586a2.965 2.965 0 0 0-2.087 2.1A31.05 31.05 0 0 0 .5 12a31.05 31.05 0 0 0 .002 5.814 2.965 2.965 0 0 0 2.087 2.1C4.439 20.5 12 20.5 12 20.5s7.561 0 9.411-.586a2.965 2.965 0 0 0 2.087-2.1A31.05 31.05 0 0 0 23.5 12a31.05 31.05 0 0 0-.002-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                                </svg>
                            </a>
                            <a
                                href="https://www.linkedin.com/company/ayzek/"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="https://github.com/ayzek" className="text-muted-foreground hover:text-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a
                                href="https://www.instagram.com/20ayzek22?igsh=MWJmdDUydHF6d2M4ZA=="
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.072-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <a href="mailto:ayzekselcukuni@gmail.com" className="hover:text-primary transition-colors">
                                ayzekselcukuni@gmail.com
                            </a>
                        </div>
                    </div>
                    </ScrollAnimation>
                </div>
            </footer>
        </div>
    )
}