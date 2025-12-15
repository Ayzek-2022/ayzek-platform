"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Trash2, Edit } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "")
const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } })

type GalleryEvent = {
  id: number
  category: string
  image_url: string
  title: string
  description: string
  date: string
  location: string
}

const normalizeImageUrl = (v: string) => {
  const s = (v || "").trim()
  if (!s) return ""
  if (s.startsWith("http://") || s.startsWith("https://")) return s
  const path = s.startsWith("/") ? s : `/${s}`
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) return `${API_BASE}${path}`
  return path
}

export function GalleryManagement({ onNotify }: { onNotify: (msg: string) => void }) {
  const [items, setItems] = useState<GalleryEvent[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [newItem, setNewItem] = useState({ title: "", description: "", image_url: "", category: "Workshop", date: "", location: "" })
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState<GalleryEvent | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const { data } = await api.get<GalleryEvent[]>("/api/gallery-events", { headers: { "Cache-Control": "no-cache" } })
      setItems(data.sort((a, b) => (a.date < b.date ? 1 : -1)))
    } catch (e) {
      console.error("Galeri list hata:", e)
    }
  }

  const handleAdd = async () => {
    const { title, description, image_url, category, date, location } = newItem
    if (!title || !description || !image_url || !category || !date || !location) return
    try {
      const payload = { title, description, image_url: normalizeImageUrl(image_url), category, date, location }
      const { data } = await api.post<GalleryEvent>("/api/gallery-events", payload)
      setItems((prev) => [data, ...prev])
      setNewItem({ title: "", description: "", image_url: "", category: "Workshop", date: "", location: "" })
      setAddOpen(false)
      onNotify("Galeri eklendi")
    } catch (e) {
      console.error("Galeri ekle hata:", e)
    }
  }

  const handleUpdate = async () => {
    if (!editItem) return
    try {
      const payload = {
        title: editItem.title,
        description: editItem.description,
        image_url: normalizeImageUrl(editItem.image_url),
        category: editItem.category,
        date: editItem.date,
        location: editItem.location,
      }
      const { data } = await api.put<GalleryEvent>(`/api/gallery-events/${editItem.id}`, payload)
      setItems(prev => prev.map(x => (x.id === data.id ? data : x)))
      setEditOpen(false)
      onNotify("Galeri güncellendi")
    } catch (e) {
      console.error("Galeri güncelle hata:", e)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Galeri öğesini silmek istediğinizden emin misiniz?")) return
    try {
      await api.delete(`/api/gallery-events/${id}`)
      setItems((prev) => prev.filter((g) => g.id !== id))
      onNotify("Galeri silindi")
    } catch (e) {
      console.error("Galeri sil hata:", e)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 w-full">
          <Edit className="w-4 h-4 mr-2" /> Galeri Yönet
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Galeri Yönetimi</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <div className="relative w-full h-10 rounded flex items-center justify-center">
            <div className="absolute inset-0 rounded bg-ayzek-gradient" />
            <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
              Etkinlik Galerisi Yönetimi
            </span>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent">Yeni Galeri Öğesi Ekle</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-primary/20">
              <DialogHeader>
                <DialogTitle>Yeni Galeri Öğesi</DialogTitle>
                <DialogDescription>Etkinlik galerisine yeni bir görsel ekleyin</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Başlık *</Label><Input value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} /></div>
                <div><Label>Açıklama *</Label><Textarea value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} rows={3} /></div>
                <div>
                  <Label>Görsel *</Label>
                  <div className="flex gap-2">
                    <Input placeholder="URL girin veya dosya seçin" value={newItem.image_url} onChange={(e) => setNewItem((p) => ({ ...p, image_url: e.target.value }))} className="flex-1" />
                    <div className="relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewItem((p) => ({ ...p, image_url: e.target.files![0].name }))
                        }
                      }} />
                      <Button type="button" variant="outline" className="border-primary/20 pointer-events-none">
                        <ImageIcon className="w-4 h-4 mr-2" /> Dosya Seç
                      </Button>
                    </div>
                  </div>
                </div>
                <div><Label>Kategori *</Label><Input placeholder="Workshop, Meetup, etc." value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))} /></div>
                <div><Label>Tarih *</Label><Input type="date" value={newItem.date} onChange={(e) => setNewItem((p) => ({ ...p, date: e.target.value }))} /></div>
                <div><Label>Konum *</Label><Input value={newItem.location} onChange={(e) => setNewItem((p) => ({ ...p, location: e.target.value }))} /></div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAdd} className="flex-1 bg-ayzek-gradient hover:opacity-90">Ekle</Button>
                  <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1">İptal</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                <img src={normalizeImageUrl(item.image_url)} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.location} • {item.date}</p>
                <div className="flex justify-end mt-2 gap-1">
                  <Button size="sm" variant="outline" onClick={() => { setEditItem(item); setEditOpen(true); }}>Düzenle</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!items.length && <div className="text-sm text-muted-foreground px-2 py-6 text-center col-span-3">Henüz galeri öğesi yok.</div>}
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader><DialogTitle>Galeri Düzenle</DialogTitle></DialogHeader>
            {editItem && (
              <div className="space-y-4">
                <div><Label>Başlık</Label><Input value={editItem.title} onChange={(e)=>setEditItem({...editItem, title:e.target.value})}/></div>
                <div><Label>Açıklama</Label><Textarea value={editItem.description} onChange={(e)=>setEditItem({...editItem, description:e.target.value})}/></div>
                <div>
                  <Label>Görsel URL</Label>
                  <div className="flex gap-2">
                    <Input value={editItem.image_url} onChange={(e)=>setEditItem({...editItem, image_url:e.target.value})} className="flex-1" placeholder="URL girin veya dosya seçin" />
                    <div className="relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setEditItem({...editItem, image_url: e.target.files[0].name})
                        }
                      }} />
                      <Button type="button" variant="outline" className="border-primary/20 pointer-events-none">
                        <ImageIcon className="w-4 h-4 mr-2" /> Dosya Seç
                      </Button>
                    </div>
                  </div>
                </div>
                <div><Label>Kategori</Label><Input value={editItem.category} onChange={(e)=>setEditItem({...editItem, category:e.target.value})}/></div>
                <div><Label>Tarih</Label><Input type="date" value={editItem.date} onChange={(e)=>setEditItem({...editItem, date:e.target.value})}/></div>
                <div><Label>Konum</Label><Input value={editItem.location} onChange={(e)=>setEditItem({...editItem, location:e.target.value})}/></div>
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

