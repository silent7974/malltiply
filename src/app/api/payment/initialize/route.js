import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/order";
import { isValidEmail, normalizeEmail } from "@/lib/utils/validators";

// Every failure answers with a non-200 status and a plain sentence in `error`,
// so the browser can show it directly instead of a generic message.
function fail(message, status = 400, code = "error") {
  return NextResponse.json({ status: false, error: message, code }, { status });
}

// Turns whatever Paystack said into something a buyer can act on.
function plainPaystackMessage(data, httpStatus) {
  const text = String(data?.message || "").toLowerCase();

  if (data?.code === "invalid_email" || text.includes("email")) {
    return "Enter a valid email address, like name@gmail.com.";
  }
  if (httpStatus === 401 || httpStatus === 403) {
    // Usually a wrong/missing secret key on our side. Never show that to buyers.
    return "Payments are temporarily unavailable. Please try again in a few minutes, or message us on WhatsApp.";
  }
  if (httpStatus === 429) {
    return "Too many attempts. Please wait a minute and try again.";
  }
  if (httpStatus >= 500) {
    return "Our payment provider is having trouble right now. Please try again in a few minutes.";
  }
  return "We could not open the payment page. Please try again, or message us on WhatsApp.";
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return fail("Something went wrong with your request. Please try again.", 400, "bad_request");
  }

  const email = normalizeEmail(body?.email);
  const orderId = body?.metadata?.orderId;

  if (!isValidEmail(email)) {
    return fail("Enter a valid email address, like name@gmail.com.", 400, "invalid_email");
  }
  if (!orderId) {
    return fail("We could not find your order. Please try again.", 400, "missing_order");
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is not set");
    return fail(
      "Payments are temporarily unavailable. Please try again in a few minutes, or message us on WhatsApp.",
      503,
      "not_configured"
    );
  }

  // The amount comes from OUR order record, never from the browser.
  // (Before, the browser sent the amount, so it could be changed in transit.)
  let order;
  try {
    await dbConnect();
    order = await Order.findById(orderId);
  } catch (err) {
    console.error("PAYMENT INIT: could not load order", err);
    return fail("We could not load your order. Please try again.", 400, "bad_order");
  }

  if (!order) {
    return fail("We could not find your order. Please try again.", 404, "order_not_found");
  }
  if (order.paymentStatus === "paid") {
    return fail("This order has already been paid.", 400, "already_paid");
  }

  const amountKobo = Math.round(Number(order.totalAmount) * 100);
  if (!Number.isFinite(amountKobo) || amountKobo <= 0) {
    return fail(
      "This order total is not valid. Please go back to your cart and try again.",
      400,
      "invalid_amount"
    );
  }

  const channels = Array.isArray(body?.channels) && body.channels.length
    ? body.channels
    : ["card", "bank_transfer"];

  let res;
  try {
    res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        channels,
        metadata: { orderId: String(order._id) },
        callback_url: body?.callback_url,
      }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error("PAYSTACK INIT NETWORK ERROR:", err);
    const timedOut = err?.name === "TimeoutError" || err?.name === "AbortError";
    return fail(
      timedOut
        ? "The payment page took too long to load. Please check your connection and try again."
        : "We could not reach our payment provider. Please check your connection and try again.",
      502,
      "network"
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok || !data?.status || !data?.data?.authorization_url) {
    console.error("PAYSTACK INIT FAILED:", res.status, data);
    return fail(
      plainPaystackMessage(data, res.status),
      res.status >= 500 ? 502 : 400,
      data?.code || "paystack_error"
    );
  }

  // Success keeps Paystack's own shape, so the browser still reads data.authorization_url
  return NextResponse.json(data);
}