"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

// Backend'den gelecek verinin yapısını temsil eden arayüz
export interface EventSuggestion {
  id: number;
  title: string;
  description: string;
  contact: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
}

type Props = {
  suggestions: EventSuggestion[];
  onAction: (id: number, action: "approve" | "reject") => void;
  onDelete: (id: number) => void;
};

const getStatusColor = (status: string) =>
  status === "pending" ? "bg-yellow-500" : status === "accepted" ? "bg-green-500" : status === "rejected" ? "bg-red-500" : "bg-gray-500";
const getStatusText = (status: string) =>
  status === "pending" ? "Beklemede" : status === "accepted" ? "Onaylandı" : status === "rejected" ? "Reddedildi" : status;

export default function EventSuggestionsTab({ suggestions, onAction, onDelete }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Etkinlik Önerileri</CardTitle>
          <CardDescription>Kullanıcılar tarafından gönderilen etkinlik önerilerini inceleyin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-10">Henüz etkinlik önerisi bulunmamaktadır.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Etkinlik Önerileri</CardTitle>
        <CardDescription>Kullanıcılar tarafından gönderilen etkinlik önerilerini inceleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((s) => (
            <div key={s.id} className="flex items-start justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium">{s.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span>İletişim: {s.contact}</span>
                  <span>Gönderim Tarihi: {new Date(s.created_at).toLocaleDateString("tr-TR")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge className={`${getStatusColor(s.status)} text-white border-0`}>{getStatusText(s.status)}</Badge>
                {(s.status === "pending" || s.status === "reviewed") && (
                  <>
                    <Button size="sm" onClick={() => onAction(s.id, "approve")} className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-4 h-4 mr-1" /> Onayla
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onAction(s.id, "reject")}>
                      <XCircle className="w-4 h-4 mr-1" /> Reddet
                    </Button>
                  </>
                )}

                {/* Onay Diyaloğunu içeren silme butonu */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Öneriyi Sil</DialogTitle>
                      <DialogDescription>
                        Bu etkinlik önerisini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hayır</Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          onDelete(s.id);
                          setIsDialogOpen(false);
                        }}
                      >
                        Evet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
