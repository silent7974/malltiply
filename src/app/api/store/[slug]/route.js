import dbConnect from "@/lib/mongodb";
import Store from "@/models/store";

export async function GET(_, { params }) {
  await dbConnect()

  const { slug } = await params

  const store = await Store.findOne({
    slug,
    isPublished: true,
  }).populate("sellerId", "brandName");

  if (!store) {
    return new Response("Store not found", { status: 404 });
  }

  return Response.json(store);
}