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

  if (event.event === "charge.success") {
    const { orderId } = event.data.metadata
    await settlePaidOrder(orderId)
  }

  return NextResponse.json({ received: true })
}
