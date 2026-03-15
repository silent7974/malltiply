'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import SellerCategoryDropdown from '../../components/SellerCategoryDropdown'
import SuccessModal from '../../components/SuccessModal'
import { useSignupMutation } from "@/redux/services/sellerApi"

export default function SellerSignUpPremium() {
  const router = useRouter()
  const [signup, { isLoading }] = useSignupMutation()

  const [openDistrictModal, setOpenDistrictModal] = useState(false)

  const abujaDistricts = [
    "Wuse", "Maitama", "Asokoro", "Garki", "Gwarinpa", "Utako", "Jabi",
    "Kado", "Life Camp", "Kubwa", "Lugbe", "Karu", "Lokogoma", "Nyanya",
    "Apo", "Mpape", "Durumi", "Galadimawa", "Jahi", "Mabushi"
  ]

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    location: { city: "Abuja", street: "", district: "" },
    sellerType: "premium_seller",
    brandName: ''
  })

  const [errors, setErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleLocationChange = (field, value) => {
    setForm({
      ...form,
      location: { ...form.location, [field]: value }
    })
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
    if (!form.phone.trim()) newErrors.phone = 'Phone is required'
    if (!form.password) newErrors.password = 'Password is required'
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password required'
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    if (!form.category) newErrors.category = 'Select a category'
    if (!form.brandName.trim()) newErrors.brandName = 'Brand Name is required'
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
      console.error(err)
      alert(err.message || "Signup failed")
    }
  }

  return (
    <div className="w-full px-[16px] py-[40px]">
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={() => router.push('/seller')}>
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-[20px] text-center font-semibold mt-[16px]">
          Premium seller signup
        </h1>
        <p className="text-[12px] text-center text-black/50 mt-[4px]">
          Premium sellers get branded store pages and priority curation.
        </p>

        {/* Basic Fields */}
        {['fullName','email','phone','password','confirmPassword'].map(field => (
          <div key={field} className="mt-[16px]">
            <label className="block text-[12px] font-medium">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field.toLowerCase().includes('password') ? 'password' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
            />
            {errors[field] && (
              <p className="text-[8px] text-red-500 mt-[4px]">{errors[field]}</p>
            )}
          </div>
        ))}

        {/* Category */}
        <SellerCategoryDropdown
          selected={form.category}
          onSelect={setCategory}
          hasError={!!errors.category}
        />
        {errors.category && (
          <p className="text-[8px] text-red-500 mt-[4px]">{errors.category}</p>
        )}

        {/* Brand Name */}
        <label className="block mt-[16px] text-[12px] font-medium">Brand Name</label>
        <input
          name="brandName"
          value={form.brandName}
          onChange={handleChange}
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.brandName && (
          <p className="text-[8px] text-red-500 mt-[4px]">{errors.brandName}</p>
        )}

        {/* Street */}
        <label className="block mt-[16px] text-[12px] font-medium">Street</label>
        <input
          value={form.location.street}
          onChange={(e) => handleLocationChange('street', e.target.value)}
          className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px]"
        />
        {errors.street && (
          <p className="text-[8px] text-red-500 mt-[4px]">{errors.street}</p>
        )}

        {/* District Dropdown */}
        <div className="mt-[16px]">
          <label className="text-[12px] font-medium text-black">
            Area or district
          </label>
          <div
            onClick={() => setOpenDistrictModal(true)}
            className="w-full h-[32px] border border-black/30 rounded-[4px] px-[16px] mt-[4px] flex justify-between items-center cursor-pointer"
          >
            <span className={`text-[12px] ${form.location.district ? "text-black" : "text-black/50"}`}>
              {form.location.district || "Select district"}
            </span>
            <ChevronDown size={16} className="text-black/50" />
          </div>
          {errors.district && (
            <p className="text-[8px] text-red-500 mt-[4px]">{errors.district}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-[24px] bg-[#005770] text-white text-[12px] font-[Inter] font-semibold py-[12px] rounded-[4px]"
        >
          {isLoading ? 'Creating account...' : 'Create premium account'}
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
              <h2 className="text-[14px] text-center font-semibold mb-[16px] pt-[24px] sticky top-0 bg-white">
                Select District
              </h2>

              <div className="flex flex-col gap-[8px]">
                {abujaDistricts.map(area => (
                  <button
                    key={area}
                    onClick={() => {
                      handleLocationChange('district', area)
                      setOpenDistrictModal(false)
                    }}
                    className={`text-[12px] px-[12px] py-[8px] text-left rounded-[4px] ${
                      form.location.district === area
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
      </form>

      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </div>
  )
}