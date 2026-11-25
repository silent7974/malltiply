"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { ChevronLeft, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import { useMeQuery } from "@/redux/services/authApi";
import { useCreateGuestOrderMutation, useCreateOrderMutation } from "@/redux/services/orderApi";
import formatPrice from "@/lib/utils/formatPrice";
import PickupPage from "./PickupPage";
import { useInitializePaymentMutation } from "@/redux/services/paymentApi";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/utils/calculateDeliveryFee";
import { validateDeliveryDetails } from "@/lib/utils/validators";

const SUPPORT_WHATSAPP_URL = "https://wa.me/2349065941258";

function getProductId(item) {
  const id = typeof item.productId === "object" ? item.productId?._id : item.productId;
  return String(id);
}

// Turns any failure into one plain sentence for the buyer.
// Our API routes send { error: "plain sentence" }; the rest are network problems.
function getErrorMessage(err, fallback) {
  if (err?.data?.error) return err.data.error;
  if (err?.status === "FETCH_ERROR") {
    return "We could not reach the server. Please check your internet connection and try again.";
  }
  if (err?.status === "TIMEOUT_ERROR") {
    return "The request took too long. Please check your connection and try again.";
  }
  return fallback;
}

export default function CheckoutPage({ onClose, onEditAddress }) {
  const { data } = useMeQuery();
  const user = data?.user;
  const cart = useSelector((state) => state.cart);

  // Page scroll lock is handled by cart/page.jsx (one owner, no leaks
  // when one overlay replaces another).

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState(null); // null | "order" | "payment"
  const [error, setError] = useState(null); // { message, canEdit }

  // The price the SERVER works out: items total, delivery fee, total.
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteTry, setQuoteTry] = useState(0);

  // Remembers the order we already created, so a retry after a payment
  // failure reuses it instead of creating a duplicate.
  const pendingOrderRef = useRef(null);

  // If the buyer comes back from Paystack with the back button, the browser may
  // restore this page frozen on "Opening Paystack...". Reset it.
  useEffect(() => {
    const onShow = (e) => {
      if (e.persisted) {
        setIsSubmitting(false);
        setStage(null);
      }
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  let guestInfo = null;
  if (typeof window !== "undefined") {
    try {
      guestInfo = JSON.parse(localStorage.getItem("guestInfo") || "null");
    } catch {
      guestInfo = null;
    }
  }

  const activeUser = user || guestInfo;
  const buyerDistrict = user
    ? user.address?.district
    : guestInfo?.address?.district;

  // Ask the server for the price whenever the cart or the area changes.
  const quoteKey = JSON.stringify([
    cart.items.map((i) => [getProductId(i), i.color ?? null, i.size ?? null, i.quantity]),
    buyerDistrict ?? null,
  ]);

  useEffect(() => {
    if (cart.items.length === 0) return;
    const controller = new AbortController();
    setQuote(null);
    setQuoteError("");

    (async () => {
      try {
        const res = await fetch("/api/delivery/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            area: buyerDistrict,
            items: cart.items.map((i) => ({
              productId: getProductId(i),
              color: i.color,
              size: i.size,
              quantity: i.quantity,
              sku: i.sku,
              price: i.price,
              image: i.image,
            })),
          }),
          signal: controller.signal,
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(body?.error || "We could not work out your delivery fee. Please try again.");
        }
        setQuote(body);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setQuoteError(
          err instanceof TypeError
            ? "We could not reach the server. Please check your internet connection and try again."
            : err.message
        );
      }
    })();

    return () => controller.abort();
  }, [quoteKey, quoteTry]);

  const itemsTotal = quote ? quote.itemsTotal : cart.totalPrice;
  const deliveryFee = quote ? quote.fee : null;
  const orderTotal = quote ? quote.total : null;
  const isFreeDelivery = quote?.free === true;
  const priceChanged = quote && quote.itemsTotal !== cart.totalPrice;

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    setError(null);

    // 1. Check everything BEFORE creating an order, so a typo never
    //    leaves a half-finished order behind.
    const check = validateDeliveryDetails(
      {
        fullName: activeUser?.fullName,
        phone: activeUser?.phone,
        email: activeUser?.email,
        street: activeUser?.address?.street,
        district: activeUser?.address?.district,
      },
      { requireEmail: true }
    );

    if (!activeUser || !check.ok) {
      setError({
        message: !activeUser
          ? "Please add your delivery details first."
          : Object.values(check.errors)[0],
        canEdit: true,
      });
      return;
    }

    if (!quote) {
      setError({
        message: quoteError || "We are still working out your delivery fee. Please try again in a moment.",
        canEdit: false,
      });
      return;
    }

    const details = check.cleaned;
    const shippingAddress = {
      fullName: details.fullName,
      phone: details.phone,
      city: "Abuja",
      street: details.street,
      district: details.district,
    };
    const guestPayload = {
      fullName: details.fullName,
      phone: details.phone,
      email: details.email,
      address: { city: "Abuja", street: details.street, district: details.district },
    };

    // Same cart + same price + same address = same order
    const signature = JSON.stringify({
      items: cart.items.map((i) => [getProductId(i), i.color ?? null, i.size ?? null, i.quantity]),
      itemsTotal: quote.itemsTotal,
      fee: quote.fee,
      to: [details.fullName, details.phone, details.street, details.district],
      email: details.email,
    });

    setIsSubmitting(true);
    setStage("order");

    try {
      let orderId;
      let payableAmount;

      const pending = pendingOrderRef.current;
      if (pending && pending.signature === signature) {
        orderId = pending.orderId;
        payableAmount = pending.amount;
      } else {
        const orderData = {
          items: cart.items,
          shippingMethod: selectedShipping,
          pickupAddress: selectedPickupStation,
          shippingAddress,
          paymentStatus: "pending",
          // The server works out its own prices and fee; these are for reference only
          itemsTotal: quote.itemsTotal,
          shippingFee: quote.fee,
          totalAmount: quote.total,
          ...(!user && { guestInfo: guestPayload }),
        };

        const orderRes = user
          ? await createOrder(orderData).unwrap()
          : await createGuestOrder(orderData).unwrap();

        orderId = orderRes.order._id;
        payableAmount = orderRes.order.totalAmount || quote.total;
        pendingOrderRef.current = { signature, orderId, amount: payableAmount };

        if (!user) {
          const existing = JSON.parse(localStorage.getItem("guestOrderIds") || "[]");
          if (!existing.includes(orderId)) {
            localStorage.setItem("guestOrderIds", JSON.stringify([...existing, orderId]));
          }
        }

        // A price moved between the quote and the order. Never send the buyer
        // to Paystack with a total they have not seen.
        if (Number(payableAmount) !== Number(quote.total)) {
          pendingOrderRef.current = null;
          setQuoteTry((n) => n + 1);
          setError({
            message: "Some prices changed while you were checking out. Please check your new total and tap Submit again.",
            canEdit: false,
          });
          setIsSubmitting(false);
          setStage(null);
          return;
        }
      }

      // 2. Start the payment
      setStage("payment");
      const paymentRes = await initializePayment({
        email: details.email,
        amount: payableAmount, // the server uses its own order total, not this number
        channels: ["card", "bank_transfer"],
        metadata: { orderId },
        callback_url: `${window.location.origin}/payment/success`,
      }).unwrap();

      const url = paymentRes?.data?.authorization_url;
      if (!url) throw new Error("No payment link returned");

      // Success: leave the button disabled while the browser moves to Paystack.
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError({
        message: getErrorMessage(
          err,
          "We could not start your payment. Please try again, or message us on WhatsApp."
        ),
        canEdit: Boolean(err?.data?.fields) || err?.data?.code === "invalid_email",
      });
      setIsSubmitting(false);
      setStage(null);
    }
  };

  const submitLabel =
    stage === "order"
      ? "Creating your order..."
      : stage === "payment"
      ? "Opening Paystack..."
      : `Submit order (${cart.totalQuantity})`;

  const bannerMessage = error?.message || quoteError;

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
        <div className="flex items-start justify-between">
          <p className="text-[14px] font-inter font-medium text-black">{activeUser?.fullName}</p>
          {onEditAddress && (
            <button
              type="button"
              onClick={onEditAddress}
              className="text-[12px] font-inter font-semibold text-[#005770]"
            >
              Change
            </button>
          )}
        </div>
        <p className="text-[14px] font-inter text-black/70">{activeUser?.phone}</p>
        <p className="text-[14px] font-inter font-medium text-[#005770]">{activeUser?.address?.street}</p>
        <p className="text-[14px] font-inter text-black">
          {activeUser?.address?.district}, {activeUser?.address?.city}
          <br /> Nigeria
        </p>
        {activeUser?.email && (
          <p className="text-[12px] font-inter text-black/50">
            Receipt will be sent to {activeUser.email}
          </p>
        )}
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Items */}
      <p className="text-[14px] mx-[16px] font-inter font-medium text-black mb-[8px]">
        Item details ({cart.totalQuantity})
      </p>

      <div className="grid grid-cols-3 mx-[16px] gap-x-[20px] gap-y-[8px] mb-[16px]">
        {cart.items.map((item, i) => {
          const variantLine = (() => {
            const parts = [];
            if (item.color) parts.push(`Color: ${item.color}`);
            if (item.size) parts.push(`Size: ${item.size}`);
            if (item.measurement) parts.push(`Measurement: ${item.measurement}`);
            return parts.join(" / ");
          })();

          return (
            <div key={i}>
              <div className="relative w-[88px] h-[74px]">
                <Image
                  src={item.image || "/placeholder.png"}
                  fill
                  alt={item.name}
                  className="object-cover rounded-[4px]"
                />
              </div>

              <p className="mt-[4px] text-[9px] font-inter text-black/50 truncate">
                {item.name}
              </p>

              {variantLine && (
                <p className="text-[8px] font-inter text-black">
                  {variantLine}
                </p>
              )}

              <div className="flex items-center gap-[4px] mt-[2px]">
                <p className="text-[10px] font-inter font-semibold">₦{formatPrice(item.price)}</p>
              </div>
              {item.quantity > 1 && (
                <p className="text-[10px] font-inter font-medium mt-[1px]">x{item.quantity}</p>
              )}
            </div>
          );
        })}
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
              {!quote
                ? "Standard: working out your fee..."
                : isFreeDelivery
                ? `Standard: FREE (Malltiply Originals over ₦${formatPrice(FREE_DELIVERY_THRESHOLD)})`
                : `Standard: ₦${formatPrice(deliveryFee)}`}
            </p>
            <p className="text-[12px] font-inter text-black">Delivery within 24 hours</p>
            <p className="text-[10px] text-black/50">Courier: Bolt · {buyerDistrict}, Abuja</p>

            {/* Why the delivery is not free, in plain words */}
            {quote?.reason === "no-originals" && (
              <p className="text-[10px] font-inter text-black/50 mt-[4px]">
                Free delivery is on Malltiply Originals orders over ₦{formatPrice(FREE_DELIVERY_THRESHOLD)}.
              </p>
            )}
            {quote?.reason === "below-threshold" && (
              <p className="text-[10px] font-inter text-[#005770] mt-[4px]">
                Add ₦{formatPrice(FREE_DELIVERY_THRESHOLD - quote.originalsTotal)} more of Malltiply Originals for free delivery
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Order Summary */}
      {priceChanged && (
        <p className="mx-[16px] mb-[8px] text-[12px] font-inter text-[#005770]">
          Some prices were updated. The total below is the current one.
        </p>
      )}
      <div className="mx-[16px] flex flex-col gap-[6px] mb-[16px]">
        <div className="flex justify-between">
          <p className="text-[13px] font-inter text-black/60">Items</p>
          <p className="text-[13px] font-inter text-black">₦{formatPrice(itemsTotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[13px] font-inter text-black/60">Delivery</p>
          <p className={`text-[13px] font-inter font-medium ${isFreeDelivery ? "text-[#005770]" : "text-black"}`}>
            {!quote ? "..." : isFreeDelivery ? "FREE" : `₦${formatPrice(deliveryFee)}`}
          </p>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-[6px] mt-[2px]">
          <p className="text-[14px] font-inter font-semibold text-black">Total</p>
          <p className="text-[14px] font-inter font-semibold text-black">
            {quote ? `₦${formatPrice(orderTotal)}` : "..."}
          </p>
        </div>
      </div>

      <div className="h-[4px] bg-[#EEEEEE] w-full mb-[16px]" />

      {/* Payment */}
      <p className="text-[14px] mx-[16px] font-inter font-medium mb-[8px]">Payment</p>
      <div className="mx-[16px] flex items-center gap-[8px]">
        <Image src="/checkout-indicator.svg" width={14} height={14} alt="selected" />
        <p className="text-[14px] font-inter font-medium">Paystack</p>
      </div>
      <p className="text-[13px] font-inter text-black/50 mx-[16px] mt-[4px]">
        You'll be able to pay by bank transfer or card. If you choose transfer, we'll show you an account number to send money to.
      </p>

      {/* Message banner: sits just above the bottom bar so it is always visible */}
      {bannerMessage && (
        <div
          role="alert"
          className="fixed bottom-[64px] left-0 w-full z-50 bg-red-50 border-t border-red-200 px-4 py-3"
        >
          <p className="text-[12px] font-inter font-medium text-red-600">{bannerMessage}</p>
          <div className="flex items-center gap-4 mt-[6px]">
            {error?.canEdit && onEditAddress && (
              <button
                type="button"
                onClick={onEditAddress}
                className="text-[12px] font-inter font-semibold text-[#005770] underline"
              >
                Edit my details
              </button>
            )}
            {!error && quoteError && (
              <button
                type="button"
                onClick={() => setQuoteTry((n) => n + 1)}
                className="text-[12px] font-inter font-semibold text-[#005770] underline"
              >
                Try again
              </button>
            )}
            <a
              href={SUPPORT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-inter text-black/60 underline"
            >
              Need help? WhatsApp us
            </a>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[64px] bg-white border-t border-black/10 flex justify-center items-center z-50">
          <div className="flex items-center justify-center gap-4 w-[90%] max-w-[400px]">
            <div className="flex flex-col">
              <p className="text-[18px] font-inter font-semibold">
                {quote ? `₦${formatPrice(orderTotal)}` : "..."}
              </p>
              {quote && !isFreeDelivery && (
                <p className="text-[10px] font-inter text-black/40">
                  incl. ₦{formatPrice(deliveryFee)} delivery
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !quote}
              className="px-4 h-[48px] bg-[#005770] rounded-[44px] text-white font-inter font-semibold text-[16px] disabled:opacity-70"
            >
              {submitLabel}
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