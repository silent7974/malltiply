"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useSigninMutation } from "@/redux/services/authApi"
import SignUpLayout from "./SignUpLayout"

export default function SignInLayout({ onClose }) {
  const [signin, { isLoading, error }] = useSigninMutation()
  const [showSignUp, setShowSignUp] = useState(false)

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!form.emailOrPhone.trim())
      newErrors.emailOrPhone = "Email or Phone is required"
    if (!form.password.trim())
      newErrors.password = "Password is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const res = await signin(form).unwrap()
      alert("Login successful ✅")
      onClose?.() // close modal on success
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  if (showSignUp) {
    return <SignUpLayout onClose={onClose} onSwitchToSignIn={() => setShowSignUp(false)} />
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] overflow-y-auto">
      <div className="px-[16px] py-[40px] max-w-md mx-auto">
        {/* Top bar */}
        <button onClick={onClose}>
          <X size={24} color="#000000" />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-[8px] mb-[8px]">
          <Image src="/malltiply-logo.svg" alt="Malltiply Logo" width={96} height={32} />
        </div>

        {/* Lock notice */}
        <div className="flex items-center justify-center gap-[2px] mb-[36px]">
          <Image src="/lock.svg" alt="Lock" width={16} height={16} />
          <p className="text-[16px] font-inter font-normal text-[#005770]">
            All data will be encrypted
          </p>
        </div>

        {/* Features */}
        <div className="flex gap-[24px] mb-[36px] justify-center">
          {/* Fast Delivery */}
          <div className="flex flex-col items-center">
            <div className="w-[40px] h-[40px] rounded-full bg-[#E1E6E8] flex items-center justify-center">
              <Image src="/truck.svg" alt="Truck" width={24} height={24} />
            </div>
            <p className="mt-[4px] text-[12px] font-montserrat font-bold text-black">
              Fast Delivery
            </p>
            <p className="mt-[2px] text-[8px] font-montserrat font-medium text-black">
              within 24 hours - same day
            </p>
          </div>

          {/* Easy Returns */}
          <div className="flex flex-col items-center">
            <div className="w-[40px] h-[40px] rounded-full bg-[#E1E6E8] flex items-center justify-center">
              <Image src="/return.svg" alt="Return" width={18} height={18} />
            </div>
            <p className="mt-[4px] text-[12px] font-montserrat font-bold text-black">
              Easy Returns
            </p>
            <p className="mt-[2px] text-[8px] font-montserrat font-medium text-black">
              within 10 days from purchase
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone"
            value={form.emailOrPhone}
            onChange={handleChange}
            className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
          />
          {errors.emailOrPhone && (
            <p className="text-[10px] text-red-500">{errors.emailOrPhone}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
          />
          {errors.password && (
            <p className="text-[10px] text-red-500">{errors.password}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] hover:opacity-90 transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Switch to Sign Up */}
        <p className="mt-[24px] text-center text-[12px] font-inter font-medium text-black">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => setShowSignUp(true)}
            className="text-[#6182D8] underline"
          >
            Sign Up
          </button>
        </p>

        {/* API error */}
        {error && (
          <p className="mt-[8px] text-center text-[12px] text-red-500">
            {error?.data?.message || "Login failed"}
          </p>
        )}
      </div>
    </div>
  )
}