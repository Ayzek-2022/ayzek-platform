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

import { api } from "@/lib/api"

// Bu iki onay kutusunu tamamen gizli tutuyoruz (istediğinde true yapabilirsin)
const SHOW_CONSENTS = false

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
"Robotik ve Otomasyon",
"Otonom Sistemler",
"Medikal Yapay Zeka",
"Biyoinformatik",
"Akıllı Malzemeler ve Sensörler",
"Yapay Zeka Destekli Enerji Sistemleri",
"Sayısal Simülasyon ve Modelleme",
"Endüstri 4.0 ve Akıllı Üretim"
]

const hearAboutOptions = [
  "Sosyal Medya","Arkadaş","Teknoloji Etkinliği",
  "Üniversite","Diğer",
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  interests: string[]
  hearAbout: string
  motivation: string  // tek alan (contribution kaldırıldı)
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  interests: [],
  hearAbout: "",
  motivation: "",
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

    if (!formData.firstName.trim()) newErrors.firstName = "Ad gerekli"
    if (!formData.lastName.trim()) newErrors.lastName = "Soyad gerekli"

    if (!formData.email.trim()) newErrors.email = "E-posta gerekli"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Geçerli e-posta girin"

    if (formData.interests.length === 0) newErrors.interests = "En az bir ilgi alanı seçmelisiniz"
    if (!formData.hearAbout) newErrors.hearAbout = "Bizi nereden duyduğunuzu seçin"
    if (!formData.motivation.trim()) newErrors.motivation = "Motivasyonunuzu yazın"
    if (SHOW_CONSENTS && !formData.agreeToTerms) newErrors.agreeToTerms = "Şartları kabul etmelisiniz"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Çoklu seçim toggle
  const toggleInterest = (t: string) =>
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(t)
        ? prev.interests.filter(x => x !== t)
        : [...prev.interests, t],
    }))

  function extractFastApiError(err: any): string | null {
    const d = err?.response?.data
    if (!d) return null
    if (Array.isArray(d?.detail) && d.detail[0]?.msg) return d.detail[0].msg
    if (typeof d?.detail === "string") return d.detail
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    // Backend contribution zorunlu olduğu için aynı metni oraya da gönderiyoruz.
    const payload = {
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      interests: formData.interests,
      heard_from: formData.hearAbout,
      motivation: formData.motivation.trim(),
      contribution: formData.motivation.trim(), // 👈 tek alandan karşılanıyor
    }

    try {
      await api.post("/community/apply", payload)
      setShowSuccessDialog(true)
      setFormData(initialFormData)
      setErrors({})
    } catch (error: any) {
      console.error("Submission error:", error)
      setShowErrorDialog(true)
      const msg = extractFastApiError(error)
      if (msg) setErrors(prev => ({ ...prev, motivation: msg }))
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
            {/* Kişisel Bilgiler */}
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

            {/* İlgi Alanları */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">İlgi Alanları *</h3>
              <p className="text-sm text-muted-foreground">Size uygun olanları seçin</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {interestAreas.map((interest) => {
                  const checked = formData.interests.includes(interest)
                  return (
                    /* DIŞ KAPSAYICI BUTTON DEĞİL → button-içinde-button hatası biter */
                    <div
                      key={interest}
                      role="button"
                      tabIndex={0}
                      aria-pressed={checked}
                      onClick={() => toggleInterest(interest)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          toggleInterest(interest)
                        }
                      }}
                      className={`text-left cursor-pointer p-3 rounded-lg border transition-all ${
                        checked ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleInterest(interest)}
                          />
                        </span>
                        <span className="text-sm font-medium">{interest}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              {errors.interests && <p className="text-sm text-destructive">{errors.interests}</p>}
            </div>

            {/* Bize Daha Fazla Anlatın */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold">Bize Daha Fazla Anlatın</h3>

              <div className="space-y-2">
                <Label>AYZEK'i nereden duydunuz? *</Label>
                <Select
                  value={formData.hearAbout}
                  onValueChange={(value) => setFormData({ ...formData, hearAbout: value })}
                >
                  <SelectTrigger className={errors.hearAbout ? "border-destructive" : ""}>
                    <SelectValue placeholder="Bir seçenek seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {hearAboutOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
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
            </div>

            {/* Şartlar & Bülten — gizli */}
            {SHOW_CONSENTS && (
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: Boolean(checked) })}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm font-medium leading-none">
                    Şartlar ve Koşullar ile Gizlilik Politikasını kabul ediyorum *
                  </Label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => setFormData({ ...formData, subscribeNewsletter: Boolean(checked) })}
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm font-medium leading-none">
                    Topluluk güncellemeleri ve etkinlik duyuruları için bültenimize abone olun
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-destructive">{errors.agreeToTerms}</p>}
              </div>
            )}

            {/* Gönder */}
            <div className="flex justify-center pt-6">
              <Button type="submit" size="lg" className="text-lg px-12" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gönderiliyor...</>) : ("AYZEK Topluluğuna Katıl")}
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
              Başvurunuzu aldık ve kısa süre içinde inceleyeceğiz.
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
              Başvurunuzu işlerken bir hata oluştu. Lütfen tekrar deneyin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>Tekrar Dene</Button>
            <Button onClick={() => setShowErrorDialog(false)}>Destek ile İletişime Geç</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
