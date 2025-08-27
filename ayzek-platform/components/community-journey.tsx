"use client"

import { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy, Rocket } from "lucide-react"

const journeyMilestones = [
  {
    year: "2022",
    title: "Başlangıç",
    description:
      "AYZEK, öğrenme ve iş birliği için bir alan yaratmak isteyen tutkulu teknoloji meraklılarından oluşan bir grup tarafından kuruldu.",
    achievements: ["15 üyeyle ilk buluşma", "Temel değerler oluşturuldu", "Topluluk kuralları oluşturuldu"],
    stats: { members: 15, events: 1, projects: 0 },
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    year: "2022",
    title: "Başlangıç",
    description:
      "AYZEK, öğrenme ve iş birliği için bir alan yaratmak isteyen tutkulu teknoloji meraklılarından oluşan bir grup tarafından kuruldu.",
    achievements: ["15 üyeyle ilk buluşma", "Temel değerler oluşturuldu", "Topluluk kuralları oluşturuldu"],
    stats: { members: 15, events: 1, projects: 0 },
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
 {
    year: "2022",
    title: "Başlangıç",
    description:
      "AYZEK, öğrenme ve iş birliği için bir alan yaratmak isteyen tutkulu teknoloji meraklılarından oluşan bir grup tarafından kuruldu.",
    achievements: ["15 üyeyle ilk buluşma", "Temel değerler oluşturuldu", "Topluluk kuralları oluşturuldu"],
    stats: { members: 15, events: 1, projects: 0 },
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    year: "2022",
    title: "Başlangıç",
    description:
      "AYZEK, öğrenme ve iş birliği için bir alan yaratmak isteyen tutkulu teknoloji meraklılarından oluşan bir grup tarafından kuruldu.",
    achievements: ["15 üyeyle ilk buluşma", "Temel değerler oluşturuldu", "Topluluk kuralları oluşturuldu"],
    stats: { members: 15, events: 1, projects: 0 },
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
]

export function CommunityJourney() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2
      const newVisibleCards = new Set<number>()

      const cards = container.querySelectorAll("[data-card-index]")
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2
        const distanceFromCenter = Math.abs(cardCenter - containerCenter)

        // Card is considered "visible" if it's within the viewport center area
        if (distanceFromCenter < containerRect.width / 3) {
          newVisibleCards.add(index)
        }
      })

      setVisibleCards(newVisibleCards)
    }

    container.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="space-y-0">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold mb-4 gradient-text">Yolculuğumuz</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Küçük bir teknoloji tutkunu grubundan gelişen yenilikçi topluluğa - birlikte nasıl büyüdüğümüzün hikayesi.
        </p>
      </div>

      <div className="relative py-16 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-8 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          <div className="flex gap-8 px-16 min-w-max">
            <div className="absolute top-1/2 left-16 right-16 h-1 bg-ayzek-gradient rounded-full transform -translate-y-1/2 z-0 shadow-lg opacity-60" />

            {journeyMilestones.map((milestone, index) => {
              const isVisible = visibleCards.has(index)

              return (
                <div key={index} className="relative flex-shrink-0 w-96 z-10" data-card-index={index}>

                  <Card
                    className={`w-full shadow-2xl border-2 border-primary/20 bg-background/95 backdrop-blur transition-all duration-700 mt-20 ${
                      isVisible
                        ? "scale-105 shadow-3xl blur-0 opacity-100 translate-y-0"
                        : "scale-95 shadow-lg blur-sm opacity-70 translate-y-4"
                    }`}
                  >
                    <CardHeader className="relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          variant="outline"
                          className={`text-xs transition-all duration-500 ${
                            isVisible ? "bg-primary/10 border-primary/30" : "bg-muted/50"
                          }`}
                        >
                          {milestone.year}
                        </Badge>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{milestone.stats.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{milestone.stats.events}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>{milestone.stats.projects}</span>
                          </div>
                        </div>
                      </div>

                      <CardTitle
                        className={`font-display text-xl mb-3 transition-all duration-500 ${
                          isVisible ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {milestone.title}
                      </CardTitle>

                      <CardDescription
                        className={`leading-relaxed transition-all duration-500 ${
                          isVisible ? "text-foreground/80" : "text-muted-foreground/60"
                        }`}
                      >
                        {milestone.description}
                      </CardDescription>

                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 transition-opacity duration-500 ${
                          isVisible ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </CardHeader>

                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <h4
                          className={`font-medium text-sm transition-colors duration-500 ${
                            isVisible ? "text-primary" : "text-muted-foreground"
                          }`}
                        >
                          Önemli Başarılar:
                        </h4>
                        <ul className="space-y-2">
                          {milestone.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className={`text-sm flex items-start transition-all duration-500 delay-${i * 100} ${
                                isVisible
                                  ? "text-foreground/80 translate-x-0 opacity-100"
                                  : "text-muted-foreground/60 translate-x-2 opacity-70"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 transition-colors duration-500 ${
                                  isVisible ? "bg-primary" : "bg-muted-foreground/40"
                                }`}
                              />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {index < journeyMilestones.length - 1 && (
                    <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-ayzek-gradient transform -translate-y-1/2 z-10 opacity-60">
                      <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary rounded-full transform translate-x-1 -translate-y-1/2 animate-pulse" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-primary/20 shadow-lg">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Yatay kaydırarak keşfedin</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
