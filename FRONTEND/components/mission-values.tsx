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
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      {/* Mission Statement */}
      <div className="text-center space-y-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Misyonumuz</h2>
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-snug mb-3 sm:mb-4">
            Teknoloji meraklılarının birlikte öğrenebileceği, gelişebileceği ve yenilik yapabileceği; ömür boyu sürecek
            anlamlı bağlantılar kurabileceği kapsayıcı ve canlı bir topluluk oluşturmak.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5">
            <p className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-snug">
              "En iyi yeniliklerin, farklı zihinlerin bir araya gelerek fikir alışverişinde bulunması ve birbirinin
              yolculuğunu desteklemesiyle gerçekleştiğine inanıyoruz."
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2"> AYZEK Topluluğu </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-4">
        <div className="text-center px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 gradient-text">Değerlerimiz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-snug">
            Bu temel ilkeler, yaptığımız her şeyi yönlendirir ve topluluğumuzun kültürünü şekillendirir.
          </p>
        </div>

        {/* Mobil: 2 sütun, dikey uzar | md+: eski grid davranışı */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-black/80 backdrop-blur-sm border border-white/10 min-h-[180px] sm:min-h-[200px] md:min-h-[220px] flex flex-col"
              >
                <CardHeader className="text-center flex-shrink-0 p-3 sm:p-3.5 md:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-1.5 rounded-full bg-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${value.color}`} />
                  </div>
                  <CardTitle className="font-display text-xs sm:text-sm md:text-base mb-0">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-3 sm:p-3.5 md:p-4 pt-0">
                  <CardDescription className="text-center leading-snug text-[10px] sm:text-xs md:text-sm line-clamp-4">
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
