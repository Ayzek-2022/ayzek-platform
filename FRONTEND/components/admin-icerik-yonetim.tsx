"use client"

import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalendarDays,
  Clock,
  Edit,
  GalleryThumbnailsIcon as Gallery,
  Home,
  ImageIcon,
  MapPin,
  Trash2,
  Plus,
  GripVertical,
  Users,
  Star // <-- yalnızca ikon importu eklendi
} from "lucide-react"

// ------------ API Helper (eski back bağlantıları AYNEN duruyor) ------------
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000").replace(/\/+$/, "")
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
})
const errMsg = (e: unknown) =>
  (e as AxiosError)?.response?.data
    ? JSON.stringify((e as AxiosError).response?.data)
    : (e as Error)?.message || "İstek başarısız"

// ------------ Tipler (eski tipler AYNEN duruyor) ------------
type PosterOut = {
  id: number
  title: string
  subtitle?: string | null
  content?: string | null
  image_url?: string | null
  is_active: boolean
  order_index: number
}

type TimelineOut = {
  id: number
  title: string
  description: string
  category: string
  date_label: string
  image_url?: string | null
}

type GalleryEvent = {
  id: number
  category: string
  image_url: string
  title: string
  description: string
  date: string // "YYYY-MM-DD"
  location: string
}

// ===== YENİ: YOLCULUĞUMUZ İÇİN TİPLER =====
type JourneyPersonOut = {
  id: number;
  year: number;
  name: string;
  role: string;
  description: string;
  photo_url: string | null;
}
// ==========================================

// ---- Blog (backend) ----
type BlogOut = {
  id: number
  title: string
  content: string
  author: string
  category: string
  cover_image?: string | null
  date: string // YYYY-MM-DD
  preview?: string | null
}
type BlogListResponse = {
  items: BlogOut[]
  total: number
  page: number
  page_size: number
}
// Backend'den gelen takım üyesi verisi
type TeamMemberOut = {
  id: number;
  name: string;
  role: string;
  linkedin_url: string | null;
}
// Backend'den gelen tam takım verisi
type TeamOut = {
  id: number;
  name: string;
  project_name: string;
  category: string;
  description: string;
  photo_url: string | null;
  is_featured: boolean;
  members: TeamMemberOut[];
}
// Yeni takım formundaki bir üye satırı için tip
type NewTeamMember = {
  name: string;
  role: string;
  linkedin_url: string;
}
type CrewMemberOut = {
  id: number;
  name: string;
  role: string;
  description: string | null;
  category: string;
  photo_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  order_index: number;
}

// ------------ Yardımcılar ------------
function normalizeImageUrl(v: string) {
  const s = (v || "").trim()
  if (!s) return ""

  // Eğer zaten tam bir http linkiyse (örn: https://google.com/img.jpg) dokunma
  if (s.startsWith("http://") || s.startsWith("https://")) return s

  // Başında slash yoksa ekle
  const path = s.startsWith("/") ? s : `/${s}`

  // Eğer yol /public veya /uploads ile başlıyorsa, bu Backend'deki bir dosyadır.
  // Başına API_BASE (http://127.0.0.1:8000) eklemeliyiz.
  if (path.startsWith("/public/") || path.startsWith("/uploads/")) {
     return `${API_BASE}${path}`
  }

  // Diğer durumlar için olduğu gibi döndür
  return path
}


const fmtDateTR = (d: string) => {
  const dt = new Date(`${d}T00:00:00`)
  return isNaN(+dt)
    ? d
    : dt.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })
}

// ======================================================================
//                               COMPONENT
// ======================================================================
export default function ContentManagementTab() {
  const { updateContent, addNotification } = useAdmin()

  // --------------------- POSTER (backend) ---------------------
  const [posterItems, setPosterItems] = useState<PosterOut[]>([])
  const [isAddPosterOpen, setIsAddPosterOpen] = useState(false)
  const [posterModalOpen, setPosterModalOpen] = useState(false)
  const [newPosterItem, setNewPosterItem] = useState({ title: "", subtitle: "", content: "", image_url: "" })
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterEditOpen, setPosterEditOpen] = useState(false);
  const [editPoster, setEditPoster] = useState<PosterOut | null>(null);

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get<PosterOut[]>("/posters", { params: { limit: 200 } })
        setPosterItems(data)
      } catch (e) {
        console.error("Poster list hata:", errMsg(e))
      }
    })()
  }, [])

  const openEditPoster = (p: PosterOut) => {
  setEditPoster({ ...p });
  setPosterEditOpen(true);
};

const handleUpdatePoster = async () => {
  if (!editPoster) return;
  try {
    const payload = {
      title: editPoster.title,
      subtitle: editPoster.subtitle || null,
      content: editPoster.content || null,
      image_url: editPoster.image_url ? normalizeImageUrl(editPoster.image_url) : null,
      is_active: editPoster.is_active,
      order_index: editPoster.order_index,
    };
    const { data } = await api.put<PosterOut>(`/posters/${editPoster.id}`, payload);
    setPosterItems(prev => prev.map(x => (x.id === data.id ? data : x)));
    addNotification({ type: "system", title: "Poster", message: `"${data.title}" güncellendi.`, read: false });
    setPosterEditOpen(false);
  } catch (e) {
    console.error("Poster güncelle hata:", errMsg(e));
  }
};

  const handleAddPosterItem = async () => {
    if (!newPosterItem.title) return

    // Veriyi paketliyoruz (FormData)
    const formData = new FormData()
    formData.append("title", newPosterItem.title)
    if (newPosterItem.subtitle) formData.append("subtitle", newPosterItem.subtitle)
    if (newPosterItem.content) formData.append("content", newPosterItem.content)
    
    // Dosya seçildiyse dosyayı, seçilmediyse manuel yazılan linki ekle
    if (posterFile) {
      formData.append("file", posterFile)
    } else if (newPosterItem.image_url) {
      formData.append("image_url", newPosterItem.image_url)
    }

    formData.append("is_active", "true")
    // order_index backend'de int bekleniyorsa bile form-data string gider, backend çevirir
    formData.append("order_index", String(posterItems.length))

    try {
      // Axios, FormData gördüğünde otomatik olarak 'multipart/form-data' header'ı ekler
      const { data } = await api.post<PosterOut>("/posters", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      
      setPosterItems((prev) => [data, ...prev])
      updateContent("posters", { action: "add", item: data })
      
      // Formu temizle
      setNewPosterItem({ title: "", subtitle: "", content: "", image_url: "" })
      setPosterFile(null) // Dosyayı sıfırla
      setIsAddPosterOpen(false)
      
      addNotification({ type: "system", title: "Başarılı", message: "Poster eklendi.", read: false })
    } catch (e) {
      console.error("Poster ekle hata:", errMsg(e))
      addNotification({ type: "system", title: "Hata", message: "Poster yüklenemedi.", read: false })
    }
  }

  const handleDeletePosterItem = async (id: number) => {
    try {
      await api.delete(`/posters/${id}`)
      setPosterItems((prev) => prev.filter((p) => p.id !== id))
      addNotification({ type: "system", title: "Poster Silindi", message: `Poster #${id} kaldırıldı.`, read: false })
    } catch (e) {
      console.error("Poster sil hata:", errMsg(e))
    }
  }

  // --------------------- TIMELINE (ANASAYFA, backend) ---------------------
  const [timelineItems, setTimelineItems] = useState<TimelineOut[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [aboutAddOpen, setAboutAddOpen] = useState(false)

  const [newTimeline, setNewTimeline] = useState({
    title: "",
    description: "",
    date_label: "",
    category: "milestone",
    image_url: "",
  })
  const [timelineEditOpen, setTimelineEditOpen] = useState(false);
const [editTimeline, setEditTimeline] = useState<TimelineOut | null>(null);

const openEditTimeline = (t: TimelineOut) => {
  setEditTimeline({ ...t });
  setTimelineEditOpen(true);
};

const handleUpdateTimeline = async () => {
  if (!editTimeline) return;
  try {
    const form = new URLSearchParams();
    form.set("title", editTimeline.title);
    form.set("description", editTimeline.description || "");
    form.set("category", editTimeline.category);
    form.set("date_label", editTimeline.date_label);
    if (editTimeline.image_url) form.set("image_url", normalizeImageUrl(editTimeline.image_url));

    const { data } = await axios.put<TimelineOut>(`${API_BASE}/timeline/${editTimeline.id}`, form.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    });
    setTimelineItems(prev => prev.map(x => (x.id === data.id ? data : x)));
    addNotification({ type: "system", title: "Timeline", message: `"${data.title}" güncellendi.`, read: false });
    setTimelineEditOpen(false);
  } catch (e) {
    console.error("Timeline güncelle hata:", errMsg(e));
  }
};

  const fetchTimeline = async () => {
    setTimelineLoading(true)
    try {
      const { data } = await api.get<TimelineOut[]>("/timeline", { headers: { "Cache-Control": "no-cache" } })
      setTimelineItems(data.sort((a, b) => a.id - b.id))
    } catch (e) {
      console.error("Timeline list hata:", errMsg(e))
    } finally {
      setTimelineLoading(false)
    }
  }
  useEffect(() => {
    fetchTimeline()
  }, [])

  const handleCreateTimeline = async () => {
    if (!newTimeline.title || !newTimeline.date_label || !newTimeline.category) return
    try {
      const form = new URLSearchParams()
      form.set("title", newTimeline.title)
      form.set("description", newTimeline.description || "")
      form.set("category", newTimeline.category)
      form.set("date_label", newTimeline.date_label)
      if (newTimeline.image_url) form.set("image_url", normalizeImageUrl(newTimeline.image_url))

      const { data } = await axios.post<TimelineOut>(`${API_BASE}/timeline`, form.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      })
      setTimelineItems((prev) => [...prev, data])
      addNotification({ type: "system", title: "Timeline Kaydı", message: `"${data.title}" eklendi.`, read: false })
      setNewTimeline({ title: "", description: "", date_label: "", category: "milestone", image_url: "" })
      setAboutAddOpen(false)
    } catch (e) {
      console.error("Timeline ekle hata:", errMsg(e))
    }
  }

  const handleDeleteTimeline = async (id: number) => {
    try {
      await api.delete(`/timeline/${id}`)
      setTimelineItems((prev) => prev.filter((t) => t.id !== id))
      addNotification({ type: "system", title: "Timeline Silindi", message: `#${id} kaldırıldı.`, read: false })
    } catch (e) {
      console.error("Timeline sil hata:", errMsg(e))
    }
  }

  // --------------------- YOLCULUĞUMUZ (SADECE FRONTEND — Zaman Çizelgesi) ---------------------
  // Yıl seç; o yıla kayıt ekle. Tümü local state, backend çağrısı YOK.
  const [journeyPeople, setJourneyPeople] = useState<Record<number, JourneyPersonOut[]>>({});
  const [journeyLoading, setJourneyLoading] = useState(true);
  const [selectedJourneyYear, setSelectedJourneyYear] = useState<number>(new Date().getFullYear());
  const [journeyAddOpen, setJourneyAddOpen] = useState(false);
  const [journeyManageOpen, setJourneyManageOpen] = useState(false);
  
  const initialNewPersonState = {
    name: "",
    role: "",
    description: "",
    photo_url: "",
  };
  const [newJourneyPerson, setNewJourneyPerson] = useState(initialNewPersonState);
  const [journeyEditOpen, setJourneyEditOpen] = useState(false);
