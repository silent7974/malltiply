"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { EllipsisVertical, CircleAlert, Check, Circle, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import {
  useRemoveCartItemMutation,
  useClearCartMutation,
  useUpdateCartItemMutation,
} from "@/redux/services/cartApi";
import { removeItem, clearCart, updateQuantity } from "@/redux/slices/cartSlice";
import formatPrice from "@/lib/utils/formatPrice";
import productCategoryMap from "@/lib/data/productCategoryMap";
import AddNewAddress from "../components/AddNewAddress";
import CheckoutPage from "../components/CheckoutPage";
import { useMeQuery } from "@/redux/services/authApi";
import GuestAddressForm from "../components/GuestAddressForm";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [removeCartItemApi] = useRemoveCartItemMutation();
  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [clearCartApi] = useClearCartMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const { data: me } = useMeQuery()
  const user = me?.user

  const handleCheckout = () => {
    setShowAddressModal(true)
  }

  const totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

    function getProductId(item) {
      return typeof item.productId === "object"
        ? item.productId._id
        : item.productId;
    }

  const [showCheckoutPage, setShowCheckoutPage] = useState(false);


  const [selectedIds, setSelectedIds] = useState([]);
  const allSelected = selectedIds.length === cart.items.length && cart.items.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(cart.items.map((i) => i.productId._id || i.productId));
  };

  const toggleSelect = (id) => {
    const pid = id._id || id; // handle both object and string
    if (selectedIds.includes(pid)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== pid));
    } else {
      setSelectedIds([...selectedIds, pid]);
    }
  };


  const handleQuantityChange = async (item, type) => {
    const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
    const productId = item.productId._id || item.productId;

    if (newQuantity <= 0) {
      handleRemove(item);
      return;
    }

    // Always update Redux (works for both guests and signed-in users)
    dispatch(updateQuantity({ productId, color: item.color, size: item.size, quantity: newQuantity }));

    // Only sync to backend if signed in
    if (user) {
      try {
        await updateCartItemApi({ productId, quantity: newQuantity }).unwrap();
      } catch (err) {
        console.error("Failed to update quantity:", err);
        // Roll back only if backend fails for a signed-in user
        dispatch(updateQuantity({ productId, color: item.color, size: item.size, quantity: item.quantity }));
      }
    }
  };

  const handleRemove = async (item) => {
    // Normalize productId before dispatching
    dispatch(removeItem({
      productId: item.productId?._id || item.productId, // ← normalize here
      color: item.color,
      size: item.size,
    }))
    // Only call backend if user is logged in
    if (user) {
      try {
        await removeCartItemApi(item.productId._id || item.productId).unwrap()
      } catch (err) {
        console.error("Failed to remove item:", err)
      }
    }
  }


  const handleClearSelected = async () => {
    if (selectedIds.length === 0) return

    const itemsToClear = cart.items.filter((i) =>
      selectedIds.includes(i.productId._id || i.productId)
    )

    itemsToClear.forEach((item) =>
      dispatch(removeItem({
        productId: item.productId?._id || item.productId, // ← normalize
        color: item.color,
        size: item.size,
      }))
    )

    // Only hit backend if signed in
    if (user) {
      try {
        await Promise.all(
          itemsToClear.map((item) =>
            removeCartItemApi(item.productId._id || item.productId).unwrap()
          )
        )
      } catch (err) {
        console.error("Failed to clear selected items:", err)
      }
    }

    setSelectedIds([])
    setDropdownOpen(false)
  }

  return (
    <div className="px-4 py-4 min-h-screen bg-white relative pb-[140px]">
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        {/* Left - Select All */}
        <div className="flex items-center gap-1.5">
          <button onClick={toggleSelectAll} className="relative w-[14px] h-[14px] flex items-center justify-center">
            {allSelected ? (
              <Image 
                width={14} 
                height={14}
                src={"/selected-indicator.svg"}
                alt={"Selected Indicator"}
              />
            ) : (
              <Circle size={14} color="#000000" strokeWidth={0.5} />
            )}
          </button>
          <span className="text-[14px] font-inter text-black">All</span>
        </div>

        {/* Middle - Cart quantity */}
        <p className="text-[16px] font-inter font-medium text-black">
          Cart ({totalQuantity})
        </p>

        {/* Right - Options */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <EllipsisVertical size={20} color="#000000" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-[160px] bg-white border border-black/10 rounded-[8px] shadow-lg z-10"
              >
                <button
                  onClick={handleClearSelected}
                  className="w-full text-left px-4 py-2 text-[14px] text-black/80 hover:bg-gray-50"
                >
                  Clear selected cart
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-[14px] text-black/80 hover:bg-gray-50"
                >
                  Share cart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-center justify-between border border-black/20 rounded-[2px] p-2">
        <div className="flex items-center gap-1 text-[#005770]">
          <Check size={16} />
          <span className="text-[10px] font-inter font-medium">
            Prices are final, no hidden charges
          </span>
        </div>
        <p className="text-[10px] font-inter font-medium text-black/50">
          {cart.items.length === 0 ? "add item" : "almost done"}
        </p>
      </div>

      {/* Cart Items */}
      <div className="mt-3 flex flex-col gap-2">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center">
            <div className="w-[120px] h-[120px] flex items-center justify-center rounded-full bg-[#EEEEEE]">
              <ShoppingBasket
                size={70}
                strokeWidth={1}
                className="text-black/70"
              />
            </div>
            <p className="text-[16px] font-inter text-black/60 mt-3">
              No items yet
            </p>
            <a
              href="/"
              className="mt-4 bg-[#005770] text-white px-6 py-2 rounded-[30px] font-inter font-medium text-[14px] shadow-md hover:bg-[#004659] transition-all"
            >
              Go back to shop
            </a>
          </div>
        ) : (
          cart.items.map((item) => {
            const pid = item.productId._id || item.productId;
            const selected = selectedIds.includes(pid);
            const category = productCategoryMap[item.category] || {};
            const variantLine = (() => {
              const parts = [];
              if (item.color) parts.push(`Color: ${item.color}`);
              if (item.size) parts.push(`Label size: ${item.size}`);
              if (item.measurement) parts.push(`Measurement: ${item.measurement}`);
              return parts.join(" / ");
            })();

            return (
              <div
                key={`${getProductId(item)}-${item.color || "x"}-${item.size || "x"}`}
                className="flex items-start gap-2 pb-2"
              >

                {/* Select item */}
                <button onClick={() => toggleSelect(pid)} className="mt-2">
                  {selected ? (
                    <Image 
                      width={14} 
                      height={14}
                      alt={"Selected Indicator"}
                      src={"/selected-indicator.svg"}
                    />
                  ) : (
                    <Circle size={14} color="#000000" strokeWidth={0.5} />
                  )}
                </button>

                {/* Image */}
                <div className="relative w-[88px] h-[74px]">
                  <Image
                    src={item.image || "/placeholder.png"}
                    fill
                    alt={item.name}
                    className="object-cover rounded-[4px]"
                  />
                  {/* {item.quantity < 20 && (
                    <div className="absolute inset-x-[2px] bottom-[2px] bg-black/50 rounded-[47px] flex items-center justify-center px-1 py-[1px]">
                      <p className="text-[6px] text-white font-montserrat font-bold text-center break-words">
                        ALMOST SOLD OUT
                      </p>
                    </div>
                  )} */}
                </div>


                {/* Info */}
                <div className="flex-1 border-b border-black/20 pb-2">
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] text-black/50 font-montserrat">
                      {item.name}
                    </p>
                    <Image
                      src="/trashcan-cart.svg"
                      alt="Delete"
                      width={12}
                      height={12}
                      className="cursor-pointer"
                      onClick={() => handleRemove({
                        productId: item.productId,
                        color: item.color,
                        size: item.size
                      })}
                    />
                  </div>

                  {variantLine && (
                    <p className="mt-1 text-[8px] text-black font-montserrat">
                      {variantLine}
                    </p>
                  )}

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <p className="text-[14px] font-inter font-semibold text-black">
                        ₦{formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="w-[80px] h-[24px] flex border border-black/30 rounded-[4px] overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item, "minus")}
                        className="w-[24px] h-full bg-[#EEEEEE] flex items-center justify-center"
                      >
                        <span className="text-[16px] font-medium text-black/50">
                          -
                        </span>
                      </button>
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-[14px] font-medium text-black">
                          {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => handleQuantityChange(item, "plus")}
                        className="w-[24px] h-full bg-[#EEEEEE] flex items-center justify-center"
                      >
                        <span className="text-[16px] font-medium text-black/50">
                          +
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Availability Notice */}
      {cart.items.length > 0 && (
        <div className="mt-2 w-full bg-[#EEEEEE] h-[32px] flex items-center gap-2 px-4 rounded-[4px]">
          <CircleAlert size={14} color="rgba(0,0,0,0.3)" />
          <p className="text-[11px] font-inter font-medium text-black/30">
            Item is reserved once payment is final
          </p>
        </div>
      )}

      {/* Bottom Summary Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-black/10 flex justify-center items-center z-50">
          <div className="flex items-center justify-between w-[90%] max-w-[400px]">
            <div className="flex flex-col">
              <p className="text-[18px] font-inter font-semibold text-black">
                ₦{formatPrice(totalPrice)}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              className="px-6 h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[20px] flex items-center justify-center gap-2 shadow-lg"
            >
              Checkout ({totalQuantity})
            </motion.button>
          </div>
        </div>
      )}

      {/* Slide-in Add Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-white z-[999] shadow-2xl overflow-y-auto"
          >
            {user ? (
              <AddNewAddress
                onClose={() => setShowAddressModal(false)}
                onSaveSuccess={() => { setShowAddressModal(false); setShowCheckoutPage(true) }}
              />
            ) : (
              <GuestAddressForm
                onClose={() => setShowAddressModal(false)}
                onSaveSuccess={() => { setShowAddressModal(false); setShowCheckoutPage(true) }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckoutPage && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-white z-[999] shadow-2xl overflow-y-auto"
          >
            <CheckoutPage
              onClose={() => setShowCheckoutPage(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}