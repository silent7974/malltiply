"use client"
import { useState } from "react"
import { ChevronLeft, Check, ChevronDown, Clock } from "lucide-react"
import Image from "next/image"

export default function GuestAddressForm({ onClose, onSaveSuccess }) {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [street, setStreet] = useState("")
  const [district, setDistrict] = useState("")
  const [openDistrictModal, setOpenDistrictModal] = useState(false)

  const abujaDistricts = [
    "Wuse", "Maitama", "Asokoro", "Garki", "Gwarinpa", "Utako", "Jabi",
    "Kado", "Life Camp", "Kubwa", "Lugbe", "Karu", "Lokogoma", "Nyanya",
    "Apo", "Mpape", "Durumi", "Galadimawa", "Jahi", "Mabushi"
  ]

  const handleSave = () => {
    if (!fullName || !phone || !street || !district) {
      alert("Please fill all fields.")
      return
    }
    const guestInfo = { fullName, phone, email, address: { city: "Abuja", street, district } }
    localStorage.setItem("guestInfo", JSON.stringify(guestInfo))
    onSaveSuccess?.(guestInfo)
  }

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
          <span className="text-[10px] font-inter font-medium">Free delivery across Abuja</span>
        </div>
        <p className="text-[10px] font-inter font-medium text-black/50">for first 30 orders</p>
      </div>

      <div className="flex flex-col gap-[16px]">
        {[
          { label: "Full name", value: fullName, set: setFullName, placeholder: "Enter your full name" },
          { label: "Phone number", value: phone, set: setPhone, placeholder: "Enter your phone number" },
          { label: "Email (for order updates)", value: email, set: setEmail, placeholder: "Enter your email" },
          { label: "Street address", value: street, set: setStreet, placeholder: "Enter street address" },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="text-[12px] font-inter font-medium text-black">{label}</label>
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70 outline-none"
            />
          </div>
        ))}

        <div>
          <label className="text-[12px] font-inter font-medium text-black">City</label>
          <input value="Abuja" disabled
            className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70" />
        </div>

        <div>
          <label className="text-[12px] font-inter font-medium text-black">Area or district</label>
          <div onClick={() => setOpenDistrictModal(true)}
            className="w-full h-[32px] border border-black/30 rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer">
            <span className={`text-[12px] font-inter ${district ? "text-black" : "text-black/50"}`}>
              {district || "Select district"}
            </span>
            <ChevronDown size={16} className="text-black/50" />
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] mt-[32px]">
        Continue to checkout
      </button>

      {openDistrictModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpenDistrictModal(false)}>
          <div className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] pb-[36px]"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[14px] text-center font-inter font-semibold mb-[16px] pt-[24px] sticky top-0 bg-white pb-2">
              Select District
            </h2>
            <div className="flex flex-col gap-[8px]">
              {abujaDistricts.map((area) => (
                <button key={area} onClick={() => { setDistrict(area); setOpenDistrictModal(false) }}
                  className={`text-[12px] font-inter px-[12px] py-[8px] text-left rounded-[4px] ${
                    district === area ? "bg-[#2A9CBC]/10 text-[#2A9CBC]" : "bg-gray-100 text-black"}`}>
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}