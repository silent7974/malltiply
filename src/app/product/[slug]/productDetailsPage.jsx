"use client";

import React, { useState, useRef, useEffect, useMemo } from "react"
import { useGetProductBySlugQuery } from "@/redux/services/productApi"
import { ChevronDown, Upload, Ruler, ChevronRight, X } from "lucide-react"
import productCategoryMap from '@/lib/data/productCategoryMap'
import FloatingCart from "@/app/components/FloatingCart"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useSelector } from "react-redux"
import AddToCartButton from "@/app/components/AddToCartButton";
import Spinner from "@/app/components/Spinner";
import { useParams } from "next/navigation";
import InfoModal from "@/app/components/InfoModal";

const SWIPE_HINT_KEY = "malltiply_swipe_hint_seen"

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug;
  const { data: product, isLoading, isError } = useGetProductBySlugQuery(slug);

  // STATE
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [modal, setModal] = useState(null);

  // ← NEW: live drag tracking so the image follows the finger instead of
  // only jumping at touchend. isDragging toggles the CSS transition off
  // while the finger is down, and back on for the snap animation.
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef(0);

  // ← NEW: full-screen image viewer with blurred background
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // ← NEW: one-time "this is swipeable" nudge on first visit to any product
  const [hintOffset, setHintOffset] = useState(0);

  const totalQuantity = useSelector(state => state.cart.totalQuantity)

  const carouselRef = useRef(null);
  const viewerCarouselRef = useRef(null);

  const navbarRef = useRef(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  useEffect(() => {
    const navbar = document.querySelector("nav")
    if (!navbar) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyHeader(!entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(navbar)
    return () => observer.disconnect()
  }, [])

  // MEMOIZED VALUES
  const mergedVariants = useMemo(() => {
    const rawVariants = product?.variants
    const baseVariants = (
      Array.isArray(rawVariants) ? rawVariants :
      rawVariants && typeof rawVariants === 'object' ? [rawVariants] :
      []
    ).map(v => ({
      ...v,
      price: v.price ?? product?.price,
      sku: v.sku ?? product?.sku,
      quantity: v.quantity ?? product?.quantity,
      isBase: true,
    }))
    const extraVariants = Array.isArray(product?.variantColumns) ? product.variantColumns : []
    return [...baseVariants, ...extraVariants];
  }, [product]);

  const variantType = useMemo(() => {
    if (!product?.category) return null;
    const categoryConfig = productCategoryMap[product.category];
    if (!categoryConfig?.variants) return null;

    if (categoryConfig.variants.sizes) return "size";
    if (categoryConfig.variants.measurement) return "measurement";
    if (categoryConfig.variants.memory || categoryConfig.variants.ram) return "tech-spec";
    return null;
  }, [product]);

  const allColors = useMemo(
    () => [...new Set(mergedVariants.map(v => v.color).filter(Boolean))],
    [mergedVariants]
  );

  const colorVariants = useMemo(
    () => mergedVariants.filter(v =>
      selectedColor ? v.color?.toLowerCase() === selectedColor?.toLowerCase() : true
    ),
    [mergedVariants, selectedColor]
  );

  const activeVariant = useMemo(() => {
    if (!selectedColor) return null;
    return mergedVariants.find(v =>
      v.color?.toLowerCase() === selectedColor?.toLowerCase() &&
      ((variantType === "size" && v.size === selectedSize) ||
      (variantType === "measurement" && v.measurement === selectedSize) ||
      (variantType === "tech-spec" && (v.memory === selectedSize || v.ram === selectedSize)) ||
      (!variantType && !selectedSize))
    );
  }, [mergedVariants, selectedColor, selectedSize, variantType]);

  const displayQuantity = activeVariant?.quantity ?? product?.quantity ?? 1;
  const displaySku = activeVariant?.sku ?? product?.sku ?? "N/A";
  const images = product?.images || [];

  // EFFECTS
  useEffect(() => {
    if (mergedVariants[0]?.color) {
      setSelectedColor(mergedVariants[0].color)
    }
  }, [mergedVariants])

  useEffect(() => {
    setSelectedSize(colorVariants[0]?.size ?? null);
    setSelectedQuantity(1);
  }, [colorVariants]);

  // ← NEW: fire the one-time swipe hint once the product has loaded,
  // only if there's more than one image and the user hasn't seen it before.
  useEffect(() => {
    if (!product) return;
    if ((product.images?.length || 0) <= 1) return;
    if (typeof window === "undefined") return;

    const seen = localStorage.getItem(SWIPE_HINT_KEY);
    if (seen) return;

    const nudgeOut = setTimeout(() => setHintOffset(-28), 700);
    const nudgeBack = setTimeout(() => setHintOffset(0), 1000);
    const markSeen = setTimeout(() => {
      localStorage.setItem(SWIPE_HINT_KEY, "1");
    }, 1300);

    return () => {
      clearTimeout(nudgeOut);
      clearTimeout(nudgeBack);
      clearTimeout(markSeen);
    };
  }, [product]);

  // HANDLERS
  const handleQuantityChange = (type) => {
    if (type === "plus" && selectedQuantity < displayQuantity) {
      setSelectedQuantity(prev => prev + 1);
    } else if (type === "minus" && selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedQuantity(1);

    const matchIdx = images.findIndex(
      img => img.color?.toLowerCase() === color?.toLowerCase()
    );
    if (matchIdx !== -1) setCurrentIndex(matchIdx);
  };

  const handleVariantSelect = (value) => {
    setSelectedSize(value);
    setSelectedQuantity(1);
  };

  // ← REPLACED: live drag tracking instead of measure-only-at-the-end.
  // Works for both the inline carousel and the full-screen viewer since
  // they share the same currentIndex/dragOffset state.
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - touchStartXRef.current;
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    const ref = isViewerOpen ? viewerCarouselRef : carouselRef;
    const width = ref.current?.offsetWidth || 1;
    const threshold = width * 0.2; // swipe past 20% of the screen to change image

    if (dragOffset < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    setDragOffset(0);
    setIsDragging(false);
  };

  if (isLoading) return <Spinner/>
  if (isError || !product) return <p className="flex items-center justify-center mt-70">Product not found</p>;

  const formatPrice = (price) => new Intl.NumberFormat("en-NG").format(price || 0);
  const isOutOfStock = displayQuantity === 0;

  // Combined horizontal offset: drag (while touching) or hint (one-time nudge)
  const trackOffset = dragOffset + hintOffset;
  const trackTransition = isDragging ? "" : "transition-transform duration-300 ease-out";

  return (
    <div className="w-full">

      {/* Sticky mini header */}
      <div
        className={`fixed top-0 left-0 w-full z-40 bg-white border-b border-black/10 px-4 transition-transform duration-300 ${
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "48px" }}
      >
        <div className="flex items-center justify-between h-full">
          <p className="text-[16px] font-inter font-semibold text-black truncate max-w-[70%]">
            {product?.sellerId?.brandName || "Brand"}
          </p>
          <Link href="/cart" className="relative">
            <ShoppingCart size={24} className="text-black" />
            {totalQuantity > 0 && (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: "-4px", right: "-6px",
                  width: "18px", height: "14px",
                  borderRadius: "8px",
                  backgroundColor: "#005770",
                  color: "#ffffff",
                  fontSize: "8px",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                {totalQuantity}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Image Carousel — tap to open full viewer */}
      <div
        className="relative py-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={carouselRef}
      >
        <div
          className={`flex ${trackTransition}`}
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${trackOffset}px))` }}
        >
          {images.length > 0 ? (
            images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`product-image-${idx}`}
                onClick={() => setIsViewerOpen(true)}
                className="w-full h-[416px] object-cover flex-shrink-0 bg-[#f8f9fa] cursor-pointer"
              />
            ))
          ) : (
            <img src="/placeholder.png" alt="placeholder"
              className="w-full h-[416px] object-cover flex-shrink-0 bg-[#f8f9fa]" />
          )}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-[6px]">
            {images.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentIndex === idx ? "8px" : "6px",
                  height: currentIndex === idx ? "8px" : "6px",
                  backgroundColor: currentIndex === idx ? "#ffffff" : "rgba(0,0,0,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4">

        <p className="text-[12px] font-inter font-medium text-black/50 uppercase tracking-widest">
          {product?.sellerId?.brandName || "Brand"}
        </p>
        <div className="flex flex-col gap-[16px]">
          <p className="text-[16px] font-inter font-semibold text-black leading-snug">
            {product.productName}
          </p>
          <p className="text-[14px] font-inter text-black leading-snug">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <p className="text-[16px] font-inter font-semibold text-black">
              ₦{formatPrice(activeVariant?.price ?? product.price)}
            </p>
          </div>
        </div>

        {allColors.length > 0 && (
        <div className="mt-4">
          <h3 className="font-[Montserrat] font-semibold text-[16px] text-black mb-3">Color</h3>
          <div className="flex flex-wrap gap-4">
            {allColors.map((color, idx) => {
              const isSelected = selectedColor?.toLowerCase() === color.toLowerCase()
              return (
                <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => handleColorSelect(color)}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: isSelected ? "1.5px solid black" : "1.5px solid transparent",
                    padding: "2.5px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      backgroundColor: colorMap[color.toLowerCase()] || color,
                      width: "100%", height: "100%", borderRadius: "50%",
                    }} />
                  </div>
                  <span className="text-[12px] font-[Inter] text-black">{color}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

        {variantType && colorVariants.some(v => v[variantType]) && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-[Montserrat] font-semibold text-[16px] text-black">
                {variantType === "size" ? "Size" :
                 variantType === "measurement" ? "Measurement" : "Spec"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {colorVariants.map((variant, idx) => {
                const value = variantType === "size" ? variant.size :
                              variantType === "measurement" ? variant.measurement :
                              variant.memory ?? variant.ram;
                return (
                  <button
                    key={idx}
                    onClick={() => handleVariantSelect(value)}
                    className={`px-4 py-1 rounded-[24px] border text-[14px] font-inter font-medium
                      ${selectedSize === value
                        ? "border-black border-[1px]"
                        : "border-black/50 border-[0.5px]"}`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 items-center">
            <p className="text-[16px] font-medium font-inter text-black">Qty</p>
            <div className="w-[80px] h-[24px] flex border border-black/30 rounded-[4px] overflow-hidden">
              <button
                onClick={() => handleQuantityChange("minus")}
                className="w-[24px] h-full bg-[#EEEEEE] flex items-center justify-center"
              >
                <span className="text-[16px] font-medium text-black/50">-</span>
              </button>
              <div className="flex-1 h-full flex items-center justify-center">
                <span className="text-[14px] font-medium text-black">{selectedQuantity}</span>
              </div>
              <button
                onClick={() => handleQuantityChange("plus")}
                className="w-[24px] h-full bg-[#EEEEEE] flex items-center justify-center"
              >
                <span className="text-[16px] font-medium text-black/50">+</span>
              </button>
            </div>
          </div>
          {isOutOfStock ? (
            <span className="text-[12px] font-inter font-semibold text-red-500">
              Out of stock
            </span>
          ) : (
            <p className="text-[12px] font-inter text-black/50">{displayQuantity} available</p>
          )}
        </div>
      </div>

      <div className="mt-4 w-full h-[4px] bg-[#EEEEEE]" />

        <div className="px-4 mt-4">
          <button
            onClick={() => setModal("shipping")}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <img src="/truck-green.svg" alt="Delivery Icon" className="w-4 h-4" />
              <span className="text-[14px] font-inter font-normal text-[#005770]">
                Abuja orders arrive within 24 hours
              </span>
            </div>
            <ChevronRight size={13} color="#005770" />
          </button>

          <p className="mt-[22px] text-[14px] font-inter font-medium text-black">
            Shipping fee:{" "}
            <span className="font-normal text-black/50">Calculated at checkout</span>
          </p>

          <p className="mt-2 text-[14px] font-inter font-medium text-black">
            Courier company:{" "}
            <span className="font-normal text-black/50">Bolt</span>
          </p>
        </div>

        <div className="mt-4 w-full h-[4px] bg-[#EEEEEE]" />

      {/* ADD TO CART SECTION — z-index bumped so it stays above the full-screen viewer */}
      <AddToCartButton
        product={product}
        Originalprice={activeVariant?.price ?? product.price}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedQuantity={selectedQuantity}
        onQuantitySync={setSelectedQuantity}
        displaySku={displaySku}
        displayQuantity={displayQuantity}
        onSuccess={() => alert("Added to cart successfully!")}
        isOutOfStock={isOutOfStock}
      />

      {modal === "shipping" && (
        <InfoModal title="Delivery info" onClose={() => setModal(null)}>
          <p className="text-[13px] font-inter text-black mb-3">
            Malltiply currently delivers within Abuja.
          </p>
          <p className="text-[13px] font-inter text-black mb-3">
            Delivery is typically within 24 hours for Abuja orders. Processing time may vary slightly depending on the seller.
          </p>
          <p className="text-[13px] font-inter text-black">
            You can track your order until it reaches your destination.
          </p>
        </InfoModal>
      )}

      {/* ← NEW: Full-screen image viewer with blurred backdrop */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-[900] bg-black/85 backdrop-blur-xl flex flex-col">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsViewerOpen(false)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X size={20} color="#ffffff" />
            </button>
          </div>

          {/* Same swipe/drag logic, same currentIndex — stays in sync with the inline carousel */}
          <div
            className="relative flex-1 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={viewerCarouselRef}
          >
            <div
              className={`flex h-full ${trackTransition}`}
              style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${trackOffset}px))` }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`product-image-full-${idx}`}
                  className="w-full h-full object-contain flex-shrink-0"
                />
              ))}
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-[6px]">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentIndex === idx ? "8px" : "6px",
                      height: currentIndex === idx ? "8px" : "6px",
                      backgroundColor: currentIndex === idx ? "#ffffff" : "rgba(255,255,255,0.4)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Spacer so the fixed AddToCartButton bar doesn't cover the last bit of image */}
          <div className="h-[64px]" />
        </div>
      )}

    </div>
  );
}

const colorMap = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#2E2B77",
  brown: "#8B4513",
  red: "#2e0b12",
  green: "#008000",
  silver: "#C0C0C0",
  maroon: "#5C2B2E",
  blush: "#ecb6b4",
  gold: "#D4AF37",
  yellow: "#d5ce98",
  mint: "#d4dbd7",
  terracotta: "#dc8866",
  gray: "#a8a9a1",
  steel: "#3F7895",
  cream: "#e5dccb",
  teal: "#031D1A",
  "cadet blue": "#99AFBA",
  peach: "#dfa790",
  "tale blue": "#052635",
  purple: "#3D1C2E",
  ash: "#8A847B",
  "ash gray": "#bbb6b2",
  "army green": "#485744",
  beige: "#D3C1A9",
  khaki: "#817658",
  "off white": "#D4CFC9",
  "man u": "#c41e22",
  "man city": "#73a3d3",
  arsenal: "#d82b27",
  barca: "#567efa",
}