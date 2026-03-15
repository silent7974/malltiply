'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { sellerApi, useSigninMutation } from "@/redux/services/sellerApi"
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { AnimatePresence } from 'framer-motion'
import { useDispatch } from 'react-redux'

export default function SellerSignInPage() {
  const router = useRouter()
  const [signin, { isLoading, error }] = useSigninMutation();
  const [form, setForm] = useState({ email: '', password: '' })
  const [showForgot, setShowForgot] = useState(false);
  const dispatch = useDispatch()

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password too short'

    setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerError(null);

    try {
      const res = await signin(form).unwrap();

      // after successful login:
      dispatch(sellerApi.endpoints.getProfile.initiate());

      router.replace(
        res.sellerType === "premium_seller"
          ? "/seller/premium/dashboard"
          : "/seller/normal/dashboard"
      );
    } catch (err) {
      setServerError(err?.error || err?.message || "Signin failed");
    }
  }

  return (
    <div className="w-full px-[16px] py-[40px]">
      {/* Go Back */}
      <button onClick={() => router.push('/seller')} className="mb-4">
        <ChevronLeft size={24} className="text-black" />
      </button>

      {/* Title */}
      <h1 className="text-[24px] text-center font-[Inter] font-semibold text-[#000000]">Sign in</h1>
      <p className="text-[14px] text-center font-[Inter] font-medium text-black/50 mt-[8px]">Welcome back</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block mt-[16px] text-[12px] font-[Inter] font-medium text-[#000000]">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-black/30 rounded px-3 py-2 text-sm"
            required
          />

          {errors.email && (
            <p className="text-[8px] text-red-500 mt-[4px]">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mt-[16px] text-[12px] font-[Inter] font-medium text-[#000000]">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-black/30 rounded px-3 py-2 text-sm"
            required
          />

          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-xs text-[#005770] mt-1 ml-auto block"
          >
            Forgot Password?
          </button>
          <AnimatePresence>
            {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
          </AnimatePresence>

          {errors.password && (
            <p className="text-[8px] text-red-500 mt-[4px]">{errors.password}</p>
          )} 
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-[24px] bg-[#005770] text-white text-[12px] font-[Inter] font-semibold py-[12px] rounded-[4px]"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Privacy */}
      <p className="mt-[12px] text-[10px] font-[Inter] font-medium text-black/50 text-center">
        By signing in, you agree to our{' '}
        <button 
        className="text-[#6182D8] underline"
        onClick={() => {
            router.push('/seller/privacy')
        }}
        >
        Seller privacy policy
        </button>
      </p>

      {serverError && (
        <p className="mt-[8px] text-[8px] text-red-500 text-center">{serverError}</p>
      )}

      {/* Separator */}
      <div className="h-[2px] bg-black/10 mt-11 mb-6"></div>

      {/* Bottom Links */}
      <div className="space-y-4 text-center text-sm font-semibold">
        <p>
          Don’t have an account?{' '}
          <button onClick={() => router.push('/seller/normal/signup')} className="text-[#005770]">
            Sign up
          </button>
        </p>
        <p>
          Want a branded store?{' '}
          <button onClick={() => router.push('/seller/premium/signup')} className="text-[#005770]">
            Apply as premium seller
          </button>
        </p>
      </div>
    </div>
  );
}