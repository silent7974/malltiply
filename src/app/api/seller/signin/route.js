import dbConnect from "@/lib/mongodb";
import Seller from "@/models/seller";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await dbConnect();

    const seller = await Seller.findOne({ email });
    if (!seller) {
      // Clear message: account doesn't exist
      return NextResponse.json({ error: "The account doesn't exist" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, seller.passwordHash);
    if (!isMatch) {
      // Clear message: password invalid
      return NextResponse.json({ error: "Password is invalid" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: seller._id.toString(),
        sellerType: seller.sellerType, 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      sellerType: seller.sellerType, // add this for frontend routing
    });

    response.cookies.set("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}