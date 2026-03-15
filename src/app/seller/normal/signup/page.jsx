'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import SellerCategoryDropdown from '../../components/SellerCategoryDropdown'
import SuccessModal from '../../components/SuccessModal'
import { useSignupMutation } from "@/redux/services/sellerApi"

export default function SellerSignUpNormal() {
  const router = useRouter()
  const [signup, { isLoading }] = useSignupMutation()

  const abujaDistricts = [
    "Wuse", "Maitama", "Asokoro", "Garki", "Gwarinpa", "Utako", "Jabi",
    "Kado", "Life Camp", "Kubwa", "Lugbe", "Karu", "Lokogoma", "Nyanya",
    "Apo", "Mpape", "Durumi", "Galadimawa", "Jahi", "Mabushi"
  ];

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    location: { city: "Abuja", street: "", district: "" },
    sellerType: "normal_seller"
  })

  const [errors, setErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [openDistrictModal, setOpenDistrictModal] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleLocationChange = (field, value) => {
    setForm({ ...form, location: { ...form.location, [field]: value } })
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const setCategory = (category) => {
    setForm({ ...form, category })
    setErrors(prev => ({ ...prev, category: undefined }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address'
    if (!form.phone.trim()) newErrors.phone = 'Phone Number is required'

    const password = form.password;
    const emailPrefix = form.email.split('@')[0] || '';
    const isLengthValid = password.length >= 8;
    const hasMix = /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password);
    const doesNotContainEmail = !emailPrefix || !password.toLowerCase().includes(emailPrefix.toLowerCase());

    if (!password) newErrors.password = 'Password is required'
    else {
      if (!isLengthValid) newErrors.password = 'Password must be at least 8 characters'
      if (!hasMix) newErrors.password = 'Password must include letters, numbers, and symbols'
      if (!doesNotContainEmail) newErrors.password = 'Password should not include your email prefix'
    }

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = 'Passwords do not match'

    if (!form.category) newErrors.category = 'Please select a category'
    if (!form.location.street.trim()) newErrors.street = 'Street is required'
    if (!form.location.district.trim()) newErrors.district = 'District is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await signup(form).unwrap()
      setShowSuccessModal(true)
    } catch (err) {
      console.error("Signup failed:", err)
    }
  }

  return (
    <div className="w-full px-[16px] py-[40px]">
      <form onSubmit={handleSubmit}>
        <div className="ml-[2px]">
          <button type="button" onClick={() => router.push('/seller')}>
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="mt-[16px] text-center">
          <h1 className="text-[24px] font-semibold">Sign up</h1>
          <p className="text-[14px] text-black/50 mt-[8px]">Register to list and manage products on Malltiply.</p>
        </div>

        {/* Full Name */}
        <label className="block mt-[16px] text-[12px] font-medium">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          type="text"
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.fullName && <p className="text-[8px] text-red-500 mt-[4px]">{errors.fullName}</p>}

        {/* Email */}
        <label className="block mt-[16px] text-[12px] font-medium">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.email && <p className="text-[8px] text-red-500 mt-[4px]">{errors.email}</p>}

        {/* Phone */}
        <label className="block mt-[16px] text-[12px] font-medium">Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          type="tel"
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.phone && <p className="text-[8px] text-red-500 mt-[4px]">{errors.phone}</p>}

        {/* Password */}
        <label className="block mt-[16px] text-[12px] font-medium">Create Password</label>
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.password && <p className="text-[8px] text-red-500 mt-[4px]">{errors.password}</p>}

        {/* Confirm Password */}
        <label className="block mt-[16px] text-[12px] font-medium">Confirm Password</label>
        <input
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          type="password"
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.confirmPassword && <p className="text-[8px] text-red-500 mt-[4px]">{errors.confirmPassword}</p>}

        {/* Category */}
        <SellerCategoryDropdown selected={form.category} onSelect={setCategory} hasError={!!errors.category} />
        {errors.category && <p className="text-[8px] text-red-500 mt-[4px]">{errors.category}</p>}

        {/* Location */}
        <label className="block mt-[16px] text-[12px] font-medium">Street</label>
        <input
          value={form.location.street}
          onChange={(e) => handleLocationChange('street', e.target.value)}
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.street && <p className="text-[8px] text-red-500 mt-[4px]">{errors.street}</p>}

        <label className="block mt-[16px] text-[12px] font-medium">District</label>
        <div
          onClick={() => setOpenDistrictModal(true)}
          className="w-full h-[32px] border border-black/30 rounded-[4px] px-[12px] mt-[4px] flex justify-between items-center cursor-pointer"
        >
          <span className={`text-[12px] ${form.location.district ? 'text-black' : 'text-black/50'}`}>
            {form.location.district || 'Select district'}
          </span>
          <ChevronDown size={16} className="text-black/50" />
        </div>
        {errors.district && <p className="text-[8px] text-red-500 mt-[4px]">{errors.district}</p>}

        {openDistrictModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
            onClick={() => setOpenDistrictModal(false)}
          >
            <div
              className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] pb-[36px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[14px] text-center font-semibold mb-[16px] pt-[24px] pb-2 sticky top-0 bg-white pb-2">
                Select District
              </h2>
              <div className="flex flex-col gap-[8px]">
                {abujaDistricts.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      handleLocationChange('district', area)
                      setOpenDistrictModal(false)
                    }}
                    className={`text-[12px] px-[12px] py-[8px] text-left rounded-[4px] ${
                      form.location.district === area
                        ? 'bg-[#2A9CBC]/10 text-[#2A9CBC]'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-[24px] bg-[#005770] text-white text-[12px] font-[Inter] font-semibold py-[12px] rounded-[4px]"
        >
          {isLoading ? 'Creating account...' : 'Create my seller account'}
        </button>
      </form>

      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
    </div>
  )
}