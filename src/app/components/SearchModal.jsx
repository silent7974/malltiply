"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronLeft, Search } from "lucide-react"
import Image from "next/image"
import { 
  useGetProductsBySearchQuery, 
  useGetProductsByStoreSearchQuery 
} from "@/redux/services/productApi"

export default function SearchModal({ onClose, storeId }) {
  const [query, setQuery] = useState("")

  // ✅ Decide which query hook to use
  const { data, isLoading } = storeId
    ? useGetProductsByStoreSearchQuery(
        { searchTerm: query, storeId },
        { skip: !query || !storeId }
      )
    : useGetProductsBySearchQuery(query, { skip: !query })

  const results = data?.products || []

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed inset-0 bg-white z-50 px-4 pt-4 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-[8px] mb-4">
          <ChevronLeft
            size={24}
            className="text-black cursor-pointer"
            onClick={onClose}
          />
          <div className="flex-1 relative flex items-center bg-transparent border border-black rounded-full h-[40px] pl-[16px] pr-[46px]">
            <input
              type="text"
              placeholder="Search Malltiply"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-black placeholder:text-[#00000080] font-montserrat font-medium text-[14px] outline-none"
            />

            {/* Cancel button */}
            {query && (
              <Image
                src="/cancel-search.svg"
                alt="Cancel"
                width={18}
                height={18}
                className="absolute right-[50px] cursor-pointer"
                onClick={() => setQuery("")}
              />
            )}

            {/* Search button */}
            <Image
              src="/search-white.svg"
              alt="Search"
              width={42}
              height={42}
              className="absolute right-[4px]"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col">
          {isLoading ? (
            <p className="text-sm text-gray-400 px-1">Searching...</p>
          ) : query && results.length === 0 ? (
            <p className="text-sm text-gray-400 px-1">
              No products found for "{query}"
            </p>
          ) : (
            results.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-2 h-[48px] border-b border-black/20 px-1"
              >
                <Search size={16} strokeWidth={1} className="text-black" />
                <span className="text-[13px] font-medium font-inter text-black">
                  {item.productName}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}