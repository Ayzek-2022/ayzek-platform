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
    <div className="space-y-10 sm:space-y-12 md:space-y-16">
      {/* Mission Statement */}
      <div className="text-center space-y-3 sm:space-y-4 md:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold gradient-text">Misyonumuz</h2>
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-5 md:mb-6">
            Teknoloji meraklılarının birlikte öğrenebileceği, gelişebileceği ve yenilik yapabileceği; ömür boyu sürecek
            anlamlı bağlantılar kurabileceği kapsayıcı ve canlı bir topluluk oluşturmak.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 lg:p-8">
            <p className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-relaxed">
              "En iyi yeniliklerin, farklı zihinlerin bir araya gelerek fikir alışverişinde bulunması ve birbirinin
              yolculuğunu desteklemesiyle gerçekleştiğine inanıyoruz."
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 md:mt-4"> AYZEK Topluluğu </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        <div className="text-center px-3 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2 sm:mb-3 gradient-text">Değerlerimiz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
            Bu temel ilkeler, yaptığımız her şeyi yönlendirir ve topluluğumuzun kültürünü şekillendirir.
          </p>
        </div>

        {/* Mobil: tek sütun minimalist | md+: 2 sütun | lg+: 3 sütun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-black/80 backdrop-blur-sm border border-white/10 flex flex-col"
              >
                <CardHeader className="text-center p-4 sm:p-5 md:p-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-3 rounded-full bg-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${value.color}`} />
                  </div>
                  <CardTitle className="font-display text-base sm:text-lg md:text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 md:p-6 pt-0 flex-grow">
                  <CardDescription className="text-center leading-relaxed text-sm sm:text-base">
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
