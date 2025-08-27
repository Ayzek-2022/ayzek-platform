"use client"

import { useState } from "react"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Users,
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
  Plus,
  ImageIcon,
  Lightbulb,
  GalleryThumbnailsIcon as Gallery,
  Home,
  Bell,
  MessageSquare,
  AlertCircle,
  User,
} from "lucide-react"

const mockApplications = [
  {
    id: 1,
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 (555) 123-4567",
    company: "Teknoloji A.Ş.",
    jobTitle: "Yazılım Geliştirici",
    experienceLevel: "orta",
    interests: ["Web Geliştirme", "Makine Öğrenmesi"],
    motivation: "Benzer düşünen geliştiricilerle bağlantı kurmak ve açık kaynak projelere katkıda bulunmak istiyorum.",
    status: "pending",
    submittedAt: "2024-02-10T10:30:00Z",
  },
  {
    id: 2,
    firstName: "Zeynep",
    lastName: "Kaya",
    email: "zeynep.kaya@example.com",
    phone: "+90 (555) 987-6543",
    company: "Tasarım Stüdyosu",
    jobTitle: "UX Tasarımcısı",
    experienceLevel: "ileri",
    interests: ["UI/UX Tasarım", "Web Geliştirme"],
    motivation: "Junior tasarımcılara mentorluk yapmak ve yeni tasarım trendlerini öğrenmek istiyorum.",
    status: "approved",
    submittedAt: "2024-02-09T14:15:00Z",
  },
  {
    id: 3,
    firstName: "Mehmet",
    lastName: "Demir",
    email: "mehmet.demir@example.com",
    phone: "+90 (555) 456-7890",
    company: "Startup Ltd.",
    jobTitle: "Ürün Müdürü",
    experienceLevel: "uzman",
    interests: ["Ürün Yönetimi", "Veri Bilimi"],
    motivation: "Deneyimlerimi paylaşmak ve yeni teknolojiler hakkında bilgi edinmek istiyorum.",
    status: "rejected",
    submittedAt: "2024-02-08T09:45:00Z",
  },
]

const mockEvents = [
  {
    id: 1,
    title: "AI Atölyesi",
    date: "2024-02-15",
    time: "14:00",
    location: "Teknoloji Merkezi",
    attendees: 45,
    maxAttendees: 60,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Aylık Buluşma",
    date: "2024-02-20",
    time: "18:30",
    location: "Topluluk Merkezi",
    attendees: 32,
    maxAttendees: 50,
    status: "upcoming",
  },
]

const mockEventSuggestions = [
  {
    id: 1,
    title: "React 19 Workshop",
    description: "Yeni React 19 özelliklerini keşfedelim",
    suggestedBy: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    category: "Workshop",
    expectedAttendees: 30,
    suggestedDate: "2024-03-15",
    status: "pending",
    submittedAt: "2024-02-12T09:30:00Z",
  },
  {
    id: 2,
    title: "AI ve Makine Öğrenmesi Paneli",
    description: "Sektör uzmanlarıyla AI'nin geleceğini konuşalım",
    suggestedBy: "Zeynep Kaya",
    email: "zeynep@example.com",
    category: "Panel",
    expectedAttendees: 50,
    suggestedDate: "2024-03-20",
    status: "approved",
    submittedAt: "2024-02-10T14:15:00Z",
  },
]

const mockTimelineData = [
  {
    id: 1,
    title: "Büyüyen Topluluk",
    description: "Kelime hızla yayıldı ve düzenli atölyeler ve ağ oluşturma etkinlikleri düzenledik.",
    date: "2022 Q2-Q3",
    type: "milestone",
    achievements: [
      "Aylık atölye serisi başlatıldı",
      "İlk hackathon düzenlendi",
      "Yerel teknoloji merkezi ile ortaklık",
    ],
  },
  {
    id: 2,
    title: "Tanınma ve Ödüller",
    description: "Topluluğumuz yenilikçilik ve kapsayıcılık konusunda tanınma kazandı.",
    date: "2022 Q4",
    type: "achievement",
    achievements: [
      "Bölgesel topluluk ödülü kazanıldı",
      "Teknoloji yayınlarında yer alındı",
      "Mentorluk programı başlatıldı",
    ],
  },
]

