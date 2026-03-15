"use client"
import React, { useMemo } from "react"
import Image from "next/image"
import { RotateCcw } from "lucide-react"
import formatPrice from "@/lib/utils/formatPrice"

export default function ReturnedOrders({ orders = [], onSelectOrder }) {
  const returnedOrders = useMemo(() =>
    orders
      .filter(o => o.orderStatus === "returned" && o.items?.length > 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-[Montserrat] font-medium text-[16px] text-black">
          Returned ({returnedOrders.length})
        </p>
      </div>

      {returnedOrders.length > 0 && (
        <div className="mt-4 border border-black/20 rounded-[2px] p-2 overflow-hidden">
          <div className="flex items-center gap-2 text-[#005770]">
            <RotateCcw size={16} />
            <div className="relative w-full overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-[12px] font-inter font-medium">
                Your refund request is being reviewed - we'll process it within 1-2 days
              </div>
            </div>
          </div>
        </div>
      )}

      {returnedOrders.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-[16px] font-inter font-medium text-black">No returned orders</p>
          <p className="text-[14px] text-black/50">Refund requests will appear here.</p>
        </div>
      )}

      <div className="mt-4 space-y-6">
        {returnedOrders.map(order => (
          <div key={order._id}>
            <div className="flex justify-between items-center">
              <p className="text-[12px] font-inter text-black/50">ID: {order._id.slice(-8)}</p>
              <button onClick={() => onSelectOrder(order)}>
                <span className="text-[12px] font-inter text-black/50">View</span>
              </button>
            </div>

            {order.refund && (
              <div className="mt-2 bg-[#F8F9FA] rounded-[6px] px-3 py-2">
                <p className="text-[10px] font-inter text-black/50">Refund amount</p>
                <p className="text-[14px] font-inter font-semibold text-[#005770]">
                  ₦{formatPrice(order.refund.totalRefundAmount)}
                </p>
                <p className="text-[10px] text-black/50 mt-1">
                  {order.refund.bankName} · {order.refund.accountNumber}
                </p>
              </div>
            )}

            <div className="mt-3 flex justify-between gap-4">
              <div className="flex gap-4 overflow-x-auto">
                {order.items.map((item, i) => (
                  <div key={i} className="w-[88px]">
                    <div className="relative w-[88px] h-[74px]">
                      <Image src={item.image || "/placeholder.png"} fill alt={item.name}
                        className="object-cover rounded-[4px]" />
                    </div>
                    <p className="mt-1 text-[10px] text-black/50 truncate">{item.name}</p>
                    <p className="text-[8px]">{item.color}{item.size && ` / ${item.size}`}</p>
                    <p className="text-[12px] font-semibold text-[#005770]">₦{formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>
              <div className="w-[80px] h-[123px] bg-[#F8F9FA] rounded-[6px] flex flex-col justify-center items-center">
                <p className="text-[14px] text-black/50">₦{formatPrice(order.totalAmount)}</p>
                <p className="text-[12px] text-black/50">{order.items.length} {order.items.length > 1 ? "items" : "item"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}