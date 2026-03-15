'use client'

import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { useGetMyStoreQuery } from "@/redux/services/storeApi";

import {
  ChevronLeft,
  Search,
  Bookmark,
  ShoppingCart,
  MoreVertical,
  Maximize2,
  Play,
  Pause,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CategoriesTabs from "./CategoriesTabs";
import PreviewStory from "./PreviewStory";
import PreviewFooter from "./PreviewFooter";

export default function PreviewStore({ onClose }) {
  const {
    videoPreviewUrl,
    bannerPreviewUrl,
    videoMuted,
    storeTagline,
  } = useSelector((s) => s.store)

  const { data: store } = useGetMyStoreQuery();
  const displayName = store?.brandName?.split(" ")[0] || "Store";

  const [showMaximize, setShowMaximize] = useState(false);
  const [showVideo, setShowVideo] = useState(!!videoPreviewUrl)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef(null)
  const rafRef = useRef(null)

  const BANNER_DURATION = 5000
  const RADIUS = 44
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const startRef = useRef(0) // track start time
  const elapsedRef = useRef(0) // track elapsed time across pauses

  useEffect(() => {
    if (paused) return

    const duration =
      showVideo && videoPreviewUrl
        ? (videoRef.current?.duration || 5) * 1000
        : BANNER_DURATION

    const start = performance.now() - elapsedRef.current
    startRef.current = start

    function tick(now) {
      const elapsed = now - startRef.current
      elapsedRef.current = elapsed
      const pct = Math.min(elapsed / duration, 1)
      setProgress(pct)

      if (pct < 1 && !paused) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setProgress(0)
        elapsedRef.current = 0
        setShowVideo((v) => !v)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [showVideo, paused])


  function togglePlay() {
    setPaused((p) => !p)
    if (videoRef.current) {
      paused ? videoRef.current.play() : videoRef.current.pause()
    }
  }

  function enterFullscreen() {
    setPaused(true);
    videoRef.current?.pause();
    videoRef.current?.requestFullscreen?.();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white overflow-y-auto scrollbar-hide touch-auto max-h-screen"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white pt-[40px] pb-3 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <ChevronLeft size={20} onClick={onClose} />
            <p className="font-[montserrat] font-bold text-[24px] text-[#474545]">
              {displayName}
            </p>
          </div>

          <div className="flex items-center gap-[12px] text-[#474545]">
            <Search size={24} />
            <Bookmark size={24} />
            <ShoppingCart size={24} />
            <MoreVertical size={24} />
          </div>
        </div>

        {/* MEDIA */}
        <div 
          className="relative w-full h-[360px] bg-black overflow-hidden"
          onClick={() => setShowMaximize((prev) => !prev)}
        >
          <AnimatePresence mode="wait">
            {showVideo && videoPreviewUrl ? (
              <motion.video
                key="video"
                ref={videoRef}
                src={videoPreviewUrl?.url}
                muted={videoMuted}
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
              />
            ) : bannerPreviewUrl ? (
              <motion.img
                key="banner"
                src={bannerPreviewUrl?.url}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
              />
            ) : null}
          </AnimatePresence>

          {/* MAXIMIZE (VIDEO ONLY) */}
          {showVideo && showMaximize && (
            <button
              onClick={enterFullscreen}
              className="absolute top-3 left-3 bg-black/70 p-2 rounded-full"
            >
              <Maximize2 size={18} color="#fff" />
            </button>
          )}

          {/* RING + PLAY */}
          <div className="absolute bottom-3 right-3 w-6 h-6">
            <svg viewBox="0 0 100 100" className="absolute inset-0">
              {/* Base ring */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="#fff"
                strokeWidth="10"
                opacity="0.5"
              />
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="#fff"
                strokeWidth="10"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={
                  CIRCUMFERENCE * (1 - progress)
                }
                strokeLinecap="round"
              />
            </svg>

            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              {paused ? (
                <Play size={14} color="#fff" fill="#fff" />
              ) : (
                <Pause size={14} color="#fff" fill="#fff"  />
              )}
            </button>
          </div>
        </div>

        <CategoriesTabs storeId={store?._id} />

        <PreviewStory />

        <PreviewFooter />
      </motion.div>

    </div>
  )
}