"use client"

import { JoinCommunityForm } from "@/components/join-community-form"
import { AdminNavbar } from "@/components/admin-navbar"
import { NotificationsPanel } from "@/components/notifications-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Lightbulb, Trophy, Calendar, MessageCircle } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animations"
import { useState } from "react"

const benefits = [
  {
    icon: Users,
    title: "Networking Fırsatları",
    description: "Bölgenizdeki 150+ teknoloji profesyoneli, girişimci ve yenilikçi ile bağlantı kurun.",
  },
  {
    icon: Lightbulb,
    title: "Öğrenme ve Gelişim",
    description: "Becerilerinizi geliştirmek için özel atölyeler, masterclass'lar ve mentorluk programlarına erişin.",
  },
  {
    icon: Calendar,
    title: "Özel Etkinlikler",
    description: "Yıl boyunca hackathonlar, konferanslar ve topluluk buluşmalarına öncelikli erişim sağlayın.",
  },
  {
    icon: Trophy,
    title: "Tanınma ve Ödüller",
    description: "Projelerinizi ve başarılarınızı topluluk ve potansiyel işverenlere sergileyin.",
  },
  {
    icon: MessageCircle,
    title: "7/24 Topluluk Desteği",
    description:
      "Aktif online kanallarımız aracılığıyla yardım alın, fikirlerinizi paylaşın ve üyelerle işbirliği yapın.",
  },
  {
    icon: Heart,
    title: "Kapsayıcı Ortam",
    description: "Çeşitliliği kutlayan ve herkesin yolculuğunu destekleyen misafirperver bir topluluğa katılın.",
  },
]

export default function JoinPage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

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
              <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots)" />
          </svg>
        </div>
        <div className="container max-w-screen-xl mx-auto text-center relative z-10">
          <ScrollAnimation animation="fade-up">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">Topluluğumuza Katıl</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Yeniliğin işbirliğiyle buluştuğu canlı bir teknoloji topluluğunun parçası olun. Teknoloji konusunda
              tutkulu, benzer düşünen bireylerle bağlantı kurun, öğrenin ve büyüyün.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Neden AYZEK'e Katılmalısınız?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gelişen teknoloji topluluğumuzun parçası olmanın avantajlarını keşfedin
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 border-primary/10"
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayzek-gradient/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Membership Process */}
      <section className="py-16 px-4">
        <div className="container max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Nasıl Çalışır</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Topluluğumuzun üyesi olmak için basit adımlar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayzek-gradient text-white flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Başvuru Formu</h3>
              <p className="text-muted-foreground">
                Geçmişiniz ve ilgi alanlarınızla kapsamlı başvuru formumuzu doldurun.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayzek-gradient text-white flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">İnceleme Süreci</h3>
              <p className="text-muted-foreground">
                Ekibimiz, topluluk değerlerimize uygunluğu sağlamak için başvurunuzu inceler.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayzek-gradient text-white flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Hoş Geldiniz</h3>
              <p className="text-muted-foreground">
                Hoş geldin paketinizi alın ve hemen toplulukla bağlantı kurmaya başlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className="py-16 px-4">
        <div className="container max-w-screen-xl mx-auto">
          <ScrollAnimation animation="fade-up">
            <JoinCommunityForm />
          </ScrollAnimation>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Sıkça Sorulan Sorular</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Üyelik ücretsiz mi?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Evet! AYZEK üyeliği tamamen ücretsizdir. Teknoloji eğitimi ve networking'i herkes için erişilebilir
                  kılmaya inanıyoruz.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Zaman taahhüdü nedir?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gerekli bir zaman taahhüdü yoktur. İstediğiniz kadar az veya çok katılım sağlayabilirsiniz. Çoğu üye
                  ayda 1-2 etkinliğe katılır.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Deneyimli olmam gerekir mi?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hiç de değil! Tamamen yeni başlayanlardan sektör veteranlarına kadar her deneyim seviyesindeki üyeleri
                  memnuniyetle karşılıyoruz. Herkesin öğrenecek ve öğretecek bir şeyi vardır.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Onay ne kadar sürer?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Çoğu başvuru 24-48 saat içinde incelenir. Onaylandıktan sonra hoş geldin paketiniz ve sonraki
                  adımlarla birlikte bir e-posta alacaksınız.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/20">
        <div className="container max-w-screen-xl mx-auto">
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
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/ayzek"
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
                href="https://instagram.com/ayzek"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.072-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.057-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              <a href="mailto:info@ayzek.com" className="hover:text-primary transition-colors">
                info@ayzek.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
