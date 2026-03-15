"use client";

import AllOrders from "@/app/seller/components/orders/AllOrders";
import CancelledOrders from "@/app/seller/components/orders/CancelledOrders";
import DeliveredOrders from "@/app/seller/components/orders/DeliveredOrders";
import PendingOrders from "@/app/seller/components/orders/PendingOrders";
import ProcessingOrders from "@/app/seller/components/orders/ProcessingOrders";
import ShippedOrders from "@/app/seller/components/orders/ShippedOrders";
import React, { useState, useRef } from "react";

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("All");

  // Store refs for each tab
  const tabRefs = useRef({});

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    // Scroll selected tab into view
    tabRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="w-full pt-4">
      {/* Tabs Container */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              ref={(el) => (tabRefs.current[tab] = el)}
              onClick={() => handleTabClick(tab)}
              className={`
                whitespace-nowrap
                px-3 py-1.5
                rounded-[24px]
                font-inter font-medium text-[16px]
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#005770] text-[#F8F9FA]"
                    : "bg-[#EEEEEE] text-black/50"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Placeholder */}
      <div className="mt-6 ">
       {activeTab === "All" && <AllOrders />}

        {activeTab === "Pending" && <PendingOrders />}

        {activeTab === "Processing" && <ProcessingOrders />}

        {activeTab === "Shipped" && <ShippedOrders />}

        {activeTab === "Delivered" && <DeliveredOrders /> }

        {activeTab === "Cancelled" && <CancelledOrders /> }
      </div>
    </div>
  );
}