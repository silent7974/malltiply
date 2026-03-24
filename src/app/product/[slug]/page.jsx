"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useGetProductBySlugQuery } from "@/redux/services/productApi";
import { ChevronDown, Upload, Ruler, ChevronRight } from "lucide-react";
import productCategoryMap from '@/lib/data/productCategoryMap';
import FloatingCart from "@/app/components/FloatingCart";
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useSelector } from "react-redux"
import AddToCartButton from "@/app/components/AddToCartButton";
import Spinner from "@/app/components/Spinner";
import { useParams } from "next/navigation";
import InfoModal from "@/app/components/InfoModal";

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

  const totalQuantity = useSelector(state => state.cart.totalQuantity)

  const carouselRef = useRef(null);

  // Add these to your existing state/refs
  const navbarRef = useRef(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  useEffect(() => {
    // Observe the main navbar
    const navbar = document.querySelector("nav") // targets your Navbar component
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
    rawVariants && typeof rawVariants === 'object' ? [rawVariants] : // ← handle object case
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
      (!variantType && !selectedSize)) // <- if no size/spec, match just by color
    );
  }, [mergedVariants, selectedColor, selectedSize, variantType]);

  // Make sure we always have correct display values
  const displayQuantity = activeVariant?.quantity ?? product?.quantity ?? 1;
  const displaySku = activeVariant?.sku ?? product?.sku ?? "N/A";

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
  };

  const handleVariantSelect = (value) => {
    setSelectedSize(value);
    setSelectedQuantity(1);
  };

  let startX = 0, endX = 0;
  const handleTouchStart = (e) => startX = e.touches[0].clientX;
  const handleTouchMove = (e) => endX = e.touches[0].clientX;
  const handleTouchEnd = () => {
    if (startX - endX > 50 && currentIndex < (product?.images?.length ?? 0) - 1) setCurrentIndex(prev => prev + 1);
    if (endX - startX > 50 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  if (isLoading) return <Spinner/>
  if (isError || !product) return <p className="flex items-center justify-center mt-70">Product not found</p>;

  const images = product.images || [];
  const formatPrice = (price) => new Intl.NumberFormat("en-NG").format(price || 0);

  const isOutOfStock = displayQuantity === 0;

  return (
    <div className="w-full">

      {/* Sticky mini header — appears when main Navbar scrolls out of view */}
      <div
        className={`fixed top-0 left-0 w-full z-40 bg-white border-b border-black/10 px-4 transition-transform duration-300 ${
          showStickyHeader ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ height: "48px" }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Product name — truncated */}
          <p className="text-[16px] font-inter font-semibold text-black truncate max-w-[70%]">
            {product?.sellerId?.brandName || "Brand"}
          </p>

          {/* Cart button */}
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
      {/* <FloatingCart /> */}
      {/* Image Carousel */}

      <div
        className="relative py-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={carouselRef}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.length > 0 ? (
            images.map((img, idx) => (
              <img key={idx} src={img.url} alt={`product-image-${idx}`}
                className="w-full h-[393px] object-cover flex-shrink-0" />
            ))
          ) : (
            <img src="/placeholder.png" alt="placeholder"
              className="w-full h-[393px] object-cover flex-shrink-0" />
          )}
        </div>

        {/* Upload icon */}
        {/* <div className="absolute top-6 right-2 w-8 h-8 flex items-center justify-center bg-black/80 rounded-full cursor-pointer">
          <Upload size={14} color="#ffffff" />
        </div> */}

        {/* Image indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-[6px]">
            {images.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentIndex === idx ? "8px" : "6px",
                  height: currentIndex === idx ? "8px" : "6px",
                  backgroundColor: currentIndex === idx ? "#ffffff" : "rgba(255,255,255,0.5)",
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
        {/* Product name + description */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[16px] font-inter font-semibold text-black leading-snug">
            {product.productName}
          </p>
          <p className="text-[14px] font-inter text-black leading-snug">
            {product.description}
          </p>
        </div>

        {/* Prices */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <p className="text-[16px] font-inter font-semibold text-black">
              ₦{formatPrice(product.price)}
            </p>
          </div>
        </div>

        {/* Color Selector */}
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

        {/* Size / Measurement / Tech Spec Selector */}
        {variantType && colorVariants.some(v => v[variantType]) && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-[Montserrat] font-semibold text-[16px] text-black">
                {variantType === "size" ? "Size" :
                 variantType === "measurement" ? "Measurement" : "Spec"}
              </h3>
              {/* {variantType === "size" && (
                <button className="flex items-center justify-center gap-[4px] w-[108px] h-[24px] rounded-[16px] bg-[#EEEEEE] px-[8px]">
                  <Ruler size={14} className="text-black" />
                  <span className="text-[14px] font-inter text-black">Size Guide</span>
                </button>
              )} */}
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

        {/* Quantity */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 items-center">
            <p className="text-[16px] font-medium font-inter text-black">Qty</p>

            {/* Quantity Input */}
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
          {/* Low Stock Badge */}
            {/* {displayQuantity < 20 && (
              <div
                className="flex items-center justify-center"
                style={{
                  backgroundColor: "#005770",
                  width: "60px",
                  height: "24px",
                  borderRadius: "2px",
                }}
              >
                <span
                  className="font-inter font-bold text-white"
                  style={{ fontSize: "8px" }}
                >
                  {isOutOfStock ? "Out of stock" : `${displayQuantity} left`}
                </span>
              </div>
            )} */}
          <p>{displayQuantity} available</p>
        </div>
      </div>

      {/* DELIVERY & SHIPPING INFO */}
      <div className="mt-4 w-full h-[4px] bg-[#EEEEEE]" />

        <div className="px-4 mt-4">
          {/* Delivery within 24 hours */}
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

          {/* Shipping fee */}
          <p className="mt-[22px] text-[14px] font-inter font-medium text-black">
            Shipping fee:{" "}
            <span className="font-normal text-black/50">Calculated at checkout</span>
          </p>

          {/* Courier company */}
          <p className="mt-2 text-[14px] font-inter font-medium text-black">
            Courier company:{" "}
            <span className="font-normal text-black/50">GIG</span>
          </p>

          {/* Internal Separator */}
          {/* <div className="mt-4 border-t border-black/20" /> */}

          {/* Returns Section */}
          {/* <a href="/returns" className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <img src="/return-green.svg" alt="Returns Icon" className="w-6 h-6" />
              <span className="text-[16px] font-inter font-normal text-[#1A7709]">
                10-Day Returns
              </span>
            </div>
            <ChevronRight size={13} color="rgba(0,0,0,0.7)" />
          </a> */}
        </div>

        {/* External Separator */}
        <div className="mt-4 w-full h-[4px] bg-[#EEEEEE]" />

    

      {/* ADD TO CART SECTION */}
      <AddToCartButton
        product={product}
        Originalprice={product.price}
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

    </div>
  );
}

const colorMap = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#2E2B77",
  brown: "#8B4513",
  red: "#FF0000",
  green: "#008000",
  gold: "#CFAF5A",
  silver: "#C0C0C0",
  burgundy: "#5c2b2e",
};