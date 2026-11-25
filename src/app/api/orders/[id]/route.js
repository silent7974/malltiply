import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/order";

// Payment is settled only by /api/payment/verify and /api/payment/webhook.
// Letting the browser say "this order is paid" lets anyone skip paying.

export async function PATCH(req, context) {
  const { id } = await context.params;

  await dbConnect();

  const { status, orderStatus, refund } = await req.json();

  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle order status updates (THIS IS WHAT YOU NEED)
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (refund) {
      order.refund = {
        ...refund,
        requestedAt: new Date(),
      }
      order.orderStatus = "returned"
    }

    await order.save();

    return NextResponse.json({ message: "Order updated", order }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}