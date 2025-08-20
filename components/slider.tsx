"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const slides = [
  { src: "/placeholder.svg?height=720&width=1600", alt: "Business City" },
  { src: "/placeholder.svg?height=720&width=1600", alt: "Teamwork" },
  { src: "/placeholder.svg?height=720&width=1600", alt: "Services" },
]

export function Slider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl soft-card soft-card-hover">
      <div className="relative aspect-[16/6] w-full">
        {slides.map((s, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transform transition-all duration-[1200ms] ease-out",
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105",
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={s.src || "/placeholder.svg"}
              alt={s.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/10 via-sky-700/5 to-transparent" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-2.5 w-6 rounded-full transition-all",
              i === index ? "bg-sky-500 shadow" : "bg-sky-300/70 hover:bg-sky-400/80",
            )}
          />
        ))}
      </div>
    </div>
  )
}