const mockGalleryData = [
  {
    id: 1,
    title: "AI Workshop Oturumu",
    description: "Yapay zeka ve makine öğrenmesi üzerine interaktif workshop",
    date: "2024-01-15",
    category: "workshop",
  },
  {
    id: 2,
    title: "Topluluk Ağ Oluşturma Etkinliği",
    description: "Teknoloji profesyonelleri için networking etkinliği",
    date: "2024-02-20",
    category: "networking",
  },
]

const mockTeamData = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Kurucu & CEO",
    bio: "10+ yıllık teknoloji deneyimi ile topluluk liderliği yapıyor.",
    social: { twitter: "@alexj", linkedin: "alexjohnson", github: "alexj" },
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Etkinlik Koordinatörü",
    bio: "Yaratıcı etkinlik planlama ve topluluk katılımı uzmanı.",
    social: { twitter: "@sarahc", linkedin: "sarahchen", github: "sarahc" },
  },
]

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, updateContent, addNotification } =
    useAdmin()
  const [applications, setApplications] = useState(mockApplications)
  const [events, setEvents] = useState(mockEvents)
  const [eventSuggestions, setEventSuggestions] = useState(mockEventSuggestions)
  const [selectedApplication, setSelectedApplication] = useState<(typeof mockApplications)[0] | null>(null)
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<(typeof mockEvents)[0] | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [newTimelineEntry, setNewTimelineEntry] = useState({
    title: "",
    description: "",
    date: "",
    category: "milestone",
  })
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    description: "",
    image: "",
    category: "event",
  })
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    bio: "",
    image: "",
    social: { twitter: "", linkedin: "", github: "" },
  })
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    location: "",
    maxAttendees: 50,
  })
  const [contentData, setContentData] = useState({
    heroTitle: "Topluluk Hafızası ve Etkinlik Vitrini",
    heroDescription:
      "Yolculuğumuzu keşfedin, başarıları kutlayın ve canlı teknoloji topluluğumuzda yaklaşan etkinliklere katılın.",
    memberCount: "150+",
    eventCount: "25+",
    projectCount: "10+",
    activeYears: "3",
  })
  const [editingContent, setEditingContent] = useState({
    heroTitle: contentData.heroTitle,
    heroDescription: contentData.heroDescription,
    memberCount: contentData.memberCount,
    eventCount: contentData.eventCount,
  })

  const [timelineModalOpen, setTimelineModalOpen] = useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  const handleApplicationAction = (id: number, action: "approve" | "reject") => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: action === "approve" ? "approved" : "rejected" } : app)),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede"
      case "approved":
        return "Onaylandı"
      case "rejected":
        return "Reddedildi"
      default:
        return status
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "join_request":
        return <Users className="w-4 h-4 text-blue-500" />
      case "event_suggestion":
        return <Lightbulb className="w-4 h-4 text-orange-500" />
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-green-500" />
      case "system":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Az önce"
    if (diffInHours < 24) return `${diffInHours} saat önce`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} gün önce`
    return date.toLocaleDateString("tr-TR")
  }

  const handleEventSuggestionAction = (id: number, action: "approve" | "reject") => {
    setEventSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === id ? { ...suggestion, status: action === "approve" ? "approved" : "rejected" } : suggestion,
      ),
    )
  }

  const pendingCount = applications.filter((app) => app.status === "pending").length
  const approvedCount = applications.filter((app) => app.status === "approved").length
  const totalEvents = events.length
  const upcomingEvents = events.filter((event) => event.status === "upcoming").length
  const pendingSuggestions = eventSuggestions.filter((suggestion) => suggestion.status === "pending").length

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      const event = {
        id: events.length + 1,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location,
        maxAttendees: newEvent.maxAttendees,
        attendees: 0,
        status: "upcoming" as const,
      }
      setEvents([...events, event])
      setNewEvent({ title: "", description: "", image: "", date: "", time: "", location: "", maxAttendees: 50 })
      setIsAddEventOpen(false)
    }
  }

  const handleEditEvent = (event: (typeof mockEvents)[0]) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: "",
      image: "",
      date: event.date,
      time: event.time,
      location: event.location,
      maxAttendees: event.maxAttendees,
    })
  }

  const handleUpdateEvent = () => {
    if (editingEvent && newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time,
                location: newEvent.location,
                maxAttendees: newEvent.maxAttendees,
              }
            : e,
        ),
      )
      setEditingEvent(null)
      setNewEvent({ title: "", description: "", image: "", date: "", time: "", location: "", maxAttendees: 50 })
    }
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((e) => e.id !== eventId))
  }

  const handleUpdateContent = () => {
    setContentData({
      heroTitle: editingContent.heroTitle,
      heroDescription: editingContent.heroDescription,
      memberCount: editingContent.memberCount,
      eventCount: editingContent.eventCount,
      projectCount: contentData.projectCount,
      activeYears: contentData.activeYears,
    })
    updateContent("homepage", {
      heroTitle: editingContent.heroTitle,
      heroDescription: editingContent.heroDescription,
      stats: {
        memberCount: editingContent.memberCount,
        eventCount: editingContent.eventCount,
        projectCount: contentData.projectCount,
        activeYears: contentData.activeYears,
      },
    })
    setIsEditingContent(false)
  }

  const handleAddTimelineEntry = () => {
    if (newTimelineEntry.title && newTimelineEntry.date) {
      updateContent("timeline", {
        action: "add",
        entry: {
          id: Date.now(),
          ...newTimelineEntry,
        },
      })
      setNewTimelineEntry({ title: "", description: "", date: "", category: "milestone" })
      setIsTimelineModalOpen(false)
    }
  }

  const handleAddGalleryItem = () => {
    if (newGalleryItem.title && newGalleryItem.image) {
      updateContent("gallery", {
        action: "add",
        item: {
          id: Date.now(),
          ...newGalleryItem,
        },
      })
      setNewGalleryItem({ title: "", description: "", image: "", category: "event" })
      setIsGalleryModalOpen(false)
    }
  }

  const handleAddTeamMember = () => {
    if (newTeamMember.name && newTeamMember.role) {
      updateContent("team", {
        action: "add",
        member: {
          id: Date.now(),
          ...newTeamMember,
        },
      })
      setNewTeamMember({
        name: "",
        role: "",
        bio: "",
        image: "",
        social: { twitter: "", linkedin: "", github: "" },
      })
      setIsTeamModalOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted dark">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/ayzek-logo.png" alt="AYZEK" className="w-8 h-8" />
              <span className="text-3xl font-display font-bold bg-ayzek-gradient bg-clip-text text-transparent">
                AYZEK
              </span>
            </div>
            <div className="h-6 w-px bg-border"></div>
            <h1 className="text-xl font-display font-semibold text-foreground">Yönetici Paneli</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative border-primary/20 hover:bg-primary/10 bg-transparent"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 bg-card border-primary/20" align="end">
                <div className="flex items-center justify-between p-4 border-b border-primary/10">
                  <h3 className="font-semibold text-foreground">Bildirimler</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Tümünü Okundu İşaretle
                    </Button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Henüz bildirim yok</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 ${
                            notification.read ? "border-transparent" : "border-primary bg-primary/5"
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`text-sm font-medium ${notification.read ? "text-muted-foreground" : "text-foreground"}`}
                                >
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p
                                className={`text-sm mt-1 ${notification.read ? "text-muted-foreground" : "text-foreground/80"}`}
                              >
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="border-primary/20 hover:bg-primary/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-screen-xl mx-auto p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen Başvurular</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">İnceleme bekliyor</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Onaylanan Üyeler</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">Aktif topluluk üyeleri</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Toplam Etkinlik</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{totalEvents}</div>
              <p className="text-xs text-muted-foreground">Tüm zamanlar</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Yaklaşan Etkinlikler</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Sonraki 30 gün</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Etkinlik Önerileri</CardTitle>
              <Lightbulb className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{pendingSuggestions}</div>
              <p className="text-xs text-muted-foreground">Bekleyen öneriler</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="applications">Başvurular</TabsTrigger>
            <TabsTrigger value="events">Etkinlikler</TabsTrigger>
            <TabsTrigger value="content">İçerik Yönetimi</TabsTrigger>
            <TabsTrigger value="suggestions">Etkinlik Önerileri</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle>Üye Başvuruları</CardTitle>
                <CardDescription>Topluluk üyelik başvurularını inceleyin ve yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">
                            {application.firstName} {application.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{application.email}</p>
                          <p className="text-sm text-muted-foreground">{application.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(application.status)} text-white border-0`}>
                          {getStatusText(application.status)}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedApplication(application)}
                              className="border-primary/20"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Görüntüle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-card border-primary/20">
                            <DialogHeader>
                              <DialogTitle>
                                Başvuru: {application.firstName} {application.lastName}
                              </DialogTitle>
                              <DialogDescription>
                                {new Date(application.submittedAt).toLocaleDateString("tr-TR")} tarihinde gönderildi
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">İletişim Bilgileri</Label>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4" />
                                      {application.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4" />
                                      {application.phone}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Profesyonel Bilgiler</Label>
                                  <div className="space-y-1 text-sm">
                                    <p>{application.company}</p>
                                    <p>{application.jobTitle}</p>
                                    <p>Deneyim: {application.experienceLevel}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">İlgi Alanları</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.interests.map((interest) => (
                                    <Badge key={interest} variant="secondary">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Motivasyon</Label>
                                <p className="text-sm mt-1">{application.motivation}</p>
                              </div>
                              {application.status === "pending" && (
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleApplicationAction(application.id, "approve")}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Onayla
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleApplicationAction(application.id, "reject")}
                                    className="flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reddet
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-card/50 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Etkinlik Yönetimi</CardTitle>
                  <CardDescription>Topluluk etkinliklerini ve kayıtları yönetin</CardDescription>
                </div>
                <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-ayzek-gradient hover:opacity-90">
                      <Plus className="w-4 h-4 mr-2" />
                      Etkinlik Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-primary/20 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
                      <DialogDescription>Topluluk için yeni bir etkinlik oluşturun</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="eventTitle">Etkinlik Başlığı</Label>
                        <Input
                          id="eventTitle"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="Etkinlik adını girin"
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventDescription">Etkinlik Açıklaması</Label>
                        <Textarea
                          id="eventDescription"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Etkinlik açıklamasını girin"
                          rows={3}
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="eventImage">Etkinlik Görseli</Label>
                        <div className="flex gap-2">
                          <Input
                            id="eventImage"
                            value={newEvent.image}
                            onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                            placeholder="Görsel URL'si girin"
                            className="bg-background/50 flex-1"
                          />
                          <Button variant="outline" size="sm" className="border-primary/20 bg-transparent">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Yükle
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="eventDate">Tarih</Label>
                          <Input
                            id="eventDate"
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eventTime">Saat</Label>
                          <Input
                            id="eventTime"
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="eventLocation">Konum</Label>
                        <Input
                          id="eventLocation"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Etkinlik konumunu girin"
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxAttendees">Maksimum Katılımcı</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          value={newEvent.maxAttendees}
                          onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: Number.parseInt(e.target.value) })}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleAddEvent} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                          Etkinlik Ekle
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddEventOpen(false)} className="flex-1">
                          İptal
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString("tr-TR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.attendees}/{event.maxAttendees}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dialog
                          open={editingEvent?.id === event.id}
                          onOpenChange={(open) => !open && setEditingEvent(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary/20 bg-transparent"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Düzenle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-primary/20">
                            <DialogHeader>
                              <DialogTitle>Etkinlik Düzenle</DialogTitle>
                              <DialogDescription>Etkinlik bilgilerini güncelleyin</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="editTitle">Etkinlik Başlığı</Label>
                                <Input
                                  id="editTitle"
                                  value={newEvent.title}
                                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                  className="bg-background/50"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="editDate">Tarih</Label>
                                  <Input
                                    id="editDate"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="bg-background/50"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editTime">Saat</Label>
                                  <Input
                                    id="editTime"
                                    type="time"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                    className="bg-background/50"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="editLocation">Konum</Label>
                                <Input
                                  id="editLocation"
                                  value={newEvent.location}
                                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                  className="bg-background/50"
                                />
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={handleUpdateEvent}
                                  className="flex-1 bg-ayzek-gradient hover:opacity-90"
                                >
                                  Güncelle
                                </Button>
                                <Button variant="outline" onClick={() => setEditingEvent(null)} className="flex-1">
                                  İptal
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Sil
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-primary/20">
                            <DialogHeader>
                              <DialogTitle>Etkinliği Sil</DialogTitle>
                              <DialogDescription>
                                "{event.title}" etkinliğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-2 pt-4">
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="flex-1"
                              >
                                Evet, Sil
                              </Button>
                              <Button variant="outline" className="flex-1 bg-transparent">
                                İptal
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Homepage Poster Area */}
              <Card className="bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Ana Sayfa Poster Alanı
                  </CardTitle>
                  <CardDescription>Ana sayfa banner ve hero bölümünü yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Ana Başlık</Label>
                    <Input
                      value={editingContent.heroTitle}
                      onChange={(e) => setEditingContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={editingContent.heroDescription}
                      onChange={(e) => setEditingContent((prev) => ({ ...prev, heroDescription: e.target.value }))}
                      rows={3}
                      className="bg-background/50"
                    />
                  </div>
                  <Button size="sm" className="bg-ayzek-gradient hover:opacity-90">
                    <Edit className="w-4 h-4 mr-2" />
                    Güncelle
                  </Button>
                </CardContent>
              </Card>

              {/* Interactive Time Capsule */}
              <Card className="bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Zaman Kapsülü
                  </CardTitle>
                  <CardDescription>Timeline etkinliklerini ve kilometre taşlarını yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Kilometre Taşı: 6</span>
                    <Dialog open={isTimelineModalOpen} onOpenChange={setIsTimelineModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                          <Plus className="w-4 h-4 mr-2" />
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
                              value={newTimelineEntry.title}
                              onChange={(e) => setNewTimelineEntry((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="Kilometre taşı başlığı"
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Açıklama</Label>
                            <Textarea
                              value={newTimelineEntry.description}
                              onChange={(e) =>
                                setNewTimelineEntry((prev) => ({ ...prev, description: e.target.value }))
                              }
                              placeholder="Detaylı açıklama"
                              rows={3}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Tarih</Label>
                            <Input
                              type="date"
                              value={newTimelineEntry.date}
                              onChange={(e) => setNewTimelineEntry((prev) => ({ ...prev, date: e.target.value }))}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Kategori</Label>
                            <select
                              value={newTimelineEntry.category}
                              onChange={(e) => setNewTimelineEntry((prev) => ({ ...prev, category: e.target.value }))}
                              className="w-full p-2 rounded-md bg-background/50 border border-input"
                            >
                              <option value="milestone">Kilometre Taşları</option>
                              <option value="achievement">Başarılar</option>
                              <option value="education">Eğitim</option>
                              <option value="event">Etkinlikler</option>
                            </select>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={handleAddTimelineEntry}
                              className="flex-1 bg-ayzek-gradient hover:opacity-90"
                            >
                              Ekle
                            </Button>
                            <Button variant="outline" onClick={() => setIsTimelineModalOpen(false)} className="flex-1">
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
                    onClick={() => setTimelineModalOpen(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Timeline Düzenle
                  </Button>
                </CardContent>
              </Card>

              {/* Event Gallery */}
              <Card className="bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gallery className="w-5 h-5" />
                    Etkinlik Galerisi
                  </CardTitle>
                  <CardDescription>Ana sayfa ve etkinlik sayfası galerilerini yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Görsel: 12</span>
                    <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                          <Plus className="w-4 h-4 mr-2" />
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
                              value={newGalleryItem.title}
                              onChange={(e) => setNewGalleryItem((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="Görsel başlığı"
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Açıklama</Label>
                            <Textarea
                              value={newGalleryItem.description}
                              onChange={(e) => setNewGalleryItem((prev) => ({ ...prev, description: e.target.value }))}
                              placeholder="Görsel açıklaması"
                              rows={2}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Görsel URL</Label>
                            <div className="flex gap-2">
                              <Input
                                value={newGalleryItem.image}
                                onChange={(e) => setNewGalleryItem((prev) => ({ ...prev, image: e.target.value }))}
                                placeholder="Görsel URL'si"
                                className="bg-background/50 flex-1"
                              />
                              <Button variant="outline" size="sm" className="border-primary/20 bg-transparent">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Yükle
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Kategori</Label>
                            <select
                              value={newGalleryItem.category}
                              onChange={(e) => setNewGalleryItem((prev) => ({ ...prev, category: e.target.value }))}
                              className="w-full p-2 rounded-md bg-background/50 border border-input"
                            >
                              <option value="event">Etkinlik</option>
                              <option value="workshop">Workshop</option>
                              <option value="meetup">Meetup</option>
                              <option value="conference">Konferans</option>
                            </select>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={handleAddGalleryItem}
                              className="flex-1 bg-ayzek-gradient hover:opacity-90"
                            >
                              Ekle
                            </Button>
                            <Button variant="outline" onClick={() => setIsGalleryModalOpen(false)} className="flex-1">
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
                    <Gallery className="w-4 h-4 mr-2" />
                    Galeri Yönet
                  </Button>
                </CardContent>
              </Card>

              {/* Homepage CTA Elements */}
              <Card className="bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    CTA Elementleri
                  </CardTitle>
                  <CardDescription>Ana sayfa çağrı-eylem butonlarını ve bağlantılarını yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Topluluk İstatistikleri</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Üye Sayısı"
                        value={editingContent.memberCount}
                        onChange={(e) => setEditingContent((prev) => ({ ...prev, memberCount: e.target.value }))}
                        className="bg-background/50"
                      />
                      <Input
                        placeholder="Etkinlik Sayısı"
                        value={editingContent.eventCount}
                        onChange={(e) => setEditingContent((prev) => ({ ...prev, eventCount: e.target.value }))}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 w-full" onClick={handleUpdateContent}>
                    <Edit className="w-4 h-4 mr-2" />
                    CTA Güncelle
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Takım Üyeleri
                  </CardTitle>
                  <CardDescription>Ana sayfa takım üyesi kartlarını yönetin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toplam Üye: 6</span>
                    <Dialog open={isTeamModalOpen} onOpenChange={setIsTeamModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-primary/20 bg-transparent">
                          <Plus className="w-4 h-4 mr-2" />
                          Üye Ekle
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-primary/20 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Yeni Takım Üyesi</DialogTitle>
                          <DialogDescription>Takıma yeni üye ekleyin</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>İsim</Label>
                              <Input
                                value={newTeamMember.name}
                                onChange={(e) => setNewTeamMember((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Tam isim"
                                className="bg-background/50"
                              />
                            </div>
                            <div>
                              <Label>Rol</Label>
                              <Input
                                value={newTeamMember.role}
                                onChange={(e) => setNewTeamMember((prev) => ({ ...prev, role: e.target.value }))}
                                placeholder="Pozisyon/Rol"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Biyografi</Label>
                            <Textarea
                              value={newTeamMember.bio}
                              onChange={(e) => setNewTeamMember((prev) => ({ ...prev, bio: e.target.value }))}
                              placeholder="Kısa biyografi"
                              rows={3}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <Label>Profil Fotoğrafı</Label>
                            <div className="flex gap-2">
                              <Input
                                value={newTeamMember.image}
                                onChange={(e) => setNewTeamMember((prev) => ({ ...prev, image: e.target.value }))}
                                placeholder="Fotoğraf URL'si"
                                className="bg-background/50 flex-1"
                              />
                              <Button variant="outline" size="sm" className="border-primary/20 bg-transparent">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Yükle
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label>Sosyal Medya</Label>
                            <div className="grid grid-cols-3 gap-2">
                              <Input
                                value={newTeamMember.social.twitter}
                                onChange={(e) =>
                                  setNewTeamMember((prev) => ({
                                    ...prev,
                                    social: { ...prev.social, twitter: e.target.value },
                                  }))
                                }
                                placeholder="Twitter"
                                className="bg-background/50"
                              />
                              <Input
                                value={newTeamMember.social.linkedin}
                                onChange={(e) =>
                                  setNewTeamMember((prev) => ({
                                    ...prev,
                                    social: { ...prev.social, linkedin: e.target.value },
                                  }))
                                }
                                placeholder="LinkedIn"
                                className="bg-background/50"
                              />
                              <Input
                                value={newTeamMember.social.github}
                                onChange={(e) =>
                                  setNewTeamMember((prev) => ({
                                    ...prev,
                                    social: { ...prev.social, github: e.target.value },
                                  }))
                                }
                                placeholder="GitHub"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleAddTeamMember} className="flex-1 bg-ayzek-gradient hover:opacity-90">
                              Ekle
                            </Button>
                            <Button variant="outline" onClick={() => setIsTeamModalOpen(false)} className="flex-1">
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
                    onClick={() => setTeamModalOpen(true)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Takım Yönet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <Card className="bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle>Etkinlik Önerileri</CardTitle>
                <CardDescription>Kullanıcılar tarafından gönderilen etkinlik önerilerini inceleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span>Öneren: {suggestion.suggestedBy}</span>
                          <span>Kategori: {suggestion.category}</span>
                          <span>Beklenen Katılımcı: {suggestion.expectedAttendees}</span>
                          <span>Önerilen Tarih: {new Date(suggestion.suggestedDate).toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={`${getStatusColor(suggestion.status)} text-white border-0`}>
                          {getStatusText(suggestion.status)}
                        </Badge>
                        {suggestion.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleEventSuggestionAction(suggestion.id, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Onayla
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleEventSuggestionAction(suggestion.id, "reject")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reddet
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={timelineModalOpen} onOpenChange={setTimelineModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-ayzek-gradient bg-clip-text text-transparent">
              Timeline Yönetimi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setEditingItem({
                  id: Date.now(),
                  title: "",
                  description: "",
                  date: "",
                  type: "milestone",
                  achievements: [],
                })
              }}
              className="bg-ayzek-gradient hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Timeline Öğesi Ekle
            </Button>

            <div className="grid gap-4">
              {mockTimelineData.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <p className="text-sm mt-2">{item.description}</p>
                      {item.achievements && (
                        <ul className="text-xs mt-2 space-y-1">
                          {item.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          // Remove item logic
                          addNotification({
                            type: "system",
                            title: "Timeline Öğesi Silindi",
                            message: `"${item.title}" timeline öğesi başarıyla silindi.`,
                            read: false,
                          })
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-ayzek-gradient bg-clip-text text-transparent">
              Galeri Yönetimi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setEditingItem({
                  id: Date.now(),
                  title: "",
                  description: "",
                  image: "",
                  date: "",
                  category: "workshop",
                })
              }}
              className="bg-ayzek-gradient hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Galeri Öğesi Ekle
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockGalleryData.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <p className="text-sm mt-2">{item.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          addNotification({
                            type: "system",
                            title: "Galeri Öğesi Silindi",
                            message: `"${item.title}" galeri öğesi başarıyla silindi.`,
                            read: false,
                          })
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={teamModalOpen} onOpenChange={setTeamModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-ayzek-gradient bg-clip-text text-transparent">
              Takım Yönetimi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => {
                setEditingItem({
                  id: Date.now(),
                  name: "",
                  role: "",
                  bio: "",
                  image: "",
                  social: { twitter: "", linkedin: "", github: "" },
                })
              }}
              className="bg-ayzek-gradient hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Takım Üyesi Ekle
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTeamData.map((member) => (
                <Card key={member.id} className="text-center">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <p className="text-xs mt-2">{member.bio}</p>
                    <div className="flex gap-2 mt-3 justify-center">
                      <Button size="sm" variant="outline" onClick={() => setEditingItem(member)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          addNotification({
                            type: "system",
                            title: "Takım Üyesi Silindi",
                            message: `"${member.name}" takım üyesi başarıyla silindi.`,
                            read: false,
                          })
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-ayzek-gradient bg-clip-text text-transparent">
                {editingItem.name ? "Takım Üyesi Düzenle" : editingItem.title ? "İçerik Düzenle" : "Yeni İçerik Ekle"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {editingItem.name !== undefined ? (
                // Team member form
                <>
                  <div>
                    <Label htmlFor="name">İsim</Label>
                    <Input
                      id="name"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <Input
                      id="role"
                      value={editingItem.role}
                      onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biyografi</Label>
                    <Textarea
                      id="bio"
                      value={editingItem.bio}
                      onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                // Timeline/Gallery form
                <>
                  <div>
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Tarih</Label>
                    <Input
                      id="date"
                      value={editingItem.date}
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    // Save logic
                    addNotification({
                      type: "system",
                      title: "İçerik Güncellendi",
                      message: `İçerik başarıyla ${editingItem.id ? "güncellendi" : "eklendi"}.`,
                      read: false,
                    })
                    setEditingItem(null)
                  }}
                  className="bg-ayzek-gradient hover:opacity-90"
                >
                  Kaydet
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  İptal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
