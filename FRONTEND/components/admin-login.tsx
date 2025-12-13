"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, Loader2, Shield, Home } from "lucide-react"

interface AdminLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void
  isLoading?: boolean
  error?: string
}

export function AdminLogin({ onLogin, isLoading = false, error }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!credentials.email || !credentials.password) {
      setShowErrorDialog(true)
      return
    }
    onLogin(credentials)
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-muted p-4 dark">
        <Button
          variant="outline"
          size="sm"
          className="absolute top-6 left-6 bg-background/50 border-primary/20"
          onClick={() => (window.location.href = "/")}
        >
          <Home className="w-4 h-4 mr-2" />
          Ana Sayfaya Dön
        </Button>

        <Card className="w-full max-w-md bg-card/50 border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ayzek-gradient/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="relative w-full h-10 mb-2 flex items-center justify-center">
              <div className="absolute inset-0 bg-ayzek-gradient rounded" />
              <span className="relative z-10 text-lg font-display font-bold text-white">
                AYZEK Yönetici Paneli
              </span>
            </div>
            <CardDescription>Panelinize erişmek için giriş yapın</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  placeholder="ayzekselcukuni@gmail.com"
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full bg-ayzek-gradient hover:opacity-90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="max-w-md bg-card border-primary/20">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle>Eksik Bilgi</DialogTitle>
            <DialogDescription>Devam etmek için lütfen hem e-posta hem de şifre girin.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={() => setShowErrorDialog(false)} className="bg-ayzek-gradient hover:opacity-90">
              Tamam
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
