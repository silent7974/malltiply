import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/order";
import Product from "@/models/product";

export async function PATCH(req, context) {
  const { id } = await context.params;

  await dbConnect();

  const { status, orderStatus, refund } = await req.json();

  try {
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Handle payment status updates (existing logic)
    if (status === "paid" && order.paymentStatus !== "paid") {
      for (const item of order.items) {
        const { productId, sku, quantity } = item;

        const product = await Product.findById(productId);
        if (!product) continue;

        if (String(product.sku).trim() === String(sku).trim()) {
          const newQty = Math.max((product.quantity || 0) - quantity, 0);
          product.set("quantity", newQty);

          const parts = product.sku.split("-");
          parts[parts.length - 1] = String(newQty).padStart(2, "0");
          product.set("sku", parts.join("-"));
        }

        const variant = product.variantColumns?.find(
          v => String(v.sku).trim() === String(sku).trim()
        );

        if (variant) {
          const vNewQty = Math.max((variant.quantity || 0) - quantity, 0);
          variant.quantity = vNewQty;

          const vParts = variant.sku.split("-");
          vParts[vParts.length - 1] = String(vNewQty).padStart(2, "0");
          variant.sku = vParts.join("-");

          product.markModified("variantColumns");
        }

        await product.save();
      }

      order.paymentStatus = "paid";
    }

    // ✅ Handle order status updates (THIS IS WHAT YOU NEED)
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