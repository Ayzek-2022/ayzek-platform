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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Demo credentials check
      if (credentials.email === "admin@ayzek.community" && credentials.password === "admin123") {
        setIsAuthenticated(true)
        setIsAdminLoggedIn(true)
        setAdminUser({
          email: credentials.email,
          name: "AYZEK Admin",
        })
      } else {
        setError("Geçersiz e-posta veya şifre")
      }
    } catch (err) {
      setError("Giriş başarısız. Lütfen tekrar deneyin.")
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
