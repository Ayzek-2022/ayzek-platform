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
    name: "Sema SERVİ",
    role: "Yazılım Mühendisi",
    content:
      "AYZEK, mesleki gelişimimde çok etkili oldu. Topluluk etkinlikleri ve ağ kurma fırsatları eşsiz.",
    avatar: "e4446ef5-eef4-4f1f-b6bd-d46d58639472.JPG",
  },
  {
    id: 2,
    name: "Muhammed Esad DOĞAN",
    role: "Ürün Yöneticisi",
    content:
      "Buradaki hackathonlar ve atölyeler, en son teknoloji trendlerini takip etmeme yardımcı oldu. Harika bir topluluk!",
    avatar: "/professional-man-smiling.png",
  },
  {
    id: 3,
    name: "Fatih AKKUŞ",
    role: "UX Tasarımcısı",
    content:
      "Topluluk üyeleriyle ömür boyu sürecek bağlantılar kurdum ve çok şey öğrendim. Katılmanızı şiddetle tavsiye ederim!",
    avatar: "/professional-woman-designer.png",
  },
]

export function VisitorFeedback() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedback, setFeedback] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle feedback submission
    console.log("Feedback submitted:", feedback)
    setFeedback({ name: "", email: "", message: "" })
    setShowFeedbackForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <img
                src={testimonial.avatar || "/placeholder.svg"}
                alt="Profil fotoğrafı"
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <CardTitle className="text-lg font-display">{testimonial.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center italic">"{testimonial.content}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
