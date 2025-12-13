"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { AutoSlidingBanner } from "@/components/anasayfa-poster";
import { ScrollAnimation } from "@/components/scroll-animations";
import { ParallaxSection } from "@/components/parallax-section";
import { HorizontalTimeline } from "@/components/horizontal-timeline";
import EventGallery from "@/components/event-gallery";
import { AdminNavbar } from "@/components/navbar";
import { NotificationsPanel } from "@/components/notifications-panel";
import { InlineEditWrapper } from "@/components/admin-inline-edit-wrapper";
import { ContentEditModal } from "@/components/content-edit-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, Rocket, ArrowRight, Eye, MapPin, ExternalLink } from "lucide-react";
import { VisitorFeedback } from "@/components/visitor-feedback";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Takım verisi için net bir tip tanımı
interface FeaturedTeam {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
}

export default function HomePage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Etkinlikler için state'ler
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  // Öne çıkan takımlar için state'ler
  const [featuredTeams, setFeaturedTeams] = useState<FeaturedTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Saat -> "23.30" formatı
  const formatTime = (value: string) => {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d
        .toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false })
        .replace(":", ".");
    }
    const m = String(value).match(/^(\d{1,2}):(\d{2})/);
    if (m) return `${m[1]}.${m[2]}`;
    return String(value);
  };

  // Etkinlikleri çeken useEffect
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/events/upcoming");
        setUpcomingEvents(response.data);
      } catch (err: any) {
        setError(err);
        console.error("Etkinlikler çekilirken bir hata oluştu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);
  
  // Öne çıkan takımları çeken useEffect
  useEffect(() => {
    const fetchFeaturedTeams = async () => {
      try {
        setTeamsLoading(true);
        const response = await axios.get("http://127.0.0.1:8000/teams/featured");
        
        const formattedTeams: FeaturedTeam[] = response.data.map((team: any) => ({
          id: team.id,
          name: team.name,
          logoUrl: team.photo_url,
          code: `YZT | ${team.name.toUpperCase()}`,
        }));
        
        setFeaturedTeams(formattedTeams);

      } catch (err: any) {
        setTeamsError(err);
        console.error("Öne çıkan takımlar çekilirken bir hata oluştu:", err);
      } finally {
        setTeamsLoading(false);
      }
    };
    fetchFeaturedTeams();
  }, []);

  // Statik veriler
  const [stats, setStats] = useState([
    { value: "150+", label: "Topluluk Üyesi", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { value: "25+", label: "Düzenlenen Etkinlik", color: "bg-gradient-to-r from-green-500 to-green-600" },
    { value: "10+", label: "Tamamlanan Proje", color: "bg-gradient-to-r from-purple-600 to-indigo-600" },
    { value: "3", label: "Yıl Aktif", color: "bg-gradient-to-r from-green-600 to-teal-600" },
  ]);
  const [aboutPreview, setAboutPreview] = useState({
    title: "Hakkımızda",
    description: "AYZEK, teknoloji tutkunu bireylerden oluşan bir topluluktur. Birlikte öğrenir, gelişir ve geleceği şekillendiririz.",
  });

  const PALETTE = [
    { ring: "from-emerald-400 to-green-600", glow: "shadow-emerald-500/30" },
    { ring: "from-sky-400 to-blue-600", glow: "shadow-sky-500/30" },
    { ring: "from-fuchsia-400 to-violet-600", glow: "shadow-fuchsia-500/30" },
    { ring: "from-amber-400 to-orange-600", glow: "shadow-amber-500/30" },
    { ring: "from-rose-400 to-pink-600", glow: "shadow-rose-500/30" },
  ];

  // Handler fonksiyonları
  const handleEditStats = () => setEditingSection("stats");
  const handleEditAbout = () => setEditingSection("about");
  const handleSaveContent = (data: any) => {
    if (editingSection === "stats") {
      setStats(data.stats || stats);
    } else if (editingSection === "about") {
      setAboutPreview(data);
    }
    setEditingSection(null);
  };
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted theme-transition overflow-x-hidden">
      <AdminNavbar onNotificationsClick={() => setIsNotificationsOpen(true)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      <InlineEditWrapper className="relative py-0 px-0 sm:px-4">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-0">
          <ScrollAnimation animation="fade-in">
            <AutoSlidingBanner />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper>
        <ParallaxSection className="py-12 md:py-20 px-4 bg-muted/20" speed={0.3}>
          <div className="container max-w-screen-xl mx-auto">
            <ScrollAnimation animation="fade-up" className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 md:mb-6 gradient-text">Zaman Kapsülü</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-base md:text-lg leading-relaxed px-4">
                Topluluğumuzun yolculuğunu interaktif kilometre taşları, başarılar ve bugün kim olduğumuzu şekillendiren unutulmaz anlar aracılığıyla keşfedin.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={200}>
              <div className="py-4 md:py-6">
                <HorizontalTimeline />
              </div>
            </ScrollAnimation>
          </div>
        </ParallaxSection>
      </InlineEditWrapper>

      <InlineEditWrapper onEdit={handleEditStats} className="py-12 md:py-16 px-4 bg-card/50 theme-transition">
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {stats.map((stat, index) => (
              <ScrollAnimation key={index} animation="scale-up" delay={index * 100}>
                <div className={`hover-lift theme-transition rounded-lg p-4 md:p-6 ${stat.color} text-white shadow-lg`}>
                  <div
                    className="text-2xl md:text-3xl font-display font-bold mb-2 animate-float"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-white/90">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper onEdit={handleEditAbout} className="py-12 md:py-20 px-4 bg-background/50">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 md:mb-4">{aboutPreview.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">{aboutPreview.description}</p>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <ScrollAnimation animation="slide-in-left" delay={0}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0">
                  <Users className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                  <CardTitle className="text-lg md:text-xl">Misyonumuz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center text-sm md:text-base">
                    Zirvede beraber olmak değil beraberken zirveye ulaşmak, hızla ilerleyen teknoloji çağında yer edinebilmek ve faydalı olabilmenin mutluluğunu paylaşmak amacıyla bir araya gelmiş bir topluluğuz.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="scale-up" delay={100}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0">
                  <Heart className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                  <CardTitle className="text-lg md:text-xl">Değerlerimiz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center text-sm md:text-base">
                    Bu değerler bizi birbirimize güçlü şekilde bağayarak başarılar inşa etmemizi sağlıyor.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="slide-in-right" delay={200}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0">
                  <Rocket className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                  <CardTitle className="text-lg md:text-xl">Başarılarımız</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center text-sm md:text-base">
                    Hackathon zaferleri, açık kaynak projeleri ve topluluk etkinlikleriyle gurur duyuyoruz.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="scale-up" delay={300}>
            <div className="text-center mt-4">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer">
                <a href="/about">
                  <Eye className="w-4 h-4 mr-2" />
                  Detayları Gör
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper className="py-12 md:py-20 px-4 bg-card/40 theme-transition">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 md:mb-4">Yaklaşan Etkinlikler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
              Teknoloji dünyasındaki en son gelişmeleri takip edin ve topluluğumuzla birlikte öğrenin.
            </p>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {loading ? (
              <p className="text-center text-muted-foreground w-full col-span-full">Etkinlikler yükleniyor...</p>
            ) : error ? (
              <p className="text-center text-red-500 w-full col-span-full">Etkinlikler çekilirken bir hata oluştu.</p>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                <ScrollAnimation key={index} animation="scale-up" delay={index * 100}>
                  <Card
                    className="hover-lift bg-background/60 border-primary/10 cursor-pointer transition-all duration-300 h-full"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        <span className="text-xs md:text-sm text-muted-foreground">
                          {new Date(event.start_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })} • {formatTime(event.start_at)}
                        </span>
                      </div>
                      <CardTitle className="text-lg md:text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm md:text-base">{event.description}</CardDescription>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))
            ) : (
              <p className="text-center text-muted-foreground w-full col-span-full">Paylaşılan etkinlik yok.</p>
            )}
          </div>
          <ScrollAnimation animation="scale-up" delay={300}>
            <div className="text-center mt-8 md:mt-12">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer">
                <a href="/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Tüm Etkinlikleri Gör
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper className="py-12 md:py-20 px-4 bg-background/30">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 md:mb-4">Etkinlik Galerisi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
              Geçmiş etkinliklerimizden kareler ve unutulmaz anlar. Her fotoğrafın arkasında bir hikaye var.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={200}>
            <EventGallery />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* === Takımlarımız Önizleme (GÜNCELLENEN) === */}
      <InlineEditWrapper className="py-12 md:py-20 px-4 bg-background/30">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 md:mb-4">Takımlarımız</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
              AYZEK'i ileriye taşıyan ekiplerle tanış. Projelerimizi omuzlayan takımlarımızı keşfet.
            </p>
          </ScrollAnimation>
          
          {/* HER EKRANDA 2 KART */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {teamsLoading ? (
              <p className="col-span-full text-center text-muted-foreground">Takımlar yükleniyor...</p>
            ) : teamsError ? (
              <p className="col-span-full text-center text-red-500">Takımlar yüklenirken bir hata oluştu.</p>
            ) : (
              featuredTeams.map((t, i) => {
                const pal = PALETTE[i % PALETTE.length];
                
                return (
                  <ScrollAnimation key={t.id} animation="scale-up" delay={i * 150}>
                    <Link href="/teams" className="block">
                      <div
                        className={[
                          "group cursor-pointer relative overflow-hidden rounded-[2.5rem]",
                          "w-full h-[200px] md:h-[220px]",
                          "bg-card/70 supports-[backdrop-filter]:bg-card/60 backdrop-blur",
                          "border border-white/15 ring-1 ring-white/10",
                          "hover:shadow-xl transition-all duration-300 hover:scale-105 p-4 md:p-5",
                          "flex flex-col items-center justify-between",
                        ].join(" ")}
                        aria-label={`${t.name} kartı`}
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] p-[1px]">
                          <div className={`h-full w-full rounded-[2.4rem] bg-gradient-to-br ${pal.ring} opacity-40`} />
                        </div>
                        <div className={`relative z-10 mt-1 grid place-items-center size-20 md:size-24 rounded-full bg-gradient-to-br ${pal.ring} shadow-xl ${pal.glow} ring-1 ring-black/20 dark:ring-black/40 transition-transform group-hover:scale-110`}>
                          {t.logoUrl ? (
                            <img src={t.logoUrl} alt={t.name} className="h-full w-full object-cover rounded-full" />
                          ) : (
                            <Users className="h-5 w-5 md:h-6 md:w-6 text-white/90" />
                          )}
                        </div>
                        <div className="relative z-10 mb-1 text-center">
                          <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-muted-foreground">{t.code}</div>
                          <div className={`mt-1 inline-flex items-center rounded-full px-2.5 md:px-3 py-0.5 md:py-1 text-xs font-semibold text-white bg-gradient-to-r ${pal.ring} backdrop-blur-[2px] shadow-md`}>
                            {t.name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollAnimation>
                );
              })
            )}
          </div>

          <ScrollAnimation animation="scale-up" delay={400}>
            <div className="text-center mt-6 md:mt-8">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer">
                <Link href="/teams" className="inline-flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Tüm Takımlarımızı Gör
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* === Visitor Feedback üstüne başlık + kısa metin eklendi === */}
      <InlineEditWrapper className="pt-8 md:pt-12 px-4 bg-card/20">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 md:mb-3">Topluluğumuzdan Yorumlar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
              AYZEK'in hikâyesi, onu birlikte yaşayanların deneyimleriyle anlam kazanıyor. İşte ekipten ve
              kuruculardan kısa notlar.
            </p>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper className="pb-12 md:pb-16 px-4 bg-card/20">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" delay={200}>
            <VisitorFeedback />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <footer className="py-8 md:py-12 px-4 border-t border-border theme-transition bg-background/50">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-in">
            <div className="flex flex-col items-center space-y-4 md:space-y-6">
              <div className="flex items-center space-x-2">
                <img src="/ayzek-logo.png" alt="AYZEK" className="w-6 h-6" />
                <span className="text-xl font-display font-bold text-primary">AYZEK</span>
              </div>
              <p className="text-muted-foreground text-center max-w-md">
                Anılar inşa ediyor, bağlantıları güçlendiriyor ve geleceği birlikte yaratıyoruz.
              </p>
              <div className="flex items-center space-x-6">
                {/* sosyal linkler aynı */}
                <a href="https://youtube.com/@ayzekselcuk?si=8fbutC3-be5GmIne" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.965 2.965 0 0 0-2.087-2.1C19.561 3.5 12 3.5 12 3.5s-7.561 0-9.411.586a2.965 2.965 0 0 0-2.087 2.1A31.05 31.05 0 0 0 .5 12a31.05 31.05 0 0 0 .002 5.814 2.965 2.965 0 0 0 2.087 2.1C4.439 20.5 12 20.5 12 20.5s7.561 0 9.411-.586a2.965 2.965 0 0 0 2.087-2.1A31.05 31.05 0 0 0 23.5 12a31.05 31.05 0 0 0-.002-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/ayzek/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://github.com/ayzek" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/20ayzek22?igsh=MWJmdDUydHF6d2M4ZA==" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
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

      <ContentEditModal
        isOpen={editingSection === "about"}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveContent}
        title="Hakkımızda Önizlemesini Düzenle"
        description="Hakkımızda bölümünün önizleme içeriğini güncelleyin"
        initialData={aboutPreview}
        fields={[
          { key: "title", label: "Başlık", type: "text", required: true },
          { key: "description", label: "Açıklama", type: "textarea", required: true },
        ]}
      />
      
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          {selectedEvent && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={selectedEvent.cover_image_url || "/placeholder-image.jpg"}
                  alt={selectedEvent.title}
                  className="w-full h-auto object-cover md:h-full"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{selectedEvent.description}</p>
                
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedEvent.start_at).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' })} • {formatTime(selectedEvent.start_at)}
                    </span> 
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                {selectedEvent.tags && Array.isArray(selectedEvent.tags) && selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedEvent.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
                
                {selectedEvent.whatsapp_link && (
                  <Button asChild className="w-full bg-ayzek-gradient hover:opacity-90">
                    <a href={selectedEvent.whatsapp_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Şimdi Kaydol
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
