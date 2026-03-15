'use client'

import { motion } from "framer-motion";
import { useForgotPasswordMutation } from "@/redux/services/sellerApi";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(""); // show backend message
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await forgotPassword(email).unwrap();
      setMessage(res.message || "Check your email for reset link");
      toast.success(res.message || "Check your email for reset link");
    } catch (err) {
      const errMsg = err.data?.error || "Something went wrong. Try again.";
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ ease: "easeInOut", duration: 0.3 }}
      className="fixed inset-0 bg-[#F8F9FA] z-50"
    >
      <div className="h-full flex flex-col mt-[40px] px-[16px]">
        <button onClick={onClose} className="justify-self-start">
          <ChevronLeft size={24} className="text-black" />
        </button>
        
        {/* Header */}
        <div className=" items-center mb-[24px]">
          <h2 className="text-[18px] font-[Inter] font-medium text-center text-black">
            Reset password
          </h2>

          <div /> {/* Spacer */}
        </div>

        {/* Form */}
        <div>
          <label className="block text-[12px] font-[Inter] font-medium text-black mb-[4px]">
            Email address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
              setMessage("");
            }}
            className="w-full border border-black/30 rounded px-3 py-2 text-sm bg-white"
            placeholder="you@example.com"
          />

          {errors.email && (
            <p className="text-[8px] text-red-500 mt-[4px]">{errors.email}</p>
          )}

          {message && (
            <p className="text-[10px] text-green-600 mt-[6px]">{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-[24px] bg-[#005770] text-white text-[12px] font-[Inter] font-semibold py-[12px] rounded-[4px]"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}