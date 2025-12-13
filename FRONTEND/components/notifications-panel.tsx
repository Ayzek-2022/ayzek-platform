"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  UserPlus,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  X,
  Eye,
  MoreHorizontal,
} from "lucide-react"

interface Notification {
  id: string
  type: "join_request" | "event_update" | "system" | "pending_action"
  title: string
  description: string
  timestamp: string
  isRead: boolean
  priority: "low" | "medium" | "high"
  actionRequired?: boolean
  data?: any
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "join_request",
    title: "Yeni Üyelik Başvurusu",
    description: "Ahmet Yılmaz topluluğa katılmak için başvuru yaptı",
    timestamp: "2024-02-10T10:30:00Z",
    isRead: false,
    priority: "high",
    actionRequired: true,
    data: { applicantName: "Ahmet Yılmaz", email: "ahmet.yilmaz@example.com" },
  },
  {
    id: "2",
    type: "event_update",
    title: "Etkinlik Güncellemesi",
    description: "AI Atölyesi etkinliğine 5 yeni katılımcı kaydoldu",
    timestamp: "2024-02-10T09:15:00Z",
    isRead: false,
    priority: "medium",
    actionRequired: false,
    data: { eventName: "AI Atölyesi", newRegistrations: 5 },
  },
  {
    id: "3",
    type: "join_request",
    title: "Yeni Üyelik Başvurusu",
    description: "Zeynep Kaya topluluğa katılmak için başvuru yaptı",
    timestamp: "2024-02-09T16:45:00Z",
    isRead: true,
    priority: "high",
    actionRequired: true,
    data: { applicantName: "Zeynep Kaya", email: "zeynep.kaya@example.com" },
  },
  {
    id: "4",
    type: "system",
    title: "Sistem Bakımı",
    description: "Planlı sistem bakımı 15 Şubat'ta gerçekleştirilecek",
    timestamp: "2024-02-08T14:20:00Z",
    isRead: true,
    priority: "medium",
    actionRequired: false,
  },
  {
    id: "5",
    type: "pending_action",
    title: "Bekleyen Onay",
    description: "3 etkinlik onayınızı bekliyor",
    timestamp: "2024-02-08T11:30:00Z",
    isRead: false,
    priority: "high",
    actionRequired: true,
    data: { pendingCount: 3 },
  },
  {
    id: "6",
    type: "event_update",
    title: "Etkinlik İptal Edildi",
    description: "Blockchain Konferansı yetersiz katılım nedeniyle iptal edildi",
    timestamp: "2024-02-07T13:10:00Z",
    isRead: true,
    priority: "low",
    actionRequired: false,
    data: { eventName: "Blockchain Konferansı" },
  },
]

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.isRead).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "join_request":
        return <UserPlus className="w-4 h-4 text-blue-500" />
      case "event_update":
        return <Calendar className="w-4 h-4 text-green-500" />
      case "system":
        return <Settings className="w-4 h-4 text-orange-500" />
      case "pending_action":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Az önce"
    if (diffInHours < 24) return `${diffInHours} saat önce`
    if (diffInHours < 48) return "Dün"
    return date.toLocaleDateString("tr-TR")
  }

  const filteredNotifications = notifications.filter((notification) => {
    switch (activeTab) {
      case "unread":
        return !notification.isRead
      case "action_required":
        return notification.actionRequired && !notification.isRead
      case "join_requests":
        return notification.type === "join_request"
      case "events":
        return notification.type === "event_update"
      default:
        return true
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-primary/20">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Bildirimler
              {unreadCount > 0 && <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">{unreadCount}</Badge>}
            </DialogTitle>
            <DialogDescription>Topluluk aktivitelerini ve bekleyen işlemleri görüntüleyin</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs bg-transparent">
                <CheckCircle className="w-3 h-3 mr-1" />
                Tümünü Okundu İşaretle
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="all" className="text-xs">
              Tümü
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Okunmamış
              {unreadCount > 0 && <Badge className="ml-1 bg-red-500 text-white text-xs px-1">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="action_required" className="text-xs">
              Eylem Gerekli
              {actionRequiredCount > 0 && (
                <Badge className="ml-1 bg-orange-500 text-white text-xs px-1">{actionRequiredCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="join_requests" className="text-xs">
              Başvurular
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              Etkinlikler
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Bu kategoride bildirim bulunmuyor</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                        notification.isRead ? "bg-background/50 border-border/50" : "bg-card border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-medium text-sm ${
                                  notification.isRead ? "text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  Eylem Gerekli
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionRequired && !notification.isRead && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-ayzek-gradient hover:opacity-90 text-xs">
                              İşlemi Görüntüle
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs bg-transparent">
                              Daha Sonra
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
