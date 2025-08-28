"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    src: "/modern-business.png",
    alt: "Modern Business",
    title: "🚀 شركات عصرية وذكية ومتطورة",
    description: "فرص لا تُفوَّت، ابتكارات تغيّر المستقبل",
    color: "from-blue-500 to-purple-600",
  },
  {
    src: "/teamwork-collaboration.png",
    alt: "Teamwork",
    title: "🔹تعاون يثمر فرصاً",
    description:
      "كن جزءاً من مجتمع أعمال متكامل يسهّل عليك الوصول إلى الشركاء المناسبين ويمنحك فرصاً حقيقية لتحقيق أهدافك",
    color: "from-green-500 to-blue-600",
  },
  {
    src: "/digital-services-concept.png",
    alt: "Services",
    title: "خدمات رقمية شاملة",
    description: " تصنيفات متنوع يغطي جميع احتياجاتك التجارية والشخصية",
    color: "from-purple-500 to-pink-600",
  },
];

export function UltraSlider() {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(id);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  if (!isLoaded) {
    return <div className="ultra-card aspect-[4/3] skeleton-ultra" />;
  }

  return (
    <div
      className="group ultra-card aspect-[4/3] overflow-hidden transform-style-3d"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out",
              i === index
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-110 z-0"
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

            {/* Gradient Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t",
                slide.color,
                "opacity-60"
              )}
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <div className="space-y-4 transform transition-all duration-700 delay-300">
                <h3 className="text-2xl font-bold text-shadow-lg">
                  {slide.title}
                </h3>
                <p className="text-base opacity-90 text-shadow leading-relaxed max-w-md">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full glass hover:bg-white/30 text-white shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full glass hover:bg-white/30 text-white shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-6 right-6 h-10 w-10 rounded-full glass hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        {isAutoPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setIsAutoPlaying(false);
            }}
            className={cn(
              "relative h-3 rounded-full transition-all duration-500 overflow-hidden",
              i === index
                ? "w-12 bg-white"
                : "w-3 bg-white/50 hover:bg-white/80"
            )}
          >
            {i === index && isAutoPlaying && (
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
