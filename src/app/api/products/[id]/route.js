import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";
import Seller from "@/models/seller";

const JWT_SECRET = process.env.JWT_SECRET;

// GET — Single product

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params  // ← await params

  const product = await Product.findById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT — Update product

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params  // ← await params

    const token = await cookies().get("sellerToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const seller = await Seller.findById(decoded.id).select("sellerType");
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const product = await Product.findById(id);
    if (!product || product.sellerId.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    if (body.adVideo && seller.sellerType !== "premium_seller") {
      return NextResponse.json(
        { error: "Only premium sellers can upload product ads" },
        { status: 403 }
      );
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE — Delete product

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params  

    const token = await cookies().get("sellerToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const product = await Product.findById(id);
    if (!product || product.sellerId.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await product.deleteOne();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}