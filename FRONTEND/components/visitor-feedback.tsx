"use client"

import type React from "react"

import { useState } from "react"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback submitted:", feedback)
    setFeedback({ name: "", email: "", message: "" })
    setShowFeedbackForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Testimonials */}
      <div
        className="
          flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
          md:mx-0 md:px-0 md:overflow-visible md:snap-none
          md:grid md:grid-cols-3 md:gap-6
        "
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="
              flex-none w-[70vw] sm:w-[58vw] snap-center
              md:w-auto
            "
          >
            <Card className="group hover:shadow-lg transition-all duration-300 bg-white/90 dark:bg-black/80 border border-black/10 dark:border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center p-3 md:p-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt="Profil fotoğrafı"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <CardTitle className="font-display text-base md:text-lg">{testimonial.name}</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                <p className="text-xs md:text-sm text-center italic line-clamp-4">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
