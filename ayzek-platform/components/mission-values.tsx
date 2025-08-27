import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Lightbulb, Target, Globe, Zap } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Kapsayıcılık",
    description:
      "Geçmişi, deneyim seviyesi veya kimliği ne olursa olsun herkesi kucaklıyoruz. Çeşitlilik bizi daha güçlü kılar.",
    color: "text-red-500",
  },
  {
    icon: Users,
    title: "İş Birliği",
    description: "Birlikte çalışmanın, bilgiyi paylaşmanın ve birbirimizin gelişimini desteklemenin gücüne inanıyoruz.",
    color: "text-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Yenilikçilik",
    description: "Yaratıcı düşünceyi, denemeyi ve mümkün olanın sınırlarını zorlamayı teşvik ederiz.",
    color: "text-yellow-500",
  },
  {
    icon: Target,
    title: "Mükemmeliyet",
    description: "Etkinliklerden projelere, topluluk etkileşimlerine kadar her şeyde kaliteyi hedefleriz.",
    color: "text-green-500",
  },
  {
    icon: Globe,
    title: "Etkileşim",
    description: "Teknoloji sektöründe ve daha geniş toplulukta olumlu bir fark yaratmayı amaçlarız.",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Gelişim",
    description:
      "Sürekli öğrenmeye, kişisel gelişime ve başkalarının potansiyeline ulaşmasına yardımcı olmaya kendimizi adadık.",
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
            Teknoloji meraklılarının birlikte öğrenebileceği, gelişebileceği ve yenilik yapabileceği; ömür boyu sürecek anlamlı bağlantılar kurabileceği kapsayıcı ve canlı bir topluluk oluşturmak.
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8">
            <p className="text-lg font-medium text-foreground">
              "En iyi yeniliklerin, farklı zihinlerin bir araya gelerek fikir alışverişinde bulunması ve birbirinin yolculuğunu desteklemesiyle gerçekleştiğine inanıyoruz."
            </p>
            <p className="text-sm text-muted-foreground mt-4">— AYZEK Topluluğu Kurucuları</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-card flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-8 h-8 ${value.color}`} />
                  </div>
                  <CardTitle className="font-display text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
