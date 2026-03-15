// /api/orders/guest/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"

export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  const { guestInfo, items, shippingMethod, paymentMethod, totalAmount, itemsTotal, shippingFee } = body

  const order = new Order({
    userId: null, // ← you'll need to make this optional in the schema
    guestInfo,    // ← add this field to order schema
    items,
    shippingMethod,
    shippingAddress: guestInfo.address,
    paymentMethod,
    paymentStatus: "pending",
    itemsTotal,
    shippingFee: shippingFee || 0,
    totalAmount,
    orderStatus: "pending",
  })

  await order.save()
  return NextResponse.json({ success: true, order })
}