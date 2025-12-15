"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Dr. Ögr. Üyesi Sema SERVİ",
    role: "Topluluk Danışmanı",
    content: " ",
    avatar: "semahoca.JPG",
  },
  {
    id: 2,
    name: "Muhammed Esad DOĞAN",
    role: "Kurucu Başkan",
    content: " ",
    avatar: "/esaddogan.jpg",
  },
  {
    id: 3,
    name: "Fatih AKKUŞ",
    role: "Kurucu Ekip Üyesi",
    content: " ",
    avatar: "/fatihakkus.jpg",
  },
  {
    id: 4,
    name: "Rabia DOĞANAY",
    role: "Kurucu Ekip Üyesi",
    content: " ",
    avatar: "/rabiadoganay.jpg",
  },
  {
    id: 5,
    name: "Diyar TÜRK",
    role: "Kurucu Ekip Üyesi",
    content: " ",
    avatar: "/diyarturk.jpg",
  },
  {
    id: 6,
    name: "Muhammed İbrahim TOP",
    role: "Kurucu Ekip Üyesi",
    content: " ",
    avatar: "/ibrahimtop.jpg",
  },
]

export function VisitorFeedback() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback submitted:", feedback)
    setFeedback({ name: "", email: "", message: "" })
    setShowFeedbackForm(false)
  }

  // Scroll pozisyonunu takip et
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || testimonials.length === 0) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.scrollWidth / testimonials.length
      const index = Math.round(scrollLeft / itemWidth)
      setCurrentIndex(Math.max(0, Math.min(index, testimonials.length - 1)))
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const itemWidth = container.scrollWidth / testimonials.length
    container.scrollTo({ left: itemWidth * index, behavior: "smooth" })
  }

  return (
    <div className="space-y-4">
      {/* Testimonials - Kaydırılabilir */}
      <div
        ref={scrollContainerRef}
        className="
          flex gap-2.5 sm:gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
          md:mx-0 md:px-0 md:overflow-visible md:snap-none
          md:grid md:grid-cols-3 md:gap-4 lg:gap-6
          scrollbar-hide
        "
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="
              flex-none w-[72vw] sm:w-[60vw] snap-center
              md:w-auto
            "
          >
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-black/80 border border-black/10 dark:border-white/10 backdrop-blur-sm min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex flex-col">
              <CardHeader className="text-center flex-shrink-0 p-3 sm:p-3.5 md:p-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt="Profil fotoğrafı"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full mx-auto mb-1.5 object-cover"
                />
                <CardTitle className="font-display text-sm sm:text-base md:text-lg mb-0.5">{testimonial.name}</CardTitle>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
              </CardHeader>
              <CardContent className="flex-grow p-3 sm:p-3.5 md:p-4 pt-0">
                <p className="text-[10px] sm:text-xs md:text-sm text-center italic line-clamp-3">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Nokta navigasyonu - sadece mobilde göster */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 md:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/40"}
              `}
              aria-label={`${index + 1}. yoruma git`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
