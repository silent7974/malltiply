import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";
import Seller from "@/models/seller";
import Store from "@/models/store";

const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// POST — Create product
// ===============================
export async function POST(req) {
  try {
    await dbConnect();

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

    const isPremium = seller.sellerType === "premium_seller";

    let storeId = null;

    if (isPremium) {
      const store = await Store.findOne({ sellerId: decoded.id }).select("_id");

      if (!store) {
        return NextResponse.json(
          { error: "Premium seller has no store" },
          { status: 400 }
        );
      }

      storeId = store._id;
    }

    const data = await req.json();

    const {
      productName,
      description = "",
      price,
      quantity,
      category,
      sku,
      subCategory = "",
      subType = "",
      variants = {},
      variantColumns = [],
      images = [],
      adVideo = null,
    } = data;

    if (!productName || !subCategory || price == null || quantity == null || sku == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (adVideo && !isPremium) {
      return NextResponse.json(
        { error: "Only premium sellers can upload product ads" },
        { status: 403 }
      );
    }

    const product = await Product.create({
      sellerId: decoded.id,
      ...(storeId && { storeId }),
      productName: productName.trim(),
      description: description.trim(),
      price,
      quantity,
      sku,
      category,
      subCategory,
      subType,
      variants,
      variantColumns,
      images,
      ...(isPremium && adVideo ? { adVideo } : {}),
    });

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ===============================
// GET — Seller products
// ===============================
export async function GET() {
  try {
    await dbConnect();

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

    const products = await Product.find({ sellerId: decoded.id });
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}