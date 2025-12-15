"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  value: string;
  onChange: (value: string) => void;
  onFileSelect?: (file: File) => void;
  accept?: string;
  placeholder?: string;
  label?: string;
}

export function FileUploadButton({ 
  value, 
  onChange, 
  onFileSelect,
  accept = "image/*",
  placeholder = "URL girin veya dosya seçin",
  label = "Görsel"
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file.name);
      onFileSelect?.(file);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <div className="flex gap-2">
        <Input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="border-primary/20 hover:bg-primary/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Dosya Seç
        </Button>
      </div>
    </div>
  );
}

