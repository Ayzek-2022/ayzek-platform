"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Mail, Phone, CheckCircle, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

export interface Application {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  interests: string[]
  heard_from: string
  motivation?: string | null
  contribution?: string | null
  status: "pending" | "reviewed" | "accepted" | "rejected"
  created_at: string | null
}

type Props = {
  applications: Application[]
  onAction: (id: number, action: "accepted" | "rejected" | "reviewed") => void
}

const getStatusColor = (status: Application["status"]) => {
  switch (status) {
    case "pending": return "bg-yellow-500"
    case "accepted": return "bg-green-600"
    case "rejected": return "bg-red-600"
    case "reviewed": return "bg-blue-600"
    default: return "bg-gray-500"
  }
}

const getStatusText = (status: Application["status"]) => {
  switch (status) {
    case "pending": return "Beklemede"
    case "accepted": return "Onaylandı"
    case "rejected": return "Reddedildi"
    case "reviewed": return "İncelendi"
    default: return status
  }
}

export default function ApplicationsTab({ applications, onAction }: Props) {
  const [selected, setSelected] = useState<Application | null>(null)

  return (
    <Card className="bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Üye Başvuruları</CardTitle>
        <CardDescription>Topluluk üyelik başvurularını inceleyin ve yönetin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <h4 className="font-medium">{a.first_name} {a.last_name}</h4>
                <p className="text-sm text-muted-foreground">{a.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(a.status)} text-white border-0`}>{getStatusText(a.status)}</Badge>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelected(a)} className="border-primary/20">
                      <Eye className="w-4 h-4 mr-1" />
                      Görüntüle
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl bg-card border-primary/20">
                    <DialogHeader>
                      <DialogTitle>Başvuru: {selected?.first_name} {selected?.last_name}</DialogTitle>
                      <DialogDescription>
                        {selected?.created_at ? new Date(selected.created_at).toLocaleDateString("tr-TR") : "—"} tarihinde gönderildi
                      </DialogDescription>
                    </DialogHeader>

                    {selected && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">İletişim Bilgileri</Label>
                            <div className="space-y-1 text-sm mt-1">
                              <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{selected.email}</div>
                              <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{selected.phone || "—"}</div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Durum</Label>
                            <div className="mt-1">
                              <Badge className={`${getStatusColor(selected.status)} text-white border-0`}>{getStatusText(selected.status)}</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">İlgi Alanları</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selected.interests.map((it) => <Badge key={it} variant="secondary">{it}</Badge>)}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Topluluğumuza katılmanızdaki motivasyon nedir?</Label>
                          <p className="text-sm mt-1">{selected.motivation?.trim() || selected.contribution?.trim() || "—"}</p>
                        </div>

                        {selected.status === "pending" && (
                          <div className="flex gap-2 pt-4">
                            <Button onClick={() => onAction(selected.id, "accepted")} className="flex-1 bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-2" /> Onayla
                            </Button>
                            <Button variant="destructive" onClick={() => onAction(selected.id, "rejected")} className="flex-1">
                              <XCircle className="w-4 h-4 mr-2" /> Reddet
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

