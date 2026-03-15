import dbConnect from "@/lib/mongodb";
import Seller from "@/models/seller";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const seller = await Seller.findOne({ email });
    if (!seller) {
      // silent success (security best practice)
      return NextResponse.json({ message: "If account exists, email sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    seller.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    seller.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await seller.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/seller/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: seller.email,
      subject: "Reset your Malltiply password",
      html: `
        <p>You requested a password reset.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}