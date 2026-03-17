"use client"

import { useState, useRef, useEffect } from "react"
import headerCategoryMap from "@/lib/data/headerCategoryMap"
import AllLayout from "./components/AllLayout"
import CategoryLayout from "./components/CategoryLayout"
import { logEvent } from "@/lib/analytics"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const tabsRef = useRef({})

  useEffect(() => {
    logEvent({ page: "HomePage", component: "HomePage", event: "HomePage_Viewed" })
  }, [])

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
      <div className="relative w-full h-[40px] my-[8px] flex items-center">

        {/* Left fade */}
        <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Right fade */}
        <div className="absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 px-4 overflow-x-auto scrollbar-hide">
          {Object.keys(headerCategoryMap).map((header) => {
            const isActive = activeCategory === header
            return (
              <button
                key={header}
                ref={(el) => (tabsRef.current[header] = el)}
                onClick={() => {
                  setActiveCategory(header)
                  logEvent({ page: "HomePage", component: "CategoryTabs", event: "CategoryTab_Clicked", payload: { category: header } })
                }}
                className="relative flex flex-col items-center pb-2"
              >
                <span
                  className={`font-[600] font-montserrat text-[16px] ${
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