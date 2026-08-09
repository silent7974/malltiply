"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { ChevronLeft, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import { useMeQuery } from "@/redux/services/authApi";
import { useCreateGuestOrderMutation, useCreateOrderMutation } from "@/redux/services/orderApi";
import formatPrice from "@/lib/utils/formatPrice";
import PickupPage from "./PickupPage";
import { useInitializePaymentMutation } from "@/redux/services/paymentApi";
import { useClearCartMutation } from "@/redux/services/cartApi";
import { calculateDeliveryFee, FREE_DELIVERY_THRESHOLD } from "@/lib/utils/calculateDeliveryFee";

export default function CheckoutPage({ onClose }) {
  const { data } = useMeQuery();
  const user = data?.user;
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    window.history.pushState({ overlay: "checkout" }, "");
    const handlePop = () => onClose();
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPickupStation, setSelectedPickupStation] = useState(null);
  const [showPickupPage, setShowPickupPage] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [createGuestOrder] = useCreateGuestOrderMutation();
  const [initializePayment] = useInitializePaymentMutation();
  const [clearCart] = useClearCartMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestInfo = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("guestInfo") || "null")
    : null;

  const activeUser = user || guestInfo;

  const buyerDistrict = user
    ? user.address?.district
    : guestInfo?.address?.district;

  // Delivery fee — recomputes whenever cart total or district changes.
  // Single source of truth for both UI and order payload.
  const deliveryFee = useMemo(
    () => calculateDeliveryFee(cart.totalPrice, buyerDistrict),
    [cart.totalPrice, buyerDistrict]
  );

  const isFreeDelivery = deliveryFee === 0;
  const orderTotal = cart.totalPrice + deliveryFee;

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    if (!activeUser) return alert("Please add your delivery details first.");

    setIsSubmitting(true);
    try {
      const shippingAddress = user
        ? {
            fullName: user.fullName,
            phone: user.phone,
            city: user.address?.city || "Abuja",
            street: user.address?.street,
            district: user.address?.district,
          }
        : {
            fullName: guestInfo?.fullName,
            phone: guestInfo?.phone,
            city: guestInfo?.address?.city || "Abuja",
            street: guestInfo?.address?.street,
            district: guestInfo?.address?.district,
          };

      const orderData = {
        items: cart.items,
        shippingMethod: selectedShipping,
        pickupAddress: selectedPickupStation,
        shippingAddress,
        paymentStatus: "pending",
        itemsTotal: cart.totalPrice,
        shippingFee: deliveryFee,
        totalAmount: orderTotal,
        ...(!user && { guestInfo }),
      };

      const orderRes = user
        ? await createOrder(orderData).unwrap()
        : await createGuestOrder(orderData).unwrap();

      const orderId = orderRes.order._id;
      const payableAmount = orderRes.order.totalAmount || orderTotal;

      if (!user) {
        const existing = JSON.parse(localStorage.getItem("guestOrderIds") || "[]");
        localStorage.setItem("guestOrderIds", JSON.stringify([...existing, orderId]));
      }

      const email = user ? user.email : guestInfo?.email;
      const paymentRes = await initializePayment({
        email,
        amount: payableAmount,
        channels: ["card", "bank_transfer"],
        metadata: { orderId },
        callback_url: `${window.location.origin}/payment/success`,
      }).unwrap();

      window.location.href = paymentRes.data.authorization_url;

    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-[40px] pb-[80px]">
      {/* Header */}
      <div className="flex px-[16px] items-center justify-between mb-[12px]">
        <ChevronLeft size={20} className="text-black/70 cursor-pointer" onClick={onClose} />
        <p className="text-[20px] font-inter font-medium text-black">
          Checkout ({cart.totalQuantity})
        </p>
        <div className="w-[20px]" />
      </div>

      {/* Notice */}
      <div className="flex mx-[16px] items-center justify-center border border-black/20 rounded-[2px] p-[4px] mb-[16px]">
        <div className="flex items-center gap-1 text-[#005770]">
          <CreditCardIcon size={16} />
          <span className="text-[10px] font-inter font-medium">Secure payment via Paystack</span>
        </div>
      </div>

      {/* Address */}
      <div className="mx-[16px] flex flex-col gap-[8px] mb-[16px]">
        <p className="text-[14px] font-inter font-medium text-black">{activeUser?.fullName}</p>
        <p className="text-[14px] font-inter text-black/70">{activeUser?.phone}</p>
        <p className="text-[14px] font-inter font-medium text-[#005770]">{activeUser?.address?.street}</p>
        <p className="text-[14px] font-inter text-black">
          {activeUser?.address?.district}, {activeUser?.address?.city}
          <br /> Nigeria
        </p>
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Items */}
      <p className="text-[14px] mx-[16px] font-inter font-medium text-black mb-[8px]">
        Item details ({cart.totalQuantity})
      </p>

      <div className="grid grid-cols-3 mx-[16px] gap-x-[20px] gap-y-[8px] mb-[16px]">
        {cart.items.map((item, i) => (
          <div key={i}>
            <div className="relative w-[88px] h-[74px]">
              <Image
                src={item.image || "/placeholder.png"}
                fill
                alt={item.name}
                className="object-cover rounded-[4px]"
              />
            </div>
            <div className="flex items-center gap-[4px] mt-[4px]">
              <p className="text-[10px] font-inter font-semibold">₦{formatPrice(item.price)}</p>
            </div>
            {item.quantity > 1 && (
              <p className="text-[10px] font-inter font-medium mt-[1px]">x{item.quantity}</p>
            )}
          </div>
        ))}
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Shipping */}
      <p className="text-[14px] mx-[16px] font-inter font-medium mb-[8px]">Shipping</p>

      <div className="mx-[16px] mb-[8px]">
        <div className="flex items-start gap-[8px]">
          <div className="mt-[4px] flex-shrink-0">
            <Image src="/checkout-indicator.svg" width={14} height={14} alt="Selected" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-inter font-medium text-[#005770]">
              {isFreeDelivery
                ? "Standard: FREE - order above ₦20,000"
                : `Standard: ₦${formatPrice(deliveryFee)}`}
            </p>
            <p className="text-[12px] font-inter text-black">Delivery within 24 hours</p>
            <p className="text-[10px] text-black/50">Courier: Bolt · {buyerDistrict}, Abuja</p>

            {/* Nudge toward free delivery if they're within 30% of the threshold */}
            {!isFreeDelivery && cart.totalPrice >= FREE_DELIVERY_THRESHOLD * 0.7 && (
              <p className="text-[10px] font-inter text-[#005770] mt-[4px]">
                Add ₦{formatPrice(FREE_DELIVERY_THRESHOLD - cart.totalPrice)} more for free delivery
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Order Summary */}
      <div className="mx-[16px] flex flex-col gap-[6px] mb-[16px]">
        <div className="flex justify-between">
          <p className="text-[13px] font-inter text-black/60">Items</p>
          <p className="text-[13px] font-inter text-black">₦{formatPrice(cart.totalPrice)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[13px] font-inter text-black/60">Delivery</p>
          <p className={`text-[13px] font-inter font-medium ${isFreeDelivery ? "text-[#005770]" : "text-black"}`}>
            {isFreeDelivery ? "FREE" : `₦${formatPrice(deliveryFee)}`}
          </p>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-[6px] mt-[2px]">
          <p className="text-[14px] font-inter font-semibold text-black">Total</p>
          <p className="text-[14px] font-inter font-semibold text-black">₦{formatPrice(orderTotal)}</p>
        </div>
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Payment */}
      <p className="text-[14px] mx-[16px] font-inter font-medium mb-[8px]">Payment</p>
      <div className="mx-[16px] flex items-center gap-[8px]">
        <Image src="/checkout-indicator.svg" width={14} height={14} alt="selected" />
        <p className="text-[14px] font-inter font-medium">Paystack</p>
      </div>

      {/* Bottom Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-black/10 flex justify-center items-center z-50">
          <div className="flex items-center justify-center gap-4 w-[90%] max-w-[400px]">
            <div className="flex flex-col">
              <p className="text-[18px] font-inter font-semibold">₦{formatPrice(orderTotal)}</p>
              {!isFreeDelivery && (
                <p className="text-[10px] font-inter text-black/40">
                  incl. ₦{formatPrice(deliveryFee)} delivery
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="px-4 h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[16px]"
            >
              {isSubmitting ? "Processing..." : `Submit order (${cart.totalQuantity})`}
            </motion.button>
          </div>
        </div>
      )}

      {/* Pickup Slide */}
      <AnimatePresence>
        {showPickupPage && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-white z-[999] shadow-2xl overflow-y-auto"
          >
            <PickupPage
              onClose={() => setShowPickupPage(false)}
              setSelectedPickupStation={setSelectedPickupStation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}