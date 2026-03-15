import dbConnect from "@/lib/mongodb"
import Product from "@/models/product"

export async function GET(req) {
  await dbConnect()

  // get query string from URL
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("query")
  const storeId = searchParams.get("storeId");

  try {
    const results = await Product.find({
      $text: { $search: query },
      ...(storeId && { storeId }),
    }).sort({ score: { $meta: "textScore" } });

    return new Response(
      JSON.stringify({ products: results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Search failed", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}