import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { settlePaidOrder } from "@/lib/orders/settlePaidOrder";

export async function POST(req) {
  try {
    const { reference } = await req.json();

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    const isSuccessful =
      data?.status === true && data?.data?.status === "success";
    const orderId = data?.data?.metadata?.orderId;

    if (isSuccessful && orderId) {
      await dbConnect();
      data.order = await settlePaidOrder(orderId);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PAYSTACK VERIFY ERROR:", error);
    return NextResponse.json({ error: "Verify payment failed" }, { status: 500 });
  }
}
