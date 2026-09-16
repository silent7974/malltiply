"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageZoomModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef(null);
  const lastTapRef = useRef(0);

  // Sync initialIndex when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset zoom on image change
  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      resetZoom();
    }
  }, [images.length, resetZoom]);

  const handlePrev = useCallback(() => {
    if (images.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      resetZoom();
    }
  }, [images.length, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Zoom helpers
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.75, 4));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.75, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Double tap / double click
  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  // Touch handlers for pinch-to-zoom and pan
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistanceRef.current = dist;
    } else if (e.touches.length === 1) {
      // Single touch: double tap detection or pan
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(e);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      if (scale > 1) {
        setIsDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        posStartRef.current = { ...position };
      }
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistanceRef.current) {
      // Pinch zoom
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - lastTouchDistanceRef.current) * 0.01;
      setScale((prev) => Math.min(Math.max(prev + delta, 1), 4));
      lastTouchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      const dy = e.touches[0].clientY - dragStartRef.current.y;
      setPosition({
        x: posStartRef.current.x + dx,
        y: posStartRef.current.y + dy,
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      lastTouchDistanceRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      posStartRef.current = { ...position };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: posStartRef.current.x + dx,
        y: posStartRef.current.y + dy,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.3, 4));
    } else {
      setScale((prev) => {
        const next = Math.max(prev - 0.3, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  const currentImage = images[currentIndex];
  const imageUrl = typeof currentImage === "string" ? currentImage : currentImage?.url;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col select-none touch-none"
          onWheel={handleWheel}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white z-10">
            <span className="text-[13px] font-inter font-medium text-white/70">
              {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : ""}
            </span>

            {/* Hint */}
            <span className="text-[11px] font-inter text-white/50 hidden sm:inline-block">
              Double-tap or scroll to zoom • Drag to pan
            </span>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
              title="Close (Esc)"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Main Image Area */}
          <div
            className="flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleTap}
          >
            {imageUrl ? (
              <motion.img
                key={currentIndex}
                src={imageUrl}
                alt={`Zoom view ${currentIndex + 1}`}
                animate={{
                  scale,
                  x: position.x,
                  y: position.y,
                }}
                transition={{
                  type: isDragging ? "tween" : "spring",
                  stiffness: 250,
                  damping: 25,
                }}
                className="max-w-full max-h-full object-contain pointer-events-none"
                draggable={false}
              />
            ) : (
              <p className="text-white/40 text-sm">Image unavailable</p>
            )}

            {/* Left Nav Arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition cursor-pointer z-10"
                title="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Right Nav Arrow */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white/80 hover:text-white transition cursor-pointer z-10"
                title="Next image"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-center gap-4 py-3 bg-black/40 z-10">
            <button
              onClick={zoomOut}
              disabled={scale <= 1}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 rounded-full text-white transition cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut size={18} />
            </button>

            <span className="text-[12px] font-inter font-medium text-white/70 min-w-[45px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={zoomIn}
              disabled={scale >= 4}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 rounded-full text-white transition cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn size={18} />
            </button>

            {scale > 1 && (
              <button
                onClick={resetZoom}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition cursor-pointer"
                title="Reset zoom"
              >
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