const [editJourneyPerson, setEditJourneyPerson] = useState<JourneyPersonOut | null>(null);

const openEditJourneyPerson = (p: JourneyPersonOut) => {
  setEditJourneyPerson({ ...p });
  setJourneyEditOpen(true);
};

const handleUpdateJourneyPerson = async () => {
  if (!editJourneyPerson) return;
  try {
    const payload = {
      year: editJourneyPerson.year,
      name: editJourneyPerson.name,
      role: editJourneyPerson.role,
      description: editJourneyPerson.description,
      photo_url: editJourneyPerson.photo_url,
    };
    const { data } = await api.put<JourneyPersonOut>(`/journey/${editJourneyPerson.id}`, payload);
    setJourneyPeople(prev => {
      const cp = { ...prev };
      cp[data.year] = (cp[data.year] || []).map(x => (x.id === data.id ? data : x));
      return cp;
    });
    addNotification({ type: "system", title: "Başarılı", message: `"${data.name}" güncellendi.`, read: false });
    setJourneyEditOpen(false);
  } catch (e) {
    console.error("Yolculuğumuz güncelle hata:", errMsg(e));
  }
};
  const yearsList = (() => {
    const now = new Date().getFullYear();
    const arr: number[] = [];
    for (let y = now + 1; y >= 2017; y--) arr.push(y); // Daha geçmiş yılları da kapsayacak şekilde
    return arr;
  })();

  const fetchJourneyPeople = async () => {
    setJourneyLoading(true);
    try {
      const { data } = await api.get<Record<number, JourneyPersonOut[]>>("/journey/");
      setJourneyPeople(data);
    } catch (e) {
      console.error("Yolculuğumuz verisi getirilirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: "Yolculuğumuz verisi yüklenemedi.", read: false });
    } finally {
      setJourneyLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneyPeople();
  }, []);

  const handleAddJourneyPerson = async () => {
    if (!newJourneyPerson.name || !newJourneyPerson.role || !newJourneyPerson.description) {
      addNotification({ type: "system", title: "Eksik Bilgi", message: "İsim, Görev ve Açıklama alanları zorunludur.", read: false });
      return;
    }
    const payload = {
      year: selectedJourneyYear,
      ...newJourneyPerson,
      photo_url: newJourneyPerson.photo_url || null,
    };
    try {
      const { data } = await api.post<JourneyPersonOut>("/journey/", payload);
      // State'i güncelle
      setJourneyPeople(prev => {
        const yearData = prev[data.year] ? [...prev[data.year], data] : [data];
        return { ...prev, [data.year]: yearData };
      });
      addNotification({ type: "system", title: "Başarılı", message: `"${data.name}" kişisi ${data.year} yılına eklendi.`, read: false });
      setNewJourneyPerson(initialNewPersonState);
      setJourneyAddOpen(false);
    } catch (e) {
      console.error("Yolculuğumuz kişisi eklenirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: `Kişi eklenemedi: ${errMsg(e)}`, read: false });
    }
  };

  const handleDeleteJourneyPerson = async (personId: number) => {
    if (!window.confirm(`#${personId} ID'li kişiyi silmek istediğinizden emin misiniz?`)) return;
    try {
      await api.delete(`/journey/${personId}`);
      // State'i yerel olarak güncelle
      const updatedJourneyPeople: Record<number, JourneyPersonOut[]> = {};
      for (const year in journeyPeople) {
        updatedJourneyPeople[year] = journeyPeople[year].filter(p => p.id !== personId);
      }
      setJourneyPeople(updatedJourneyPeople);
      addNotification({ type: "system", title: "Başarılı", message: `Kişi #${personId} silindi.`, read: false });
    } catch (e) {
      console.error("Yolculuğumuz kişisi silinirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: `Kişi silinemedi: ${errMsg(e)}`, read: false });
    }
  };

  // --------------------- GALERİ (gallery-events, backend) ---------------------
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [isGalleryAddOpen, setIsGalleryAddOpen] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryEvent[]>([])
  const [newGallery, setNewGallery] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Workshop",
    date: "",
    location: "",
  })
  const [galleryEditOpen, setGalleryEditOpen] = useState(false);
const [editGallery, setEditGallery] = useState<GalleryEvent | null>(null);

const openEditGallery = (g: GalleryEvent) => {
  setEditGallery({ ...g });
  setGalleryEditOpen(true);
};

const handleUpdateGallery = async () => {
  if (!editGallery) return;
  try {
    const payload = {
      title: editGallery.title,
      description: editGallery.description,
      image_url: normalizeImageUrl(editGallery.image_url),
      category: editGallery.category,
      date: editGallery.date,
      location: editGallery.location,
    };
    const { data } = await api.put<GalleryEvent>(`/api/gallery-events/${editGallery.id}`, payload);
    setGalleryItems(prev => prev.map(x => (x.id === data.id ? data : x)));
    addNotification({ type: "system", title: "Galeri", message: `"${data.title}" güncellendi.`, read: false });
    setGalleryEditOpen(false);
  } catch (e) {
    console.error("Galeri güncelle hata:", errMsg(e));
  }
};

  const fetchGallery = async () => {
    try {
      const { data } = await api.get<GalleryEvent[]>("/api/gallery-events", { headers: { "Cache-Control": "no-cache" } })
      setGalleryItems(data.sort((a, b) => (a.date < b.date ? 1 : -1)))
    } catch (e) {
      console.error("Galeri list hata:", errMsg(e))
    }
  }
  useEffect(() => {
    fetchGallery()
  }, [])

  const handleAddGalleryItem = async () => {
    const { title, description, image_url, category, date, location } = newGallery
    if (!title || !description || !image_url || !category || !date || !location) return
    try {
      const payload = {
        title,
        description,
        image_url: normalizeImageUrl(image_url),
        category,
        date,
        location,
      }
      const { data } = await api.post<GalleryEvent>("/api/gallery-events", payload)
      setGalleryItems((prev) => [data, ...prev])
      setNewGallery({ title: "", description: "", image_url: "", category: "Workshop", date: "", location: "" })
      setIsGalleryAddOpen(false)
      addNotification({ type: "system", title: "Galeri", message: `"${data.title}" eklendi.`, read: false })
    } catch (e) {
      console.error("Galeri ekle hata:", errMsg(e))
    }
  }

  const handleDeleteGalleryItem = async (id: number) => {
    try {
      await api.delete(`/api/gallery-events/${id}`)
      setGalleryItems((prev) => prev.filter((g) => g.id !== id))
      addNotification({ type: "system", title: "Galeri", message: `Öğe #${id} silindi.`, read: false })
    } catch (e) {
      console.error("Galeri sil hata:", errMsg(e))
    }
  }

  // --------------------- BLOG (backend) ---------------------
  const [blogItems, setBlogItems] = useState<BlogOut[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(false)

  // Yeni Ekle
  const [blogAddOpen, setBlogAddOpen] = useState(false)
  const [newBlog, setNewBlog] = useState({
    title: "",
    description: "", // -> content
    author: "",
    category: "",
    image: "",  // -> cover_image (opsiyonel)
    date: "",  // yyyy-mm-dd
    preview: "", // -> preview (opsiyonel)
  })

  // Yönetim & Düzenleme
  const [blogManageOpen, setBlogManageOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editBlog, setEditBlog] = useState<BlogOut | null>(null)

  const fetchBlogs = async () => {
    setLoadingBlogs(true)
    try {
      const { data } = await api.get<BlogListResponse>("/blogs", { params: { page: 1, page_size: 100 } })
      setBlogItems(data.items || [])
    } catch (e) {
      console.error("Blog list hata:", errMsg(e))
    } finally {
      setLoadingBlogs(false)
    }
  }
  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleAddBlog = async () => {
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
      setBlogItems((prev) => [data, ...prev])
      addNotification({ type: "system", title: "Blog", message: `"${data.title}" eklendi.`, read: false })
      setNewBlog({ title: "", description: "", author: "", category: "", image: "", date: "", preview: "" })
      setBlogAddOpen(false)
    } catch (e) {
      console.error("Blog ekle hata:", errMsg(e))
    }
  }

  const handleDeleteBlog = async (id: number) => {
    try {
      await api.delete(`/blogs/${id}`)
      setBlogItems((prev) => prev.filter((b) => b.id !== id))
      addNotification({ type: "system", title: "Blog", message: `Blog #${id} silindi.`, read: false })
    } catch (e) {
      console.error("Blog sil hata:", errMsg(e))
    }
  }

  const openEdit = (b: BlogOut) => {
    setEditBlog({ ...b })
    setEditOpen(true)
  }

  const handleUpdateBlog = async () => {
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
      setBlogItems((prev) => prev.map((x) => (x.id === data.id ? data : x)))
      addNotification({ type: "system", title: "Blog", message: `"${data.title}" güncellendi.`, read: false })
      setEditOpen(false)
    } catch (e) {
      console.error("Blog güncelle hata:", errMsg(e))
    }
  }

 // ===== DÜZENLEME BAŞLANGICI: TAKIMLAR BÖLÜMÜ (NİHAİ VE DOĞRU VERSİYON) =====

  const [teams, setTeams] = useState<TeamOut[]>([])
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [isTeamAddOpen, setIsTeamAddOpen] = useState(false)
  const [teamManageOpen, setTeamManageOpen] = useState(false)
  
  const initialNewTeamState = {
    name: "",
    project_name: "",
    category: "",
    description: "",
    photo_url: "",
    is_featured: false,
    members: [{ name: "", role: "", linkedin_url: "" }],
  };
  const [newTeam, setNewTeam] = useState(initialNewTeamState);
  const [teamEditOpen, setTeamEditOpen] = useState(false);
