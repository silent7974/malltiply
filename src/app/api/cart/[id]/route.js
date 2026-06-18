import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/cart";
import Product from "@/models/product"
import { getAvailableQuantity } from "@/lib/cartAvailability";

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

  const { id } = await context.params;
  const { quantity, color, size } = await req.json();

  const cart = await Cart.findOne({ userId: decoded.id });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.find(
    i =>
      i.productId.toString() === id &&
      (color === undefined || i.color === color) &&
      (size === undefined || i.size === size)
  );
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 })

  // Server-side stock check, same as POST — only relevant when increasing
  // or setting a quantity, not when removing (quantity <= 0).
  if (quantity > 0) {
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const available = getAvailableQuantity(product, { color: item.color, size: item.size });
    if (quantity > available) {
      return NextResponse.json(
        { error: `Only ${available} item(s) available.` },
        { status: 400 }
      );
    }
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      i =>
        !(
          i.productId.toString() === id &&
          (color === undefined || i.color === color) &&
          (size === undefined || i.size === size)
        )
    )
  } else {
    item.quantity = quantity;
  }

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
  const { color, size } = await req.json().catch(() => ({}));

  const cart = await Cart.findOne({ userId: decoded.id });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  cart.items = cart.items.filter(
    i =>
      !(
        i.productId.toString() === id &&
        (color === undefined || i.color === color) &&
        (size === undefined || i.size === size)
      )
  );

  cart.totalQuantity = cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0)
  cart.totalDiscountedPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.discountedPrice || i.price || 0), 0)

  await cart.save();
  return NextResponse.json(cart);
}