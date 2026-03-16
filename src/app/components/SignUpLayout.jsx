"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useSignupMutation } from "@/redux/services/authApi"

export default function SignUpLayout({ onClose, onSwitchToSignIn  }) {
  const [signup, { isLoading, error }] = useSignupMutation()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required"
    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address"
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required"

    if (!form.password) {
      newErrors.password = "Password is required"
    } else {
      if (form.password.length < 8)
        newErrors.password = "Password must be at least 8 characters"
      if (
        !/[A-Za-z]/.test(form.password) ||
        !/\d/.test(form.password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(form.password)
      ) {
        newErrors.password =
          "Password must include letters, numbers, and symbols"
      }
      if (form.password.includes(form.email.split("@")[0])) {
        newErrors.password = "Password should not include your email prefix"
      }
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match"
    }

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
      await signup(form).unwrap()
      alert("Signup successful 🚀")
      onClose?.()
    } catch (err) {
      console.error("Signup failed:", err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F9FA] overflow-y-auto">
      <div className="px-[16px] py-[40px] max-w-md mx-auto">
        {/* Top bar */}
        <button onClick={onClose}>
          <X size={24} color="#000000" />
        </button>
        <div className="flex items-center justify-center gap-[8px] mb-[8px]">
          <Image
            src="/malltiply-logo.svg"
            alt="Malltiply Logo"
            width={96}
            height={32}
            priority
          />
        </div>

        {/* Encryption notice */}
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
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
          />
          {errors.fullName && (
            <p className="text-[10px] text-red-500">{errors.fullName}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
          />
          {errors.email && (
            <p className="text-[10px] text-red-500">{errors.email}</p>
          )}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
          />
          {errors.phone && (
            <p className="text-[10px] text-red-500">{errors.phone}</p>
          )}

          {/* Password + Confirm Password same row */}
          <div className="flex gap-[16px] w-full">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full h-[36px] px-[16px] border border-black/30 rounded-[4px] text-[12px] font-inter font-medium text-black placeholder:text-black/30"
            />
          </div>

          {errors.password && (
            <p className="text-[10px] text-red-500">{errors.password}</p>
          )}
          {errors.confirmPassword && (
            <p className="text-[10px] text-red-500">{errors.confirmPassword}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[16px] hover:opacity-90 transition"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Terms */}
        <p className="mt-[24px] text-center text-[12px] font-inter font-medium text-black">
          By signing up, you agree to our{" "}
          <button type="button" className="text-[#6182D8] underline">
            Terms of Use
          </button>{" "}
          <br />
          and acknowledge that you have read our{" "}
          <button type="button" className="text-[#6182D8] underline">
            Privacy Policy
          </button>
        </p>

        {/* Switch to Sign In */}
        <p className="mt-[24px] text-center text-[12px] font-inter font-medium text-black">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#6182D8] underline"
          >
            Sign In
          </button>
        </p>

        {/* API error */}
        {error && (
          <p className="mt-[8px] text-center text-[12px] text-red-500">
            {error?.data?.message || "Signup failed"}
          </p>
        )}
      </div>
    </div>
  )
}