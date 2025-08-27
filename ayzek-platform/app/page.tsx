"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { HorizontalTimeline } from "@/components/horizontal-timeline";
import { AutoSlidingBanner } from "@/components/auto-sliding-banner";
import { ScrollAnimation } from "@/components/scroll-animations";
import { ParallaxSection } from "@/components/parallax-section";
import { EventGallery } from "@/components/event-gallery";
import { AdminNavbar } from "@/components/admin-navbar";
import { NotificationsPanel } from "@/components/notifications-panel";
import { InlineEditWrapper } from "@/components/inline-edit-wrapper";
import { ContentEditModal } from "@/components/content-edit-modal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Heart, ArrowRight, Eye } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL as string;

function formatTRDate(iso: string) {
  const dt = new Date(iso);
  if (isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function HomePage() {
  const router = useRouter();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [stats, setStats] = useState([
    { value: "150+", label: "Topluluk Üyesi", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { value: "25+", label: "Düzenlenen Etkinlik", color: "bg-gradient-to-r from-green-500 to-green-600" },
    { value: "10+", label: "Tamamlanan Proje", color: "bg-gradient-to-r from-purple-600 to-indigo-600" },
    { value: "3", label: "Yıl Aktif", color: "bg-gradient-to-r from-green-600 to-teal-600" },
  ]);

  const [aboutPreview, setAboutPreview] = useState({
    title: "Hakkımızda",
    description:
      "AYZEK, teknoloji tutkunu bireylerden oluşan bir topluluktur. Birlikte öğrenir, gelişir ve geleceği şekillendiririz.",
  });

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Kurucu & CEO",
      image: "/team-alex-founder.png",
      social: {
        twitter: "https://twitter.com/alexjohnson",
        linkedin: "https://linkedin.com/in/alexjohnson",
        github: "https://github.com/alexjohnson",
        email: "alex@ayzek.com",
      },
    },
    {
      name: "Sarah Chen",
      role: "Etkinlik Koordinatörü",
      image: "/team-sarah-events.png",
      social: {
        twitter: "https://twitter.com/sarahchen",
        linkedin: "https://linkedin.com/in/sarahchen",
        email: "sarah@ayzek.com",
      },
    },
    {
      name: "Marcus Rodriguez",
      role: "Teknoloji Lideri",
      image: "/team-marcus-tech.png",
      social: {
        linkedin: "https://linkedin.com/in/marcusrodriguez",
        github: "https://github.com/marcusrodriguez",
        email: "marcus@ayzek.com",
      },
    },
  ];

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

  // --- Yaklaşan Etkinlikler (dinamik) ---
  const [upcoming, setUpcoming] = useState<
    Array<{
      id: number;
      slug: string;
      title: string;
      description: string;
      cover_image_url?: string;
      start_at: string;
      location: string;
      capacity: number;
      registered: number;
    }>
  >([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoadingUpcoming(true);
        const res = await fetch(`${API}/events/upcoming?limit=3`, { cache: "no-store" });
        if (!res.ok) throw new Error("Etkinlikler yüklenemedi");
        const data = await res.json();
        if (!cancel) setUpcoming(data);
      } catch (e) {
        if (!cancel) setUpcoming([]);
      } finally {
        if (!cancel) setLoadingUpcoming(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted theme-transition">
      {/* Navigation Header */}
      <AdminNavbar onNotificationsClick={() => setIsNotificationsOpen(true)} />

      {/* Notifications Panel */}
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      <InlineEditWrapper className="relative py-8 px-4">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-in">
            <AutoSlidingBanner />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper>
        <ParallaxSection className="py-19 px-4 bg-muted/20" speed={0.3}>
          <div className="container max-w-screen-xl mx-auto">
            <ScrollAnimation animation="fade-up" className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-6 gradient-text">Zaman Kapsülü</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                Topluluğumuzun yolculuğunu interaktif kilometre taşları, başarılar ve bugün kim olduğumuzu şekillendiren
                unutulmaz anlar aracılığıyla keşfedin.
              </p>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={200}>
              <div className="py-6">
                <HorizontalTimeline />
              </div>
            </ScrollAnimation>
          </div>
        </ParallaxSection>
      </InlineEditWrapper>

      <InlineEditWrapper onEdit={handleEditStats} className="py-12 px-4 bg-card/50 theme-transition">
        <div className="container max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <ScrollAnimation key={index} animation="scale-up" delay={index * 100}>
                <div className={`hover-lift theme-transition rounded-lg p-6 ${stat.color} text-white shadow-lg`}>
                  <div
                    className="text-3xl font-display font-bold mb-2 animate-float"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white/90">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </InlineEditWrapper>

      {/* About Us Preview Section */}
      <InlineEditWrapper onEdit={handleEditAbout} className="py-20 px-4 bg-background/50">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">{aboutPreview.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{aboutPreview.description}</p>
          </ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <ScrollAnimation animation="fade-up" delay={0}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col">
                <CardHeader className="text-center flex-shrink-0">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Misyonumuz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center">
                    Teknoloji alanında yenilikçi çözümler geliştiren, öğrenmeyi seven bir topluluk oluşturmak.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={100}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col">
                <CardHeader className="text-center flex-shrink-0">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Değerlerimiz</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center">
                    İşbirliği, sürekli öğrenme, yenilikçilik ve topluma katkı sağlama temel değerlerimizdir.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={200}>
              <Card className="hover-lift bg-card/60 border-primary/10 h-full flex flex-col">
                <CardHeader className="text-center flex-shrink-0">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <CardTitle>Başarılarımız</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center">
                  <CardDescription className="text-center">
                    Hackathon zaferleri, açık kaynak projeleri ve topluluk etkinlikleriyle gurur duyuyoruz.
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
          <div className="text-center mt-4">
            <Button asChild className="bg-ayzek-gradient hover:opacity-90">
              <a href="/about">
                <Eye className="w-4 h-4 mr-2" />
                Detayları Gör
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </InlineEditWrapper>

      {/* Yaklaşan Etkinlikler (Dinamik) */}
      <InlineEditWrapper className="py-20 px-4 bg-card/40 theme-transition">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Yaklaşan Etkinlikler</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Teknoloji dünyasındaki en son gelişmeleri takip edin ve topluluğumuzla birlikte öğrenin.
            </p>
          </ScrollAnimation>

          {loadingUpcoming ? (
            <div className="text-center text-muted-foreground py-10">Yükleniyor…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {upcoming.map((e, i) => (
                <ScrollAnimation key={e.id} animation="fade-up" delay={i * 100}>
                  <Card
                    className="hover-lift bg-background/60 border-primary/10 cursor-pointer"
                    onClick={() => router.push(`/etkinlikler?open=${e.slug}`, { scroll: false })}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Calendar className="w-8 h-8 text-primary" />
                        <span className="text-sm text-muted-foreground">{formatTRDate(e.start_at)}</span>
                      </div>
                      <CardTitle className="line-clamp-2">{e.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">{e.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                          {e.registered}/{e.capacity} katılımcı
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild className="bg-ayzek-gradient hover:opacity-90">
              <a href="/events">
                <Calendar className="w-4 h-4 mr-2" />
                Tüm Etkinlikleri Gör
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </InlineEditWrapper>

      <InlineEditWrapper className="py-20 px-4 bg-background/30">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Etkinlik Galerisi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Geçmiş etkinliklerimizden kareler ve unutulmaz anlar. Her fotoğrafın arkasında bir hikaye var.
            </p>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-up" delay={200}>
            <EventGallery />
          </ScrollAnimation>
        </div>
      </InlineEditWrapper>

      {/* Ziyaretçi Geri Bildirimleri */}
      <InlineEditWrapper className="py-16 px-4 bg-card/20">
        <div className="container max-w-screen-xl mx-auto">
          {/* Projende zaten var: <VisitorFeedback /> */}
          {/* Eğer import edilmediyse yoruma alın veya ekleyin */}
          {/* <VisitorFeedback /> */}
        </div>
      </InlineEditWrapper>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border theme-transition bg-background/50">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-in">
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
                  href="https://twitter.com/ayzek"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/ayzek"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.063 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/ayzek"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/ayzek"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.072 4.849.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921-.43.372-.823 1.102-.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
              <div className="text-sm text-muted-foreground">
                <a href="mailto:info@ayzek.com" className="hover:text-primary transition-colors">
                  info@ayzek.com
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </footer>

      {/* Edit Modals */}
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
    </div>
  );
}

