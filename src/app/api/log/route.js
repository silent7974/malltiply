import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
// import analyticsLogs from "@/models/analyticsLogs"


export async function POST(req) {
  try {
    await dbConnect()
    const data = await req.json()
    console.log("ANALYTICS LOGS:", data)
    // await analyticsLogs.create(data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}