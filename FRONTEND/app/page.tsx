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
import { InlineEditWrapper } from "@/components/admin/admin-inline-edit-wrapper";
import { ContentEditModal } from "@/components/content-edit-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, Rocket, ArrowRight, Eye, MapPin, ExternalLink } from "lucide-react";
import { VisitorFeedback } from "@/components/visitor-feedback";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EventCardSkeleton, TeamCardSkeleton } from "@/components/skeleton-loaders";

// --- YENİ EKLENEN KISIMLAR ---
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

function normalizeImageUrl(v: string | null | undefined) {
  const s = (v || "").trim();
  if (!s) return "";

  // 1. Zaten tam URL ise dokunma
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // 2. Başında slash yoksa ekle
  const path = s.startsWith("/") ? s : `/${s}`;

  // 3. Backend'den gelen dosya ise prefix ekle
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) {
     return `${API_BASE}${path}`;
  }

  return path;
}
// -----------------------------

// Takım verisi için net bir tip tanımı
interface FeaturedTeam {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
}

export default function HomePage() {
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
        const response = await axios.get(`${API_BASE}/events/upcoming`);
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
        const response = await axios.get(`${API_BASE}/teams/featured`);
        
        const formattedTeams: FeaturedTeam[] = response.data.map((team: any) => ({
          id: team.id,
          name: team.name,
          // --- DÜZELTME BURADA ---
          logoUrl: normalizeImageUrl(team.photo_url), 
          code: team.name.toUpperCase(),
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
    { value: "150+", label: "Topluluk Üyesi", color: "bg-gradient-to-r from-blue-600 to-blue-500" },
    { value: "25+", label: "Düzenlenen Etkinlik", color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { value: "10+", label: "Tamamlanan Proje", color: "bg-gradient-to-r from-cyan-500 to-cyan-400" },
    { value: "3", label: "Yıl Aktif", color: "bg-gradient-to-r from-blue-700 to-cyan-600" },
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
      <AdminNavbar />

      <InlineEditWrapper className="relative py-3 sm:py-4 md:py-5 px-0 sm:px-4">
        <div className="container max-w-screen-xl mx-auto px-2 sm:px-4 md:px-0">
          <ScrollAnimation animation="fade-in">
            <AutoSlidingBanner />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* HAKKıMıZDA - Poster'ın hemen altında */}
      <InlineEditWrapper onEdit={handleEditAbout} className="py-4 sm:py-6 md:py-10 px-3 sm:px-4">
        <div className="container max-w-screen-xl mx-auto">
            <ScrollAnimation animation="fade-up" className="text-center mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-display font-bold mb-1.5 sm:mb-2 gradient-text">{aboutPreview.title}</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug px-2">{aboutPreview.description}</p>
          </ScrollAnimation>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5">
            <ScrollAnimation animation="slide-in-left" delay={0}>
              <Card className="hover-lift bg-black/80 backdrop-blur-sm border border-white/10 h-[160px] sm:h-[200px] md:h-[240px] flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0 p-2 sm:p-3 md:p-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mx-auto mb-1 sm:mb-1.5" />
                  <CardTitle className="text-[10px] sm:text-sm md:text-base lg:text-lg leading-tight mb-0">Misyonumuz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-1.5 sm:p-2 md:p-3 pt-0">
                  <CardDescription className="text-center text-[8px] sm:text-xs md:text-sm leading-tight line-clamp-3 sm:line-clamp-4">
                    Teknoloji çağında birlikte öğrenip gelişerek, faydalı projeler üretmek için bir araya gelmiş bir topluluğuz.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="scale-up" delay={100}>
              <Card className="hover-lift bg-black/80 backdrop-blur-sm border border-white/10 h-[160px] sm:h-[200px] md:h-[240px] flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0 p-2 sm:p-3 md:p-4">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mx-auto mb-1 sm:mb-1.5" />
                  <CardTitle className="text-[10px] sm:text-sm md:text-base lg:text-lg leading-tight mb-0">Değerlerimiz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-1.5 sm:p-2 md:p-3 pt-0">
                  <CardDescription className="text-center text-[8px] sm:text-xs md:text-sm leading-tight line-clamp-3 sm:line-clamp-4">
                    Bu değerler bizi birbirimize güçlü şekilde bağayarak başarılar inşa etmemizi sağlıyor.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="slide-in-right" delay={200}>
              <Card className="hover-lift bg-black/80 backdrop-blur-sm border border-white/10 h-[160px] sm:h-[200px] md:h-[240px] flex flex-col transition-all duration-300">
                <CardHeader className="text-center flex-shrink-0 p-2 sm:p-3 md:p-4">
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary mx-auto mb-1 sm:mb-1.5" />
                  <CardTitle className="text-[10px] sm:text-sm md:text-base lg:text-lg leading-tight mb-0">Başarılarımız</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-1.5 sm:p-2 md:p-3 pt-0">
                  <CardDescription className="text-center text-[8px] sm:text-xs md:text-sm leading-tight line-clamp-3 sm:line-clamp-4">
                    Hackathon zaferleri, açık kaynak projeleri ve topluluk etkinlikleriyle gurur duyuyoruz.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
          <ScrollAnimation animation="scale-up" delay={300}>
            <div className="text-center mt-3 sm:mt-4">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-5">
                <a href="/about">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  Detayları Gör
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5" />
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* ZAMAN KAPSÜLÜ - Hakkımızda'nın altında */}
      <InlineEditWrapper>
        <ParallaxSection className="py-6 sm:py-8 md:py-12 px-3 sm:px-4" speed={0.3}>
          <div className="container max-w-screen-xl mx-auto">
            <ScrollAnimation animation="fade-up" className="text-center mb-4 sm:mb-5 md:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Zaman Kapsülü</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-xs sm:text-sm md:text-base leading-snug px-2">
                Topluluğumuzun yolculuğunu interaktif kilometre taşları, başarılar ve bugün kim olduğumuzu şekillendiren unutulmaz anlar aracılığıyla keşfedin.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={200}>
              <div className="py-2 sm:py-4 md:py-6">
                <HorizontalTimeline />
              </div>
            </ScrollAnimation>
          </div>
        </ParallaxSection>
      </InlineEditWrapper>

      <InlineEditWrapper className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-card/30 theme-transition">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Yaklaşan Etkinlikler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 leading-snug">
              Teknoloji dünyasındaki en son gelişmeleri takip edin ve topluluğumuzla birlikte öğrenin.
            </p>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5">
            {loading ? (
              <>
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </>
            ) : error ? (
              <p className="text-center text-red-500 w-full col-span-full text-sm">Etkinlikler çekilirken bir hata oluştu.</p>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                <ScrollAnimation key={index} animation="scale-up" delay={index * 100}>
                  <Card
                    className="hover-lift bg-black/80 backdrop-blur-sm border border-white/10 cursor-pointer transition-all duration-300 min-h-[160px] sm:min-h-[180px] md:min-h-[200px] flex flex-col"
                    onClick={() => handleEventClick(event)}
                  >
                    <CardHeader className="p-3 sm:p-4 md:p-5 flex-shrink-0">
                      <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="text-[10px] sm:text-xs text-muted-foreground text-right">
                          {new Date(event.start_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })} • {formatTime(event.start_at)}
                        </span>
                      </div>
                      <CardTitle className="text-sm sm:text-base md:text-lg mb-0">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-3 sm:p-4 md:p-5 pt-0">
                      <CardDescription className="text-xs sm:text-sm line-clamp-3 leading-snug">{event.description}</CardDescription>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))
            ) : (
              <p className="text-center text-muted-foreground w-full col-span-full text-sm">Paylaşılan etkinlik yok.</p>
            )}
          </div>
          <ScrollAnimation animation="scale-up" delay={300}>
            <div className="text-center mt-3 sm:mt-4 md:mt-5">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-5">
                <a href="/events">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  Tüm Etkinlikleri Gör
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5" />
                </a>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Etkinlik Galerisi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 leading-snug">
              Geçmiş etkinliklerimizden kareler ve unutulmaz anlar. Her fotoğrafın arkasında bir hikaye var.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={200}>
            <EventGallery />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* === Takımlarımız Önizleme (GÜNCELLENEN) === */}
      <InlineEditWrapper className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Takımlarımız</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 leading-snug">
              AYZEK'i ileriye taşıyan ekiplerle tanış. Projelerimizi omuzlayan takımlarımızı keşfet.
            </p>
          </ScrollAnimation>
          
          {/* MOBİL: 2 kolon, TABLET: 2 kolon, DESKTOP: 4 kolon */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
            {teamsLoading ? (
              <>
                <TeamCardSkeleton />
                <TeamCardSkeleton />
                <TeamCardSkeleton />
                <TeamCardSkeleton />
              </>
            ) : teamsError ? (
              <p className="col-span-full text-center text-red-500 text-sm">Takımlar yüklenirken bir hata oluştu.</p>
            ) : (
              featuredTeams.map((t, i) => {
                const pal = PALETTE[i % PALETTE.length];
                
                return (
                  <ScrollAnimation key={t.id} animation="scale-up" delay={i * 150}>
                    <Link href="/teams" className="block">
                      <div
                        className={[
                          "group cursor-pointer relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem]",
                          "w-full h-[200px] sm:h-[240px] md:h-[300px]",
                          "bg-card/70 supports-[backdrop-filter]:bg-card/60 backdrop-blur",
                          "border border-white/15 ring-1 ring-white/10",
                          "hover:shadow-xl transition-all duration-300 hover:scale-105 p-3 sm:p-4 md:p-5",
                          "flex flex-col items-center justify-center",
                        ].join(" ")}
                        aria-label={`${t.name} kartı`}
                      >
                        <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-[1px]">
                          <div className={`h-full w-full rounded-[1.4rem] sm:rounded-[1.9rem] md:rounded-[2.4rem] bg-gradient-to-br ${pal.ring} opacity-40`} />
                        </div>
                        <div className={`relative z-10 grid place-items-center size-20 sm:size-24 md:size-32 rounded-full bg-gradient-to-br ${pal.ring} shadow-xl ${pal.glow} ring-1 ring-black/20 dark:ring-black/40 overflow-hidden`}>
                          {t.logoUrl ? (
                            <img src={t.logoUrl} alt={t.name} className="h-full w-full object-cover" />
                          ) : (
                            <Users className="size-5 sm:size-6 md:size-7 text-white/90" />
                          )}
                        </div>
                        <div className="relative z-10 mt-2 sm:mt-3 text-center">
                          <div className={`inline-flex items-center rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold text-white bg-gradient-to-r ${pal.ring} backdrop-blur-[2px] shadow-md`}>
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
            <div className="text-center mt-2 sm:mt-3">
              <Button asChild className="bg-ayzek-gradient hover:opacity-90 btn-hover-scale btn-shimmer text-[10px] sm:text-xs md:text-sm h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-5">
                <Link href="/teams" className="inline-flex items-center">
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  Tüm Takımlarımızı Gör
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5" />
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* === Visitor Feedback üstüne başlık + kısa metin eklendi === */}
      <InlineEditWrapper className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Topluluğumuzdan Yorumlar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-2 leading-snug">
              AYZEK'in hikâyesi, onu birlikte yaşayanların deneyimleriyle anlam kazanıyor. İşte ekipten ve
              kuruculardan kısa notlar.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={200}>
            <VisitorFeedback />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <footer className="py-6 sm:py-8 md:py-10 px-3 sm:px-4 border-t border-border theme-transition bg-black/80">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-in">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/ayzek-logo.png" alt="AYZEK" className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-lg sm:text-xl font-display font-bold text-primary">AYZEK</span>
              </div>
              <p className="text-muted-foreground text-center max-w-md text-xs sm:text-sm md:text-base px-2">
                Anılar inşa ediyor, bağlantıları güçlendiriyor ve geleceği birlikte yaratıyoruz.
              </p>
              <div className="flex items-center space-x-4 sm:space-x-6">
                {/* sosyal linkler */}
                <a href="https://youtube.com/@ayzekselcuk?si=8fbutC3-be5GmIne" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.965 2.965 0 0 0-2.087-2.1C19.561 3.5 12 3.5 12 3.5s-7.561 0-9.411.586a2.965 2.965 0 0 0-2.087 2.1A31.05 31.05 0 0 0 .5 12a31.05 31.05 0 0 0 .002 5.814 2.965 2.965 0 0 0 2.087 2.1C4.439 20.5 12 20.5 12 20.5s7.561 0 9.411-.586a2.965 2.965 0 0 0 2.087-2.1A31.05 31.05 0 0 0 23.5 12a31.05 31.05 0 0 0-.002-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/ayzek/" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://github.com/ayzek" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/20ayzek22?igsh=MWJmdDUydHF6d2M4ZA==" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.072-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
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
        <DialogContent className="sm:max-w-[700px] max-w-[94vw] p-0 overflow-hidden">
          {selectedEvent && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  // --- DÜZELTME BURADA ---
                  src={normalizeImageUrl(selectedEvent.cover_image_url) || "/placeholder-image.jpg"}
                  alt={selectedEvent.title}
                  className="w-full h-48 sm:h-56 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-4 sm:p-5 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2">{selectedEvent.title}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">{selectedEvent.description}</p>
                
                <div className="flex flex-col space-y-2 sm:space-y-2.5 md:space-y-3 mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm">
                      {new Date(selectedEvent.start_at).toLocaleDateString("tr-TR", { day: '2-digit', month: 'long', year: 'numeric' })} • {formatTime(selectedEvent.start_at)}
                    </span> 
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm">{selectedEvent.location}</span>
                  </div>
                </div>

                {selectedEvent.tags && Array.isArray(selectedEvent.tags) && selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-4 sm:mb-5 md:mb-6">
                    {selectedEvent.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
                
                {selectedEvent.whatsapp_link && (
                  <Button asChild className="w-full bg-ayzek-gradient hover:opacity-90 text-xs sm:text-sm h-9 sm:h-10 md:h-11">
                    <a href={selectedEvent.whatsapp_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
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