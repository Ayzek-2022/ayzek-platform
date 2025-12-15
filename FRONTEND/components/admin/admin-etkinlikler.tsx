// components/admin-etkinlikler.tsx
"use client";

import { useState, useRef } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar as LucideCalendar, Clock, Trash2, Plus, Upload, Eye, CheckCircle, XCircle, Lightbulb, Edit } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export interface EventSuggestion {
  id: number;
  title: string;
  description: string;
  contact: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  created_at: string;
}

interface EventsTabProps {
  events: EventItem[];
  suggestions: EventSuggestion[];
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
  onSuggestionAction: (id: number, action: "approve" | "reject") => void;
  onSuggestionDelete: (id: number) => void;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case "pending": return "bg-yellow-500";
    case "accepted": return "bg-green-500";
    case "rejected": return "bg-red-500";
    case "reviewed": return "bg-blue-500";
    default: return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch(status) {
    case "pending": return "Beklemede";
    case "accepted": return "Onaylandı";
    case "rejected": return "Reddedildi";
    case "reviewed": return "İncelendi";
    default: return status;
  }
};

export default function EventsTab({ events, suggestions, onAdd, onDelete, onSuggestionAction, onSuggestionDelete }: EventsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxAttendees, setMaxAttendees] = useState(60);
  const [category, setCategory] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [tags, setTags] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState<EventSuggestion | null>(null);
  const [isSuggestionDetailOpen, setIsSuggestionDetailOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'event' | 'suggestion', id: number} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(file.name); // Dosya adını göster
    }
  };

  const handleAddEvent = () => {
    if (!title || !description || (!image && !imageFile) || !date || !time || !location || !category || !whatsappLink) {
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
      image: imageFile ? URL.createObjectURL(imageFile) : image, // Gerçek senaryoda file upload yapılmalı
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
    setImageFile(null);
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

  const handleDeleteClick = (type: 'event' | 'suggestion', id: number) => {
    setItemToDelete({type, id});
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'event') {
        onDelete(itemToDelete.id);
      } else {
        onSuggestionDelete(itemToDelete.id);
      }
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card/50">
          <TabsTrigger value="events" className="flex items-center gap-2">
            <LucideCalendar className="w-4 h-4" />
            Etkinlikler
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Etkinlik Önerileri
            {suggestions.filter(s => s.status === 'pending').length > 0 && (
              <Badge className="ml-2 bg-orange-500 text-white">
                {suggestions.filter(s => s.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-card/50 border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-2xl">Etkinlik Yönetimi</CardTitle>
                <CardDescription className="mt-2">Topluluk etkinliklerini oluşturun ve yönetin</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Etkinlik
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
                    <DialogDescription>Topluluk için yeni bir etkinlik oluşturun</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Etkinlik Başlığı *</Label>
                      <Input 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Örn: AI Workshop 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Etkinlik Açıklaması *</Label>
                      <Textarea 
                        id="description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Etkinlik hakkında detaylı bilgi..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Etkinlik Görseli *</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="image" 
                          value={image} 
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="URL girin veya dosya seçin"
                          className="flex-1"
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-primary/20"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Dosya Seç
                        </Button>
                      </div>
                      {imageFile && (
                        <p className="text-sm text-muted-foreground">Seçili: {imageFile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori *</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Örn: Seminer, Workshop, Bootcamp..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Tarih *</Label>
                        <Input 
                          id="date" 
                          type="date" 
                          value={date} 
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Saat *</Label>
                        <Input 
                          id="time" 
                          type="time" 
                          value={time} 
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Konum *</Label>
                      <Input 
                        id="location" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Örn: İTÜ Merkez Kampüs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAttendees">Maksimum Katılımcı</Label>
                      <Input 
                        id="maxAttendees" 
                        type="number" 
                        value={maxAttendees} 
                        onChange={(e) => setMaxAttendees(Number(e.target.value))}
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsappLink">Kayıt Linki *</Label>
                      <Input 
                        id="whatsappLink" 
                        value={whatsappLink} 
                        onChange={(e) => setWhatsappLink(e.target.value)}
                        placeholder="WhatsApp grup linki veya kayıt formu"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Etiketler (Virgülle ayırın)</Label>
                      <Input 
                        id="tags" 
                        value={tags} 
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="AI, Machine Learning, Python"
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button onClick={handleAddEvent} className="bg-gradient-to-r from-primary to-accent">
                      <Plus className="w-4 h-4 mr-2" />
                      Etkinlik Ekle
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <LucideCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz etkinlik bulunmuyor</p>
                </div>
              ) : (
                <div className="rounded-md border border-primary/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50">
                        <TableHead className="font-semibold">Başlık</TableHead>
                        <TableHead className="font-semibold">Tarih & Saat</TableHead>
                        <TableHead className="font-semibold">Konum</TableHead>
                        <TableHead className="font-semibold">Katılım</TableHead>
                        <TableHead className="font-semibold">Etiketler</TableHead>
                        <TableHead className="text-right font-semibold">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => {
                        const tagsArray = typeof event.tags === "string"
                          ? event.tags.split(",").map((t) => t.trim())
                          : event.tags;

                        return (
                          <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <LucideCalendar className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span>{toTurkishDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{event.location}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-mono">
                                {event.attendees}/{event.maxAttendees}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {tagsArray?.slice(0, 2).map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {tagsArray && tagsArray.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{tagsArray.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteClick('event', event.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card className="bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-orange-500" />
                Etkinlik Önerileri
              </CardTitle>
              <CardDescription className="mt-2">
                Kullanıcılar tarafından gönderilen etkinlik önerilerini inceleyin ve onaylayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Henüz etkinlik önerisi bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <div 
                      key={suggestion.id} 
                      className="flex items-start justify-between p-4 border border-primary/10 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{suggestion.title}</h4>
                          <Badge className={`${getStatusColor(suggestion.status)} text-white border-0`}>
                            {getStatusText(suggestion.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{suggestion.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📧 {suggestion.contact}</span>
                          <span>📅 {toTurkishDate(suggestion.created_at.split('T')[0])}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSuggestion(suggestion);
                            setIsSuggestionDetailOpen(true);
                          }}
                          className="hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {(suggestion.status === "pending" || suggestion.status === "reviewed") && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => onSuggestionAction(suggestion.id, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Onayla
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => onSuggestionAction(suggestion.id, "reject")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reddet
                            </Button>
                          </>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDeleteClick('suggestion', suggestion.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Öneri Detay Dialog */}
      <Dialog open={isSuggestionDetailOpen} onOpenChange={setIsSuggestionDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSuggestion?.title}</DialogTitle>
            <DialogDescription>
              Etkinlik Önerisi Detayları
            </DialogDescription>
          </DialogHeader>
          {selectedSuggestion && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Açıklama</Label>
                <p className="text-sm mt-1 text-muted-foreground">{selectedSuggestion.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">İletişim</Label>
                  <p className="text-sm mt-1">{selectedSuggestion.contact}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Durum</Label>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(selectedSuggestion.status)} text-white border-0`}>
                      {getStatusText(selectedSuggestion.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Gönderim Tarihi</Label>
                <p className="text-sm mt-1">{toTurkishDate(selectedSuggestion.created_at.split('T')[0])}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Silme Onay Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
            <DialogDescription>
              Bu {itemToDelete?.type === 'event' ? 'etkinliği' : 'öneriyi'} kalıcı olarak silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
