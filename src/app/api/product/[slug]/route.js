import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";

export async function GET(_, { params }) {
  await dbConnect();

  const { slug } = await params;

  const product = await Product.findOne({ slug });
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  return Response.json(product);
}