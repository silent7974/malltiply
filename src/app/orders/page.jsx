"use client";
import React, { useEffect, useRef, useState } from "react";
import { useClearCartMutation } from "@/redux/services/cartApi";
import { useGetBuyerOrdersQuery, useGetGuestOrdersMutation, useUpdateOrderStatusMutation } from "@/redux/services/orderApi";
import AllOrders from "../components/orders/AllOrders";
import PendingOrders from "../components/orders/PendingOrders";
import ProcessingOrders from "../components/orders/ProcessingOrders";
import ShippedOrders from "../components/orders/ShippedOrders";
import DeliveredOrders from "../components/orders/DeliveredOrders";
import { useMeQuery } from "@/redux/services/authApi";
import { clearCart as clearCartRedux } from "@/redux/slices/cartSlice"
import { useDispatch } from "react-redux";
import OrderDetails from "../components/orders/OrderDetails";
import RefundModal from "../components/orders/RefundModal";
import ReturnedOrders from "../components/orders/ReturnedOrders";

const TABS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Returned",
];

export default function OrdersPage() {
  const [clearCart] = useClearCartMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [activeTab, setActiveTab] = useState("All");
  const tabRefs = useRef({});
  const dispatch = useDispatch()
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRefund, setShowRefund] = useState(false)

  const { data: me, isLoading: authLoading } = useMeQuery()
  const user = me?.user
  const [getGuestOrders] = useGetGuestOrdersMutation()
  const { data: buyerOrders, isFetching: buyerOrdersFetching  } = useGetBuyerOrdersQuery(undefined, { 
    skip: !user,
    pollingInterval: 60000, // refetch every 60 seconds
    refetchOnFocus: true,      // refetch when tab regains focus
    refetchOnReconnect: true,  // refetch when internet reconnects
  })

  const [guestOrders, setGuestOrders] = useState([])

  const [guestFetching, setGuestFetching] = useState(false)

  useEffect(() => {
    if (authLoading || user) return
    const ids = JSON.parse(localStorage.getItem("guestOrderIds") || "[]")
    if (!ids.length) return

    const fetchOrders = () => {
      setGuestFetching(true)  // ← add this
      getGuestOrders(ids).unwrap()
        .then(setGuestOrders)
        .catch(console.error)
        .finally(() => setGuestFetching(false))  // ← add this
    }
    
    fetchOrders()

    const interval = setInterval(fetchOrders, 60000)

    // ← refetch on tab focus for guests
    const handleFocus = () => fetchOrders()
    document.addEventListener("visibilitychange", handleFocus)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleFocus)
    }
  }, [user, authLoading])

  const orders = user ? (buyerOrders || []) : guestOrders

  useEffect(() => {
    if (selectedOrder && orders.length) {
      const updated = orders.find(o => o._id === selectedOrder._id)
      if (updated) setSelectedOrder(updated)
    }
  }, [orders])

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    tabRefs.current[tab]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference) return;

    async function verify() {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const data = await res.json();
      const success =
        data?.status === true && data?.data?.status === "success";

      if (!success) return;

      const orderId =
        data?.data?.metadata?.orderId || data?.metadata?.orderId;

      if (!orderId) return;

      await updateOrderStatus({ orderId, status: "paid" }).unwrap();
      if (user) {
        await clearCart().unwrap().catch(console.error)
      }
      // Always clear localStorage regardless
      dispatch(clearCartRedux()) // from cartSlice
      localStorage.removeItem("cart")
    }

    verify();
  }, []);

  const isFetching = user ? buyerOrdersFetching : guestFetching

  return (
    <div className="relative min-h-screen pb-[72px]">
      {/* Tabs */}
      <div className="w-full pt-4 px-6">
        <div className="flex gap-3 px-[2px] overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                onClick={() => handleTabClick(tab)}
                className="relative flex flex-col items-center pb-2 "
              >
                <span
                  className={`font-[600] font-montserrat text-[14px] ${
                    isActive ? "text-black" : "text-black/50"
                  }`}
                >
                  {tab}
                </span>

                {isActive && (
                  <span className="absolute bottom-1 w-[20px] h-[4px] rounded-full bg-black" />
                )}
              </button>
            );
          })}
        </div>

        {isFetching && (
          <div className="flex items-center gap-2 px-6 py-2">
            <div className="w-3 h-3 rounded-full bg-[#005770] animate-pulse" />
            <span className="text-[11px] font-inter text-black/40">Updating orders...</span>
          </div>
        )}

        {/* Content */}
        <div className="mt-6">
          {activeTab === "All" && <AllOrders orders={orders} onSelectOrder={setSelectedOrder} />}
          {activeTab === "Pending" && <PendingOrders orders={orders} onSelectOrder={setSelectedOrder} />}
          {activeTab === "Processing" && <ProcessingOrders orders={orders} onSelectOrder={setSelectedOrder} />}
          {activeTab === "Shipped" && <ShippedOrders orders={orders} onSelectOrder={setSelectedOrder} />}
          {activeTab === "Delivered" && <DeliveredOrders orders={orders} onSelectOrder={setSelectedOrder} />}
          {activeTab === "Returned" && <ReturnedOrders orders={orders} onSelectOrder={setSelectedOrder} />}
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {showRefund && (
        <RefundModal
          orders={orders}
          onClose={() => setShowRefund(false)}
        />
      )}

      {/* 🔒 Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[56px] bg-[#F8F9FA] border-t border-black/20 flex items-center justify-center z-10">
        <div className="flex gap-4">
          {/* Refund */}
          <button onClick={() => setShowRefund(true)} className="px-4 py-2 rounded-[40px] border border-black/20">
            <span className="font-inter font-medium text-[16px] text-black">
              Refund
            </span>
          </button>

          {/* Track */}
          <button
            onClick={() => {
              if (orders.length > 0) setSelectedOrder(orders[0]) // opens most recent, or pick logic
            }}
            className="px-10 py-2 rounded-[44px] bg-[#005770]"
          >
            <span className="font-inter font-medium text-[16px] text-white">Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}