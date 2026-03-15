import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"

export async function GET(_, { params }) {
  await dbConnect()

  const products = await Product.find({
    storeId: params.storeId,
  }).sort({ createdAt: -1 })

  return Response.json(products)
}