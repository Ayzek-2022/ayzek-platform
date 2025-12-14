import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Lightbulb, Target, Globe, Zap } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Kapsayıcılık",
    description:
      "Birden fazla alanda çalışmalar yaparak her alanda tecrübeli bir topluluk oluyoruz.",
    color: "text-red-500",
  },
  {
    icon: Users,
    title: "İş Birliği",
    description:
      "Bölgenin önde gelen teknoloji kurumlarıyla yaptığı iş birlikleri sayesinde güçlü bir network ağına ve sektörden tecrübelere ulaşım imkanı sağlıyoruz.",
    color: "text-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Yenilikçilik",
    description:
      "Orijinal fikirlere değer vererek onların gelişimini destekliyor, tecrübeli ekiplerimizle fikirlerin hayata geçmesini sağlıyoruz.",
    color: "text-yellow-500",
  },
  {
    icon: Target,
    title: "Profesyonellik",
    description:
      "İşimizi ciddiyetle yapıyor, güvenilir ve kaliteli bir topluluk ortamı sunuyoruz.",
    color: "text-green-500",
  },
  {
    icon: Globe,
    title: "Etkileşim",
    description:
      "Düzenlediğimiz etkinliklerle yeni insanlara ulaşarak ekibimizi büyütüyoruz.",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Gelişim",
    description:
      "Biz algoritma ve yapay zeka topluluğu AYZEK! Geleceğin teknolojisi olan yapay zeka alanında çalışmalar yapıyoruz.",
    color: "text-orange-500",
  },
]

export function MissionValues() {
  return (
    <div className="space-y-16">
      {/* Mission Statement */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-display font-bold mb-4">Misyonumuz</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Teknoloji meraklılarının birlikte öğrenebileceği, gelişebileceği ve yenilik yapabileceği; ömür boyu sürecek
            anlamlı bağlantılar kurabileceği kapsayıcı ve canlı bir topluluk oluşturmak.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8">
            <p className="text-lg font-medium text-foreground">
              "En iyi yeniliklerin, farklı zihinlerin bir araya gelerek fikir alışverişinde bulunması ve birbirinin
              yolculuğunu desteklemesiyle gerçekleştiğine inanıyoruz."
            </p>
            <p className="text-sm text-muted-foreground mt-4"> AYZEK Topluluğu </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Değerlerimiz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bu temel ilkeler, yaptığımız her şeyi yönlendirir ve topluluğumuzun kültürünü şekillendirir.
          </p>
        </div>

        {/* Mobil: 2 sütun, dikey uzar | md+: eski grid davranışı */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-black/80 backdrop-blur-sm"
              >
                <CardHeader className="text-center p-3 md:p-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 rounded-full bg-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${value.color}`} />
                  </div>
                  <CardTitle className="font-display text-base md:text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4">
                  <CardDescription className="text-center leading-relaxed text-sm md:text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
