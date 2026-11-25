import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { validateOrderItems } from "@/lib/orders/validateOrderItems";
import { computeDelivery } from "@/lib/utils/calculateDeliveryFee";

// Checkout asks "what will this cost?" before any order exists. The answer
// comes from the same code the order routes use, so the number the buyer sees
// is the number they are charged.
export async function POST(req) {
  try {
    await dbConnect();
    const { items, area } = await req.json();

    const validated = await validateOrderItems(items);
    const delivery = computeDelivery({
      originalsTotal: validated.originalsTotal,
      area,
    });

    return NextResponse.json({
      itemsTotal: validated.itemsTotal,
      originalsTotal: validated.originalsTotal,
      fee: delivery.fee,
      free: delivery.free,
      reason: delivery.reason,
      areaFee: delivery.areaFee,
      total: validated.itemsTotal + delivery.fee,
    });
  } catch (err) {
    // Messages like "X has only 2 item(s) available" are written for buyers
    if (err?.name === "OrderValidationError") {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Delivery quote error:", err);
    return NextResponse.json(
      { error: "We could not work out your delivery fee. Please try again." },
      { status: 500 }
    );
  }
}