"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/contexts/admin-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus } from "lucide-react"

interface AdminEditOverlayProps {
  contentType: "banner" | "timeline" | "team" | "event" | "gallery"
  contentId?: string
  children: React.ReactNode
  onEdit?: (data: any) => void
  onDelete?: () => void
  onAdd?: (data: any) => void
  className?: string
}

export function AdminEditOverlay({
  contentType,
  contentId,
  children,
  onEdit,
  onDelete,
  onAdd,
  className = "",
}: AdminEditOverlayProps) {
  const { isEditMode } = useAdmin()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})

  if (!isEditMode) {
    return <>{children}</>
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const handleSave = () => {
    if (onEdit) {
      onEdit(formData)
    }
    setIsEditModalOpen(false)
    setFormData({})
  }

  const handleAddSave = () => {
    if (onAdd) {
      onAdd(formData)
    }
    setIsAddModalOpen(false)
    setFormData({})
  }

  const handleDelete = () => {
    if (onDelete && confirm("Bu içeriği silmek istediğinizden emin misiniz?")) {
      onDelete()
    }
  }

  return (
    <div className={`relative group ${className}`}>
      {children}

      {/* Edit Controls Overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
        {onAdd && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>İçerik Düzenle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="Başlık girin"
              />
            </div>
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Açıklama girin"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="image">Görsel URL</Label>
              <Input
                id="image"
                value={formData.image || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, image: e.target.value }))}
                placeholder="Görsel URL'si girin"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleSave}>Kaydet</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yeni İçerik Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-title">Başlık</Label>
              <Input
                id="add-title"
                value={formData.title || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                placeholder="Başlık girin"
              />
            </div>
            <div>
              <Label htmlFor="add-description">Açıklama</Label>
              <Textarea
                id="add-description"
                value={formData.description || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                placeholder="Açıklama girin"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="add-image">Görsel URL</Label>
              <Input
                id="add-image"
                value={formData.image || ""}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, image: e.target.value }))}
                placeholder="Görsel URL'si girin"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleAddSave}>Ekle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
