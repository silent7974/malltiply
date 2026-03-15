"use client"

import { useState, useRef, useEffect } from "react"
import { useGetProductsByStoreQuery } from "@/redux/services/productApi"
import ProductGrid from "../ui/ProductGrid"

export default function StoreCategories({ store }) {
  const brandColor = store.brandColor || "#000"
  const categories = ["All", ...(store.categories || [])]

  const [activeCategory, setActiveCategory] = useState("All")
  const tabsRef = useRef({})

  // 🔹 Fetch ALL products for this store (no filtering yet)
  const { data: products = [], isLoading } =
    useGetProductsByStoreQuery(store._id)

  const filteredProducts =
  activeCategory === "All"
    ? products
    : products.filter(
        (p) => p.subCategory === activeCategory
      );


  // Center active tab
  useEffect(() => {
    if (tabsRef.current[activeCategory]) {
      tabsRef.current[activeCategory].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      })
    }
  }, [activeCategory])

  return (
    <div className="">
      {/* CATEGORY TABS */}
      <div className="w-full h-[40px] border-y border-black/20 flex items-center">
        <div className="flex overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category

            return (
              <button
                key={category}
                ref={(el) => (tabsRef.current[category] = el)}
                onClick={() => setActiveCategory(category)}
                className="relative inline-flex items-center justify-center pb-2 px-2"
              >
              <span
                className="font-[600] font-montserrat text-[16px] whitespace-nowrap"
                style={{
                  color: isActive ? brandColor : "rgba(0,0,0,0.5)",
                }}
              >
                {category}
              </span>

                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[4px] rounded-full"
                    style={{ backgroundColor: brandColor }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="">
        {isLoading ? (
          <p className="mt-3 text-center text-gray-400 text-sm">
            Loading products…
          </p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  )
}