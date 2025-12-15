"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Trash2, FileText, Edit } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "")
const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } })

type BlogOut = {
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
  items: BlogOut[]
  total: number
  page: number
  page_size: number
}

const normalizeImageUrl = (v: string) => {
  const s = (v || "").trim()
  if (!s) return ""
  if (s.startsWith("http://") || s.startsWith("https://")) return s
  const path = s.startsWith("/") ? s : `/${s}`
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) return `${API_BASE}${path}`
  return path
}

const fmtDateTR = (d: string) => {
  const dt = new Date(`${d}T00:00:00`)
  return isNaN(+dt) ? d : dt.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
}

export function BlogManagement({ onNotify }: { onNotify: (msg: string) => void }) {
  const [items, setItems] = useState<BlogOut[]>([])
  const [loading, setLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [newBlog, setNewBlog] = useState({ title: "", description: "", author: "", category: "", image: "", date: "", preview: "" })
  const [editOpen, setEditOpen] = useState(false)
  const [editBlog, setEditBlog] = useState<BlogOut | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<BlogListResponse>("/blogs", { params: { page: 1, page_size: 100 } })
      setItems(data.items || [])
    } catch (e) {
      console.error("Blog list hata:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    const { title, description, author, category, image, date, preview } = newBlog
    if (!title || !date || !description || !author || !category) return
    try {
      const payload = {
        title,
        content: description,
        author,
        category,
        cover_image: normalizeImageUrl(image) || undefined,
        date,
        preview: preview || undefined,
      }
      const { data } = await api.post<BlogOut>("/blogs", payload)
      setItems((prev) => [data, ...prev])
      setNewBlog({ title: "", description: "", author: "", category: "", image: "", date: "", preview: "" })
      setAddOpen(false)
      onNotify(`"${data.title}" eklendi`)
    } catch (e) {
      console.error("Blog ekle hata:", e)
    }
  }

  const handleUpdate = async () => {
    if (!editBlog) return
    try {
      const payload = {
        title: editBlog.title,
        content: editBlog.content,
        author: editBlog.author,
        category: editBlog.category,
        cover_image: normalizeImageUrl(editBlog.cover_image || "") || undefined,
        date: editBlog.date,
        preview: editBlog.preview || undefined,
      }
      const { data } = await api.put<BlogOut>(`/blogs/${editBlog.id}`, payload)
      setItems((prev) => prev.map((x) => (x.id === data.id ? data : x)))
      setEditOpen(false)
      onNotify(`"${data.title}" güncellendi`)
    } catch (e) {
      console.error("Blog güncelle hata:", e)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Blog yazısını silmek istediğinizden emin misiniz?")) return
    try {
      await api.delete(`/blogs/${id}`)
      setItems((prev) => prev.filter((b) => b.id !== id))
      onNotify("Blog silindi")
    } catch (e) {
      console.error("Blog sil hata:", e)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 w-full">
          <Edit className="w-4 h-4 mr-2" /> Blogları Yönet
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Blog Yönetimi</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <div className="relative w-full h-10 rounded flex items-center justify-center">
            <div className="absolute inset-0 rounded bg-ayzek-gradient" />
            <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
              Blog Yönetimi
            </span>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent">Yeni Blog Ekle</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-primary/20 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Blog Yazısı</DialogTitle>
                <DialogDescription>Yeni bir blog yazısı oluşturun</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Başlık *</Label><Input value={newBlog.title} onChange={(e) => setNewBlog((p) => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>İçerik *</Label><Textarea value={newBlog.description} onChange={(e) => setNewBlog((p) => ({ ...p, description: e.target.value }))} rows={6} /></div>
                <div><Label>Önizleme Metni</Label><Textarea value={newBlog.preview} onChange={(e) => setNewBlog((p) => ({ ...p, preview: e.target.value }))} rows={2} placeholder="Kısa özet..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Yazar *</Label><Input value={newBlog.author} onChange={(e) => setNewBlog((p) => ({ ...p, author: e.target.value }))} /></div>
                  <div><Label>Kategori *</Label><Input value={newBlog.category} onChange={(e) => setNewBlog((p) => ({ ...p, category: e.target.value }))} /></div>
                </div>
                <div><Label>Tarih *</Label><Input type="date" value={newBlog.date} onChange={(e) => setNewBlog((p) => ({ ...p, date: e.target.value }))} /></div>
                <div>
                  <Label>Kapak Görseli (opsiyonel)</Label>
                  <div className="flex gap-2">
                    <Input value={newBlog.image} onChange={(e) => setNewBlog((p) => ({ ...p, image: e.target.value }))} placeholder="URL girin veya dosya seçin" className="flex-1" />
                    <div className="relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewBlog((p) => ({ ...p, image: e.target.files![0].name }))
                        }
                      }} />
                      <Button type="button" variant="outline" className="border-primary/20 pointer-events-none">
                        <ImageIcon className="w-4 h-4 mr-2" /> Dosya Seç
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAdd} className="flex-1 bg-ayzek-gradient hover:opacity-90">Ekle</Button>
                  <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1">İptal</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Yükleniyor...</div>
        ) : (
          <div className="grid gap-4">
            {items.map((blog) => (
              <Card key={blog.id} className="p-4">
                <div className="flex items-start gap-4">
                  {blog.cover_image && (
                    <img src={normalizeImageUrl(blog.cover_image)} alt={blog.title} className="w-24 h-24 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground">{blog.author} • {blog.category} • {fmtDateTR(blog.date)}</p>
                    <p className="text-sm mt-2 line-clamp-2">{blog.preview || blog.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditBlog(blog); setEditOpen(true); }}>Düzenle</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {!items.length && <div className="text-sm text-muted-foreground px-2 py-6 text-center">Henüz blog yazısı yok.</div>}
          </div>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-card border-primary/20 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Blog Düzenle</DialogTitle></DialogHeader>
            {editBlog && (
              <div className="space-y-4">
                <div><Label>Başlık</Label><Input value={editBlog.title} onChange={(e)=>setEditBlog({...editBlog, title:e.target.value})}/></div>
                <div><Label>İçerik</Label><Textarea value={editBlog.content} onChange={(e)=>setEditBlog({...editBlog, content:e.target.value})} rows={6}/></div>
                <div><Label>Önizleme</Label><Textarea value={editBlog.preview || ""} onChange={(e)=>setEditBlog({...editBlog, preview:e.target.value})} rows={2}/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Yazar</Label><Input value={editBlog.author} onChange={(e)=>setEditBlog({...editBlog, author:e.target.value})}/></div>
                  <div><Label>Kategori</Label><Input value={editBlog.category} onChange={(e)=>setEditBlog({...editBlog, category:e.target.value})}/></div>
                </div>
                <div><Label>Tarih</Label><Input type="date" value={editBlog.date} onChange={(e)=>setEditBlog({...editBlog, date:e.target.value})}/></div>
                <div>
                  <Label>Kapak Görseli (opsiyonel)</Label>
                  <div className="flex gap-2">
                    <Input value={editBlog.cover_image || ""} onChange={(e)=>setEditBlog({...editBlog, cover_image:e.target.value})} placeholder="URL girin veya dosya seçin" className="flex-1" />
                    <div className="relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEditBlog({ ...editBlog, cover_image: e.target.files[0].name })
                        }
                      }} />
                      <Button type="button" variant="outline" className="border-primary/20 pointer-events-none">
                        <ImageIcon className="w-4 h-4 mr-2" /> Dosya Seç
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdate}>Kaydet</Button>
                  <Button variant="outline" className="flex-1" onClick={()=>setEditOpen(false)}>Kapat</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

