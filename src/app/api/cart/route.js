import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/cart";
import Product from "@/models/product";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
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

  const cart = await Cart.findOne({ userId: decoded.id }).populate("items.productId");
  return NextResponse.json(cart || { items: [], totalQuantity: 0, totalPrice: 0, totalDiscountedPrice: 0 });
}

export async function POST(req) {
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

  const { productId, color, size, quantity = 1, sku } = await req.json();

  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  let cart = await Cart.findOne({ userId: decoded.id });
  if (!cart) cart = new Cart({ userId: decoded.id, items: [] });

  const existing = cart.items.find(
    i => i.productId.equals(productId) && i.color === color && i.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.productName,
      price: product.price,
      discountedPrice: product.discountedPrice ?? product.price, // ← fallback
      image: product.images?.[0]?.url || "",
      color,
      size,
      quantity,
      sku // now valid
    });
  }

  cart.totalQuantity = cart.items.reduce((sum, i) => sum + (i.quantity || 0), 0)
  cart.totalPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0)
  cart.totalDiscountedPrice = cart.items.reduce((sum, i) => sum + (i.quantity || 0) * (i.discountedPrice || i.price || 0), 0)

  await cart.save();
  return NextResponse.json(cart);
}