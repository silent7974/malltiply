// /api/orders/guest/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"
import { validateOrderItems } from "@/lib/orders/validateOrderItems"

export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  const {
    guestInfo,
    items,
    shippingMethod,
    shippingAddress,
    shippingFee,
  } = body

  const validated = await validateOrderItems(items)
  const safeShippingFee = Number(shippingFee || 0)

  const order = new Order({
    userId: null, // ← you'll need to make this optional in the schema
    guestInfo,    // ← add this field to order schema
    items: validated.normalizedItems,
    shippingMethod,
    shippingAddress: shippingAddress || {
      fullName: guestInfo?.fullName,
      phone: guestInfo?.phone,
      city: guestInfo?.address?.city || "Abuja",
      street: guestInfo?.address?.street,
      district: guestInfo?.address?.district,
    },
    paymentStatus: "pending",
    itemsTotal: validated.itemsTotal,
    discountTotal: validated.discountTotal,
    shippingFee: safeShippingFee,
    totalAmount: validated.itemsTotal + safeShippingFee,
    orderStatus: "pending",
  })

  await order.save()
  return NextResponse.json({ success: true, order })
}
