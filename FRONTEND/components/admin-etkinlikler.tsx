// components/admin-etkinlikler.tsx
"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// NOTE: Select importları kaldırıldı çünkü kategori artık serbest metin.
// import {
//   Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
import { Calendar as LucideCalendar, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export interface EventItem {
  id: number;
  title: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  location: string;
  attendees: number;
  maxAttendees: number;
  status: "upcoming" | "past";
  tags: string | string[];
}

interface EventsTabProps {
  events: EventItem[];
  onAdd: (payload: {
    title: string;
    description: string;
    image: string;
    date: string;   // yyyy-MM-dd
    time: string;   // HH:mm
    location: string;
    maxAttendees: number;
    category: string;
    whatsappLink: string;
    tags: string[];
  }) => void;
  onDelete: (eventId: number) => void;
}

// const eventCategories = ["Workshop", "Meetup", "Conference", "Hackathon"]; // (Artık kullanılmıyor)

export default function EventsTab({ events, onAdd, onDelete }: EventsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState(60);
  const [category, setCategory] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [tags, setTags] = useState("");

  const handleAddEvent = () => {
    if (!title || !description || !image || !date || !time || !location || !category || !whatsappLink) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAdd({
      title,
      description,
      image,
      date,
      time,
      location,
      maxAttendees,
      category,
      whatsappLink,
      tags: tagsArray,
    });

    // formu temizle
    setTitle("");
    setDescription("");
    setImage("");
    setDate("");
    setTime("");
    setLocation("");
    setMaxAttendees(60);
    setCategory("");
    setWhatsappLink("");
    setTags("");
    setIsDialogOpen(false);
  };

  const toTurkishDate = (isoDate: string) => {
    try {
      return format(new Date(isoDate), "dd.MM.yyyy", { locale: tr });
    } catch {
      return isoDate;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>Etkinlik Yönetimi</CardTitle>
          <CardDescription>Topluluk etkinliklerini ve kayıtları yönetin</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Etkinlik Ekle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
              <DialogDescription>Topluluk için yeni bir etkinlik oluşturun</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Etkinlik Başlığı</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Etkinlik Açıklaması</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Etkinlik Görseli (URL)</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} className="col-span-3" />
              </div>

              {/* --- KATEGORİ: SERBEST METİN --- */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Kategori</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="col-span-3"
                  placeholder="Örn: Seminer, Tanışma Buluşması, Bootcamp..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="whatsappLink" className="text-right">Kayıt Linki</Label>
                <Input id="whatsappLink" value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Etiketler (Virgülle ayırın)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="AI, Machine Learning, Python" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Tarih</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Saat</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Konum</Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>İptal</Button>
              <Button type="button" onClick={handleAddEvent}>Etkinlik Ekle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Tarih & Saat</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Etiketler</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => {
              const tagsArray = typeof event.tags === "string"
                ? event.tags.split(",").map((t) => t.trim())
                : event.tags;

              return (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <LucideCalendar className="w-4 h-4 text-muted-foreground" />
                      <span>{toTurkishDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{`${event.attendees}/${event.maxAttendees}`}</TableCell>
                  <TableCell>{tagsArray?.join(", ") || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(event.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
