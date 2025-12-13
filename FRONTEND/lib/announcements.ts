// lib/announcements.ts
export type AnnouncementKind =
  | "poster" | "event" | "blog" | "timeline" | "team" | "system" 

export type Announcement = {
  id: string
  kind: AnnouncementKind
  title: string
  message: string
  href?: string
  createdAt: number
  read?: boolean
}

export const KIND_META: Record<AnnouncementKind, { label: string; ring: string }> = {
  poster:   { label: "Poster",   ring: "ring-fuchsia-500/60" },
  event:    { label: "Etkinlik", ring: "ring-cyan-500/60" },
  blog:     { label: "Blog",     ring: "ring-blue-500/60" },
  timeline: { label: "Timeline", ring: "ring-amber-500/60" },
  team:     { label: "Takım",    ring: "ring-emerald-500/60" },
  system:   { label: "Sistem",   ring: "ring-slate-500/60" },
}