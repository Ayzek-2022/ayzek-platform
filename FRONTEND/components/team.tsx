"use client"

import * as React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Linkedin } from "lucide-react"

// Frontend'de kullanılacak veri tipleri
type Member = {
  id: number | string
  name: string
  role?: string
  linkedin?: string
}

type Team = {
  id: number | string
  code: string
  name: string
  logoUrl?: string
  categories: string[]
  members: Member[]
  about?: string
}

function TeamCapsuleCard({ team, palette }: { team: Team; palette: { ring: string; glow:string; pill: string } }) {
  const [open, setOpen] = React.useState(false)
  // const shortCode = team.code

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={[
          "group relative overflow-hidden rounded-[2.5rem]",
          "w-full h-[340px] md:h-[370px]",
          "bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60",
          "border border-white/15",
          "ring-1 ring-white/10",
          "hover:shadow-xl transition-shadow",
          "flex flex-col items-center justify-start p-6",
        ].join(" ")}
        aria-label={`${team.name} kartı`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] p-[1px]">
          <div className={`h-full w-full rounded-[2.4rem] bg-gradient-to-br ${palette.ring} opacity-40`} />
        </div>

        {/* DÜZENLEME: Anasayfadaki canlı görünüm için 'z-10', 'ring-black/20' ve 'dark:ring-black/40' sınıfları eklendi. */}
        <div className={`relative z-10 mt-3 grid place-items-center size-40 rounded-full bg-gradient-to-br ${palette.ring} shadow-xl ${palette.glow} ring-1 ring-black/20 dark:ring-black/40 overflow-hidden`}>
          {team.logoUrl ? (
            <Image 
              src={team.logoUrl} 
              alt={team.name} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Users className="size-8 text-white/90" />
          )}
        </div>
        
        <div className="relative z-10 mt-5 w-full px-3 text-center">
          {team.about ? (
            <p className="text-sm text-white/75 leading-relaxed line-clamp-2">
              {team.about}
            </p>
          ) : (
            <p className="text-sm text-white/60 line-clamp-2">&nbsp;</p>
          )}
        </div>

        <div className="relative z-10 mt-4 text-center">
          <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r ${palette.ring} backdrop-blur-[2px] shadow-md`}>
            {team.name}
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={[
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-[92vw] sm:w-full overflow-hidden",
            "bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60",
            "border border-white/15 ring-1 ring-white/10",
            "text-white",
            "[&>button]:text-white [&>button]:hover:bg-white/10",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/30" />
            <div className={`absolute inset-0 bg-gradient-to-br ${palette.ring} opacity-25`} />
          </div>
          <div className="z-10">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-2">
                <span>{team.name}</span>
                {/* Removed code display span as per instructions */}
                {/* <span className="text-xs font-normal text-muted-foreground">{team.code}</span> */}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {team.about && (
                <p className="text-sm leading-relaxed text-white/85">{team.about}</p>
              )}
              {team.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {team.categories.map((c) => (
                    <Badge key={c} variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                {team.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-md border border-white/10 bg-white/10 backdrop-blur px-3 py-2">
                    <div>
                      <div className="text-sm font-medium leading-tight">{m.name}</div>
                      {m.role && <div className="text-xs text-muted-foreground">{m.role}</div>}
                    </div>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <Linkedin className="size-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TeamsPuzzleGrid({ items }: { items: Team[] }) {
  const PALETTE = [
    { ring: "from-emerald-400 to-green-600", glow: "shadow-emerald-500/30", pill: "bg-emerald-600" },
    { ring: "from-sky-400 to-blue-600", glow: "shadow-sky-500/30", pill: "bg-blue-600" },
    { ring: "from-fuchsia-400 to-violet-600", glow: "shadow-fuchsia-500/30", pill: "bg-violet-600" },
    { ring: "from-amber-400 to-orange-600", glow: "shadow-amber-500/30", pill: "bg-orange-600" },
    { ring: "from-rose-400 to-pink-600", glow: "shadow-rose-500/30", pill: "bg-pink-600" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-3">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t, i) => (
          <TeamCapsuleCard key={t.id} team={t} palette={PALETTE[i % PALETTE.length]} />
        ))}
      </div>
    </div>
  )
}

export function TeamExplorer() {
  const [teams, setTeams] = React.useState<Team[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/teams")
        if (!response.ok) {
          throw new Error("Veriler alınamadı. Sunucu hatası.")
        }
        const dataFromBackend = await response.json()

        const formattedTeams: Team[] = dataFromBackend.map((team: any) => ({
          id: team.id,
          name: team.name,
          logoUrl: team.photo_url,
          about: team.description,
          categories: [team.category],
          code: team.name.toUpperCase(),
          members: team.members.map((member: any) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            linkedin: member.linkedin_url
          }))
        }));

        setTeams(formattedTeams)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (isLoading) {
    return <div className="text-center p-10">Takımlar yükleniyor...</div>
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Hata: {error}</div>
  }

  return (
    <div className="relative w-full">
      <Separator className="my-6" />
      <TeamsPuzzleGrid items={teams} />
    </div>
  )
}