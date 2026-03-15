// /api/orders/guest-lookup/route.js
import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/order"

export async function POST(req) {
  await dbConnect()
  const { orderIds } = await req.json()

  if (!orderIds?.length) return NextResponse.json([], { status: 200 })

  const orders = await Order.find({ _id: { $in: orderIds } }).sort({ createdAt: -1 })
  return NextResponse.json(orders, { status: 200 })
}