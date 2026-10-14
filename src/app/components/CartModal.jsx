"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCart, clearModalProduct } from "@/redux/slices/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import colorMap from "@/lib/data/colorMap";

const getVariantSize = (v) => v?.size || v?.measurement || v?.memory || v?.ram || null;

export default function CartModal({
  product: propProduct,
  selectedColor: propColor,
  selectedSize: propSize,
  selectedQuantity: propQuantity,
  displayPrice: propPrice,
  Originalprice: propOriginalPrice,
  displaySku: propSku,
  displayQuantity: propQuantityAvailable,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  isOutOfStock: propOutOfStock,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isCartOpen, modalProduct } = useSelector((state) => state.cart);

  // Cache so the sheet has data during exit animation
  const [cachedProduct, setCachedProduct] = useState(null);

  useEffect(() => {
    const lock = isCartOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isCartOpen]);

  useEffect(() => {
    if (modalProduct) setCachedProduct(modalProduct);
  }, [modalProduct]);

  const product = propProduct || modalProduct || cachedProduct;

  // Local state for variant selections
  const [internalColor, setInternalColor] = useState(null);
  const [internalSize, setInternalSize] = useState(null);
  const [internalQuantity, setInternalQuantity] = useState(1);

  // Merge product.variants (base) and product.variantColumns (extra)
  const mergedVariants = useMemo(() => {
    if (!product) return [];
    const rawVariants = product.variants;
    const baseVariants = (
      Array.isArray(rawVariants)
        ? rawVariants
        : rawVariants && typeof rawVariants === "object"
        ? [rawVariants]
        : []
    )
      .filter((v) => v && (v.color || v.size || v.measurement || v.memory || v.ram))
      .map((v) => ({
        ...v,
        price: v.price ?? product.price,
        sku: v.sku ?? product.sku,
        quantity: v.quantity ?? product.quantity,
      }));

    const extraVariants = (Array.isArray(product.variantColumns) ? product.variantColumns : []).map(
      (v) => ({
        ...v,
        price: v.price ?? product.price,
        sku: v.sku ?? product.sku,
        quantity: v.quantity ?? product.quantity,
      })
    );

    return [...baseVariants, ...extraVariants];
  }, [product]);

  const allColors = useMemo(() => {
    const colors = mergedVariants.map((v) => v.color).filter(Boolean);
    return [...new Set(colors)];
  }, [mergedVariants]);

  const lastInitializedId = useRef(null);

  useEffect(() => {
    if (product?._id && isCartOpen && lastInitializedId.current !== product._id) {
      lastInitializedId.current = product._id;

      if (!propColor) {
        const defaultColor = allColors[0] || null;
        setInternalColor(defaultColor);

        const matchingVariants = defaultColor
          ? mergedVariants.filter((v) => v.color?.toLowerCase() === defaultColor.toLowerCase())
          : mergedVariants;

        const defaultSize = getVariantSize(matchingVariants[0]) || null;
        setInternalSize(defaultSize);
        setInternalQuantity(1);
      }
    }
  }, [product?._id, isCartOpen, allColors, mergedVariants, propColor]);

  const activeColor = propColor !== undefined ? propColor : internalColor;
  const activeSize = propSize !== undefined ? propSize : internalSize;
  const activeQuantity = propQuantity !== undefined ? propQuantity : internalQuantity;

  const availableSizes = useMemo(() => {
    const forColor = mergedVariants
      .filter((v) => !activeColor || v.color?.toLowerCase() === activeColor?.toLowerCase())
      .map(getVariantSize)
      .filter(Boolean);

    if (forColor.length > 0) return [...new Set(forColor)];

    const all = mergedVariants.map(getVariantSize).filter(Boolean);
    return [...new Set(all)];
  }, [mergedVariants, activeColor]);

  const handleColorClick = (color) => {
    if (onColorChange) {
      onColorChange(color);
    } else {
      setInternalColor(color);
      const sizesForNewColor = mergedVariants
        .filter((v) => v.color?.toLowerCase() === color.toLowerCase())
        .map(getVariantSize)
        .filter(Boolean);

      if (sizesForNewColor.length > 0 && !sizesForNewColor.includes(internalSize)) {
        setInternalSize(sizesForNewColor[0]);
      }
      setInternalQuantity(1);
    }
  };

  const handleSizeClick = (size) => {
    if (onSizeChange) {
      onSizeChange(size);
    } else {
      setInternalSize(size);
      setInternalQuantity(1);
    }
  };

  const selectedVariant = useMemo(() => {
    return (
      mergedVariants.find(
        (v) =>
          (!activeColor || v.color?.toLowerCase() === activeColor?.toLowerCase()) &&
          (!activeSize || getVariantSize(v) === activeSize)
      ) || null
    );
  }, [mergedVariants, activeColor, activeSize]);

  const activeImage = useMemo(() => {
    const images = product?.images || [];
    if (images.length === 0) return null;
    const tagged = activeColor
      ? images.find((img) => img.color?.toLowerCase() === activeColor.toLowerCase())
      : null;
    return (tagged || images[0]).url;
  }, [product, activeColor]);

  const currentMaxQuantity =
    propQuantityAvailable !== undefined
      ? propQuantityAvailable
      : selectedVariant?.quantity ?? product?.quantity ?? 0;

  const isOutOfStock =
    propOutOfStock !== undefined
      ? propOutOfStock
      : currentMaxQuantity <= 0;

  const currentPrice =
    propPrice !== undefined
      ? propPrice
      : selectedVariant?.price ?? product?.price ?? 0;

  const currentSku =
    propSku !== undefined
      ? propSku
      : selectedVariant?.sku || product?.sku || "N/A";

  const formatPrice = (price) => new Intl.NumberFormat("en-NG").format(price || 0);

  const handleExitComplete = () => {
    if (!isCartOpen) {
      setCachedProduct(null);
      lastInitializedId.current = null;
      dispatch(clearModalProduct());
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isCartOpen && product && (
        <>
          <motion.div
            key="cart-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/30 z-50"
          />

          <motion.div
            key="cart-modal-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] z-[55] max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#F8F9FA] border-b border-black/10 flex items-center justify-center px-4 h-[56px] rounded-t-[16px] z-10">
              <h2 className="text-[16px] font-inter font-medium text-black">
                Select Options
              </h2>
            </div>

            {/* Content */}
            <div className="px-4 py-5">
              {/* Product Image & Info */}
              <div className="flex gap-4 mb-5">
                <div className="w-[100px] h-[100px] bg-[#f8f9fa] rounded-[12px] overflow-hidden flex-shrink-0 flex items-center justify-center border border-black/5">
                  {activeImage ? (
                    <img
                      key={activeImage}
                      src={activeImage}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-opacity duration-200"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">No image</div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-[15px] font-inter font-semibold text-black leading-snug line-clamp-2 mb-1">
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] font-inter font-semibold text-black">
                      ₦{formatPrice(currentPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-[1px] bg-black/10 mb-5" />

              {/* Color Selector */}
              {allColors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-montserrat font-semibold text-[13px] text-black">
                      Color
                    </h4>
                    {activeColor && (
                      <span className="text-[12px] font-inter text-black/70 capitalize font-medium">
                        {activeColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {allColors.map((color, idx) => {
                      const isSelected = activeColor?.toLowerCase() === color?.toLowerCase();
                      const colorHex = colorMap[color.toLowerCase()] || color.toLowerCase();
                      const isLight =
                        color.toLowerCase() === "white" ||
                        color.toLowerCase() === "off white" ||
                        color.toLowerCase() === "cream";

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleColorClick(color)}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                          title={color}
                        >
                          <div
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              border: isSelected ? "1.5px solid black" : "1.5px solid transparent",
                              padding: "2.5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: colorHex,
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                boxShadow: isLight ? "inset 0 0 0 1px rgba(0,0,0,0.15)" : "none",
                              }}
                            />
                          </div>
                          <span
                            className={`text-[12px] font-inter capitalize max-w-[65px] text-center leading-tight truncate ${
                              isSelected ? "text-black font-semibold" : "text-black/60 font-medium"
                            }`}
                          >
                            {color}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size / Spec Selector */}
              {availableSizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-montserrat font-semibold text-[13px] text-black">
                      Size
                    </h4>
                    {activeSize && (
                      <span className="text-[12px] font-inter text-black/70 font-medium">
                        {activeSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size, idx) => {
                      const isSelected = activeSize === size;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSizeClick(size)}
                          className={`px-4 py-1.5 rounded-[24px] border text-[14px] font-inter font-medium transition cursor-pointer ${
                            isSelected
                              ? "border-black border-[1px] text-black bg-transparent"
                              : "border-black/50 border-[0.5px] text-black/80 hover:border-black bg-transparent"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to Cart — handles its own quantity, toast, bubble, and Go-to-cart state */}
              <div className="mb-3">
                <AddToCartButton
                  product={product}
                  Originalprice={currentPrice}
                  displayPrice={currentPrice}
                  selectedColor={activeColor}
                  selectedSize={activeSize}
                  selectedQuantity={activeQuantity}
                  onQuantitySync={(q) => {
                    if (propQuantity === undefined) setInternalQuantity(q);
                  }}
                  displaySku={currentSku}
                  displayQuantity={currentMaxQuantity}
                  isOutOfStock={isOutOfStock}
                />
              </div>

              {/* View Full Details */}
              <button
                type="button"
                onClick={() => {
                  dispatch(closeCart());
                  if (product.slug) router.push(`/product/${product.slug}`);
                }}
                className="w-full text-[13px] font-inter font-medium text-black/60 hover:text-black transition cursor-pointer"
              >
                View Full Details →
              </button>
            </div>

            {/* Spacer so the fixed AddToCartButton bar doesn't cover content */}
            <div className="h-[80px]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}