"use client"

import { useGetPublicProductsQuery } from "@/redux/services/productApi"
import ProductGrid from "./ui/ProductGrid"
import Spinner from "./Spinner"


export default function AllTabContent({ activeTab }) {
  const { data, error, isLoading } = useGetPublicProductsQuery()
  const products = data?.products || []

  switch (activeTab) {
    case "Deals":
      if (isLoading) return <div className="p-4">Loading deals...</div>
      if (error) return <div className="p-4 text-red-500">Failed to load deals</div>

      const deals = products.filter((p) => p.discount && p.discount > 0).sort((a, b) => b.discount - a.discount)
      return <ProductGrid products={deals} />

    case "5-Star Rated":
      return <div className="p-4">⭐ Top Rated Section</div>

    case "Best-Selling":
      return <div className="p-4">📈 Best Selling Section</div>

    case "New In":
      if (isLoading) return <div className="p-4">Loading new arrivals...</div>
      if (error) return <div className="p-4 text-red-500">Failed to load products</div>

      const newIn = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return <ProductGrid products={newIn} />

    case "All":
    default:
      if (isLoading) return <Spinner />
      if (error) return <div className="p-4 text-red-500">Failed to load products</div>

      return <ProductGrid products={products} />
  }
}