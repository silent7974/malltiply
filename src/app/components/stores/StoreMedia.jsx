"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, Play, Pause } from "lucide-react"

export default function StoreMedia({ store }) {
  const bannerItem = store.bannerMedia?.find(m => m.type === "image")
  const videoItem = store.bannerMedia?.find(m => m.type === "video")

  const bannerPreviewUrl = bannerItem ? { url: bannerItem.url } : null
  const videoPreviewUrl = videoItem ? { url: videoItem.url } : null
  const videoMuted = store.videoMuted ?? true

  const [showMaximize, setShowMaximize] = useState(false)
  const [showVideo, setShowVideo] = useState(!!videoPreviewUrl)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef(null)
  const rafRef = useRef(null)

  const BANNER_DURATION = 5000
  const RADIUS = 44
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const startRef = useRef(0)
  const elapsedRef = useRef(0)

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
  }, [showVideo, paused, videoPreviewUrl])

  function togglePlay() {
    setPaused((p) => !p)
    if (videoRef.current) {
      paused ? videoRef.current.play() : videoRef.current.pause()
    }
  }

  function enterFullscreen() {
    setPaused(true)
    videoRef.current?.pause()
    videoRef.current?.requestFullscreen?.()
  }

  return (
    <div 
      className="relative w-full h-[360px] bg-black overflow-hidden"
      onClick={() => setShowMaximize((prev) => !prev)}
    >
      <AnimatePresence mode="wait">
        {showVideo && videoPreviewUrl ? (
          <motion.video
            key="video"
            ref={videoRef}
            src={videoPreviewUrl.url}
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
            src={bannerPreviewUrl.url}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          />
        ) : null}
      </AnimatePresence>

      {showVideo && showMaximize && (
        <button
          onClick={enterFullscreen}
          className="absolute top-3 left-3 bg-black/70 p-2 rounded-full"
        >
          <Maximize2 size={18} color="#fff" />
        </button>
      )}

      <div className="absolute bottom-3 right-3 w-6 h-6">
        <svg viewBox="0 0 100 100" className="absolute inset-0">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#fff" strokeWidth="10" opacity="0.5" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="#fff"
            strokeWidth="10"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>

        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          {paused ? <Play size={14} color="#fff" fill="#fff" /> : <Pause size={14} color="#fff" fill="#fff" />}
        </button>
      </div>
    </div>
  )
}