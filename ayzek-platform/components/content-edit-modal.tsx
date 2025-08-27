"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Save, X } from "lucide-react"

interface ContentEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  title: string
  description?: string
  initialData?: any
  fields: Array<{
    key: string
    label: string
    type: "text" | "textarea" | "number" | "date" | "time" | "email"
    placeholder?: string
    required?: boolean
  }>
}

export function ContentEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  initialData = {},
  fields,
}: ContentEditModalProps) {
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    setFormData(initialData)
  }, [initialData, isOpen])

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const handleFieldChange = (key: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.type === "textarea" ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="bg-background/50"
                />
              ) : (
                <Input
                  id={field.key}
                  type={field.type}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className="bg-background/50"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-ayzek-gradient hover:opacity-90">
            <Save className="w-4 h-4 mr-2" />
            Kaydet
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 border-primary/20 bg-transparent">
            <X className="w-4 h-4 mr-2" />
            İptal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
