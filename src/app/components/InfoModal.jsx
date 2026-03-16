"use client"

import { motion, AnimatePresence } from "framer-motion"

export default function InfoModal({ title, children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* overlay */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={onClose}
        />

        {/* sheet */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* header */}
          <div className="w-full h-[56px] bg-[#F8F9FA] border-b border-black/10 flex items-center px-4 rounded-t-[16px]">
            <p className="flex-1 text-center font-inter font-medium text-[16px]">
              {title}
            </p>

            <div className="w-[20px]" />
          </div>

          {/* content */}
          <div className="px-4 py-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}