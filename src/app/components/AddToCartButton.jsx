"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity, removeItem } from "@/redux/slices/cartSlice";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import productCategoryMap from "@/lib/data/productCategoryMap";
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "@/redux/services/cartApi";
import { useMeQuery } from "@/redux/services/authApi";
import Toast from "./Toast";

export default function AddToCartButton({
  product,
  displayPrice,
  Originalprice,
  selectedColor,
  selectedSize,
  selectedQuantity,
  onQuantitySync,
  displaySku,
  isOutOfStock
}) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [bubble, setBubble] = useState(null);
  const { data: me } = useMeQuery()
  const user = me?.user

  // API hooks
  const [addToCartApi] = useAddToCartMutation();
  const [updateCartApi] = useUpdateCartItemMutation();
  const [removeCartApi] = useRemoveCartItemMutation();

  const [toast, setToast] = useState({ show: false, message: "" });

  function triggerToast(msg) {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 1500);
  }

  // ✅ Detect existing variant in cart
  const currentItem =
    cart?.items?.find(
      (i) =>
        i.productId === product._id &&
        i.color === selectedColor &&
        i.size === selectedSize
    ) || null;

  // ✅ Internal state
  const [isInCart, setIsInCart] = useState(false);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => setClientReady(true), []);

  // ✅ Only sync with cart, not product details
  useEffect(() => {
    setIsInCart(!!currentItem);
  }, [currentItem, cart?.items]);

  // ✅ Notify details page only when quantity changes
  useEffect(() => {
    if (currentItem && onQuantitySync) {
      onQuantitySync(currentItem.quantity);
    }
  }, [currentItem?.quantity]);

  // 🛒 Add to cart
  const handleAddToCart = async (e) => {

    if (isOutOfStock || product.quantity === 0) {
      alert("This item is out of stock.");
      return;
    }

    const categoryConfig = productCategoryMap[product.category];
    const variants = categoryConfig?.variants || {};

    const requiresColor = variants.colors === true;
    const requiresSize =
      variants.sizes ||
      variants.measurement ||
      variants.memory ||
      variants.ram;

    if (requiresColor && !selectedColor) {
      alert("Please select a color first.");
      return;
    }
    if (requiresSize && !selectedSize) {
      alert("Please select a size/spec first.");
      return;
    }

    // 🎈 Bubble animation trigger
    const rect = e.currentTarget.getBoundingClientRect();
    setBubble({
      x: rect.left + rect.width / 2,
      y: rect.top,
      quantity: selectedQuantity,
      key: Date.now(),
    });

    const item = {
      productId: product._id,
      name: product.productName,
      price: Originalprice,
      discountedPrice: displayPrice,
      image: product.images?.[0]?.url,
      color: selectedColor,
      size: selectedSize,
      quantity: selectedQuantity,
      sku: displaySku
    };

    // Add to redux + backend
    dispatch(addToCart(item));
    triggerToast("Item added to cart ✔");
    // Only sync to backend if signed in
    if (user) {
      try {
        await addToCartApi(item).unwrap()
      } catch (err) {
        console.error("Backend addToCart failed:", err)
      }
    }

    setIsInCart(true);
  };

  // ➕ / ➖ quantity handler
  const handleQuantityChange = async (type) => {
    if (!currentItem) return;

    const maxQuantity = product?.quantity ?? 1;
    let newQuantity =
      type === "plus"
        ? currentItem.quantity + 1
        : currentItem.quantity - 1;

    // Prevent invalid values
    if (newQuantity <= 0) {
      triggerToast("Item removed from cart ❌");
      // Remove from cart
      dispatch(
        removeItem({
          productId: currentItem.productId,
          color: currentItem.color,
          size: currentItem.size,
        })
      );

      if (user) {
        try {
          await removeCartApi(currentItem.productId).unwrap();
        } catch (err) {
          console.error("Failed to remove from backend", err);
        }
      }

      if (onQuantitySync) onQuantitySync(1);
      setIsInCart(false);
      return;
    }

    if (newQuantity > maxQuantity) {
      alert(`Only ${maxQuantity} items available.`);
      return;
    }

    // Update quantity both locally + backend
    dispatch(
      updateQuantity({
        productId: currentItem.productId,
        color: currentItem.color,
        size: currentItem.size,
        quantity: newQuantity,
      })
    );

    try {
      await updateCartApi({
        productId: currentItem.productId,
        quantity: newQuantity,
      }).unwrap();
    } catch (err) {
      console.error("Backend update failed:", err);
    }

    setIsInCart(true);
    if (onQuantitySync) onQuantitySync(newQuantity);
  };

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      {/* 🎈 Bubble Animation */}
      {clientReady &&
        createPortal(
          <AnimatePresence>
            {bubble && (
              <motion.div
                key={bubble.key}
                initial={{
                  x: bubble.x,
                  y: bubble.y,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: window.innerWidth - 60,
                  y: window.innerHeight - 120,
                  scale: 0.4,
                  opacity: 0.7,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                onAnimationComplete={() => setBubble(null)}
                className="fixed z-40 flex items-center justify-center w-6 h-6 rounded-full bg-[#005770] text-white text-[10px] font-bold pointer-events-none"
              >
                {bubble.quantity}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Bottom Add/Cart Control */}
      <div className="fixed bottom-0 left-0 w-full h-[64px] px-4 bg-white border-t border-black/10 flex justify-center items-center z-40">
        <AnimatePresence mode="wait">
          {!isInCart ? (
            <motion.button
              key="add"
              onClick={handleAddToCart}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="w-full h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[24px] flex flex-col items-center justify-center shadow-lg"
            >
              <span>Add to cart</span>
            </motion.button>
          ) : (
            <motion.div
              key="inCart"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="flex justify-center gap-4 w-full"
            >
              <div className="flex items-center border border-black/30 rounded-[4px] overflow-hidden h-[48px] ">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="w-[36px] h-full bg-[#EEEEEE] text-[22px] text-black/70"
                >
                  -
                </button>
                <div className="px-3 text-[16px] font-semibold text-black">
                  {currentItem?.quantity ?? selectedQuantity ?? 1}
                </div>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="w-[36px] h-full bg-[#EEEEEE] text-[22px] text-black/70"
                >
                  +
                </button>
              </div>

              <motion.a
                href="/cart"
                className="px-6 h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[20px] flex items-center justify-center gap-2 shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                Go to cart
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}