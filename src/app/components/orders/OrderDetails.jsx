"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import formatPrice from "@/lib/utils/formatPrice";

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_STYLES = {
  pending: { bg: "#676300", text: "#FAFFA3", label: "Pending" },
  processing: { bg: "#001D67", text: "#A3CEFF", label: "Processing" },
  shipped: { bg: "#440067", text: "#DDA3FF", label: "Shipped" },
  delivered: { bg: "#006707", text: "#A3FFA9", label: "Delivered" },
  returned: { bg: "#671D00", text: "#FFB7A3", label: "Cancelled" },
};

export default function OrderDetails({ order, onClose }) {
  if (!order) return null;

  const currentIndex = STATUS_STEPS.indexOf(order.orderStatus);

  const pickupStatusMap = {
    pending: "We're preparing your order",
    processing: "Your order is being packed",
    shipped: "Your order is on the way",
    delivered: "Delivered successfully",
    returned: "Return in progress",
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Overlay */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/30"
        />

        {/* Modal */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-1000 bg-white rounded-t-[16px]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Header */}
          <div className="w-full h-[56px] bg-[#F8F9FA] border-b border-black/20 flex items-center justify-center rounded-t-[48px]">
            <p className="font-inter font-medium text-[16px] text-black">
              Order summary
            </p>
          </div>

          {/* Scrollable body */}
          <div className="px-4 pb-6 max-h-[64vh] overflow-y-auto scrollbar-hide">
            {/* Tracker */}
            <div className="mt-[36px] flex items-center">
              {STATUS_STEPS.map((step, i) => {
                const filled =
                  order.orderStatus !== "cancelled" && i <= currentIndex;

                return (
                  <React.Fragment key={step}>
                    <div
                      className="w-[32px] h-[32px] rounded-full"
                      style={{
                        backgroundColor: filled ? "#2A9CBC" : "#EEEEEE",
                      }}
                    />
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className="flex-1 h-[8px]"
                        style={{
                          backgroundColor:
                            order.orderStatus !== "cancelled" &&
                            i < currentIndex
                              ? "#2A9CBC"
                              : "#EEEEEE",
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Meta */}
            <div className="mt-[36px] space-y-[16px]">
              <div className="flex justify-between">
                <p className="font-inter text-[16px] text-black">
                  ORDER ID:
                </p>
                <p className="font-inter text-[16px] text-black/50">
                  {order._id.slice(-8)}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="font-inter text-[16px] text-black">
                  STATUS:
                </p>
                <span
                  className="px-[12px] py-[6px] rounded-[24px] text-[10px] font-inter font-medium"
                  style={{
                    backgroundColor: STATUS_STYLES[order.orderStatus].bg,
                    color: STATUS_STYLES[order.orderStatus].text,
                  }}
                >
                  {STATUS_STYLES[order.orderStatus].label}
                </span>
              </div>

              <div className="flex justify-between">
                <p className="font-inter text-[16px] text-black">
                  DATE:
                </p>
                <p className="font-inter text-[16px] text-black/50">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-[20px]">
              <p className="font-inter font-medium text-[16px] text-black">
                {order.items.length > 1 ? "Items" : "Item"}
              </p>

              <div className="mt-[16px] grid grid-cols-3 gap-4">
                {order.items.map((item, i) => (
                  <div key={i}>
                    <div className="relative w-full aspect-[88/74]">
                      <Image
                        src={item.image || "/placeholder.png"}
                        fill
                        alt={item.name}
                        className="object-cover rounded-[4px]"
                      />
                    </div>

                    <p className="mt-[4px] text-[10px] font-[Montserrat] text-black/50 truncate">
                      {item.name}
                    </p>

                    <p className="text-[8px] font-[Montserrat] text-black">
                      {item.color && `Color: ${item.color}`}{" "}
                      {item.size && `/ Size: ${item.size}`}
                    </p>

                    <div className="flex justify-between mt-[4px]">
                      <p className="text-[12px] font-inter text-[#005770] font-semibold">
                        ₦{formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-[20px] space-y-[8px]">
              <div className="flex items-center gap-[4px]">
                <p className="font-inter font-medium text-[16px] text-black">
                  Delivery method:
                </p>
                <p className="font-inter text-[16px] text-black/50">GIG</p>
              </div>

              <div className="flex items-center gap-[4px]">
                <p className="font-inter font-medium text-[16px] text-black">
                  Pickup status:
                </p>
                <p className="font-inter text-[14px] text-black">
                  {pickupStatusMap[order.orderStatus]}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}