"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import { useUpdateProfileMutation, useMeQuery } from "@/redux/services/authApi";

export default function AddNewAddress({ onClose, onSaveSuccess }) {
  const { data, isLoading: loadingUser } = useMeQuery();
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const user = data?.user;
  const existingAddress = user?.address || {};

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [openDistrictModal, setOpenDistrictModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
      setStreet(existingAddress.street || "");
      setDistrict(existingAddress.district || "");
    }
  }, [user]);

  const abujaDistricts = [
    "Wuse", "Maitama", "Asokoro", "Garki", "Gwarinpa", "Utako", "Jabi",
    "Kado", "Life Camp", "Kubwa", "Lugbe", "Karu", "Lokogoma", "Nyanya",
    "Apo", "Mpape", "Durumi", "Galadimawa", "Jahi", "Mabushi"
  ];

  const handleSave = async () => {
    try {
      const data = {
        fullName,
        phone,
        address: {
          city: "Abuja",
          street,
          district,
        },
      };
      await updateProfile(data).unwrap();
      onSaveSuccess?.();
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to update address. Please try again.");
    } finally {
      onClose();
    }
  };

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
              Free delivery across Abuja
            </span>
          </div>
          <p className="text-[10px] font-inter font-medium text-black/50">
            limited time
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
                onChange={(e) => setFullName(e.target.value)}
                placeholder={user?.fullName || "Enter your full name"}
                className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Phone number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={user?.phone || "Enter your phone number"}
                className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                City
              </label>
              <input
                value="Abuja"
                disabled
                className="w-full h-[32px] bg-[#EEEEEE] rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70"
              />
            </div>

            {/* Street */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Street address / landmark
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={existingAddress.street || "Enter street address or landmark"}
                className="w-full h-[32px] border border-black/30 rounded-[4px] px-[16px] mt-[4px] text-[12px] font-inter text-black/70 outline-none"
              />
            </div>

            {/* District Dropdown */}
            <div>
              <label className="text-[12px] font-inter font-medium text-black">
                Area or district
              </label>
              <div
                onClick={() => setOpenDistrictModal(true)}
                className="w-full h-[32px] border border-black/30 rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer"
              >
                <span className={`text-[12px] font-inter ${district ? "text-black" : "text-black/50"}`}>
                  {district || existingAddress.district || "Select district"}
                </span>
                <ChevronDown size={16} className="text-black/50" />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] mt-[32px] hover:opacity-90 transition flex items-center justify-center"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Save and use"
          )}
        </button>

        {/* District Modal */}
        {openDistrictModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
            onClick={() => setOpenDistrictModal(false)}
          >
            <div
              className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] pb-[36px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[14px] text-center font-inter font-semibold mb-[16px] pt-[24px] sticky top-0 bg-white pb-2">
                Select District
              </h2>
              <div className="flex flex-col gap-[8px]">
                {abujaDistricts.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setDistrict(area);
                      setOpenDistrictModal(false);
                    }}
                    className={`text-[12px] font-inter px-[12px] py-[8px] text-left rounded-[4px] ${
                      district === area
                        ? "bg-[#2A9CBC]/10 text-[#2A9CBC]"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}