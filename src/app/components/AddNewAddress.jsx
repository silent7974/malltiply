"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import { useUpdateProfileMutation, useMeQuery } from "@/redux/services/authApi";
import formatPrice from "@/lib/utils/formatPrice";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/utils/calculateDeliveryFee";
import { validateDeliveryDetails, isValidNgPhone, FIELD_MESSAGES } from "@/lib/utils/validators";
import FieldError from "./FieldError"
import AreaPickerSheet from "./AreaPickerSheet";

export default function AddNewAddress({ onClose, onSaveSuccess }) {
  const { data, isLoading: loadingUser } = useMeQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const user = data?.user;
  const existingAddress = user?.address || {};

  // Page scroll lock is handled by cart/page.jsx (one owner, no leaks
  // when one overlay replaces another).

  useEffect(() => {
    window.history.pushState({ overlay: "address" }, "")
    const handlePop = () => onClose()
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [openDistrictModal, setOpenDistrictModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setStreet(existingAddress.street || "");
      setDistrict(existingAddress.district || "");
    }
  }, [user]);

  const clearError = (key) => {
    setFormError("");
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSave = async () => {
    const result = validateDeliveryDetails(
      { fullName, phone, street, district },
      { requireEmail: false } // signed-in buyers already have an email on their account
    );

    if (!result.ok) {
      setErrors(result.errors);
      setFormError("Please fix the highlighted fields.");
      return;
    }

    const c = result.cleaned;
    try {
      await updateProfile({
        fullName: c.fullName,
        phone: c.phone,
        address: { city: "Abuja", street: c.street, district: c.district },
      }).unwrap();
      onSaveSuccess?.(); // cart/page.jsx closes this and opens checkout
    } catch (err) {
      console.error("Failed to save address:", err);
      // Show the server's own sentence when it sent one (for example a phone
      // number already used by another account)
      setFormError(
        err?.data?.error ||
        err?.data?.message ||
        "We could not save your address. Please check your connection and try again."
      );
    }
  };

  const inputRing = (key) => (errors[key] ? "ring-1 ring-red-400" : "");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-0 bg-white z-50 px-[16px] py-[40px] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-[12px]">
          <ChevronLeft
            size={20}
            className="text-black/70 cursor-pointer"
            onClick={onClose}
          />
          <p className="text-[20px] font-inter font-medium text-black">
            Add a new address
          </p>
          <div className="w-[20px]" />
        </div>

        {/* Encryption Notice */}
        <div className="flex items-center justify-center gap-[2px] mb-[12px]">
          <Image src="/lock.svg" alt="Lock" width={12} height={12} />
          <p className="text-[12px] font-inter font-normal text-[#005770]">
            All data will be encrypted
          </p>
        </div>

        {/* Notice */}
        <div className="flex items-center justify-between border border-black/20 rounded-[2px] p-2">
          <div className="flex items-center gap-1 text-[#005770]">
            <Clock size={16} />
            <span className="text-[10px] font-inter font-medium">
              Free delivery on Malltiply Originals
            </span>
          </div>
          <p className="text-[10px] font-inter font-medium text-black/50">
            over ₦{formatPrice(FREE_DELIVERY_THRESHOLD)}
          </p>
        </div>

        {/* ----------- Loading Skeleton ----------- */}
        {loadingUser ? (
          <div className="mt-[20px] space-y-4 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-[32px] bg-gray-200 rounded-md"></div>
            ))}
          </div>
        ) : (
          /* ----------- Form ----------- */
          <div className="mt-[20px] flex flex-col gap-[16px]">
            {/* Full Name */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Full name
              </label>
              <input
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
                placeholder="Enter your full name"
                type="text"
                autoComplete="name"
                className={`w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70 outline-none ${inputRing("fullName")}`}
              />
              <FieldError message={errors.fullName} />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Phone number
              </label>
              <input
                value={phone}
                onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
                onBlur={() => {
                  if (phone.trim() && !isValidNgPhone(phone)) {
                    setErrors((prev) => ({ ...prev, phone: FIELD_MESSAGES.phone }));
                  }
                }}
                placeholder="e.g. 0801 234 5678"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={`w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70 outline-none ${inputRing("phone")}`}
              />
              <FieldError message={errors.phone} />
            </div>

            {/* City */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                City
              </label>
              <input
                value="Abuja"
                disabled
                className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70"
              />
            </div>

            {/* Street */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Street address / landmark
              </label>
              <input
                value={street}
                onChange={(e) => { setStreet(e.target.value); clearError("street"); }}
                placeholder="Enter street address or landmark"
                type="text"
                autoComplete="street-address"
                className={`w-full h-[32px] border border-black/30 rounded-[4px] px-[16px] mt-[4px] text-[16px] font-inter text-black/70 outline-none ${inputRing("street")}`}
              />
              <FieldError message={errors.street} />
            </div>

            {/* District Dropdown */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Your area
              </label>
              <div
                onClick={() => setOpenDistrictModal(true)}
                className={`w-full h-[32px] border rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer ${errors.district ? "border-red-400" : "border-black/30"}`}
              >
                <span className={`text-[12px] font-inter ${district ? "text-black" : "text-black/50"}`}>
                  {district || "Select your area"}
                </span>
                <ChevronDown size={16} className="text-black/50" />
              </div>
              <FieldError message={errors.district} />
            </div>
          </div>
        )}

        {formError && (
          <p role="alert" className="text-[12px] font-inter text-red-500 mt-[16px] text-center">
            {formError}
          </p>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] mt-[16px] hover:opacity-90 transition flex items-center justify-center disabled:opacity-60"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save and use"
          )}
        </button>

        {/* District Modal */}
        <AreaPickerSheet
          open={openDistrictModal}
          selected={district}
          onSelect={(label) => { setDistrict(label); clearError("district") }}
          onClose={() => setOpenDistrictModal(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}