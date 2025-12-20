"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import axios from "axios" // Axios import edildi
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"

// --- AYARLAR ---
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "")
const api = axios.create({ baseURL: API_BASE })

function normalizeImageUrl(v: string | null | undefined) {
  const s = (v || "").trim()
  if (!s) return null

  // 1. Tam link ise dokunma
  if (s.startsWith("http://") || s.startsWith("https://")) return s

  // 2. Başında slash yoksa ekle
  const path = s.startsWith("/") ? s : `/${s}`

  // 3. Backend'den gelen dosya ise
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) {
     return `${API_BASE}${path}`
  }

  // 4. Diğer durumlar
  return path
}
// -----------------------------

// === Backend tipleri ===
type BlogFromAPI = {
  id: number
  title: string
  content: string
  author: string
  category: string
  cover_image?: string | null
  date: string
  preview?: string | null
}

type BlogListResponse = {
  items: BlogFromAPI[]
  total: number
  page: number
  page_size: number
}

// === UI tipi (kartlar için) ===
type BlogPost = {
  id: number
  title: string
  category: string
  date: string
  excerpt: string
  content: string
  authorName: string
  coverImage?: string | null
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("")
}

export function BlogExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  // Kategori şeridi scroll
  const catsRef = useRef<HTMLDivElement | null>(null)
  const scrollCats = (dir: "left" | "right") => {
    const el = catsRef.current
    if (!el) return
    const delta = Math.max(200, el.clientWidth * 0.6)
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" })
  }

  // Backend’ten listeyi çek (seçilen kategoriye göre)
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError("")
        const params: Record<string, string | number> = { page: 1, page_size: 30 }
        if (selectedCategory !== "all") {
          params.category = selectedCategory 
        }
        const { data } = await api.get<BlogListResponse>("/blogs", { params })
        if (cancelled) return

        const mapped: BlogPost[] = (data.items || []).map((b) => ({
          id: b.id,
          title: b.title,
          category: (b.category || "").toString().trim(),
          date: b.date,
          excerpt:
            (b.preview && b.preview.trim()) ||
            (b.content ? b.content.replace(/\s+/g, " ").slice(0, 160) + "…" : ""),
          content: b.content,
          authorName: b.author || "AYZEK Ekibi",
          coverImage: normalizeImageUrl(b.cover_image),
        }))
        setPosts(mapped)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || "Bloglar yüklenemedi.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedCategory])

  // Dinamik benzersiz kategoriler
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>()
    for (const p of posts) {
      const cat = (p.category || "").trim()
      if (cat) set.add(cat)
    }
    return Array.from(set)
  }, [posts])

  const filtered = posts 

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("tr-TR")
  }

  return (
    <div className="space-y-8">
      {/* Kategori filtreleri */}
      <div className="flex items-center gap-1.5 sm:gap-2 w-full">
        {uniqueCategories.length > 10 && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollCats("left")}
            aria-label="Kategorileri sola kaydır"
            className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}

        <div ref={catsRef} className="flex-1 max-w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-2">
            <Button
              key="all"
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className="text-[10px] sm:text-xs whitespace-nowrap h-7 sm:h-8 px-2 sm:px-3"
              onClick={() => setSelectedCategory("all")}
            >
              Tümü
            </Button>

            {uniqueCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="text-[10px] sm:text-xs whitespace-nowrap h-7 sm:h-8 px-2 sm:px-3"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}

            {uniqueCategories.length === 0 && (
              <span className="text-[10px] sm:text-xs text-muted-foreground">Kategori bulunamadı</span>
            )}
          </div>
        </div>

        {uniqueCategories.length > 10 && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollCats("right")}
            aria-label="Kategorileri sağa kaydır"
            className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          >
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </div>

      {/* Yükleniyor / Hata */}
      {loading && <div className="text-xs sm:text-sm text-muted-foreground text-center py-4">Yükleniyor…</div>}
      {error && <div className="text-xs sm:text-sm text-red-500 text-center py-4">{error}</div>}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {filtered.map((post) => (
          <Card
            key={post.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-white/10 h-full flex flex-col relative"
          >
            <div className="absolute inset-0 bg-black -z-10" />
            
            {/* Kapak görseli */}
            {post.coverImage ? (
              <div className="relative h-36 sm:h-40 md:h-44 flex-shrink-0 bg-black">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                  <Badge className="bg-primary text-primary-foreground border-0 shadow-sm text-[10px] sm:text-xs">
                    {post.category || "Blog"}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="relative h-36 sm:h-40 md:h-44 flex-shrink-0 bg-black flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                  <Badge className="bg-primary text-primary-foreground border-0 shadow-sm text-[10px] sm:text-xs">
                    {post.category || "Blog"}
                  </Badge>
                </div>
                <div className="text-muted-foreground/30 text-4xl sm:text-5xl md:text-6xl font-bold relative z-10">
                  {initials(post.title)}
                </div>
              </div>
            )}

            <CardContent className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col justify-between bg-black">
              <div>
                <CardTitle className="font-display text-base sm:text-lg mb-1.5 sm:mb-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="mb-3 sm:mb-4 line-clamp-3 text-xs sm:text-sm">
                  {post.excerpt}
                </CardDescription>

                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] sm:text-xs">
                      <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-[9px] sm:text-[10px] font-semibold">
                        {initials(post.authorName)}
                      </span>
                      <span className="font-medium">{post.authorName}</span>
                    </span>
                    <span className="text-foreground/70 text-[10px] sm:text-xs">{formatDate(post.date)}</span>
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full text-xs sm:text-sm h-8 sm:h-9 md:h-10" onClick={() => setSelectedPost(post)}>
                    Yazıyı Oku
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">{post.title}</DialogTitle>
                  </DialogHeader>

                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-[10px] font-semibold">
                        {initials(post.authorName)}
                      </span>
                      <span className="font-medium">{post.authorName}</span>
                    </span>
                    <span className="px-2 py-1 rounded-full bg-muted text-foreground/80 border">
                      {formatDate(post.date)}
                    </span>
                    {!!post.category && (
                      <span className="px-2 py-1 rounded-full border bg-primary/10 text-primary">
                        {post.category}
                      </span>
                    )}
                  </div>

                  <div className="h-px bg-border mb-4" />

                  {/* İçerik */}
                  <div className="max-h-[60vh] overflow-auto pr-2">
                    {post.coverImage && (
                        <img src={post.coverImage} alt={post.title} className="w-full h-auto mb-4 rounded-lg" />
                    )}
                    {/* DÜZELTME: break-words eklendi */}
                    <article className="text-[15px] leading-7 text-foreground/90 whitespace-pre-wrap break-words">
                      {post.content}
                    </article>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-display font-semibold mb-2">Yazı bulunamadı</h3>
          <p className="text-muted-foreground">Bu filtreyle eşleşen blog yazısı yok.</p>
        </div>
      )}
    </div>
  )
}