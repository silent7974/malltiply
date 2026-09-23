"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCart, addToCart, clearModalProduct } from "@/redux/slices/cartSlice";
import { useAddToCartMutation } from "@/redux/services/cartApi";
import { useMeQuery } from "@/redux/services/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import productCategoryMap from "@/lib/data/productCategoryMap";

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
  mint: "#d4dbd7",
  terracotta: "#dc8866",
  gray: "#a8a9a1",
  grey: "#a8a9a1",
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
  yellow: "#EAB308",
  orange: "#F97316",
  pink: "#EC4899",
  navy: "#000080"
};

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
  children
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isCartOpen, modalProduct } = useSelector((state) => state.cart);
  const { data: me } = useMeQuery();
  const user = me?.user;
  const [addToCartApi] = useAddToCartMutation();

  // Keep a cached product so that when isCartOpen becomes false,
  // the component still has product data to render the exit animation smoothly!
  const [cachedProduct, setCachedProduct] = useState(null);

  useEffect(() => {
    if (modalProduct) {
      setCachedProduct(modalProduct);
    }
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

  // Distinct colors across all variants
  const allColors = useMemo(() => {
    const colors = mergedVariants.map((v) => v.color).filter(Boolean);
    return [...new Set(colors)];
  }, [mergedVariants]);

  // Track the last initialized product ID to avoid resetting selections on re-renders
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

  // Active color and size (prop takes priority if controlled, else internal)
  const activeColor = propColor !== undefined ? propColor : internalColor;
  const activeSize = propSize !== undefined ? propSize : internalSize;
  const activeQuantity = propQuantity !== undefined ? propQuantity : internalQuantity;

  // Available sizes for the selected color
  const availableSizes = useMemo(() => {
    const forColor = mergedVariants
      .filter((v) => !activeColor || v.color?.toLowerCase() === activeColor?.toLowerCase())
      .map(getVariantSize)
      .filter(Boolean);

    if (forColor.length > 0) {
      return [...new Set(forColor)];
    }

    // Fallback: all sizes across all variants
    const all = mergedVariants.map(getVariantSize).filter(Boolean);
    return [...new Set(all)];
  }, [mergedVariants, activeColor]);

  // Handle color change
  const handleColorClick = (color) => {
    if (onColorChange) {
      onColorChange(color);
    } else {
      setInternalColor(color);

      // Check if current selected size exists under this new color
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

  // Handle size change
  const handleSizeClick = (size) => {
    if (onSizeChange) {
      onSizeChange(size);
    } else {
      setInternalSize(size);
      setInternalQuantity(1);
    }
  };

  // Handle quantity change
  const handleQtyClick = (type) => {
    if (onQuantityChange) {
      onQuantityChange(type);
    } else {
      if (type === "plus" && internalQuantity < currentMaxQuantity) {
        setInternalQuantity((q) => q + 1);
      } else if (type === "minus" && internalQuantity > 1) {
        setInternalQuantity((q) => q - 1);
      }
    }
  };

  // Find exact active variant
  const selectedVariant = useMemo(() => {
    return (
      mergedVariants.find(
        (v) =>
          (!activeColor || v.color?.toLowerCase() === activeColor?.toLowerCase()) &&
          (!activeSize || getVariantSize(v) === activeSize)
      ) || null
    );
  }, [mergedVariants, activeColor, activeSize]);

  // Active image matching selected color
  const activeImage = useMemo(() => {
    if (!product?.images?.length) return null;
    if (!activeColor) return product.images[0]?.url;

    // 1. Variant specific image
    if (selectedVariant?.image?.url) return selectedVariant.image.url;
    if (selectedVariant?.imageUrl) return selectedVariant.imageUrl;

    // 2. Image url matching color name
    const matchByUrl = product.images.find((img) =>
      img.url?.toLowerCase().includes(activeColor.toLowerCase())
    );
    if (matchByUrl?.url) return matchByUrl.url;

    // 3. Match by index of color in allColors
    const colorIdx = allColors.findIndex(
      (c) => c.toLowerCase() === activeColor.toLowerCase()
    );
    if (colorIdx !== -1 && product.images[colorIdx]?.url) {
      return product.images[colorIdx].url;
    }

    return product.images[0]?.url;
  }, [product, activeColor, selectedVariant, allColors]);

  const currentMaxQuantity =
    propQuantityAvailable !== undefined
      ? propQuantityAvailable
      : selectedVariant?.quantity ?? product?.quantity ?? 10;

  const isOutOfStock =
    propOutOfStock !== undefined
      ? propOutOfStock
      : currentMaxQuantity <= 0;

  const currentPrice =
    propPrice !== undefined
      ? propPrice
      : selectedVariant?.price ?? product?.price ?? 0;

  const currentOriginalPrice =
    propOriginalPrice !== undefined
      ? propOriginalPrice
      : product?.price ?? currentPrice;

  const currentSku =
    propSku !== undefined
      ? propSku
      : selectedVariant?.sku || product?.sku || "N/A";

  const formatPrice = (price) => new Intl.NumberFormat("en-NG").format(price || 0);

  const handleAddToCart = async () => {
    if (!product) return;
    if (isOutOfStock) {
      alert("This item is out of stock.");
      return;
    }

    const categoryConfig = productCategoryMap[product.category];
    const categoryVariants = categoryConfig?.variants || {};

    if (categoryVariants.colors === true && !activeColor && allColors.length > 0) {
      alert("Please select a color first.");
      return;
    }

    const requiresSize =
      categoryVariants.sizes ||
      categoryVariants.measurement ||
      categoryVariants.memory ||
      categoryVariants.ram;

    if (requiresSize && !activeSize && availableSizes.length > 0) {
      alert("Please select a size first.");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.productName,
      price: currentOriginalPrice,
      discountedPrice: currentPrice,
      image: activeImage || product.images?.[0]?.url,
      color: activeColor,
      size: activeSize,
      quantity: activeQuantity,
      sku: currentSku,
      quantityAvailable: currentMaxQuantity,
    };

    dispatch(addToCart(cartItem));

    if (user) {
      try {
        await addToCartApi(cartItem).unwrap();
      } catch (err) {
        console.error("Backend addToCart failed:", err);
      }
    }

    // Trigger smooth slide-down exit
    dispatch(closeCart());
  };

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
          {/* Backdrop Overlay - smooth fade in and out */}
          <motion.div
            key="cart-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/30 z-50"
          />

          {/* Bottom Sheet Modal - smooth slide up and down in reverse */}
          <motion.div
            key="cart-modal-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] z-[55] max-h-[85vh] overflow-y-auto scrollbar-hide shadow-2xl"
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-[#F8F9FA] border-b border-black/10 flex items-center justify-between px-4 h-[56px] rounded-t-[16px] z-10">
              <h2 className="text-[16px] font-inter font-medium text-black">
                Select Options
              </h2>
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="p-1 hover:bg-black/5 rounded-full transition cursor-pointer"
                title="Close"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 py-5">
              {/* Product Image & Info Row */}
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
                  <p className="text-[11px] font-inter font-medium text-black/50 uppercase tracking-widest mb-1">
                    {product.sellerId?.brandName || "Brand"}
                  </p>
                  <h3 className="text-[15px] font-inter font-semibold text-black leading-snug line-clamp-2 mb-1">
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] font-inter font-semibold text-black">
                      ₦{formatPrice(currentPrice)}
                    </p>
                    {currentPrice !== currentOriginalPrice && (
                      <p className="text-[13px] font-inter text-black/50 line-through">
                        ₦{formatPrice(currentOriginalPrice)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
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
                      const isLight = color.toLowerCase() === "white" || color.toLowerCase() === "off white" || color.toLowerCase() === "cream";

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
                      Size / Spec
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

              {/* Quantity & Stock Info */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <p className="text-[13px] font-inter font-medium text-black">Quantity</p>
                  <div className="flex border border-black/30 rounded-[6px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleQtyClick("minus")}
                      disabled={activeQuantity <= 1}
                      className="w-[34px] h-[34px] bg-[#EEEEEE] flex items-center justify-center text-black/70 hover:bg-black/10 disabled:opacity-40 transition cursor-pointer"
                    >
                      -
                    </button>
                    <div className="w-[38px] h-[34px] flex items-center justify-center text-[14px] font-semibold text-black bg-white">
                      {activeQuantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQtyClick("plus")}
                      disabled={activeQuantity >= currentMaxQuantity}
                      className="w-[34px] h-[34px] bg-[#EEEEEE] flex items-center justify-center text-black/70 hover:bg-black/10 disabled:opacity-40 transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  {isOutOfStock ? (
                    <p className="text-[12px] font-inter font-semibold text-red-500">
                      Out of stock
                    </p>
                  ) : (
                    <p className="text-[12px] font-inter text-black/50">
                      {currentMaxQuantity} available
                    </p>
                  )}
                </div>
              </div>

              {/* SKU */}
              {currentSku && currentSku !== "N/A" && (
                <p className="text-[11px] font-inter text-black/40 mb-5">
                  SKU: {currentSku}
                </p>
              )}

              {/* Add to Cart Button */}
              <div className="mb-3">
                {children ? (
                  children
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[17px] flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#004560] transition cursor-pointer"
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : `Add to Cart • ₦${formatPrice(currentPrice * activeQuantity)}`}
                  </button>
                )}
              </div>

              {/* Alternative: Go to Full Page */}
              <button
                type="button"
                onClick={() => {
                  dispatch(closeCart());
                  if (product.slug) {
                    router.push(`/product/${product.slug}`);
                  }
                }}
                className="w-full py-2.5 text-[13px] font-inter font-medium text-black/60 hover:text-black transition cursor-pointer"
              >
                View Full Details →
              </button>
            </div>

            {/* Bottom safe padding */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
