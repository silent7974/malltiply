"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { ChevronLeft, Search, Bookmark, ShoppingCart, MoreVertical } from "lucide-react"
import Link from "next/link"
import SearchModal from "@/app/components/SearchModal"

export default function StoreHeader({ store }) {
  const router = useRouter()
  const totalQuantity = useSelector(state => state.cart.totalQuantity)
  const [showSearch, setShowSearch] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const displayName = store?.brandName?.split(" ")[0] || "Store"

  return (
    <div className="sticky top-0 z-20 bg-[#f8f9fa] pt-[40px] pb-3 flex justify-between items-center">
      {/* LEFT */}
      <div className="flex items-center gap-1">
        <ChevronLeft size={20} onClick={() => router.back()} className="cursor-pointer" />
        <p className="font-[montserrat] font-bold text-[24px] text-[#474545]">{displayName}</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-[12px] text-[#474545] relative">
        <Search size={24} className="cursor-pointer" onClick={() => setShowSearch(true)} />
        <Bookmark
          size={24}
          className={`cursor-pointer ${bookmarked ? "fill-[#474545]" : ""}`}
          onClick={() => setBookmarked(prev => !prev)}
        />
        <Link href="/cart" className="relative">
          <ShoppingCart size={24} />
          {mounted && totalQuantity > 0 && (
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: "-4px",
                right: "-6px",
                width: "20px",
                height: "16px",
                borderRadius: "8px",
                backgroundColor: "#005770",
                color: "#fff",
                fontSize: "8px",
                fontFamily: "Inter",
                fontWeight: 600,
              }}
            >
              {totalQuantity}
            </div>
          )}
        </Link>
        <MoreVertical size={24} className="cursor-pointer" onClick={() => setShowMore(prev => !prev)} />
        {showMore && (
          <div className="absolute top-full right-1 mt-2 w-[120px] bg-white border border-gray-300 rounded shadow-md py-2">
            <p className="px-3 py-1 cursor-pointer hover:bg-gray-100">Share Store</p>
            <p className="px-3 py-1 cursor-pointer hover:bg-gray-100">Report</p>
          </div>
        )}
      </div>

      {/* Search modal */}
      {showSearch && store._id && (
        <SearchModal onClose={() => setShowSearch(false)} storeId={store._id} />
      )}
    </div>
  )
}