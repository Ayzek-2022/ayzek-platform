"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const bannerSlides = [
  {
    id: 1,
    title: "AYZEK Topluluğuna Hoş Geldiniz",
    subtitle: "İnovasyonun İşbirliğiyle Buluştuğu Yer",
    description: "Canlı teknoloji topluluğumuzun bir parçası olun ve olağanüstü bir deneyimin parçası olun",
    image: "/9527dde9-6c97-410b-bc2a-ded7da0fe72e.JPG",
    cta: "Topluluğa Katıl",
    hasButton: true,
  },
  {
    id: 2,
    title: "Teknoloji Zirvesi 2024",
    subtitle: "Üç Gün Süren İnovasyon",
    description: "Sektör liderleriyle bağlantı kurun ve projelerinizi sergileyin",
    image: "/31e296de-cc7d-4e00-8332-442e03e1cb59.JPG",
    hasButton: false,
  },
  {
    id: 3,
    title: "Topluluk Başarıları",
    subtitle: "Başarılarımızı Kutluyoruz",
    description: "150+ üye, 25+ etkinlik ve sayısız yaratılan anı",
    image: "/cf4a848e-2e8c-4588-817d-13127084aaba.JPG",
    hasButton: false,
  },
]

export function AutoSlidingBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            index === currentSlide
              ? "opacity-100 translate-x-0"
              : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
          }`}
        >
          <div className="relative h-full flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 z-10" />
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-20 container max-w-screen-xl mx-auto px-4">
              <div className="max-w-2xl animate-fade-in">
                <h2 className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">{slide.subtitle}</h2>
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-foreground">{slide.title}</h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{slide.description}</p>
                {slide.hasButton && (
                  <Button size="lg" className="text-lg px-8 bg-ayzek-gradient hover:opacity-90" asChild>
                    <a href="/join">{slide.cta}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-primary scale-125" : "bg-background/60"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
