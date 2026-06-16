import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/cart";

const JWT_SECRET = process.env.JWT_SECRET;

export async function PUT(req, context) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { id } = await context.params; // productId or itemId
  const { quantity } = await req.json();

  const cart = await Cart.findOne({ userId: decoded.id });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.id(id) || cart.items.find(i => i.productId.toString() === id);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 })

  // 🔁 Handle both + and − buttons
  if (quantity <= 0) {
    // If quantity is 0 or less → remove item entirely
    cart.items = cart.items.filter(i => i.productId.toString() !== id)
  } else {
    // Otherwise just update the quantity
    item.quantity = quantity;
  }

  // ♻️ Recalculate totals
  cart.totalQuantity = cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0)
  cart.totalDiscountedPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.discountedPrice || i.price || 0), 0)

  await cart.save();
  return NextResponse.json(cart);
}

export async function DELETE(req, context) {
  await dbConnect();

  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { id } = await context.params;

  const cart = await Cart.findOne({ userId: decoded.id });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  // Remove the item explicitly
  cart.items = cart.items.filter(i => i.productId.toString() !== id);

  // Recalculate totals
  cart.totalQuantity = cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0)
  cart.totalDiscountedPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.discountedPrice || i.price || 0), 0)

  await cart.save();
  return NextResponse.json(cart);
}