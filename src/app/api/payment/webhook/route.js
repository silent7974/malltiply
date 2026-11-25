// /api/payment/webhook/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { settlePaidOrder } from "@/lib/orders/settlePaidOrder"
import crypto from "crypto"

export async function POST(req) {
  const body = await req.text()
  const signature = req.headers.get("x-paystack-signature")
  
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex")

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  await dbConnect()
  const event = JSON.parse(body)

  // Stops a missing metadata object from crashing it
  if (event.event === "charge.success") {
    const orderId = event.data?.metadata?.orderId
    if (orderId) {
      try {
        await settlePaidOrder(orderId, { paidKobo: event.data.amount })
      } catch (err) {
        // A short payment will never fix itself, so don't make Paystack retry it.
        // Anything else (like a database hiccup) still returns a 500 so Paystack retries.
        if (err?.name !== "AmountMismatchError") throw err
        console.error("Webhook amount mismatch:", orderId)
      }
    }
  }

  return NextResponse.json({ received: true })
}