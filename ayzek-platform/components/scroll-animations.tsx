"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-up"
  delay?: number
}

export function ScrollAnimation({ children, className = "", animation = "fade-up", delay = 0 }: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-in")
            }, delay)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getAnimationClass = () => {
    switch (animation) {
      case "fade-up":
        return "opacity-0 translate-y-8 transition-all duration-700 ease-out"
      case "fade-in":
        return "opacity-0 transition-opacity duration-700 ease-out"
      case "slide-left":
        return "opacity-0 -translate-x-8 transition-all duration-700 ease-out"
      case "slide-right":
        return "opacity-0 translate-x-8 transition-all duration-700 ease-out"
      case "scale-up":
        return "opacity-0 scale-95 transition-all duration-700 ease-out"
      default:
        return "opacity-0 translate-y-8 transition-all duration-700 ease-out"
    }
  }

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
      style={
        {
          "--animate-in": "opacity-100 translate-y-0 translate-x-0 scale-100",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}
