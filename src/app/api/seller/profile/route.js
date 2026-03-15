import dbConnect from "@/lib/mongodb"
import Seller from "@/models/seller"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Product from "@/models/product"
import store from "@/models/store"

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("sellerToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const seller = await Seller.findById(decoded.id).select("-passwordHash");

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    return NextResponse.json(seller);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("sellerToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const body = await req.json();

    const seller = await Seller.findById(decoded.id);

    console.log("Update payload:", body);
    console.log("Seller before save:", seller)
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // 🔹 Password update
    if (body.oldPassword && body.newPassword) {
      const isMatch = await bcrypt.compare(body.oldPassword, seller.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      seller.passwordHash = await bcrypt.hash(body.newPassword, salt);

      await seller.save();
      return NextResponse.json({ message: "Password updated successfully" });
    }

    // 🔹 Profile update (whitelist allowed fields)
    const allowedFields = ["fullName", "email", "phone", "category", "profileImage", "notificationsEnabled"];
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        seller[field] = body[field];
      }
    });

    // 🔹 Location update (nested object)
    if (body.location) {
      seller.location.city = body.location.city ?? seller.location.city;
      seller.location.street = body.location.street ?? seller.location.street;
      seller.location.district = body.location.district ?? seller.location.district;
    }

    await seller.save();
    const updated = seller.toObject();
    delete updated.passwordHash;

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("sellerToken")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔹 Fetch seller FIRST
    const seller = await Seller.findById(decoded.id);
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // 🔹 Delete all products
    await Product.deleteMany({ sellerId: seller._id });

    // 🔹 Delete store if premium
    if (seller.sellerType === "premium_seller") {
      await store.deleteMany({ sellerId: seller._id });
    }

    // 🔹 Delete seller
    await Seller.findByIdAndDelete(seller._id);

    // 🔹 Clear cookie
    const res = NextResponse.json({ message: "Profile deleted successfully" });
    res.cookies.set("sellerToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    console.error("Profile Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}