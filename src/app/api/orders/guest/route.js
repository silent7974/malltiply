// /api/orders/guest/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"
import { validateOrderItems } from "@/lib/orders/validateOrderItems"
import { validateDeliveryDetails } from "@/lib/utils/validators"
import { computeDelivery } from "@/lib/utils/calculateDeliveryFee"

export async function POST(req) {
  try {
    await dbConnect()
    const body = await req.json()
    const { guestInfo, items, shippingMethod } = body

    // Server-side check: never trust that the browser validated anything.
    const check = validateDeliveryDetails(
      {
        fullName: guestInfo?.fullName,
        phone: guestInfo?.phone,
        email: guestInfo?.email,
        street: guestInfo?.address?.street,
        district: guestInfo?.address?.district,
      },
      { requireEmail: true }
    )

    if (!check.ok) {
      return NextResponse.json(
        { error: Object.values(check.errors)[0], fields: check.errors },
        { status: 400 }
      )
    }

    // Save the cleaned values (trimmed, lowercased email, tidy phone)
    const c = check.cleaned
    const cleanGuestInfo = {
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      address: { city: "Abuja", street: c.street, district: c.district },
    }

    const validated = await validateOrderItems(items)

    // The server decides the delivery fee. Whatever the browser sent is ignored.
    const delivery = computeDelivery({
      originalsTotal: validated.originalsTotal,
      area: c.district,
    })
    const shippingFee = delivery.fee

    const order = new Order({
      userId: null,
      guestInfo: cleanGuestInfo,
      items: validated.normalizedItems,
      shippingMethod,
      shippingAddress: {
        fullName: c.fullName,
        phone: c.phone,
        city: "Abuja",
        street: c.street,
        district: c.district,
      },
      paymentStatus: "pending",
      itemsTotal: validated.itemsTotal,
      discountTotal: validated.discountTotal,
      shippingFee,
      totalAmount: validated.itemsTotal + shippingFee,
      orderStatus: "pending",
    })

    await order.save()
    return NextResponse.json({ success: true, order })
  } catch (err) {
    // Messages like "X has only 2 item(s) available" are written for buyers
    if (err?.name === "OrderValidationError") {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
    console.error("Guest order error:", err)
    return NextResponse.json(
      { error: "We could not create your order. Please try again." },
      { status: 500 }
    )
  }
}