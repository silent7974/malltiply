"use client"
import { useState, useEffect, useRef } from "react"
// import Image from "next/image"
// import { motion, AnimatePresence } from "framer-motion"
// import { ChevronRight, Zap, ThumbsUp } from "lucide-react"
// import FeaturedSection from "./FeaturedSection"
import AllTabContent from "./AllTabContent"

// const banners = [
//   { src: "/banners/banner.jpg", alt: "Banner 1" },
//   { src: "/banners/premium-banner.jpg", alt: "Banner 2" },
// ]

// const slides = [
//   {
//     icon: "/truck.svg",
//     iconW: 16,
//     iconH: 9,
//     title: "Fast Delivery",
//     subtitle: "within 24 hours - same day",
//   },
//   {
//     icon: "/shield.svg",
//     iconW: 14,
//     iconH: 17,
//     title: "Secure Payments",
//     subtitle: "100% safe transactions",
//   },
//   {
//     icon: "/return.svg",
//     iconW: 14,
//     iconH: 16,
//     title: "Easy Returns",
//     subtitle: "within 10 days from purchase date",
//   },
// ]

// const whySlides = [
//   { icon: "/padlock.svg", title: "Security policy" },
//   { icon: "/card.svg", title: "Safe payments" },
//   { icon: "/package.svg", title: "Delivery guarantee" },
// ]

// const allTabs = ["All", "Deals", "Best-Selling", "5-Star Rated", "New In"]


