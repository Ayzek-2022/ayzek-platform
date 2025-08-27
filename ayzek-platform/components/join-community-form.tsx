"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const experienceLevels = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (2-4 years)" },
  { value: "advanced", label: "Advanced (5-8 years)" },
  { value: "expert", label: "Expert (8+ years)" },
  { value: "student", label: "Student" },
]

const interestAreas = [
 "Web Geliştirme",
"Mobil Geliştirme",
"Veri Bilimi",
"Makine Öğrenimi",
"DevOps",
"UI/UX Tasarımı",
"Siber Güvenlik",
"Blockchain",
"Oyun Geliştirme",
"Bulut Bilişim",
"IoT",
"Yapay Zeka",
]

const hearAboutOptions = [
"Sosyal Medya",
"Arkadaş/Meslektaş",
"Teknoloji Etkinliği",
"Çevrimiçi Arama",
"Üniversite/Okul",
"Şirket/İşyeri",
"Diğer",
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  experienceLevel: string
  interests: string[]
  hearAbout: string
  motivation: string
  contribution: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  jobTitle: "",
  experienceLevel: "",
  interests: [],
  hearAbout: "",
  motivation: "",
  contribution: "",
  agreeToTerms: false,
  subscribeNewsletter: true,
}

export function JoinCommunityForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required"
    if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest area"
    if (!formData.hearAbout) newErrors.hearAbout = "Please tell us how you heard about us"
    if (!formData.motivation.trim()) newErrors.motivation = "Please share your motivation for joining"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would send the data to your backend
      console.log("Form submitted:", formData)

      setShowSuccessDialog(true)
      setFormData(initialFormData)
      setErrors({})
    } catch (error) {
      console.error("Submission error:", error)
      setShowErrorDialog(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-display">AYZEK Topluluğuna Katıl</CardTitle>
          <CardDescription className="text-lg">
            Benzer düşüncedeki teknoloji meraklılarıyla bağlantı kurmak ve kariyerini geliştirmek için ilk adımı at.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">Kişisel Bilgiler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresi *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon Numarası</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">Profesyonel Geçmiş</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Şirket/Kurum</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Google, Freelancer, Student"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Görev/Unvan</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g., Software Engineer, Designer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Deneyim Seviyesi *</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                  <SelectTrigger className={errors.experienceLevel ? "border-destructive" : ""}>
                    <SelectValue placeholder="Deneyim seviyenizi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="text-sm text-destructive">{errors.experienceLevel}</p>}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">İlgi Alanları *</h3>
              <p className="text-sm text-muted-foreground">Deneyiminizi özelleştirmemize yardımcı olması için size uygun olanları seçin</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {interestAreas.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      formData.interests.includes(interest)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                      />
                      <span className="text-sm font-medium">{interest}</span>
                    </div>
                  </div>
                ))}
              </div>
              {errors.interests && <p className="text-sm text-destructive">{errors.interests}</p>}
            </div>

            {/* Discovery & Motivation */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">Bize Daha Fazla Anlatın</h3>
              <div className="space-y-2">
                <Label htmlFor="hearAbout">AYZEK'i nereden duydunuz? *</Label>
                <Select
                  value={formData.hearAbout}
                  onValueChange={(value) => setFormData({ ...formData, hearAbout: value })}
                >
                  <SelectTrigger className={errors.hearAbout ? "border-destructive" : ""}>
                    <SelectValue placeholder="Bir seçenek seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {hearAboutOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hearAbout && <p className="text-sm text-destructive">{errors.hearAbout}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivation">Topluluğumuza katılmanızdaki motivasyon nedir? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  placeholder="Hedeflerinizi, neler öğrenmek istediğinizi veya nasıl katkı sağlamak istediğinizi paylaşın..."
                  rows={4}
                  className={errors.motivation ? "border-destructive" : ""}
                />
                {errors.motivation && <p className="text-sm text-destructive">{errors.motivation}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contribution">Topluluğa nasıl katkıda bulunmak istersiniz?</Label>
                <Textarea
                  id="contribution"
                  value={formData.contribution}
                  onChange={(e) => setFormData({ ...formData, contribution: e.target.value })}
                  placeholder="örn. mentorluk, etkinliklerde konuşma, atölye düzenleme, bilgi paylaşımı..."
                  rows={3}
                />
              </div>
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                  className={errors.agreeToTerms ? "border-destructive" : ""}
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Şartlar ve Koşullar ile Gizlilik Politikasını kabul ediyorum *
                  </Label>
                  {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) => setFormData({ ...formData, subscribeNewsletter: checked as boolean })}
                />
                <Label
                  htmlFor="subscribeNewsletter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Topluluk güncellemeleri ve etkinlik duyuruları için bültenimize abone olun
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button type="submit" size="lg" className="text-lg px-12" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "AYZEK Topluluğuna Katıl"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-display">AYZEK'e Hoş Geldiniz!</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Topluluğumuza katıldığınız için teşekkür ederiz! Başvurunuzu aldık ve kısa süre içinde inceleyeceğiz. 24 saat içinde sonraki adımları içeren bir hoş geldin e-postası alacaksınız.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowSuccessDialog(false)}>Keşfetmeye Devam Et</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-display">Gönderim Hatası</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              Başvurunuzu işlerken bir hata oluştu. Lütfen tekrar deneyin veya sorun devam ederse bizimle doğrudan iletişime geçin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
              Tekrar Dene
            </Button>
            <Button onClick={() => setShowErrorDialog(false)}>Destek ile İletişime Geç</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
