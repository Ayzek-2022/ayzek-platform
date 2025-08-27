"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";

// API tipleri (tags artık hem string[] hem string olabiliyor)
export interface TeamMember {
  id: number;
  full_name: string;
  role: string;
  description?: string | null;
  interests?: string | null;
  tags: string[] | string | null;   // <— değişti
  image_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
}

const API = process.env.NEXT_PUBLIC_API_URL as string; // örn: http://localhost:8000

// —— ETİKET DÜZELTME ——
// gelen veri ister "Liderlik, Tam..." string’i olsun, ister yanlışlıkla harf listesi gelsin,
// her koşulda ["Liderlik", "Tam ..."] dizisine çevirir.
function normalizeTags(tags: string[] | string | null | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    // harf harf gelmiş bir listeyse ve arada virgül varsa birleştirip tekrar böl
    if (tags.length > 6 && tags.every(t => typeof t === "string" && t.length === 1)) {
      return tags
        .join("")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }
    return tags.filter(Boolean);
  }
  // string ise virgüllere göre böl
  return tags
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

export default function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`${API}/team`, { signal: controller.signal, next: { revalidate: 60 } as any });
        if (!res.ok) throw new Error(`Sunucu hatası: ${res.status}`);
        const data: TeamMember[] = await res.json();
        setTeam(data);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Bilinmeyen hata");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const skeleton = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full bg-muted" />
            <div className="h-5 w-40 bg-muted rounded mx-auto mb-2" />
            <div className="h-4 w-24 bg-muted rounded mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="h-3 w-full bg-muted rounded mb-2" />
            <div className="h-3 w-5/6 bg-muted rounded mb-2" />
            <div className="h-3 w-2/3 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Ekibimizle Tanışın</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AYZEK'i teknoloji meraklıları ve yenilikçiler için canlı bir topluluk haline getiren tutkulu bireylerdir.
        </p>
      </div>

      {loading && skeleton}

      {!loading && error && <div className="text-center text-red-500">Bir şeyler ters gitti: {error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map(member => {
            const tags = normalizeTags(member.tags);
            return (
              <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <img
                      src={member.image_url || "/placeholder.svg"}
                      alt={member.full_name}
                      className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardTitle className="font-display text-xl">{member.full_name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-2">
                    {member.github_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {member.linkedin_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {/* E-posta sahası yok; istersen models & schemas'a email ekleyebiliriz */}
                    {false && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:example@example.com`} aria-label="Mail">
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
