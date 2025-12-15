"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin } from "lucide-react"

const CATEGORIES = [
  { key: "Başkan ve Yardımcılar", title: "Başkan ve Yardımcılar" },
  { key: "Sosyal Medya ve Tasarım", title: "Sosyal Medya ve Tasarım" },
  { key: "Etkinlik ve Organizasyon", title: "Etkinlik ve Organizasyon" },
  { key: "Eğitim ve Proje", title: "Eğitim ve Proje" },
  { key: "Sponsorluk ve Reklam", title: "Sponsorluk ve Reklam" },
] as const;

type CrewMember = {
  id: number;
  name: string;
  role: string;
  description: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  category: string;
  order_index: number;
}

type GroupedCrewMembers = Record<string, CrewMember[]>;

export function TeamSection() {
  const [groupedMembers, setGroupedMembers] = useState<GroupedCrewMembers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrewMembers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/crew/");
        if (!response.ok) throw new Error("Ekip üyeleri verisi alınamadı.");
        const data: GroupedCrewMembers = await response.json();
        setGroupedMembers(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Ekip üyeleri çekilirken hata:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCrewMembers();
  }, []);

  if (isLoading) return <div className="text-center py-20">Ekibimiz yükleniyor...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Hata: {error}</div>;

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12">
      <div className="text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-bold mb-2 sm:mb-3 gradient-text">Ekibimizle Tanışın</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-xs sm:text-sm md:text-base">
          AYZEK'i teknoloji meraklıları ve yenilikçiler için canlı bir topluluk haline getiren tutkulu bireylerdir.
        </p>
      </div>

      {CATEGORIES.map(({ key, title }) => {
        const members = groupedMembers[key] || [];
        if (members.length === 0) return null;

        return (
          <section key={key} className="space-y-3 sm:space-y-4">
            <h3 className="inline-block text-sm sm:text-base md:text-lg font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary shadow-sm">
              {title}
            </h3>

            {/* Mobil: tek sütun minimalist | sm: 2 sütun | lg+: 3-4 sütun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {members.map((member) => (
                <Card 
                  key={member.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-black/80 border border-black/10 dark:border-white/10 backdrop-blur-sm rounded-xl"
                >
                  <CardHeader className="text-center p-3 sm:p-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-2 sm:mb-3">
                      <img
                        src={member.photo_url || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardTitle className="font-display text-sm sm:text-base md:text-lg">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="text-primary font-medium text-xs sm:text-sm">
                      {member.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center line-clamp-3">
                      {member.description || ""}
                    </p>
                    {(member.github_url || member.linkedin_url) && (
                      <div className="flex justify-center gap-2 pt-1">
                        {member.github_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                          </Button>
                        )}
                        {member.linkedin_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                              <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  )
}
