import { Suspense } from "react"
import Spinner from "@/app/components/Spinner"
import ProductDetailsPage from "./productDetailsPage"

export async function generateMetadata({ params }) {
  const { slug } = await params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${slug}`, {
      cache: "no-store"
    })
    const product = await res.json()

    if (!product || product.error) {
      return { title: "Product not found - Malltiply" }
    }

    return {
      title: `${product.productName} - Malltiply`,
      description: product.description || `Shop ${product.productName} on Malltiply. Fast delivery within 24 hours in Abuja.`,
      openGraph: {
        title: product.productName,
        description: product.description,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    }
  } catch {
    return { title: "Malltiply" }
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<Spinner />}>
      <ProductDetailsPage />
    </Suspense>
  )
}