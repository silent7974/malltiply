import dbConnect from "@/lib/mongodb";
import Seller from "@/models/seller";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    await dbConnect();

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const seller = await Seller.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!seller) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    seller.passwordHash = await bcrypt.hash(password, salt);
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpires = undefined;

    await seller.save();

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}