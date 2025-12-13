"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAdmin } from "@/contexts/admin-context"

export default function AdminPage() {
  const { setIsAdminLoggedIn, setAdminUser } = useAdmin()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    document.documentElement.classList.add("dark")
    return () => {
     // Don't remove dark class on unmount to maintain admin dark mode
     }
  }, [])

   const handleLogin = async (credentials: { email: string; password: string }) => {
     setIsLoading(true)
     setError("")

     try {
     // Backend'deki güvenli API rotasına POST isteği gönder
       const response = await fetch("http://127.0.0.1:8000/admin/login", {
       method: "POST",
        headers: {
         "Content-Type": "application/json",
       },
         body: JSON.stringify(credentials),
     })

        if (response.ok) {
         // Backend başarılı yanıt döndürürse (giriş bilgileri doğruysa)
         setIsAuthenticated(true)
         setIsAdminLoggedIn(true)
        setAdminUser({
          email: credentials.email,
          name: "AYZEK Admin",
        })
      } else {
        // Backend hata mesajı döndürürse (geçersiz bilgiler)
        const errorData = await response.json()
        setError(errorData.detail || "Giriş başarısız. Lütfen tekrar deneyin.")
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı. Lütfen ağ bağlantınızı kontrol edin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
  setIsAuthenticated(false)
    setError("")
    setIsAdminLoggedIn(false)
    setAdminUser(null)
  }
 
if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} isLoading={isLoading} error={error} />
  }

 return <AdminDashboard onLogout={handleLogout} />
}