import { NextResponse } from "next/server"
import { PRICES } from "@/data/pricing"
import { findCoupon, setVip } from "@/lib/store"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { couponCode, plan = "vip", adId } = body as { couponCode?: string; plan?: "vip" | "standard"; adId?: string }
    const base = plan === "vip" ? PRICES.VIP_MONTHLY_USD : PRICES.STANDARD_MONTHLY_USD
    const coupon = findCoupon(couponCode)
    const amount = coupon ? Math.max(0, Math.round(base * (1 - coupon.percent / 100))) : base

    const secret = process.env.STRIPE_SECRET_KEY
    const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const successUrl = adId ? `${site}/ad/${adId}/manage?checkout=success` : `${site}/?checkout=success`
    const cancelUrl = adId ? `${site}/ad/${adId}/manage?checkout=cancel` : `${site}/?checkout=cancel`

    if (!secret || !publishable) {
      // Simulate checkout success and set VIP if applicable
      if (adId) {
        if (plan === "vip") setVip(adId, true)
        else setVip(adId, false)
      }
      return NextResponse.json({
        ok: true,
        url: successUrl,
        amount,
        simulated: true,
      })
    }

    const Stripe = (await import("stripe")).default
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" })
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan === "vip" ? "AdWell VIP" : "AdWell Standard" },
            recurring: { interval: "month" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return NextResponse.json({ ok: true, url: session.url })
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
