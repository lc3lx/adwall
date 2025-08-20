import { NextResponse } from "next/server"
import { PRICES } from "@/data/pricing"
import { findCoupon } from "@/lib/store"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const plan = (searchParams.get("plan") || "vip") as "vip" | "standard"
  const code = searchParams.get("code") || undefined
  const base = plan === "vip" ? PRICES.VIP_MONTHLY_USD : PRICES.STANDARD_MONTHLY_USD
  const coupon = findCoupon(code)
  const amount = coupon ? Math.max(0, Number((base * (1 - coupon.percent / 100)).toFixed(2))) : base
  return NextResponse.json({ ok: true, amount })
}
