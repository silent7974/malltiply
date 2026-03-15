"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Funnel, Check, ClockArrowUp } from "lucide-react";
import formatPrice from "@/lib/utils/formatPrice";

const FILTERS = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
];

const STATUS_STYLES = {
  pending: { bg: "#676300", text: "#FAFFA3", label: "Pending" },
  processing: { bg: "#001D67", text: "#A3CEFF", label: "Processing" },
  shipped: { bg: "#440067", text: "#DDA3FF", label: "Shipped" },
  delivered: { bg: "#006707", text: "#A3FFA9", label: "Delivered" },
  Returned: { bg: "#671D00", text: "#FFB7A3", label: "Cancelled" },
};

export default function AllOrders({ orders = [], onSelectOrder  }) {
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const buyerOrders = useMemo(() => {
    const now = new Date();

    return orders
      .filter((o) => o.items?.length > 0)
      .filter((o) => {
        if (filter === "all") return true;
        const days = Number(filter);
        const diff =
          (now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
        return diff <= days;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, filter]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-[Montserrat] font-medium text-[16px] text-black">
          All ({buyerOrders.length})
        </p>

        <div className="relative">
          <button onClick={() => setShowFilter(!showFilter)}>
            <Funnel size={16} className="text-black/50" />
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-[160px] bg-white rounded-[8px] shadow-lg border z-50">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFilter(f.value);
                    setShowFilter(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-[14px] hover:bg-[#EEEEEE]"
                >
                  <span>{f.label}</span>
                  {filter === f.value && (
                    <Check size={16} className="text-[#005770]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      {buyerOrders.length > 0 && (
        <div className="mt-4 border border-black/20 rounded-[2px] p-2 overflow-hidden">
          <div className="flex items-center gap-2 text-[#005770]">
            <ClockArrowUp size={16} />

            {/* Marquee wrapper */}
            <div className="relative w-full overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-[12px] font-inter font-medium">
                We've received your order, orders are typically fulfilled within 24 hours
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Empty */}
      {buyerOrders.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-[16px] font-inter font-medium text-black">
            No orders yet
          </p>
          <p className="text-[14px] text-black/50">
            Your purchases will appear here.
          </p>
        </div>
      )}

      {/* Orders */}
      <div className="mt-4 space-y-6">
        {buyerOrders.map((order) => {
          const status = STATUS_STYLES[order.orderStatus];

          return (
            <div key={order._id}>
              <div className="flex justify-between items-center">
                <p className="text-[12px] font-inter text-black/50">
                  ID: {order._id.slice(-8)}
                </p>

                <button
                  onClick={() => onSelectOrder(order)}
                  className="px-[10px] py-[4px] rounded-[24px] text-[10px] font-inter font-medium"
                  style={{ backgroundColor: status.bg, color: status.text }}
                >
                  {status.label}
                </button>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <div className="flex gap-4 overflow-x-auto">
                  {order.items.map((item, i) => (
                    <div key={i} className="w-[88px]">
                      <div className="relative w-[88px] h-[74px]">
                        <Image
                          src={item.image || "/placeholder.png"}
                          fill
                          alt={item.name}
                          className="object-cover rounded-[4px]"
                        />
                      </div>

                      <p className="mt-1 text-[10px] text-black/50 truncate">
                        {item.name}
                      </p>

                      <p className="text-[8px]">
                        {item.color} {item.size && `/ ${item.size}`}
                      </p>

                      <p className="text-[12px] font-semibold text-[#005770]">
                        ₦{formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="w-[80px] h-[123px] bg-[#F8F9FA] rounded-[6px] flex flex-col justify-center items-center">
                  <p className="text-[16px] text-black/50">
                    ₦{formatPrice(order.totalAmount)}
                  </p>
                  <p className="text-[12px] text-black/50">
                    {order.items.length}{" "}
                    {order.items.length > 1 ? "items" : "item"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}