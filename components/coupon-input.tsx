"use client"

import { useEffect, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/lang-provider"

export function CouponInput({
  plan = "vip",
  onFinalPrice,
}: {
  plan?: "vip" | "standard"
  onFinalPrice?: (price: number) => void
}) {
  const { t } = useI18n()
  const [code, setCode] = useState("")
  const [price, setPrice] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const res = await fetch(`/api/price?plan=${plan}&code=`).then((r) => r.json())
      if (res.ok) {
        setPrice(res.amount)
        onFinalPrice?.(res.amount)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan])

  const apply = () => {
    startTransition(async () => {
      const res = await fetch(`/api/price?plan=${plan}&code=${encodeURIComponent(code)}`).then((r) => r.json())
      if (res.ok) {
        setPrice(res.amount)
        onFinalPrice?.(res.amount)
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("coupon")} />
        <Button onClick={apply} disabled={isPending}>
          {t("apply")}
        </Button>
      </div>
      {price !== null && (
        <div className="text-sm">
          {t("finalPrice")}: <span className="font-semibold">${price}</span>
        </div>
      )}
    </div>
  )
}
