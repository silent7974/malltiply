"use client"

import { useState, useRef, useEffect } from "react"
import headerCategoryMap from "@/lib/data/headerCategoryMap"
import AllLayout from "./components/AllLayout"
import CategoryLayout from "./components/CategoryLayout"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const tabsRef = useRef({})

  // Scroll the selected tab into center view
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
    <div className="w-full">
      {/* Category Tabs */}
      <div className="w-full h-[40px] mt-[8px] border-y border-black/20 flex items-center">
        <div className="flex gap-6 px-4 overflow-x-auto scrollbar-hide">
          {Object.keys(headerCategoryMap).map((header) => {
            const isActive = activeCategory === header
            return (
              <button
                key={header}
                ref={(el) => (tabsRef.current[header] = el)}
                onClick={() => setActiveCategory(header)}
                className="relative flex flex-col items-center pb-2"
              >
                <span
                  className={`font-[600] font-montserrat text-[14px] ${
                    isActive ? "text-black" : "text-black/50"
                  }`}
                >
                  {header}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute bottom-1 w-[20px] h-[4px] rounded-full bg-black" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Layout Switcher */}
      {activeCategory === "All" ? (
        <AllLayout />
      ) : (
        <CategoryLayout category={activeCategory} /> 
      )}
    </div>
  )
}