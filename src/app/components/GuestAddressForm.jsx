"use client"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronDown, Clock } from "lucide-react"
import Image from "next/image"
import formatPrice from "@/lib/utils/formatPrice"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/utils/calculateDeliveryFee"
import {
  validateDeliveryDetails,
  isValidEmail,
  isValidNgPhone,
  FIELD_MESSAGES,
} from "@/lib/utils/validators"
import FieldError from "./FieldError"
import AreaPickerSheet from "./AreaPickerSheet"

// Read what the buyer saved last time, so going back never means retyping.
function loadSavedGuestInfo() {
  try {
    const saved = JSON.parse(localStorage.getItem("guestInfo") || "null")
    return saved && typeof saved === "object" ? saved : null
  } catch {
    return null
  }
}

export default function GuestAddressForm({ onClose, onSaveSuccess }) {
  // Page scroll lock is handled by cart/page.jsx (one owner, no leaks
  // when one overlay replaces another).

  useEffect(() => {
    window.history.pushState({ overlay: "address" }, "")
    const handlePop = () => onClose()
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  const [saved] = useState(loadSavedGuestInfo)
  const [fullName, setFullName] = useState(saved?.fullName || "")
  const [phone, setPhone] = useState(saved?.phone || "")
  const [email, setEmail] = useState(saved?.email || "")
  const [street, setStreet] = useState(saved?.address?.street || "")
  const [district, setDistrict] = useState(saved?.address?.district || "")
  const [openDistrictModal, setOpenDistrictModal] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")

  const clearError = (key) => {
    setFormError("")
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  // Tell the buyer about a bad email/phone as soon as they leave the field
  const checkOnBlur = (key) => {
    if (key === "email" && email.trim() && !isValidEmail(email)) {
      setErrors((prev) => ({ ...prev, email: FIELD_MESSAGES.email }))
    }
    if (key === "phone" && phone.trim() && !isValidNgPhone(phone)) {
      setErrors((prev) => ({ ...prev, phone: FIELD_MESSAGES.phone }))
    }
  }

  const handleSave = () => {
    const result = validateDeliveryDetails(
      { fullName, phone, email, street, district },
      { requireEmail: true }
    )

    if (!result.ok) {
      setErrors(result.errors)
      setFormError("Please fix the highlighted fields.")
      return
    }

    const c = result.cleaned
    const guestInfo = {
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      address: { city: "Abuja", street: c.street, district: c.district },
    }

    try {
      localStorage.setItem("guestInfo", JSON.stringify(guestInfo))
    } catch {
      setFormError("Your browser blocked saving your details. Turn off private mode and try again.")
      return
    }
    onSaveSuccess?.(guestInfo)
  }

  const fields = [
    { key: "fullName", label: "Full name", value: fullName, set: setFullName, placeholder: "Enter your full name", type: "text", autoComplete: "name" },
    { key: "phone", label: "Phone number", value: phone, set: setPhone, placeholder: "e.g. 0801 234 5678", type: "tel", inputMode: "tel", autoComplete: "tel" },
    { key: "email", label: "Email", value: email, set: setEmail, placeholder: "name@gmail.com", type: "email", inputMode: "email", autoComplete: "email", hint: "Your payment receipt is sent here" },
    { key: "street", label: "Street address", value: street, set: setStreet, placeholder: "Enter street address", type: "text", autoComplete: "street-address" },
  ]

  return (
    <div className="fixed inset-0 bg-white z-50 px-[16px] py-[40px] overflow-y-auto">
      <div className="flex items-center justify-between mb-[12px]">
        <ChevronLeft size={20} className="text-black/70 cursor-pointer" onClick={onClose} />
        <p className="text-[20px] font-inter font-medium text-black">Delivery details</p>
        <div className="w-[20px]" />
      </div>

      <div className="flex items-center justify-center gap-[2px] mb-[12px]">
        <Image src="/lock.svg" alt="Lock" width={12} height={12} />
        <p className="text-[12px] font-inter font-normal text-[#005770]">All data will be encrypted</p>
      </div>

      <div className="flex items-center justify-between border border-black/20 rounded-[2px] p-2 mb-[20px]">
        <div className="flex items-center gap-1 text-[#005770]">
          <Clock size={16} />
          <span className="text-[10px] font-inter font-medium">Free delivery on Malltiply Originals</span>
        </div>
        <p className="text-[10px] font-inter font-medium text-black/50">
          over ₦{formatPrice(FREE_DELIVERY_THRESHOLD)}
        </p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {fields.map(({ key, label, value, set, placeholder, type, inputMode, autoComplete, hint }) => (
          <div key={key}>
            <label className="text-[12px] font-inter font-medium text-black">{label}</label>
            <input
              value={value}
              onChange={(e) => { set(e.target.value); clearError(key) }}
              onBlur={() => checkOnBlur(key)}
              placeholder={placeholder}
              type={type}
              inputMode={inputMode}
              autoComplete={autoComplete}
              autoCapitalize={key === "email" ? "none" : undefined}
              spellCheck={key === "email" ? false : undefined}
              className={`w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70 outline-none ${errors[key] ? "ring-1 ring-red-400" : ""}`}
            />
            {hint && !errors[key] && (
              <p className="text-[11px] font-inter text-black/40 mt-[4px]">{hint}</p>
            )}
            <FieldError message={errors[key]} />
          </div>
        ))}

        <div>
          <label className="text-[12px] font-inter font-medium text-black">City</label>
          <input value="Abuja" disabled
            className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70" />
        </div>

        <div>
          <label className="text-[12px] font-inter font-medium text-black">Your area</label>
          <div onClick={() => setOpenDistrictModal(true)}
            className={`w-full h-[32px] border rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer ${errors.district ? "border-red-400" : "border-black/30"}`}>
            <span className={`text-[12px] font-inter ${district ? "text-black" : "text-black/50"}`}>
              {district || "Select your area"}
            </span>
            <ChevronDown size={16} className="text-black/50" />
          </div>
          <FieldError message={errors.district} />
        </div>
      </div>

      {formError && (
        <p role="alert" className="text-[12px] font-inter text-red-500 mt-[16px] text-center">{formError}</p>
      )}

      <button onClick={handleSave}
        className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] mt-[16px]">
        Continue to checkout
      </button>

      <AreaPickerSheet
        open={openDistrictModal}
        selected={district}
        onSelect={(label) => { setDistrict(label); clearError("district") }}
        onClose={() => setOpenDistrictModal(false)}
      />
    </div>
  )
}