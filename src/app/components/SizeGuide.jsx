import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { motion, AnimatePresence } from "framer-motion";

export default function SizeGuide() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-0 bg-white z-50 px-[16px] py-[40px] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-[12px]">
          <ChevronLeft
            size={20}
            className="text-black/70 cursor-pointer"
            onClick={onClose}
          />
          <p className="text-[20px] font-inter font-medium text-black">
            Size Guide
          </p>
          <div className="w-[20px]" />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}