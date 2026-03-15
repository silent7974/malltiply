"use client"
import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Minus, Plus } from "lucide-react"
import { useUpdateOrderStatusMutation } from "@/redux/services/orderApi"
import formatPrice from "@/lib/utils/formatPrice"

const BANKS = [
  "Access Bank", "GTBank", "First Bank", "Zenith Bank", "UBA",
  "Stanbic IBTC", "Fidelity Bank", "Sterling Bank", "Wema Bank", "Kuda Bank", "Opay", "Moniepoint"
]

export default function RefundModal({ orders = [], onClose }) {
  const [step, setStep] = useState(1) // 1 = select items, 2 = bank details
  const [selectedItems, setSelectedItems] = useState({}) // { orderId_productId: { item, orderId, qty } }
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [showBankPicker, setShowBankPicker] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updateOrderStatus] = useUpdateOrderStatusMutation()

  // Only delivered orders are refundable
  const refundableOrders = useMemo(() =>
    orders.filter(o => o.orderStatus === "delivered"),
    [orders]
  )

  function getKey(orderId, productId, size, color) {
    return `${orderId}_${productId}_${size || ""}_${color || ""}`
  }

  function adjustQty(orderId, item, delta) {
    const key = getKey(orderId, item.productId, item.size, item.color)
    setSelectedItems(prev => {
      const current = prev[key]?.qty || 0
      const next = Math.max(0, Math.min(item.quantity, current + delta))
      if (next === 0) {
        const { [key]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [key]: { item, orderId, qty: next } }
    })
  }

  function getQty(orderId, item) {
    return selectedItems[getKey(orderId, item.productId, item.size, item.color)]?.qty || 0
  }

  const selectedList = Object.values(selectedItems)
  const totalRefund = selectedList.reduce((sum, s) => sum + s.item.price * s.qty, 0)

  async function handleSubmit() {
    if (!bankName || !accountNumber || !accountName) {
      alert("Please fill all bank details.")
      return
    }

    setSubmitting(true)
    try {
      // Group selected items by orderId
      const byOrder = {}
      selectedList.forEach(({ orderId, item, qty }) => {
        if (!byOrder[orderId]) byOrder[orderId] = []
        byOrder[orderId].push({ productId: item.productId, name: item.name, quantity: qty, price: item.price })
      })

      await Promise.all(
        Object.entries(byOrder).map(([orderId, items]) =>
          updateOrderStatus({
            orderId,
            refund: {
              items,
              totalRefundAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
              bankName,
              accountNumber,
              accountName,
            }
          }).unwrap()
        )
      )
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to submit refund. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />

        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[16px] z-50"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="w-full h-[56px] bg-[#F8F9FA] border-b border-black/10 flex items-center px-4 rounded-t-[16px]">
            {step === 2 ? (
              <button onClick={() => setStep(1)} className="mr-3">
                <ChevronLeft size={20} className="text-black/70" />
              </button>
            ) : <div className="w-[20px] mr-3" />}
            <p className="flex-1 text-center font-inter font-medium text-[16px] text-black">
              {step === 1 ? "Select items to refund" : "Bank details"}
            </p>
            <div className="w-[20px]" />
          </div>

          {/* Scrollable body */}
          <div className="px-4 pb-[100px] max-h-[70vh] overflow-y-auto scrollbar-hide">

            {/* STEP 1 — Item selection */}
            {step === 1 && (
              <div className="mt-4">
                {refundableOrders.length === 0 ? (
                  <div className="mt-16 text-center">
                    <p className="text-[16px] font-inter font-medium text-black">No delivered orders</p>
                    <p className="text-[14px] text-black/50 mt-1">Only delivered orders can be refunded.</p>
                  </div>
                ) : (
                  refundableOrders.map(order => (
                    <div key={order._id} className="mb-6">
                      <p className="text-[11px] font-inter text-black/40 mb-2">
                        Order · {order._id.slice(-8)}
                      </p>
                      {order.items.map((item, i) => {
                        const qty = getQty(order._id, item)
                        return (
                          <div key={i} className="flex items-center gap-3 py-3 border-b border-black/10">
                            <div className="relative w-[60px] h-[50px] flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.png"}
                                fill alt={item.name}
                                className="object-cover rounded-[4px]"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-inter font-medium text-black truncate">{item.name}</p>
                              <p className="text-[10px] text-black/50">
                                {item.color}{item.size ? ` / ${item.size}` : ""}
                              </p>
                              <p className="text-[12px] font-inter font-semibold text-[#005770]">
                                ₦{formatPrice(item.price)}
                              </p>
                            </div>
                            {/* Qty stepper */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => adjustQty(order._id, item, -1)}
                                className="w-[28px] h-[28px] rounded-full bg-[#EEEEEE] flex items-center justify-center"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-[14px] font-inter font-semibold w-[16px] text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => adjustQty(order._id, item, +1)}
                                disabled={qty >= item.quantity}
                                className="w-[28px] h-[28px] rounded-full bg-[#EEEEEE] flex items-center justify-center disabled:opacity-40"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* STEP 2 — Bank details */}
            {step === 2 && (
              <div className="mt-4 flex flex-col gap-4">
                {/* Refund summary */}
                <div className="bg-[#F8F9FA] rounded-[8px] p-3">
                  <p className="text-[12px] font-inter text-black/50 mb-2">Refunding</p>
                  {selectedList.map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <p className="text-[12px] font-inter text-black">{s.item.name} x{s.qty}</p>
                      <p className="text-[12px] font-inter font-semibold">₦{formatPrice(s.item.price * s.qty)}</p>
                    </div>
                  ))}
                  <div className="mt-2 pt-2 border-t border-black/10 flex justify-between">
                    <p className="text-[13px] font-inter font-semibold">Total</p>
                    <p className="text-[13px] font-inter font-semibold text-[#005770]">₦{formatPrice(totalRefund)}</p>
                  </div>
                </div>

                {/* Bank name picker */}
                <div>
                  <label className="text-[12px] font-inter font-medium text-black">Bank name</label>
                  <div
                    onClick={() => setShowBankPicker(true)}
                    className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer"
                  >
                    <span className={`text-[12px] font-inter ${bankName ? "text-black" : "text-black/50"}`}>
                      {bankName || "Select bank"}
                    </span>
                  </div>
                </div>

                {[
                  { label: "Account number", value: accountNumber, set: setAccountNumber, placeholder: "Enter 10-digit account number", type: "tel" },
                  { label: "Account name", value: accountName, set: setAccountName, placeholder: "Enter account name" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label className="text-[12px] font-inter font-medium text-black">{label}</label>
                    <input
                      type={type || "text"}
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-3 bg-white border-t border-black/10">
            {step === 1 ? (
              <button
                onClick={() => { if (selectedList.length > 0) setStep(2) }}
                disabled={selectedList.length === 0}
                className="w-full h-[48px] rounded-[44px] bg-[#005770] text-white font-inter font-semibold text-[16px] disabled:opacity-40"
              >
                Continue · ₦{formatPrice(totalRefund)}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-[48px] rounded-[44px] bg-[#005770] text-white font-inter font-semibold text-[16px] disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Confirm refund"}
              </button>
            )}
          </div>
        </motion.div>

        {/* Bank picker bottom sheet */}
        {showBankPicker && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-[60]"
            onClick={() => setShowBankPicker(false)}>
            <div className="bg-white w-full rounded-t-[16px] max-h-[50vh] overflow-y-auto scrollbar-hide px-4 pb-8"
              onClick={e => e.stopPropagation()}>
              <h2 className="text-[14px] text-center font-inter font-semibold pt-6 pb-3 sticky top-0 bg-white">
                Select Bank
              </h2>
              {BANKS.map(b => (
                <button key={b} onClick={() => { setBankName(b); setShowBankPicker(false) }}
                  className={`w-full text-left px-3 py-[10px] rounded-[4px] text-[13px] font-inter mb-1 ${bankName === b ? "bg-[#2A9CBC]/10 text-[#2A9CBC]" : "bg-gray-100 text-black"}`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}