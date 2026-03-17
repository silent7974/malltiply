"use client"

import formatPrice from "@/lib/utils/formatPrice"
import Image from "next/image"
import { logEvent } from "@/lib/analytics"
import { useRouter } from "next/navigation"

export default function ProductCard({ product, index }) {
  const router = useRouter()

  return (
    <div 
      key={product._id}
      onClick={
        () => {router.push(`/details/${product._id}`)
        logEvent({ page: "HomePage", component: "ProductCard", event: "Product_Clicked", payload: { productId: product._id, productName: product.productName } })
      }}
    >
      {/* Product Image */}
      <Image
        src={product.images?.[0]?.url || "/placeholder.png"}
        alt={product.productName}
        width={500}
        height={index % 2 === 0 ? 140 : 168}
        className={`w-full object-cover ${
          index % 2 === 0 ? "h-[140px]" : "h-[168px]"
        }`}
      />

      {/* Product Info */}
      <div className="mt-[2px]">
        <h3 className="font-[Montserrat] text-[11px] text-black/50 truncate">
          {product.productName}
        </h3>

        <div className="flex items-center justify-between mt-[2px]">
          <div className="flex items-baseline space-x-[2px]">
            <span className="font-[Inter] font-medium text-[10px]">
             ₦  {formatPrice(product.price)}
            </span>
          </div>

          <div 
          className="w-[36px] h-[29px] flex items-center justify-center border border-black/50 rounded-[24px]"
          onClick={(e) => {
            e.stopPropagation() // prevent navigation
            logEvent({ page: "HomePage", component: "ProductCard", event: "AddToCart_Clicked", payload: { productId: product._id } })
            // addToCart(product) → your existing function
          }}
          >
            <Image
              src="/add-shopping-cart.svg"
              width={16}
              height={16}
              alt="Add shopping cart"
            />
          </div>
        </div>
      </div>
    </div>
  )
}