const [editTeam, setEditTeam] = useState<TeamOut | null>(null);

const openEditTeam = (t: TeamOut) => {
  setEditTeam({ ...t, members: t.members || [] });
  setTeamEditOpen(true);
};

const handleUpdateTeam = async () => {
  if (!editTeam) return;
  try {
    const payload = {
      name: editTeam.name,
      project_name: editTeam.project_name,
      category: editTeam.category,
      description: editTeam.description,
      photo_url: editTeam.photo_url || null,
      is_featured: editTeam.is_featured,
      members: (editTeam.members || []).map((m: any) => ({
        id: m.id, // backend üye id istiyorsa
        name: m.name,
        role: m.role,
        linkedin_url: m.linkedin_url || null,
      })),
    };
    const { data } = await api.put<TeamOut>(`/teams/${editTeam.id}`, payload);
    setTeams(prev => prev.map(x => (x.id === data.id ? data : x)));
    addNotification({ type: "system", title: "Takımlar", message: `"${data.name}" güncellendi.`, read: false });
    setTeamEditOpen(false);
  } catch (e) {
    console.error("Takım güncelle hata:", errMsg(e));
  }
};

  useEffect(() => {
    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const { data } = await api.get<TeamOut[]>("/teams");
        setTeams(data);
      } catch (e) {
        console.error("Takımlar getirilirken hata:", errMsg(e));
        // DÜZELTME: 'read: false' eklendi.
        addNotification({ type: "system", title: "Hata", message: "Takımlar yüklenemedi.", read: false });
      } finally {
        setTeamsLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  const addTeamMemberRow = () =>
    setNewTeam((p) => ({ ...p, members: [...p.members, { name: "", role: "", linkedin_url: "" }] }));

  const updateTeamMemberField = (idx: number, key: keyof NewTeamMember, value: string) =>
    setNewTeam((p) => {
      const membersCopy = [...p.members];
      membersCopy[idx] = { ...membersCopy[idx], [key]: value };
      return { ...p, members: membersCopy };
    });
  
  const removeTeamMemberRow = (idx: number) =>
    setNewTeam((p) => ({ ...p, members: p.members.filter((_, i) => i !== idx) }));

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.project_name || !newTeam.category || !newTeam.description) {
      // DÜZELTME: 'read: false' eklendi.
      addNotification({ type: "system", title: "Eksik Bilgi", message: "Lütfen tüm zorunlu alanları doldurun.", read: false });
      return;
    }
    const payload = {
      name: newTeam.name,
      project_name: newTeam.project_name,
      category: newTeam.category,
      description: newTeam.description,
      photo_url: newTeam.photo_url || null, 
      is_featured: newTeam.is_featured,
      members: newTeam.members
        .filter(m => m.name && m.role)
        .map(m => ({
          ...m,
          linkedin_url: m.linkedin_url || null 
        })),
    };

    try {
      const { data } = await api.post<TeamOut>("/teams", payload);
      setTeams((prev) => [data, ...prev]);
      // DÜZELTME: 'read: false' eklendi.
      addNotification({ type: "system", title: "Başarılı", message: `"${data.name}" takımı eklendi.`, read: false });
      
      setNewTeam(initialNewTeamState);
      setIsTeamAddOpen(false);
    } catch (e) {
      console.error("Takım ekleme hatası:", errMsg(e));
      // DÜZELTME: 'read: false' eklendi.
      addNotification({ type: "system", title: "Hata", message: `Takım eklenemedi: ${errMsg(e)}`, read: false });
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (!window.confirm(`#${id} ID'li takımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) return;
    try {
      await api.delete(`/teams/${id}`);
      setTeams((prev) => prev.filter((t) => t.id !== id));
      // DÜZELTME: 'read: false' eklendi.
      addNotification({ type: "system", title: "Takım Silindi", message: `Takım #${id} başarıyla kaldırıldı.`, read: false });
    } catch (e) {
      console.error("Takım silme hatası:", errMsg(e));
      // DÜZELTME: 'read: false' eklendi.
      addNotification({ type: "system", title: "Hata", message: `Takım silinemedi: ${errMsg(e)}`, read: false });
    }
  };

// ===== DÜZENLEME BİTİŞ: TAKIMLAR BÖLÜMÜ =====
  // --------------------- EKİBİMİZ (SADECE FRONTEND, 4 kategori) ---------------------
 type CrewCategory =
    | "Başkan ve Yardımcılar"
    | "Sosyal Medya ve Tasarım"
    | "Etkinlik ve Organizasyon"
    | "Eğitim ve Proje"

  const CREW_CATEGORIES: CrewCategory[] = [
    "Başkan ve Yardımcılar",
    "Sosyal Medya ve Tasarım",
    "Etkinlik ve Organizasyon",
    "Eğitim ve Proje",
  ]

  const [crewMembers, setCrewMembers] = useState<Record<string, CrewMemberOut[]>>({})
  const [crewLoading, setCrewLoading] = useState(true)
  const [selectedCrewCat, setSelectedCrewCat] = useState<CrewCategory>("Başkan ve Yardımcılar")
  const [crewAddOpen, setCrewAddOpen] = useState(false)
  const [crewManageOpen, setCrewManageOpen] = useState(false)
  
  const initialNewCrewState = {
    name: "",
    role: "",
    description: "",
    photo_url: "",
    linkedin_url: "",
    github_url: "", // GitHub alanı eklendi
  }
  const [newCrewMember, setNewCrewMember] = useState(initialNewCrewState)
  const [crewEditOpen, setCrewEditOpen] = useState(false);
const [editCrew, setEditCrew] = useState<CrewMemberOut | null>(null);

const openEditCrew = (m: CrewMemberOut) => {
  setEditCrew({ ...m });
  setCrewEditOpen(true);
};

const handleUpdateCrew = async () => {
  if (!editCrew) return;
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
    };
    const { data } = await api.put<CrewMemberOut>(`/crew/${editCrew.id}`, payload);
    setCrewMembers(prev => {
      const cp = { ...prev };
      cp[data.category] = (cp[data.category] || []).map(x => (x.id === data.id ? data : x));
      return cp;
    });
    addNotification({ type:"system", title:"Ekibimiz", message:`"${data.name}" güncellendi.`, read:false });
    setCrewEditOpen(false);
  } catch (e) {
    console.error("Crew güncelle hata:", errMsg(e));
  }
};
  const fetchCrewMembers = async () => {
    setCrewLoading(true);
    try {
      const { data } = await api.get<Record<string, CrewMemberOut[]>>("/crew/");
      setCrewMembers(data);
    } catch (e) {
      console.error("Ekip üyeleri getirilirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: "Ekip üyeleri yüklenemedi.", read: false });
    } finally {
      setCrewLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewMembers();
  }, []);

  const handleAddCrewMember = async () => {
    if (!newCrewMember.name || !newCrewMember.role) {
      addNotification({ type: "system", title: "Eksik Bilgi", message: "İsim ve Görev alanları zorunludur.", read: false });
      return;
    }
    const payload = {
      ...newCrewMember,
      category: selectedCrewCat,
      description: newCrewMember.description || null,
      photo_url: newCrewMember.photo_url || null,
      linkedin_url: newCrewMember.linkedin_url || null,
      github_url: newCrewMember.github_url || null,
    };
    try {
      const { data } = await api.post<CrewMemberOut>("/crew/", payload);
      setCrewMembers(prev => {
        const categoryData = prev[data.category] ? [...prev[data.category], data] : [data];
        return { ...prev, [data.category]: categoryData };
      });
      addNotification({ type: "system", title: "Başarılı", message: `"${data.name}" kişisi ${data.category} kategorisine eklendi.`, read: false });
      setNewCrewMember(initialNewCrewState);
      setCrewAddOpen(false);
    } catch (e) {
      console.error("Ekip üyesi eklenirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: `Ekip üyesi eklenemedi: ${errMsg(e)}`, read: false });
    }
  };

  const handleDeleteCrewMember = async (memberId: number) => {
    if (!window.confirm(`#${memberId} ID'li üyeyi silmek istediğinizden emin misiniz?`)) return;
    try {
      await api.delete(`/crew/${memberId}`);
      const updatedCrewMembers: Record<string, CrewMemberOut[]> = {};
      for (const category in crewMembers) {
        updatedCrewMembers[category] = crewMembers[category].filter(p => p.id !== memberId);
      }
      setCrewMembers(updatedCrewMembers);
      addNotification({ type: "system", title: "Başarılı", message: `Üye #${memberId} silindi.`, read: false });
    } catch (e) {
      console.error("Ekip üyesi silinirken hata:", errMsg(e));
      addNotification({ type: "system", title: "Hata", message: `Üye silinemedi: ${errMsg(e)}`, read: false });
    }
  };

  // ======================================================================
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Poster (backend) */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Ana Sayfa Poster Alanı
          </CardTitle>
          <CardDescription>Ana sayfa banner ve hero bölümünü yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Toplam Poster: {posterItems.length}</span>
            <Dialog open={isAddPosterOpen} onOpenChange={setIsAddPosterOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                  Yeni Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Yeni Poster</DialogTitle>
                  <DialogDescription>Ana sayfa poster alanına yeni bir öğe ekleyin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={newPosterItem.title}
                      onChange={(e) => setNewPosterItem((p) => ({ ...p, title: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Alt Başlık</Label>
                    <Input
                      value={newPosterItem.subtitle}
                      onChange={(e) => setNewPosterItem((p) => ({ ...p, subtitle: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>İçerik</Label>
                    <Textarea
                      value={newPosterItem.content}
                      onChange={(e) => setNewPosterItem((p) => ({ ...p, content: e.target.value }))}
                      rows={4}
                      className="bg-background/50"
                    />
                  </div>
              <div>
                  <Label>Görsel Seç</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="bg-background/50 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPosterFile(e.target.files[0])
                      }
                    }}
                  />
                  
                  {/* İstersen manuel link girmeyi de açık bırakabilirsin (opsiyonel) */}
                  <div className="text-xs text-muted-foreground mt-2 mb-1">veya link girin:</div>
                  <Input
                    placeholder="https://..."
                    value={newPosterItem.image_url}
                    onChange={(e) => setNewPosterItem((p) => ({ ...p, image_url: e.target.value }))}
                    className="bg-background/50 text-sm h-8"
                  />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddPosterItem} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                      Ekle
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddPosterOpen(false)} className="flex-1">
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            size="sm"
            className="bg-ayzek-gradient hover:opacity-90 w-full"
            onClick={() => setPosterModalOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" /> Posterleri Yönet
          </Button>
        </CardContent>
      </Card>

      <Dialog open={posterModalOpen} onOpenChange={setPosterModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <VisuallyHidden>
    <DialogTitle>Poster Yönetimi</DialogTitle>
  </VisuallyHidden>
          <DialogHeader>
            <div className="relative w-full h-10 rounded flex items-center justify-center">
              <div className="absolute inset-0 rounded bg-ayzek-gradient" />
              <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                Poster Yönetimi
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posterItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={normalizeImageUrl(item.image_url)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.subtitle}</p>
                    <p className="text-sm mt-2 line-clamp-3">{item.content}</p>
                    <div className="flex justify-end mt-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditPoster(item)}>Düzenle</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeletePosterItem(item.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Sil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!posterItems.length && (
                <div className="text-sm text-muted-foreground px-2 py-6 text-center">Henüz poster yok.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={posterEditOpen} onOpenChange={setPosterEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-2xl">
    <DialogHeader>
      <DialogTitle>Posteri Düzenle</DialogTitle>
      <DialogDescription>Seçtiğiniz posteri güncelleyin</DialogDescription>
    </DialogHeader>
    {editPoster && (
      <div className="space-y-4">
        <div>
          <Label>Başlık</Label>
          <Input value={editPoster.title} onChange={(e)=>setEditPoster({...editPoster, title:e.target.value})}/>
        </div>
        <div>
          <Label>Alt Başlık</Label>
          <Input value={editPoster.subtitle ?? ""} onChange={(e)=>setEditPoster({...editPoster, subtitle:e.target.value})}/>
        </div>
        <div>
          <Label>İçerik</Label>
          <Textarea value={editPoster.content ?? ""} onChange={(e)=>setEditPoster({...editPoster, content:e.target.value})}/>
        </div>
        <div>
          <Label>Görsel URL</Label>
          <Input value={editPoster.image_url ?? ""} onChange={(e)=>setEditPoster({...editPoster, image_url:e.target.value})}/>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdatePoster}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setPosterEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

      {/* Timeline (Anasayfa, backend) */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Anasayfa Zaman Kapsülü
          </CardTitle>
          <CardDescription>Timeline etkinliklerini ve kilometre taşlarını yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Toplam Kilometre Taşı: {timelineLoading ? "…" : timelineItems.length}</span>

            <Dialog open={aboutAddOpen} onOpenChange={setAboutAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                  Yeni Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20">
                <DialogHeader>
                  <DialogTitle>Yeni Timeline Girişi</DialogTitle>
                  <DialogDescription>Zaman kapsülüne yeni bir kilometre taşı ekleyin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={newTimeline.title}
                      onChange={(e) => setNewTimeline((p) => ({ ...p, title: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={newTimeline.description}
                      onChange={(e) => setNewTimeline((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Tarih Etiketi</Label>
                    <Input
                      placeholder="Mart 2024 / 2022 Q4"
                      value={newTimeline.date_label}
                      onChange={(e) => setNewTimeline((p) => ({ ...p, date_label: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <Input
                      placeholder="milestone / success / education / event / other"
                      value={newTimeline.category}
                      onChange={(e) => setNewTimeline((p) => ({ ...p, category: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Görsel URL (opsiyonel)</Label>
                    <Input
                      placeholder="/image.jpg veya tam URL"
                      value={newTimeline.image_url}
                      onChange={(e) => setNewTimeline((p) => ({ ...p, image_url: e.target.value }))}
                      className="bg-background/50"
                    />
                    {newTimeline.image_url && (
                      <img
                        src={normalizeImageUrl(newTimeline.image_url)}
                        alt="Önizleme"
                        className="mt-2 h-24 w-auto rounded object-cover border border-border/30"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateTimeline} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                      Ekle
                    </Button>
                    <Button variant="outline" onClick={() => setAboutAddOpen(false)} className="flex-1">
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="relative z-10 bg-ayzek-gradient hover:opacity-90 w-full pointer-events-auto">
                <Edit className="w-4 h-4 mr-2" /> Timeline Düzenle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <VisuallyHidden>
    <DialogTitle>Timeline Yönetimi</DialogTitle>
  </VisuallyHidden>
              <DialogHeader>
                <div className="relative w-full h-10 rounded flex items-center justify-center">
                  <div className="absolute inset-0 rounded bg-ayzek-gradient" />
                  <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                    Timeline Yönetimi
                  </span>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4">
                  {timelineItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.date_label}</p>
                          <p className="text-sm mt-2">{item.description}</p>
                          {item.image_url && (
                            <img
                              src={normalizeImageUrl(item.image_url)}
                              alt={item.title}
                              className="mt-2 h-24 w-auto rounded object-cover border border-border/30"
                            />
                          )}
                          <div className="text-xs mt-2 opacity-70">Kategori: {item.category}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditTimeline(item)}>Düzenle</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteTimeline(item.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {!timelineItems.length && (
                    <div className="text-sm text-muted-foreground px-2 py-6 text-center">
                      Henüz timeline kaydı yok.
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={timelineEditOpen} onOpenChange={setTimelineEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-2xl">
    <DialogHeader>
      <DialogTitle>Timeline Kaydını Düzenle</DialogTitle>
    </DialogHeader>
    {editTimeline && (
      <div className="space-y-3">
        <div>
          <Label>Başlık</Label>
          <Input value={editTimeline.title} onChange={(e)=>setEditTimeline({...editTimeline, title:e.target.value})}/>
        </div>
        <div>
          <Label>Açıklama</Label>
          <Textarea value={editTimeline.description} onChange={(e)=>setEditTimeline({...editTimeline, description:e.target.value})}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Tarih Etiketi</Label>
            <Input value={editTimeline.date_label} onChange={(e)=>setEditTimeline({...editTimeline, date_label:e.target.value})}/>
          </div>
          <div>
            <Label>Kategori</Label>
            <Input value={editTimeline.category} onChange={(e)=>setEditTimeline({...editTimeline, category:e.target.value})}/>
          </div>
        </div>
        <div>
          <Label>Görsel URL</Label>
          <Input value={editTimeline.image_url ?? ""} onChange={(e)=>setEditTimeline({...editTimeline, image_url:e.target.value})}/>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdateTimeline}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setTimelineEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
        </CardContent>
      </Card>

      {/* =================== YOLCULUĞUMUZ (YENİLENMİŞ) =================== */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Yolculuğumuz
          </CardTitle>
          <CardDescription>Yıl seçip o yıla ait kişileri (yönetim vb.) ekleyin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <Label>Yıl Seç</Label>
              <select
                value={selectedJourneyYear}
                onChange={(e) => setSelectedJourneyYear(Number(e.target.value))}
                className="w-full h-10 rounded-md border bg-background/50 px-3"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="text-xs text-muted-foreground mt-1">
                Bu yıldaki kayıt sayısı: {journeyLoading ? "..." : (journeyPeople[selectedJourneyYear] || []).length}
              </div>
            </div>

            <Dialog open={journeyAddOpen} onOpenChange={setJourneyAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-ayzek-gradient hover:opacity-90">Kayıt Ekle</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20 max-w-lg">
                <DialogHeader>
                  <DialogTitle>{selectedJourneyYear} Yılına Yeni Kişi Ekle</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                  <div>
                    <Label htmlFor="journeyName">İsim Soyisim</Label>
                    <Input id="journeyName" value={newJourneyPerson.name} onChange={(e) => setNewJourneyPerson(p => ({ ...p, name: e.target.value }))} className="bg-background/50" />
                  </div>
                  <div>
                    <Label htmlFor="journeyRole">Görevi</Label>
                    <Input id="journeyRole" value={newJourneyPerson.role} onChange={(e) => setNewJourneyPerson(p => ({ ...p, role: e.target.value }))} className="bg-background/50" />
                  </div>
                   <div>
                    <Label htmlFor="journeyDesc">Açıklama (Kısa Söz)</Label>
                    <Textarea id="journeyDesc" value={newJourneyPerson.description} onChange={(e) => setNewJourneyPerson(p => ({ ...p, description: e.target.value }))} className="bg-background/50" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="journeyPhoto">Resim (URL)</Label>
                    <Input id="journeyPhoto" value={newJourneyPerson.photo_url} onChange={(e) => setNewJourneyPerson(p => ({ ...p, photo_url: e.target.value }))} className="bg-background/50" placeholder="/avatars/ornek.png" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddJourneyPerson} className="flex-1 bg-ayzek-gradient hover:opacity-90">Ekle</Button>
                    <Button variant="outline" onClick={() => setJourneyAddOpen(false)} className="flex-1">İptal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="outline" className="border-primary/20" onClick={() => setJourneyManageOpen(true)}>
              <Edit className="w-4 h-4 mr-2" /> Yılları Yönet
            </Button>
          </div>

          <div className="grid gap-3">
             {journeyLoading ? <p className="text-center text-sm text-muted-foreground p-4">Yükleniyor...</p> :
              (journeyPeople[selectedJourneyYear] || []).length > 0 ? (
                (journeyPeople[selectedJourneyYear] || []).map((person) => (
                  <Card key={person.id} className="p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                                {person.photo_url ? (
                                <img src={normalizeImageUrl(person.photo_url)} alt={person.name} className="w-full h-full object-cover" />
                                ) : (
                                <Users className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold leading-tight">{person.name}</div>
                                <div className="text-xs text-muted-foreground">{person.role}</div>
                            </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openEditJourneyPerson(person)}>Düzenle</Button>
  <Button size="sm" variant="destructive" onClick={() => handleDeleteJourneyPerson(person.id)}>
    <Trash2 className="w-3 h-3 mr-1" /> Sil
  </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-6 text-center">Bu yılda henüz kayıt yok.</div>
              )
            }
          </div>

          <Dialog open={journeyManageOpen} onOpenChange={setJourneyManageOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <VisuallyHidden>
    <DialogTitle>Yolculuğumuz — Yıl Yönetimi</DialogTitle>
  </VisuallyHidden>
              <DialogHeader>
                 <div className="relative w-full h-10 rounded flex items-center justify-center">
                    <div className="absolute inset-0 rounded bg-ayzek-gradient" />
                    <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                        Yolculuğumuz — Yıl Yönetimi
                    </span>
                 </div>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yearsList.map((year) => {
                  const peopleInYear = journeyPeople[year] || [];
                  return (
                    <Card key={year} className="p-4 flex flex-col">
                      <h3 className="font-semibold text-lg">{year}</h3>
                      <div className="mt-2 flex-1 grid gap-2 content-start">
                        {peopleInYear.length > 0 ? (
                          peopleInYear.map(person => (
                            <div key={person.id} className="flex items-center justify-between gap-2 p-2 rounded border border-border/50">
                              <div className="flex items-center gap-2">
                                {person.photo_url && <img src={normalizeImageUrl(person.photo_url)} alt={person.name} className="w-8 h-8 rounded-full object-cover" />}
                                <div>
                                  <div className="text-sm font-medium">{person.name}</div>
                                  <div className="text-xs text-muted-foreground">{person.role}</div>
                                </div>
                              </div>
                              <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDeleteJourneyPerson(person.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground py-2">Bu yılda kayıt yok.</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
<Dialog open={journeyEditOpen} onOpenChange={setJourneyEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-lg">
    <DialogHeader><DialogTitle>Kişiyi Düzenle</DialogTitle></DialogHeader>
    {editJourneyPerson && (
      <div className="space-y-3">
        <div><Label>İsim Soyisim</Label>
          <Input value={editJourneyPerson.name} onChange={(e)=>setEditJourneyPerson({...editJourneyPerson, name:e.target.value})}/>
        </div>
        <div><Label>Görevi</Label>
          <Input value={editJourneyPerson.role} onChange={(e)=>setEditJourneyPerson({...editJourneyPerson, role:e.target.value})}/>
        </div>
        <div><Label>Açıklama</Label>
          <Textarea value={editJourneyPerson.description} onChange={(e)=>setEditJourneyPerson({...editJourneyPerson, description:e.target.value})}/>
        </div>
        <div><Label>Resim (URL)</Label>
          <Input value={editJourneyPerson.photo_url ?? ""} onChange={(e)=>setEditJourneyPerson({...editJourneyPerson, photo_url:e.target.value})}/>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdateJourneyPerson}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setJourneyEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

        </CardContent>
      </Card>

      {/* Galeri (backend) */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gallery className="w-5 h-5" /> Etkinlik Galerisi
          </CardTitle>
          <CardDescription>Ana sayfa ve etkinlik sayfası galerilerini yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Toplam Görsel: {galleryItems.length}</span>
            <Dialog open={isGalleryAddOpen} onOpenChange={setIsGalleryAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                  Görsel Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20">
                <DialogHeader>
                  <DialogTitle>Yeni Galeri Öğesi</DialogTitle>
                  <DialogDescription>Etkinlik galerisine yeni görsel ekleyin</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={newGallery.title}
                      onChange={(e) => setNewGallery((p) => ({ ...p, title: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={newGallery.description}
                      onChange={(e) => setNewGallery((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Görsel URL</Label>
                    <Input
                      value={newGallery.image_url}
                      onChange={(e) => setNewGallery((p) => ({ ...p, image_url: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Kategori</Label>
                      <Input
                        value={newGallery.category}
                        onChange={(e) => setNewGallery((p) => ({ ...p, category: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Tarih</Label>
                      <Input
                        type="date"
                        value={newGallery.date}
                        onChange={(e) => setNewGallery((p) => ({ ...p, date: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Konum</Label>
                      <Input
                        value={newGallery.location}
                        onChange={(e) => setNewGallery((p) => ({ ...p, location: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddGalleryItem} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                      Ekle
                    </Button>
                    <Button variant="outline" onClick={() => setIsGalleryAddOpen(false)} className="flex-1">
                      İptal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            size="sm"
            className="bg-ayzek-gradient hover:opacity-90 w-full"
            onClick={() => setGalleryModalOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" /> Galeri Yönet
          </Button>
        </CardContent>
      </Card>

      <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <VisuallyHidden>
    <DialogTitle>Galeri Yönetimi</DialogTitle>
  </VisuallyHidden>
          <DialogHeader>
            <div className="relative w-full h-10 rounded flex items-center justify-center">
              <div className="absolute inset-0 rounded bg-ayzek-gradient" />
              <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                Galeri Yönetimi
              </span>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryItems.map((g) => (
                <Card key={g.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {g.image_url ? (
                      <img
                        src={normalizeImageUrl(g.image_url)}
                        alt={g.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1">{g.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{g.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <CalendarDays className="w-3 h-3" /> {fmtDateTR(g.date)}
                      <span className="opacity-50">•</span>
                      <MapPin className="w-3 h-3" /> {g.location}
                      <span className="opacity-50">•</span>
                      <span>{g.category}</span>
                    </div>
                    <div className="flex justify-end mt-3 gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditGallery(g)}>Düzenle</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteGalleryItem(g.id)}>
                        <Trash2 className="w-3 h-3 mr-1" /> Sil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {!galleryItems.length && (
                <div className="text-sm text-muted-foreground px-2 py-6 text-center">Henüz galeri öğesi yok.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={galleryEditOpen} onOpenChange={setGalleryEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-2xl">
    <DialogHeader><DialogTitle>Galeri Öğesini Düzenle</DialogTitle></DialogHeader>
    {editGallery && (
      <div className="space-y-3">
        <div><Label>Başlık</Label>
          <Input value={editGallery.title} onChange={(e)=>setEditGallery({...editGallery, title:e.target.value})}/>
        </div>
        <div><Label>Açıklama</Label>
          <Textarea value={editGallery.description} onChange={(e)=>setEditGallery({...editGallery, description:e.target.value})}/>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Kategori</Label>
            <Input value={editGallery.category} onChange={(e)=>setEditGallery({...editGallery, category:e.target.value})}/>
          </div>
          <div><Label>Tarih</Label>
            <Input type="date" value={editGallery.date} onChange={(e)=>setEditGallery({...editGallery, date:e.target.value})}/>
          </div>
          <div><Label>Konum</Label>
            <Input value={editGallery.location} onChange={(e)=>setEditGallery({...editGallery, location:e.target.value})}/>
          </div>
        </div>
        <div><Label>Görsel URL</Label>
          <Input value={editGallery.image_url} onChange={(e)=>setEditGallery({...editGallery, image_url:e.target.value})}/>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdateGallery}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setGalleryEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

      {/* Bloglar (backend) */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> Bloglar
          </CardTitle>
          <CardDescription>Blog yazılarını yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">
              Toplam Blog: {loadingBlogs ? "…" : blogItems.length}
            </span>

            <div className="flex gap-2">
              {/* YENİ EKLE */}
              <Dialog open={blogAddOpen} onOpenChange={setBlogAddOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                    Yeni Ekle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Yeni Blog Yazısı</DialogTitle>
                    <DialogDescription>Yeni bir blog ekleyin</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Başlık</Label>
                      <Input value={newBlog.title} onChange={(e) => setNewBlog((p) => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <Label>İçerik</Label>
                      <Textarea
                        value={newBlog.description}
                        onChange={(e) => setNewBlog((p) => ({ ...p, description: e.target.value }))}
                        wrap="soft"
                        className="bg-background/50 break-words overflow-y-auto h-40 resize-y max-h-96"
                        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Yazar</Label>
                        <Input value={newBlog.author} onChange={(e) => setNewBlog((p) => ({ ...p, author: e.target.value }))} />
                      </div>
                      <div>
                        <Label>Kategori</Label>
                        <Input
                          value={newBlog.category}
                          onChange={(e) => setNewBlog((p) => ({ ...p, category: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Kapak Görseli (opsiyonel)</Label>
                      <Input
                        value={newBlog.image}
                        onChange={(e) => setNewBlog((p) => ({ ...p, image: e.target.value }))}
                        placeholder="/image.jpg veya tam URL"
                      />
                    </div>
                    <div>
                      <Label>Tarih</Label>
                      <Input
                        type="date"
                        value={newBlog.date}
                        onChange={(e) => setNewBlog((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Önizleme (opsiyonel)</Label>
                      <Textarea
                        value={newBlog.preview}
                        onChange={(e) => setNewBlog((p) => ({ ...p, preview: e.target.value }))}
                        wrap="soft"
                        className="bg-background/50 break-words overflow-y-auto h-24 resize-y max-h-60"
                        style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddBlog} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                        Ekle
                      </Button>
                      <Button variant="outline" onClick={() => setBlogAddOpen(false)} className="flex-1">
                        İptal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* YÖNET (liste) */}
              <Button
                size="sm"
                className="bg-ayzek-gradient hover:opacity-90"
                onClick={() => setBlogManageOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" /> Blogları Düzenle
              </Button>
            </div>
          </div>

          {/* Hızlı Liste */}
          <div className="grid gap-3">
            {blogItems.map((b) => (
              <Card key={b.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="cursor-pointer" onClick={() => openEdit(b)}>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {(b.author || "—")} • {(b.category || "—")} • {fmtDateTR(b.date)}
                    </p>
                    {b.preview && <p className="text-sm mt-2 line-clamp-2">{b.preview}</p>}
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteBlog(b.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
            {!blogItems.length && !loadingBlogs && (
              <div className="text-sm text-muted-foreground px-2 py-6 text-center">Henüz blog yok.</div>
            )}
          </div>

          {/* Yönetim Dialog — grid */}
          <Dialog open={blogManageOpen} onOpenChange={setBlogManageOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogItems.map((b) => (
                  <Card key={b.id} className="p-4 hover:shadow cursor-pointer" onClick={() => openEdit(b)}>
                    <h3 className="font-semibold line-clamp-1">{b.title}</h3>
                    <p className="text-xs text-muted-foreground">{fmtDateTR(b.date)} • {b.author} • {b.category}</p>
                    {b.preview && <p className="text-sm mt-2 line-clamp-3">{b.preview}</p>}
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteBlog(b.id) }}>
                        <Trash2 className="w-3 h-3 mr-1" /> Sil
                      </Button>
                    </div>
                  </Card>
                ))}
                {!blogItems.length && <div className="text-sm text-muted-foreground px-2 py-6 text-center w-full">Henüz blog yok.</div>}
              </div>
            </DialogContent>
          </Dialog>

          {/* Düzenleme Dialog — prefill */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="bg-card border-primary/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Blogu Düzenle</DialogTitle>
                <DialogDescription>Seçtiğiniz blogu güncelleyin</DialogDescription>
              </DialogHeader>

              {editBlog && (
                <div className="space-y-4">
                  <div>
                    <Label>Başlık</Label>
                    <Input value={editBlog.title} onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>İçerik</Label>
                    <Textarea
                      value={editBlog.content}
                      onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                      wrap="soft"
                      className="bg-background/50 break-words overflow-y-auto h-40 resize-y max-h-96"
                      style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Yazar</Label>
                      <Input value={editBlog.author} onChange={(e) => setEditBlog({ ...editBlog, author: e.target.value })} />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <Input value={editBlog.category} onChange={(e) => setEditBlog({ ...editBlog, category: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Kapak Görseli (opsiyonel)</Label>
                    <Input
                      value={editBlog.cover_image || ""}
                      onChange={(e) => setEditBlog({ ...editBlog, cover_image: e.target.value })}
                      placeholder="/image.jpg veya tam URL"
                    />
                  </div>
                  <div>
                    <Label>Tarih</Label>
                    <Input
                      type="date"
                      value={editBlog.date}
                      onChange={(e) => setEditBlog({ ...editBlog, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Önizleme (opsiyonel)</Label>
                    <Textarea
                      value={editBlog.preview || ""}
                      onChange={(e) => setEditBlog({ ...editBlog, preview: e.target.value })}
                      wrap="soft"
                      className="bg-background/50 break-words overflow-y-auto h-24 resize-y max-h-60"
                      style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleUpdateBlog} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                      Kaydet
                    </Button>
                    <Button variant="outline" onClick={() => setEditOpen(false)} className="flex-1">
                      Kapat
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* ===================== TAKIMLAR (SADECE FRONTEND) ===================== */}
{/* ===================== TAKIMLAR (BACKEND'E BAĞLI) ===================== */}
      {/* ===================== TAKIMLAR (DÜZELTİLMİŞ) ===================== */}
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Takım İçerikleri
          </CardTitle>
          <CardDescription>Takım bilgilerini, üyeleri ve proje detaylarını yönetin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Toplam Takım: {teamsLoading ? "Yükleniyor..." : teams.length}</span>
            <Dialog open={isTeamAddOpen} onOpenChange={setIsTeamAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">Yeni Ekle</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20 max-w-3xl">
                  <VisuallyHidden>
    <DialogTitle>Takım Yönetimi</DialogTitle>
  </VisuallyHidden>
                <DialogHeader>
                  <DialogTitle>Yeni Takım</DialogTitle>
                  <DialogDescription>Tüm alanları doldurarak veritabanına yeni bir takım ekleyin.</DialogDescription>
                </DialogHeader>

                {/* DÜZENLEME: Buradaki formun tamamı, doğru state isimlerini kullanacak şekilde güncellendi. */}
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teamName">Takım Adı</Label>
                      <Input id="teamName" value={newTeam.name} onChange={(e) => setNewTeam((p) => ({ ...p, name: e.target.value }))} className="bg-background/50" />
                    </div>
                    <div>
                      <Label htmlFor="projectName">Proje Adı</Label>
                      <Input id="projectName" value={newTeam.project_name} onChange={(e) => setNewTeam((p) => ({ ...p, project_name: e.target.value }))} className="bg-background/50" />
                    </div>
                  </div>

                  <div>
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea id="description" value={newTeam.description} onChange={(e) => setNewTeam(p => ({...p, description: e.target.value}))} className="bg-background/50" rows={4} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectCategory">Proje Kategorisi</Label>
                      <Input id="projectCategory" value={newTeam.category} onChange={(e) => setNewTeam((p) => ({ ...p, category: e.target.value }))} className="bg-background/50" />
                    </div>
                    <div>
                      <Label htmlFor="teamPhoto">Takım Fotoğrafı (URL)</Label>
                      <Input id="teamPhoto" value={newTeam.photo_url} onChange={(e) => setNewTeam((p) => ({ ...p, photo_url: e.target.value }))} className="bg-background/50" placeholder="/images/teams/default.png" />
                    </div>
                  </div>
                  {/* YENİ EKLENEN ONAY KUTUSU */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isFeatured"
                  checked={newTeam.is_featured}
                  onCheckedChange={(checked) => {
                    setNewTeam((p) => ({ ...p, is_featured: !!checked }))
                  }}
                />
                <Label
                  htmlFor="isFeatured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bu takımı anasayfada öne çıkar
                </Label>
              </div>
                  <div className="pt-2">
                    <Label>Üyeler</Label>
                    <div className="space-y-3 mt-2">
                      {newTeam.members.map((m, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                          <Input placeholder="Ad Soyad" value={m.name} onChange={(e) => updateTeamMemberField(idx, "name", e.target.value)} className="bg-background/50" />
                          <Input placeholder="Rol" value={m.role} onChange={(e) => updateTeamMemberField(idx, "role", e.target.value)} className="bg-background/50" />
                          <div className="flex gap-2">
                            <Input placeholder="LinkedIn URL" value={m.linkedin_url} onChange={(e) => updateTeamMemberField(idx, "linkedin_url", e.target.value)} className="bg-background/50 flex-1" />
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeTeamMemberRow(idx)}>Sil</Button>
                          </div>
                        </div>
                      ))}
                      <div>
                        <Button type="button" variant="outline" size="sm" onClick={addTeamMemberRow}>Üye Satırı Ekle</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddTeam} className="flex-1 bg-ayzek-gradient hover:opacity-90">Ekle</Button>
                    <Button variant="outline" onClick={() => setIsTeamAddOpen(false)} className="flex-1">İptal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 w-full" onClick={() => setTeamManageOpen(true)}>
            <Edit className="w-4 h-4 mr-2" /> Takımları Düzenle
          </Button>

          <Dialog open={teamManageOpen} onOpenChange={setTeamManageOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <VisuallyHidden>
                  <DialogTitle>Takım Yönetimi</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full h-10 rounded flex items-center justify-center">
                  <div className="absolute inset-0 rounded bg-ayzek-gradient" />
                  <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                    Takım Yönetimi
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {teamsLoading ? <p className="text-center p-4 text-muted-foreground">Takımlar Yükleniyor...</p> : 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
{teams.map((team) => (
                    // DÜZENLEME: Kartın tamamını flex container yapıyoruz.
                   <Card key={team.id} className="overflow-visible flex flex-col">
                      {/* DÜZENLEME: 'items-center' -> 'items-start' yapıldı */}
            <div className="flex items-start justify-between gap-4 p-4">
  {/* Sol taraf (resim + metin) */}
  <div className="flex items-start gap-4 min-w-0">
    <div className="w-16 h-16 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
      {team.photo_url ? (
        <img src={normalizeImageUrl(team.photo_url)} alt={team.name} className="w-full h-full object-cover" />
      ) : (
        <Users className="w-8 h-8 text-muted-foreground" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold truncate">{team.name}</h3>
        {team.is_featured && (
          <Star className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" />
        )}
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {team.project_name || "—"} • {team.category || "Kategori yok"}
      </p>
      <p className="text-xs mt-1">Üye sayısı: {team.members?.length || 0}</p>
    </div>
  </div>

  {/* Sağ taraf (aksiyonlar) */}
  <div className="flex items-center gap-2 shrink-0">
    <Button
      size="sm"
      variant="outline"
      className="relative z-10"
      onClick={() => openEditTeam(team)}
    >
      Düzenle
    </Button>
    <Button
      size="sm"
      variant="destructive"
      className="relative z-10"
      onClick={() => handleDeleteTeam(team.id)}
    >
      <Trash2 className="w-3 h-3 mr-1" /> Sil
    </Button>
  </div>
</div>
                      <CardContent className="pt-0 pb-4 px-4 border-t mt-auto">
                        {team.members?.length ? (
                          <ul className="text-xs grid gap-1 pt-3">
                            {team.members.map((m) => (
                              <li key={m.id} className="flex items-center justify-between gap-2">
                                <span className="truncate">{m.name} — {m.role || "—"}</span>
                                {m.linkedin_url && (
                                  <a href={m.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline shrink-0">
                                    LinkedIn
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted-foreground pt-3">Üye bilgisi eklenmemiş.</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {!teams.length && !teamsLoading && (
                    <div className="text-sm text-muted-foreground px-2 py-6 text-center col-span-full">Henüz takım yok. "Yeni Ekle" ile başlayın.</div>
                  )}
                </div>
                }
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={teamEditOpen} onOpenChange={setTeamEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-3xl">
    <DialogHeader><DialogTitle>Takımı Düzenle</DialogTitle></DialogHeader>
    {editTeam && (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Takım Adı</Label>
            <Input value={editTeam.name} onChange={(e)=>setEditTeam({...editTeam, name:e.target.value})}/>
          </div>
          <div><Label>Proje Adı</Label>
            <Input value={editTeam.project_name} onChange={(e)=>setEditTeam({...editTeam, project_name:e.target.value})}/>
          </div>
        </div>
        <div><Label>Açıklama</Label>
          <Textarea value={editTeam.description} onChange={(e)=>setEditTeam({...editTeam, description:e.target.value})}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label>Kategori</Label>
            <Input value={editTeam.category} onChange={(e)=>setEditTeam({...editTeam, category:e.target.value})}/>
          </div>
          <div><Label>Foto URL</Label>
            <Input value={editTeam.photo_url ?? ""} onChange={(e)=>setEditTeam({...editTeam, photo_url:e.target.value})}/>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="editTeamFeatured" checked={!!editTeam.is_featured} onCheckedChange={(c)=>setEditTeam({...editTeam, is_featured: !!c})}/>
          <Label htmlFor="editTeamFeatured">Anasayfada öne çıkar</Label>
        </div>

        <div className="pt-2">
          <Label>Üyeler</Label>
          <div className="space-y-2 mt-2">
            {(editTeam.members || []).map((m: any, idx: number)=>(
              <div key={m.id ?? idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Ad Soyad" value={m.name} onChange={(e)=>{
                  const arr = [...(editTeam.members||[])]; arr[idx] = { ...m, name:e.target.value }; setEditTeam({...editTeam, members:arr});
                }}/>
                <Input placeholder="Rol" value={m.role} onChange={(e)=>{
                  const arr = [...(editTeam.members||[])]; arr[idx] = { ...m, role:e.target.value }; setEditTeam({...editTeam, members:arr});
                }}/>
                <Input placeholder="LinkedIn URL" value={m.linkedin_url ?? ""} onChange={(e)=>{
                  const arr = [...(editTeam.members||[])]; arr[idx] = { ...m, linkedin_url:e.target.value }; setEditTeam({...editTeam, members:arr});
                }}/>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdateTeam}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setTeamEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
        </CardContent>
      </Card>
      {/* =================== /TAKIMLAR (SADECE FRONTEND) =================== */}

      {/* =================== EKİBİMİZ (4 kategori — yalnızca front) =================== */}
 <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Ekibimiz
          </CardTitle>
          <CardDescription>Kategorilere göre ekip üyelerini yönetin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <Label>Kategori Seç</Label>
              <select
                value={selectedCrewCat}
                onChange={(e) => setSelectedCrewCat(e.target.value as CrewCategory)}
                className="w-full h-10 rounded-md border bg-background/50 px-3"
              >
                {CREW_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Dialog open={crewAddOpen} onOpenChange={setCrewAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-ayzek-gradient hover:opacity-90">Üye Ekle</Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20 max-w-lg">
                  <VisuallyHidden>
    <DialogTitle>Ekibimiz — Kategori Yönetimi</DialogTitle>
  </VisuallyHidden>
                <DialogHeader>
                  <DialogTitle>{selectedCrewCat} — Yeni Üye</DialogTitle>
                  <DialogDescription>Yeni üyenin bilgilerini girin.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-4">
                  <div>
                    <Label>İsim Soyisim</Label>
                    <Input value={newCrewMember.name} onChange={(e) => setNewCrewMember(p => ({ ...p, name: e.target.value }))} className="bg-background/50" />
                  </div>
                  <div>
                    <Label>Görevi</Label>
                    <Input value={newCrewMember.role} onChange={(e) => setNewCrewMember(p => ({ ...p, role: e.target.value }))} className="bg-background/50" />
                  </div>
                  <div>
                    <Label>Açıklama (Kısa Konuşma)</Label>
                    <Textarea value={newCrewMember.description} onChange={(e) => setNewCrewMember(p => ({ ...p, description: e.target.value }))} className="bg-background/50" rows={3} />
                  </div>
                  <div>
                    <Label>Fotoğraf (URL)</Label>
                    <Input value={newCrewMember.photo_url} onChange={(e) => setNewCrewMember(p => ({ ...p, photo_url: e.target.value }))} className="bg-background/50" placeholder="/avatars/ornek.png" />
                  </div>
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input value={newCrewMember.linkedin_url} onChange={(e) => setNewCrewMember(p => ({ ...p, linkedin_url: e.target.value }))} className="bg-background/50" />
                  </div>
                  <div>
                    <Label>GitHub URL</Label>
                    <Input value={newCrewMember.github_url} onChange={(e) => setNewCrewMember(p => ({ ...p, github_url: e.target.value }))} className="bg-background/50" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleAddCrewMember} className="flex-1 bg-ayzek-gradient hover:opacity-90">Ekle</Button>
                    <Button variant="outline" onClick={() => setCrewAddOpen(false)} className="flex-1">İptal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button size="sm" variant="outline" className="border-primary/20" onClick={() => setCrewManageOpen(true)}>
              <Edit className="w-4 h-4 mr-2" /> Kategorileri Yönet
            </Button>
          </div>

          <div className="grid gap-3">
            {crewLoading ? <p className="text-center p-4 text-muted-foreground">Üyeler yükleniyor...</p> :
             (crewMembers[selectedCrewCat] || []).length > 0 ? (
                (crewMembers[selectedCrewCat] || []).map((member) => (
                  <Card key={member.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded bg-muted overflow-hidden flex items-center justify-center shrink-0">
                        {member.photo_url ? (
                          <img src={normalizeImageUrl(member.photo_url)} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold leading-tight">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                        {member.description && <p className="text-sm mt-1 text-muted-foreground/80 line-clamp-2">{member.description}</p>}
                      </div>
                        <Button size="sm" variant="outline" onClick={() => openEditCrew(member)}>Düzenle</Button>
  <Button size="sm" variant="destructive" onClick={() => handleDeleteCrewMember(member.id)}>
    <Trash2 className="w-3 h-3 mr-1" /> Sil
  </Button>
                    </div>
                  </Card>
                ))
             ) : (
                <div className="text-sm text-muted-foreground px-2 py-6 text-center">Bu kategoride henüz üye yok.</div>
             )
            }
          </div>

          <Dialog open={crewManageOpen} onOpenChange={setCrewManageOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <VisuallyHidden>
                  <DialogTitle>Ekibimiz — Kategori Yönetimi</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full h-10 rounded flex items-center justify-center">
                  <div className="absolute inset-0 rounded bg-ayzek-gradient" />
                  <span className="relative z-10 text-white text-base md:text-lg font-display font-semibold tracking-wide">
                    Ekibimiz — Kategori Yönetimi
                  </span>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREW_CATEGORIES.map((category) => {
                  const membersInCategory = crewMembers[category] || [];
                  return (
                    <Card key={category} className="p-4 flex flex-col">
                      <h3 className="font-semibold text-lg">{category}</h3>
                      <div className="mt-2 flex-1 grid gap-2 content-start">
                        {membersInCategory.length > 0 ? (
                          membersInCategory.map(member => (
                            <div key={member.id} className="flex items-center justify-between gap-2 p-2 rounded border border-border/50">
                              <div className="flex items-center gap-2">
                                {member.photo_url && <img src={normalizeImageUrl(member.photo_url)} alt={member.name} className="w-8 h-8 rounded-full object-cover" />}
                                <div>
                                  <div className="text-sm font-medium">{member.name}</div>
                                  <div className="text-xs text-muted-foreground">{member.role}</div>
                                </div>
                              </div>
                              <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDeleteCrewMember(member.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-muted-foreground py-2">Bu kategoride üye yok.</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={crewEditOpen} onOpenChange={setCrewEditOpen}>
  <DialogContent className="bg-card border-primary/20 max-w-lg">
    <DialogHeader><DialogTitle>Üyeyi Düzenle</DialogTitle></DialogHeader>
    {editCrew && (
      <div className="space-y-3">
        <div><Label>İsim</Label>
          <Input value={editCrew.name} onChange={(e)=>setEditCrew({...editCrew, name:e.target.value})}/>
        </div>
        <div><Label>Görev</Label>
          <Input value={editCrew.role} onChange={(e)=>setEditCrew({...editCrew, role:e.target.value})}/>
        </div>
        <div><Label>Açıklama</Label>
          <Textarea value={editCrew.description ?? ""} onChange={(e)=>setEditCrew({...editCrew, description:e.target.value})}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Foto URL</Label>
            <Input value={editCrew.photo_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, photo_url:e.target.value})}/>
          </div>
          <div>
            <Label>Kategori</Label>
            <select className="w-full h-10 rounded-md border bg-background/50 px-3"
              value={editCrew.category}
              onChange={(e)=>setEditCrew({...editCrew, category: e.target.value as any})}>
              {CREW_CATEGORIES.map(c => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>LinkedIn</Label>
            <Input value={editCrew.linkedin_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, linkedin_url:e.target.value})}/>
          </div>
          <div><Label>GitHub</Label>
            <Input value={editCrew.github_url ?? ""} onChange={(e)=>setEditCrew({...editCrew, github_url:e.target.value})}/>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-ayzek-gradient hover:opacity-90" onClick={handleUpdateCrew}>Kaydet</Button>
          <Button variant="outline" className="flex-1" onClick={()=>setCrewEditOpen(false)}>Kapat</Button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

