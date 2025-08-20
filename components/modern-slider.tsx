"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    src: "/modern-business.png",
    alt: "Modern Business",
    title: "شركات عصرية",
    description: "اكتشف أحدث الشركات والخدمات",
  },
  {
    src: "/teamwork-collaboration.png",
    alt: "Teamwork",
    title: "تعاون مثمر",
    description: "تواصل مباشر مع أصحاب الشركات",
  },
  {
    src: "/digital-services-concept.png",
    alt: "Services",
    title: "خدمات متنوعة",
    description: "14 تصنيف يغطي جميع احتياجاتك",
  },
]

export function ModernSlider() {
  const [index, setIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  return (
    <div
      className="relative group modern-card aspect-[4/3] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105",
            )}
          >
            <Image
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
              <p className="text-sm opacity-90">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i)
              setIsAutoPlaying(false)
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80",
            )}
          />
        ))}
      </div>
    </div>
  )
}
