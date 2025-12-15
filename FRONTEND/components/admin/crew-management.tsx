"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Trash2, Users, Edit } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "")
const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } })

type CrewMemberOut = {
  id: number
  name: string
  role: string
  description: string | null
  category: string
  photo_url: string | null
  linkedin_url: string | null
  github_url: string | null
  order_index: number
}

type CrewCategory = "Başkan ve Yardımcılar" | "Sosyal Medya ve Tasarım" | "Etkinlik ve Organizasyon" | "Eğitim ve Proje"

const CREW_CATEGORIES: CrewCategory[] = [
  "Başkan ve Yardımcılar",
  "Sosyal Medya ve Tasarım",
  "Etkinlik ve Organizasyon",
  "Eğitim ve Proje",
]

export function CrewManagement({ onNotify }: { onNotify: (msg: string) => void }) {
  const [crewMembers, setCrewMembers] = useState<Record<string, CrewMemberOut[]>>({})
  const [loading, setLoading] = useState(true)
  const [selectedCat, setSelectedCat] = useState<CrewCategory>("Başkan ve Yardımcılar")
  const [addOpen, setAddOpen] = useState(false)
  const initialNewCrewState = { name: "", role: "", description: "", photo_url: "", linkedin_url: "", github_url: "" }
  const [newCrew, setNewCrew] = useState(initialNewCrewState)
  const [editOpen, setEditOpen] = useState(false)
  const [editCrew, setEditCrew] = useState<CrewMemberOut | null>(null)

  useEffect(() => {
    fetchCrewMembers()
  }, [])

  const fetchCrewMembers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get<Record<string, CrewMemberOut[]>>("/crew/")
      setCrewMembers(data)
    } catch (e) {
      console.error("Ekip üyeleri getirilirken hata:", e)
      onNotify("Ekip üyeleri yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newCrew.name || !newCrew.role) {
      onNotify("İsim ve Görev alanları zorunludur")
      return
    }
    const payload = {
      ...newCrew,
      category: selectedCat,
      description: newCrew.description || null,
      photo_url: newCrew.photo_url || null,
      linkedin_url: newCrew.linkedin_url || null,
      github_url: newCrew.github_url || null,
    }
    try {
      const { data } = await api.post<CrewMemberOut>("/crew/", payload)
      setCrewMembers(prev => {
        const categoryData = prev[data.category] ? [...prev[data.category], data] : [data]
        return { ...prev, [data.category]: categoryData }
      })
      setNewCrew(initialNewCrewState)
      setAddOpen(false)
      onNotify(`"${data.name}" kişisi ${data.category} kategorisine eklendi`)
    } catch (e) {
      console.error("Ekip üyesi eklenirken hata:", e)
      onNotify("Ekip üyesi eklenemedi")
    }
  }

  const handleUpdate = async () => {
    if (!editCrew) return
    try {
      const payload = {
        name: editCrew.name,
        role: editCrew.role,
        description: editCrew.description || null,
        category: editCrew.category,
        photo_url: editCrew.photo_url || null,
        linkedin_url: editCrew.linkedin_url || null,
        github_url: editCrew.github_url || null,
        order_index: editCrew.order_index,
      }
      const { data } = await api.put<CrewMemberOut>(`/crew/${editCrew.id}`, payload)
      setCrewMembers(prev => {
        const cp = { ...prev }
        cp[data.category] = (cp[data.category] || []).map(x => (x.id === data.id ? data : x))
        return cp
      })
      setEditOpen(false)
      onNotify(`"${data.name}" güncellendi`)
    } catch (e) {
      console.error("Crew güncelle hata:", e)
    }
  }

  const handleDelete = async (memberId: number) => {
    if (!confirm(`#${memberId} ID'li üyeyi silmek istediğinizden emin misiniz?`)) return
    try {
      await api.delete(`/crew/${memberId}`)
      const updatedCrewMembers: Record<string, CrewMemberOut[]> = {}
      for (const category in crewMembers) {
        updatedCrewMembers[category] = crewMembers[category].filter(p => p.id !== memberId)
      }
      setCrewMembers(updatedCrewMembers)
      onNotify("Üye silindi")
    } catch (e) {
      console.error("Ekip üyesi silinirken hata:", e)
      onNotify("Üye silinemedi")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 w-full">
          <Edit className="w-4 h-4 mr-2" /> Ekibi Yönet
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <VisuallyHidden>
          <DialogTitle>Ekip Yönetimi</DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <div className="relative w-full h-10 rounded flex items-center justify-center">
            <div className="absolute inset-0 rounded bg-ayzek-gradient" />
            <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
              Ekibimiz — Kategori Yönetimi
            </span>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Label>Kategori Seç</Label>
            <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value as CrewCategory)} className="w-full h-10 rounded-md border bg-background/50 px-3">
              {CREW_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent mt-6">Üye Ekle</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-primary/20 max-w-lg">
              <DialogHeader>
                <DialogTitle>{selectedCat} — Yeni Üye</DialogTitle>
                <DialogDescription>Yeni üyenin bilgilerini girin</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div><Label>İsim Soyisim *</Label><Input value={newCrew.name} onChange={(e) => setNewCrew(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label>Görevi *</Label><Input value={newCrew.role} onChange={(e) => setNewCrew(p => ({ ...p, role: e.target.value }))} /></div>
                <div><Label>Açıklama (Kısa Konuşma)</Label><Textarea value={newCrew.description} onChange={(e) => setNewCrew(p => ({ ...p, description: e.target.value }))} rows={3} /></div>
                <div>
                  <Label>Fotoğraf (opsiyonel)</Label>
                  <div className="flex gap-2">
                    <Input value={newCrew.photo_url} onChange={(e) => setNewCrew(p => ({ ...p, photo_url: e.target.value }))} className="flex-1" placeholder="URL girin veya dosya seçin" />
                    <div className="relative">
                      <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewCrew(p => ({ ...p, photo_url: e.target.files![0].name }))
                        }
                      }} />
                      <Button type="button" variant="outline" className="border-primary/20 pointer-events-none">
                        <ImageIcon className="w-4 h-4 mr-2" /> Dosya Seç
                      </Button>
                    </div>
                  </div>
                </div>
                <div><Label>LinkedIn URL</Label><Input value={newCrew.linkedin_url} onChange={(e) => setNewCrew(p => ({ ...p, linkedin_url: e.target.value }))} /></div>
                <div><Label>GitHub URL</Label><Input value={newCrew.github_url} onChange={(e) => setNewCrew(p => ({ ...p, github_url: e.target.value }))} /></div>
                <div className="flex gap-2 pt-2">
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
          <div className="space-y-6">
            {CREW_CATEGORIES.filter(cat => crewMembers[cat] && crewMembers[cat].length > 0).map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="text-lg font-semibold">{category}</h3>
                <div className="grid gap-3">
                  {crewMembers[category].map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start gap-4">
                        {member.photo_url && (
                          <img src={member.photo_url} alt={member.name} className="w-16 h-16 rounded-full object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          {member.description && <p className="text-sm mt-1">{member.description}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditCrew(member); setEditOpen(true); }}>Düzenle</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(crewMembers).length === 0 && (
              <div className="text-sm text-muted-foreground px-2 py-6 text-center">Henüz ekip üyesi yok. Kategori seçip üye ekleyin.</div>
            )}
          </div>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-card border-primary/20 max-w-lg">
            <DialogHeader><DialogTitle>Üyeyi Düzenle</DialogTitle></DialogHeader>
            {editCrew && (
              <div className="space-y-3">
                <div><Label>İsim Soyisim</Label><Input value={editCrew.name} onChange={(e)=>setEditCrew({...editCrew, name:e.target.value})}/></div>
                <div><Label>Görevi</Label><Input value={editCrew.role} onChange={(e)=>setEditCrew({...editCrew, role:e.target.value})}/></div>
                <div><Label>Açıklama</Label><Textarea value={editCrew.description ?? ""} onChange={(e)=>setEditCrew({...editCrew, description:e.target.value})}/></div>
                <div><Label>Fotoğraf URL</Label><Input value={editCrew.photo_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, photo_url:e.target.value})}/></div>
                <div><Label>LinkedIn URL</Label><Input value={editCrew.linkedin_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, linkedin_url:e.target.value})}/></div>
                <div><Label>GitHub URL</Label><Input value={editCrew.github_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, github_url:e.target.value})}/></div>
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

