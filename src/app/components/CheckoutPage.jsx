"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { Check, ChevronLeft, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import { useMeQuery } from "@/redux/services/authApi";
import { useCreateGuestOrderMutation, useCreateOrderMutation } from "@/redux/services/orderApi";
import formatPrice from "@/lib/utils/formatPrice";
import PickupPage from "./PickupPage";
import { useInitializePaymentMutation } from "@/redux/services/paymentApi";
import { useClearCartMutation } from "@/redux/services/cartApi";


function calculateStandardFee(cart) {
  return 0;
}

export default function CheckoutPage({ onClose }) {
    const { data } = useMeQuery();
    const user = data?.user;
    const cart = useSelector((state) => state.cart);

    const [selectedShipping, setSelectedShipping] = useState("standard");
    const [selectedPickupStation, setSelectedPickupStation] = useState(null);
    const [showPickupPage, setShowPickupPage] = useState(false);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const [createGuestOrder] = useCreateGuestOrderMutation();
    const [initializePayment] = useInitializePaymentMutation();
    const [clearCart] = useClearCartMutation();
    const [selectedPayment, setSelectedPayment] = useState("card");

    const guestInfo = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("guestInfo") || "null")
      : null

    const activeUser = user || guestInfo  // use whichever is available

    const handlePlaceOrder = async () => {
      if (!activeUser) return alert("Please add your delivery details first.")

      try {

        const shippingAddress = user
        ? user.address
        : guestInfo?.address

        // 1️⃣ Create order first (status = PENDING)
        const orderData = {
          items: cart.items,
          shippingMethod: selectedShipping,
          pickupAddress: selectedPickupStation,
          shippingAddress,
          paymentMethod: selectedPayment, 
          paymentStatus: "pending",
          itemsTotal: cart.totalPrice,
          shippingFee: calculateStandardFee(cart),
          totalAmount: cart.totalPrice,
          ...(!user && { guestInfo }),
        };

        // Use the right order endpoint
        const orderRes = user
          ? await createOrder(orderData).unwrap()
          : await createGuestOrder(orderData).unwrap()

        const orderId = orderRes.order._id

        // ← add this for guests
        if (!user) {
          const existing = JSON.parse(localStorage.getItem("guestOrderIds") || "[]")
          localStorage.setItem("guestOrderIds", JSON.stringify([...existing, orderId]))
        }

        // Initialize payment
        const email = user ? user.email : guestInfo?.email
        const paymentRes = await initializePayment({
          email,
          amount: cart.totalPrice,
          channels: ["card", "bank_transfer"],
          metadata: { orderId },
          callback_url: `${window.location.origin}/payment/success`
        }).unwrap()

        window.location.href = paymentRes.data.authorization_url

    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
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

      {/* NOTICE */}
      <div className="flex mx-[16px] items-center justify-center border border-black/20 rounded-[2px] p-[4px] mb-[16px]">
        <div className="flex items-center gap-1 text-[#005770]">
          <CreditCardIcon size={16} />
          <span className="text-[10px] font-inter font-medium">Secure payment via paystack</span>
          {/* <div className="w-[4px] h-[4px] bg-[#005770] rounded-full" />
          <span className="text-[10px] font-inter font-medium">All data safeguarded</span> */}
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
              {/* {item.quantity < 20 && (
                <div className="absolute inset-x-[2px] bottom-[2px] bg-black/50 rounded-[47px] flex items-center justify-center px-1 py-[1px]">
                  <p className="text-[8px] text-white font-montserrat font-bold text-center break-words">
                    ALMOST SOLD OUT
                  </p>
                </div>
              )} */}
            </div>

            <div className="flex items-center gap-[4px] mt-[4px]">
              <p className="text-[10px] font-inter font-semibold">₦{formatPrice(item.price)}</p>
              {/* <p className="text-[8px] text-black/50 line-through">₦{formatPrice(item.price)}</p> */}
            </div>

            {item.quantity > 1 && (
              <p className="text-[10px] font-inter font-medium mt-[1px]">x{item.quantity}</p>
            )}
          </div>
        ))}
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Shipping Methods */}
      <p className="text-[14px] mx-[16px] font-inter font-medium mb-[8px]">Shipping methods</p>

      {/* Standard */}
      <div className="mx-[16px] mb-[8px]">
        <div className="flex items-start gap-[8px]">
          <div className="mt-[4px] flex-shrink-0">
            {selectedShipping === "standard" ? (
              <Image src="/checkout-indicator.svg" width={14} height={14} alt="Selected" />
            ) : (
              <div className="w-[14px] h-[14px] border border-black/50 rounded-full"
                  onClick={() => setSelectedShipping("standard")} />
            )}
          </div>
          <div>
            <p className="text-[14px] font-inter font-medium text-[#005770]">Standard: FREE within Abuja</p>
            <p className="text-[12px] font-inter text-black">Delivery within 24 hours</p>
            <p className="text-[10px] text-black/50">Courier: GIG</p>
          </div>
        </div>
      </div>

      {/* Pickup */}
      {/* <div
        className="flex items-start gap-[8px] mx-[16px] cursor-pointer"
        onClick={() => {
          setSelectedShipping("pickup");
          setShowPickupPage(true);
        }}
      >
        {selectedShipping === "pickup" ? (
          <Image src="/checkout-indicator.svg" width={16} height={16} alt="Selected" />
        ) : (
          <div className="w-[16px] h-[16px] border rounded-full border-black/50" />
        )}

        <div>
          <p className="text-[14px] font-inter font-medium text-[#1A7709]">Pickup available</p>
          <p className="text-[12px] font-inter text-black">Choose a station</p>
        </div>
      </div> */}

      {selectedPickupStation && (
        <div className="mx-[16px] mt-[4px] p-[12px] bg-black/5 rounded-[6px]">
          <p className="text-[14px] font-medium">{selectedPickupStation.name}</p>
          <p className="text-[12px] text-black/50">
            {selectedPickupStation.street}, {selectedPickupStation.district}, Abuja
          </p>
        </div>
      )}

      <div className="h-[4px] bg-[#EEEEEE] w-full my-[16px]" />

      {/* Payment Method */}
      <p className="text-[14px] mx-[16px] font-inter font-medium mb-[8px]">Payment methods (via paystack)</p>

      <div className="mx-[16px] flex flex-col gap-[12px]">
        {/* Card */}
        <div
          className="flex items-center gap-[8px] cursor-pointer"
          onClick={() => setSelectedPayment("card")}
        >
          {selectedPayment === "card" ? (
            <Image src="/checkout-indicator.svg" width={14} height={14} alt="selected" />
          ) : (
            <div className="w-[14px] h-[14px] border rounded-full border-black/50" />
          )}
          <p className="text-[14px] font-inter font-medium">Card payment</p>
        </div>

        {/* Bank Transfer */}
        <div
          className="flex items-center gap-[8px] cursor-pointer"
          onClick={() => setSelectedPayment("bank_transfer")}
        >
          {selectedPayment === "bank_transfer" ? (
            <Image src="/checkout-indicator.svg" width={16} height={16} alt="selected" />
          ) : (
            <div className="w-[16px] h-[16px] border rounded-full border-black/50" />
          )}
          <p className="text-[14px] font-inter font-medium">Bank transfer</p>
        </div>
      </div>

      {/* Bottom Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-black/10 flex justify-center items-center z-50">
          <div className="flex items-center justify-between w-[90%] max-w-[400px]">
            <div>
              <p className="text-[18px] font-inter font-semibold">₦{formatPrice(cart.totalPrice)}</p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              className="px-4 h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[18px]"
            >
              Submit order ({cart.totalQuantity})
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