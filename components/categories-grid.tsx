"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/providers/lang-provider"
import { useMemo } from "react"
import { getCategories } from "@/lib/store"

export function CategoriesGrid() {
  const { locale, t } = useI18n()
  const categories = useMemo(() => getCategories(), [])

  return (
    <section className="container py-16 md:py-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{t("categories")}</h2>
        <div className="mt-2 h-1 w-20 rounded-full brand-underline" aria-hidden />
      </div>

      <div className="grid gap-6 content-visibility-auto sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const name = locale === "ar" ? c.nameAr : c.nameEn

          return (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group block">
              <Card className="soft-card soft-card-hover overflow-hidden border-0">
                <div
                  className="h-[3px] w-full"
                  style={{
                    background: `linear-gradient(90deg, ${c.color} 0%, hsl(var(--brand-azure-tint)) 100%)`,
                  }}
                  aria-hidden
                />
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={c.image || "/placeholder.svg"}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-foreground shadow-sm backdrop-blur-sm">
                      <h3 className="font-semibold">{name}</h3>
                      <span
                        className="h-3 w-10 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${c.color} 0%, hsl(var(--brand-azure)) 100%)` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