export default function AllLayout() {
  // const [index, setIndex] = useState(0)
  // const [textIndex, setTextIndex] = useState(0)
  // const [whyIndex, setWhyIndex] = useState(0)

  // const [activeTab, setActiveTab] = useState("All")
  // const tabsRef = useRef({})

  // auto-slide banners every 5s
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setIndex((prev) => (prev + 1) % banners.length)
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  // auto-slide text every 5s
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTextIndex((prev) => (prev + 1) % slides.length)
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  // // auto-slide whySlides every 5s
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setWhyIndex((prev) => (prev + 1) % whySlides.length)
  //   }, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  // // Scroll selected tab into view
  // useEffect(() => {
  //   if (tabsRef.current[activeTab]) {
  //     tabsRef.current[activeTab].scrollIntoView({
  //       behavior: "smooth",
  //       inline: "center",
  //       block: "nearest",
  //     })
  //   }
  // }, [activeTab])

  return (
    <>
      {/* Banner Section */}
      <div className="relative w-full overflow-hidden">
        {/* <motion.div
              key={index}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={banners[index].src}
                alt={banners[index].alt}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div> */}

      {/* Text Slides Section */}
      {/* <div className="px-4 mt-4">
        <div className="w-full h-[48px] rounded bg-[#C6D8DE] px-[4px] pt-[4px] flex items-center justify-between overflow-hidden"> */}
          {/* Left side */}
          {/* <div className="flex items-start gap-2 border-r border-black/50 pr-2">
            <div className="flex flex-col"> */}
              {/* icon + title row */}
              {/* <div className="flex items-center gap-[2px]">
                <Image src="/star.svg" alt="Star" width={16} height={15} />
                <span className="font-bold text-[12px] text-[#474545]">
                  Shop from Top-Rated Sellers
                </span>
              </div> */}

              {/* subtitle aligned under icon */}
              {/* <span className="font-medium text-[8px] text-[#474545]">
                Trusted vendors with exclusive deals
              </span>
            </div>
          </div> */}

          {/* Right side (animated slides) */}
          {/* <div className="flex-1 pl-2 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.68, -0.55, 0.27, 1.55], // easeInOutBack
                }}
                className="flex flex-col"
              > */}
                {/* icon + title row */}
                {/* <div className="flex items-center gap-[2px]">
                  <Image
                    src={slides[textIndex].icon}
                    alt={slides[textIndex].title}
                    width={slides[textIndex].iconW}
                    height={slides[textIndex].iconH}
            
                  />
                  <span className="font-bold text-[12px] text-[#474545]">
                    {slides[textIndex].title}
                  </span>
                </div> */}

                {/* subtitle aligned under icon */}
                {/* <span className="font-medium text-[8px] text-[#474545]">
                  {slides[textIndex].subtitle}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div> */}

      {/* Why Choose Section (on top of light-blue) */}
      {/* <div className="w-full shadow-[0_-2px_6px_rgba(0,0,0,0.1)] -mt-[3px]">
        <div className="bg-[#F8F9FA] px-[16px] py-[8px]">
          <div className="bg-[#1A7709] px-[8px] flex items-center justify-between rounded"> */}
            {/* Left side */}
            {/* <div className="flex items-center gap-[8px]">
              <Image
                src="/shield-white.svg"
                alt="Shield"
                width={14}
                height={14}
              />
              <span className="text-[12px] text-white font-normal font-inter">
                Why choose Malltiply?
              </span>
            </div> */}

            {/* Right side animations */}
            {/* <div className="flex items-center ">
              <AnimatePresence mode="wait">
                <motion.div
                  key={whyIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.68, -0.55, 0.27, 1.55],
                  }}
                  className="flex items-center gap-[2px]"
                >
                  <Image
                    src={whySlides[whyIndex].icon}
                    alt={whySlides[whyIndex].title}
                    width={14}
                    height={14}
                  />
                  <span className="text-[12px] text-white font-normal font-inter">
                    {whySlides[whyIndex].title}
                  </span>
                </motion.div>
              </AnimatePresence> */}

              {/* Chevron */}
              {/* <ChevronRight size={16} className="text-white" />
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="px-4"> */}
        {/* Limited-Time Offer */}
        {/* <FeaturedSection
          titleImg="/titles/Limited-time.svg"
          altText="Limited-Time Offer"
          filterFn={(p) => p.discount >= 75}
          fallbackText="No limited-time offers yet. Check back soon!"
        /> */}

        {/* Limited Stock */}
        {/* <FeaturedSection
          titleImg="/titles/Limited-stocks.svg"
          altText="Limited Stock"
          filterFn={(p) => p.quantity <= 20}
          fallbackText="No limited-stock items available right now."
          showLimitedStockBadge
        /> */}

        {/* Featured Brands */}
        {/* <FeaturedSection
          titleImg="/titles/Featured-brands.svg"
          altText="Featured Brands"
          filterFn={() => false} // force no products
          fallbackText="Our featured brands are coming soon!"
        />
      </div> */}

      {/* <div className="w-full"> */}
        {/* Sub Tabs inside All */}
        {/* <div className="w-full mt-[20px]"> */}
          {/* Separator */}
          {/* <div className="w-full h-[4px] bg-[#EEEEEE]" /> */}

          {/* Tabs container */}
          {/* <div className="w-full h-[40px] flex items-center">
            <div className="flex gap-[20px] px-[16px] overflow-x-auto scrollbar-hide">
              {allTabs.map((tab) => {
                const isActive = activeTab === tab
                const textColor = isActive ? "text-black" : "text-black/50"
                const iconOpacity = isActive ? "opacity-100" : "opacity-50"

                return (
                  <button
                    key={tab}
                    ref={(el) => (tabsRef.current[tab] = el)}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex items-center gap-[4px] pb-1"
                  > */}
                    {/* Icons where needed */}
                    {/* {tab === "Deals" && (
                      <Zap size={16} className={`${iconOpacity}`} fill={isActive ? "black" : "gray"} stroke="none" />
                    )}
                    {tab === "Best-Selling" && (
                      <ThumbsUp size={16} className={`${iconOpacity}`} fill={isActive ? "black" : "gray"} stroke="none" />
                    )} */}

                    {/* Tab text */}
                    {/* <span
                      className={`font-medium font-montserrat text-[16px] ${textColor} whitespace-nowrap`}
                    >
                      {tab}
                    </span> */}

                    {/* Active indicator */}
                    {/* {isActive && (
                      <span className="absolute bottom-[1px] left-0 right-0 mx-auto w-[20px] h-[4px] rounded-full bg-black" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div> */}

        {/* Content Switcher */}
        <AllTabContent activeTab="All" />
      </div>
    </>
  )
}